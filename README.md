# AI-Powered Personal Portfolio Assistant

Live portfolio: https://jason-portfolio-blond.vercel.app

Next.js on Vercel calls Google's hosted Gemini API from `app/api/chat/route.ts`.
The production chatbot needs no home PC, FastAPI service, Ollama process, Tailscale,
or localhost endpoint. `backend/main.py` is retained as the historical local prototype.

## Activate the cloud chatbot

1. Sign in to https://aistudio.google.com/apikey with a personal Google account.
   Create an API key named `jason-portfolio` in your own project. If a school account
   cannot create a project, use your personal account or import a project you own.
2. In Vercel, open the project serving `jason-portfolio-blond.vercel.app`.
   Under Settings > Environment Variables add `GEMINI_API_KEY` with the key as its
   value. Choose Secret when available, and enable Production and Preview.
   Never prefix this variable with `NEXT_PUBLIC_`, put it in GitHub, or share it in chat.
3. Optional: set `GEMINI_MODEL=gemini-3.5-flash-lite`; this is already the default.
4. Deploy the updated `main` branch. If its deployment finished before you saved
   the variable, use Deployments > latest production deployment > Redeploy.
   Environment changes only take effect on new deployments.
5. Wait for Ready, open the live portfolio, and ask `Does Jason have AWS experience?`.
   Confirm a real generated answer and working View source links. Also try a Chinese
   question and a fact absent from the resume, such as work authorization.
   This is the required live acceptance check; a successful build alone does not
   verify provider credentials or account quota.

Official setup references:
- https://ai.google.dev/gemini-api/docs/api-key
- https://ai.google.dev/gemini-api/docs/pricing
- https://vercel.com/docs/environment-variables

Gemini 3.5 Flash-Lite is listed with free-tier input/output and paid standard text
pricing of $0.30 per million input tokens and $2.50 per million output tokens
(checked October 9, 2026). Account eligibility and quota vary; inspect AI Studio's
Rate Limit and Billing screens. Free-tier prompts may be used to improve Google's
products. The assistant sends public resume evidence and the visitor's question.
For a busy event, confirm sufficient quota before relying on the free tier.

## Grounding and safeguards

- `backend/data/resume.json` is bundled into the server function as the evidence.
- The prompt restricts answers to Jason's portfolio and directs the model to
  acknowledge missing facts. It distinguishes projects from employment.
- Structured JSON contains an answer and source IDs. The server validates IDs
  against existing resume entries and constructs navigation links itself.
  References are model-selected; they do not independently prove every claim.
- The frontend renders plain text, multiple source buttons, friendly errors and Retry.
- Maximum question length: 1,000 characters; body limit: 8 KiB, even without a
  Content-Length header. Body-read deadline: 5 seconds. Provider deadline: 20 seconds.
- Best-effort limits per warm function instance: 10 requests/client/minute,
  four concurrent provider calls, and at most 2,000 tracked clients. These are
  NOT shared across Vercel instances and reset on cold start. Origin checks help
  against cross-site browser calls but are not authentication or bot protection.
- Before enabling paid usage, configure provider quotas and Vercel Firewall limits
  for `/api/chat` across instances. Where your plan supports it, rate-limit POST
  requests to this path by IP. See https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting.
  Google billing budget alerts alone do not enforce a hard spending cap.
- Keys, prompts, and upstream error bodies are not logged or sent to visitors.

## Local development and verification

Use Node.js 20 or later:

```sh
npm ci
cp .env.example .env.local
# Fill GEMINI_API_KEY in .env.local; this file is ignored by Git.
npm run dev
```

Checks:

```sh
npm run test:chat
npm run lint
npx tsc --noEmit
npm run build
```

Route tests mock the cloud provider and verify the payload/evidence, validation,
source handling, timeout/errors, rate limits, and concurrency. They do not call
Gemini or establish live answer quality.

## Troubleshooting

- Configuration message / HTTP 503: check the variable spelling, Production scope,
  and that you redeployed after saving. A 503 can also mean provider access failure;
  server logs include only the provider's HTTP status.
- HTTP 429: wait a minute; check AI Studio quota and any Vercel Firewall rule.
- HTTP 504: provider timeout; retry or use the public portfolio/contact section.
- Provider HTTP 400/404 in server logs: check the configured model's availability.
- Provider HTTP 401/403: check key validity, project/API access, and restrictions.
- Incomplete response / HTTP 502: rephrase; truncated, blocked, or invalid JSON
  replies are rejected instead of displayed.
