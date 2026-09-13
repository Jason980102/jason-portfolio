import React from "react";
import AIChat from "@/components/AIChat";
import resumeData from "@/backend/data/resume.json";

import { FaGithub, FaLinkedin } from "react-icons/fa";

import {
  Mail,
  ExternalLink,
  Download,
  MapPin,
  GraduationCap,
  Cloud,
  Code2,
  Brain,
  Wrench,
  PanelsTopLeft,
} from "lucide-react";

const skillConfig = {
  languages: {
    title: "Languages",
    icon: Code2,
  },

  frontend: {
    title: "Frontend",
    icon: PanelsTopLeft,
  },

  backend: {
    title: "Backend",
    icon: Code2,
  },

  ai_ml: {
    title: "AI / ML",
    icon: Brain,
  },

  cloud_devops: {
    title: "Cloud / DevOps",
    icon: Cloud,
  },

  tools: {
    title: "Tools",
    icon: Wrench,
  },
} as const;

export default function Portfolio() {
  const {
    profile,
    education,
    skills,
    experience,
    projects,
  } = resumeData;

  const skillGroups = Object.entries(skills).map(
    ([key, items]) => {
      const config =
        skillConfig[key as keyof typeof skillConfig];

      return {
        key,
        title: config?.title ?? key,
        Icon: config?.icon ?? Wrench,
        items,
      };
    }
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-6 py-20 md:grid-cols-[1.15fr_0.85fr] md:gap-6 lg:px-4">
        <div>
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-300">
            <MapPin className="h-4 w-4" />

            {profile.location} · MSCS @ NYU Courant
          </div>

          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-7xl">
              {profile.name}
            </h1>

            <img
              src="/images/profilepic.jpg"
              alt={profile.name}
              className="h-20 w-20 rounded-full border border-slate-700 object-cover shadow-2xl md:hidden"
            />
          </div>

          <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300 md:text-2xl">
            {profile.headline}
          </p>

          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-400 md:text-lg">
            {profile.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="rounded-2xl bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-slate-200"
            >
              Contact Me
            </a>

            <a
              href="#projects"
              className="rounded-2xl border border-slate-700 px-5 py-3 font-medium text-slate-200 transition hover:bg-slate-900"
            >
              View Projects
            </a>

            <a
              href={profile.resume_file}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 font-medium text-slate-200 transition hover:bg-slate-900"
            >
              <Download className="h-4 w-4" />
              Resume
            </a>
          </div>

          <div className="mt-8 flex gap-5 text-slate-400">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
              aria-label="GitHub"
            >
              <FaGithub className="h-6 w-6" />
            </a>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="h-6 w-6" />
            </a>

            <a
              href={`mailto:${profile.email}`}
              className="transition hover:text-white"
              aria-label="Email"
            >
              <Mail className="h-6 w-6" />
            </a>
          </div>
        </div>

        <div className="hidden justify-center md:flex">
          <img
            src="/images/profilepic.jpg"
            alt={profile.name}
            className="h-72 w-72 rounded-full border border-slate-700 object-cover shadow-2xl lg:h-80 lg:w-80"
          />
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="mx-auto max-w-5xl scroll-mt-24 px-6 py-16"
      >
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          About Me
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          Building AI-powered systems with practical impact.
        </h2>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl shadow-black/20">
          <div className="mb-4 flex items-center gap-3 text-slate-300">
            <GraduationCap className="h-5 w-5" />

            <span>
              {profile.current_status}
            </span>
          </div>

          <p className="leading-7 text-slate-400">
            {profile.about}
          </p>
        </div>
      </section>

      {/* Education */}
      <section
        id="education"
        className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20"
      >
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Education
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          Academic Background
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {education.map((item) => (
            <div
              key={`${item.school}-${item.degree}`}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7"
            >
              <h3 className="text-xl font-semibold text-white">
                {item.school}
              </h3>

              {"institute" in item && item.institute && (
                <p className="mt-2 text-slate-300">
                  {item.institute}
                </p>
              )}

              <p className="mt-2 text-slate-300">
                {item.degree}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                {item.start}
                {" – "}
                {item.end}
                {"gpa" in item && item.gpa
                  ? ` · GPA ${item.gpa}`
                  : ""}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section
        id="skills"
        className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20"
      >
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          What I Use
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          Skills
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => {
            const Icon = group.Icon;

            return (
              <div
                key={group.key}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7"
              >
                <div className="mb-4 flex items-center gap-3 text-white">
                  <Icon className="h-5 w-5" />

                  <h3 className="text-xl font-semibold">
                    {group.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Experience */}
      <section
        id="experience"
        className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20"
      >
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Experience
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          Professional Experience
        </h2>

        <div className="mt-10 space-y-6">
          {experience.map((item) => (
            <div
              key={`${item.title}-${item.period}`}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7"
            >
              <h3 className="text-xl font-semibold text-white">
                {item.title}
              </h3>

              <p className="mt-1 text-slate-300">
                {"company" in item && item.company
                  ? item.company
                  : "organization" in item
                    ? item.organization
                    : ""}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {item.period}
              </p>

              <ul className="mt-4 space-y-2 text-slate-400">
                {item.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="leading-7"
                  >
                    • {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section
        id="projects"
        className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20"
      >
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              Selected Work
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              Projects
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <article
              id={project.id}
              key={project.id}
              className="scroll-mt-24 rounded-3xl border border-slate-800 bg-slate-900/60 p-7 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-slate-600"
            >
              <p className="mb-3 text-sm font-medium text-slate-400">
                {project.category.join(" / ")}
              </p>

              <h3 className="text-2xl font-bold text-white">
                {project.name}
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.technologies.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <ul className="mt-5 space-y-2 text-sm text-slate-400">
                {project.highlights.map((item) => (
                  <li
                    key={item}
                    className="leading-6"
                  >
                    • {item}
                  </li>
                ))}
              </ul>

              {"github" in project && project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white transition hover:text-slate-300"
                >
                  View details
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20"
      >
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center md:p-12">
          <h2 className="text-3xl font-bold text-white">
            Let&apos;s build something useful.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            I am currently interested in opportunities across AI
            engineering, software engineering, backend development,
            cloud systems, and machine learning.
          </p>

          <a
            href={`mailto:${profile.email}`}
            className="mt-8 inline-flex rounded-2xl bg-white px-6 py-3 font-medium text-slate-950 transition hover:bg-slate-200"
          >
            Email Me
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-900 px-6 py-8 text-center text-sm text-slate-500">
        © 2026 {profile.name}. Built with Next.js and Tailwind CSS.
      </footer>

      <AIChat />
    </main>
  );
}