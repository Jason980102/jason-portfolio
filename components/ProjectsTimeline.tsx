import { ArrowUpRight, ChevronDown } from "lucide-react";

type Project = {
  id: string;
  name: string;
  category: string[];
  technologies: string[];
  description: string;
  highlights: string[];
  github?: string;
  start: string;
  end: string;
};

function month(value: string) {
  if (value === "Present") return value;
  const [year, number] = value.split("-");
  return `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(number) - 1]} ${year}`;
}

export default function ProjectsTimeline({ projects }: { projects: Project[] }) {
  const ordered = [...projects].sort((a, b) => b.start.localeCompare(a.start));

  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
      <div className="mb-12 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Projects / Timeline</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">From ideas to working systems.</h2>
        <p className="mt-4 leading-7 text-slate-400">Current experiments, recent builds, and earlier work across AI, cloud, software engineering, and mobile development.</p>
      </div>

      <ol className="relative space-y-8 before:absolute before:bottom-8 before:left-[7px] before:top-3 before:w-px before:bg-gradient-to-b before:from-cyan-400/70 before:to-slate-800 md:before:left-[175px]">
        {ordered.map((project) => {
          const ongoing = project.end === "Present";
          const recent = project.start >= "2026-08";
          const status = ongoing ? "In development" : "Completed";
          return (
            <li key={project.id} className="relative pl-8 md:grid md:grid-cols-[144px_minmax(0,1fr)] md:gap-12 md:pl-0">
              <span aria-hidden="true" className={`absolute left-0 top-2 h-4 w-4 rounded-full border-4 border-slate-950 md:left-[168px] ${recent ? "bg-cyan-400" : "bg-slate-500"}`} />
              <div className="mb-3 pt-1 md:mb-0 md:text-right">
                <p className="mb-2 text-sm font-medium leading-6 text-slate-200">{month(project.start)}{project.start !== project.end && <> –<br className="hidden md:block" /> {month(project.end)}</>}</p>
                <span className={`text-xs font-semibold uppercase tracking-widest ${ongoing ? "text-cyan-400" : "text-slate-400"}`}>{status}</span>
                {ongoing && <p className="mt-1 text-xs text-slate-500">Actively developing</p>}
              </div>
              <article id={project.id} className="min-w-0 scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-600 sm:p-7">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{project.category.filter((category) => !/in development|in progress/i.test(category)).join(" / ")}</p>
                <h3 className="mt-3 text-xl font-semibold leading-snug text-white sm:text-2xl">{project.name.replace(/ \(In (Development|Progress)\)$/, "")}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => <span key={technology} className="rounded-md border border-slate-800 px-2.5 py-1 text-xs text-slate-300">{technology}</span>)}
                </div>
                <details className="group mt-6 border-t border-slate-800 pt-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-slate-300 [&::-webkit-details-marker]:hidden">
                    {ongoing ? "Progress & roadmap" : "Project highlights"}
                    <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
                  </summary>
                  <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-6 text-slate-400">
                    {project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                  </ul>
                </details>
                {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-200">View on GitHub <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>}
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
