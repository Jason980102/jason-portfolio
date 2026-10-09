/* eslint-disable @typescript-eslint/no-require-imports -- This CommonJS harness evaluates the compiled server route. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { NextRequest } = require('next/server');
const resume = require('../backend/data/resume.json');
const code = ts.transpileModule(fs.readFileSync('app/api/chat/route.ts', 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText;

function route(fetch, env = { GEMINI_API_KEY: 'test-secret' }) {
  const sandbox = { exports: {}, Buffer, setTimeout, clearTimeout, AbortSignal, Error,
    process: { env }, console: { warn() {} }, fetch,
    require: name => name === '@/backend/data/resume.json' ? resume : require(name),
  };
  vm.runInNewContext(code, sandbox);
  return sandbox.exports.POST;
}
function request(message = 'Does Jason have AWS experience?', headers = {}, raw) {
  return new NextRequest('https://portfolio.example/api/chat', {
    method: 'POST', headers: { 'content-type': 'application/json', ...headers },
    body: raw ?? JSON.stringify({ message }),
  });
}
function answer(sourceIds = ['skills', 'cloud-taekwondo']) {
  return Response.json({ candidates: [{ finishReason: 'STOP', content: {
    parts: [{ text: JSON.stringify({ answer: 'Jason used AWS EC2 and S3 in his taekwondo project.', sourceIds }) }],
  } }] });
}

test('cloud request carries resume evidence, private key, deadline and valid references', async () => {
  const post = route(async (url, options) => {
    assert.equal(url, 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent');
    assert.equal(options.headers['x-goog-api-key'], 'test-secret');
    assert.ok(options.signal instanceof AbortSignal);
    const body = JSON.parse(options.body);
    assert.ok(body.systemInstruction.parts[0].text.includes('AWS EC2'));
    assert.ok(body.systemInstruction.parts[0].text.includes('Do not invent'));
    assert.equal(body.contents[0].parts[0].text, 'Does Jason have AWS experience?');
    return answer(['skills', 'cloud-taekwondo', 'skills']);
  });
  const response = await post(request());
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.sources.length, 2);
  assert.equal(data.source.section, 'skills');
  assert.equal(data.sources[1].section, 'cloud-taekwondo');
  assert.ok(!JSON.stringify(data).includes('test-secret'));
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('invalid input, oversized streaming body, cross-site calls and missing credentials never call provider', async () => {
  let calls = 0;
  const post = route(async () => { calls++; return answer(); }, {});
  for (const [req, status] of [
    [request(''), 400], [request('x'.repeat(1001)), 400],
    [request(null), 400], [request('ok', {}, 'null'), 400],
    [request('ok', {}, '{'), 400],
    [request('ok', { 'content-type': 'text/plain' }), 415],
    [request('ok', { origin: 'https://attacker.example' }), 403],
    [request('ok', { 'content-length': '9000' }), 413],
    [request('ok', {}, ' '.repeat(9000)), 413],
    [request('ok'), 503],
  ]) assert.equal((await post(req)).status, status);
  assert.equal(calls, 0);
});

test('provider errors and timeouts are safe and do not expose upstream secrets', async () => {
  for (const [upstream, status] of [[429, 429], [403, 503], [500, 503]]) {
    const post = route(async () => new Response('private upstream details', { status: upstream }));
    const response = await post(request());
    assert.equal(response.status, status);
    assert.ok(!(await response.text()).includes('private upstream details'));
  }
  const post = route(async () => { throw new DOMException('timeout', 'TimeoutError'); });
  assert.equal((await post(request())).status, 504);
});

test('rejects fabricated source references, truncated answers and malformed provider output', async () => {
  for (const provider of [
    () => answer(['invented-project']),
    () => Response.json({ candidates: [{ finishReason: 'MAX_TOKENS' }] }),
    () => Response.json({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'invalid JSON' }] } }] }),
    () => Response.json({ candidates: [] }),
  ]) assert.equal((await route(async () => provider())(request())).status, 502);
  const response = await route(async () => answer([]))(request());
  assert.equal((await response.json()).source, null);
});

test('ten requests per client per warm instance; rejection occurs before inference', async () => {
  let calls = 0;
  const post = route(async () => { calls++; return answer(); });
  for (let i = 0; i < 10; i++) assert.equal((await post(request())).status, 200);
  const limited = await post(request());
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('retry-after'), '60');
  assert.equal(calls, 10);
  assert.equal((await post(request('AWS?', { 'x-vercel-forwarded-for': '192.0.2.2' }))).status, 200);
});

test('concurrent inference is limited and capacity recovers', async () => {
  const release = [];
  const post = route(() => new Promise(resolve => release.push(() => resolve(answer()))));
  const pending = Array.from({ length: 4 }, (_, i) => post(request('AWS?', { 'x-vercel-forwarded-for': `192.0.2.${i}` })));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(release.length, 4);
  assert.equal((await post(request())).status, 429);
  release.forEach(resolve => resolve());
  for (const response of await Promise.all(pending)) assert.equal(response.status, 200);
});
