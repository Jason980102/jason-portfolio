import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Mail, ExternalLink, Download, MapPin, GraduationCap, Cloud, Code2, Brain } from "lucide-react";
export default function Portfolio() {
  const projects = [
    {
      title: "Cloud-Based Intelligent Taekwondo Motion Classification System",
      type: "AI / Cloud / Computer Vision",
      description:
        "Built an end-to-end AI web system that analyzes Taekwondo videos using MediaPipe pose estimation and machine learning. The system supports video upload, keypoint extraction, real-time prediction, pose preview visualization, and AWS cloud storage integration.",
      tech: ["Python", "MediaPipe", "Scikit-learn", "AWS EC2", "S3", "Streamlit"],
      highlights: [
        "Trained a Random Forest model on manually labeled motion data",
        "Deployed the inference app on AWS EC2",
        "Integrated S3 storage for model artifacts and prediction outputs",
      ],
    },
    {
      title: "Promotions Microservice",
      type: "Backend / DevOps / API System",
      description:
        "Developed and tested a promotions management microservice with REST APIs, Swagger documentation, automated testing, and containerized deployment workflows.",
      tech: ["Python", "Flask", "Flask-RESTX", "PostgreSQL", "Docker", "Kubernetes", "OpenShift"],
      highlights: [
        "Implemented RESTful CRUD endpoints and action routes",
        "Added Swagger API documentation and automated tests",
        "Worked with CI/CD pipeline concepts using Tekton and OpenShift",
      ],
    },
  ];

  const skills = [
    {
      icon: <Brain className="h-5 w-5" />,
      title: "AI / ML",
      items: ["Machine Learning", "Computer Vision", "MediaPipe", "Scikit-learn", "LLM Tools"],
    },
    {
      icon: <Code2 className="h-5 w-5" />,
      title: "Software Engineering",
      items: ["Python", "Java", "JavaScript", "React", "Flask", "REST APIs"],
    },
    {
      icon: <Cloud className="h-5 w-5" />,
      title: "Cloud / DevOps",
      items: ["AWS", "Docker", "Kubernetes", "OpenShift", "CI/CD", "GitHub"],
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-6 py-20 md:grid-cols-[1.15fr_0.85fr] md:gap-6 lg:px-4">        <div>
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-300">
          <MapPin className="h-4 w-4" />
          New York, NY · MSCS @ NYU Courant
        </div>

        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-7xl">
            Jason Chen
          </h1>

          <img
            src="/images/profilepic.jpg"
            alt="Jason Chen"
            className="h-20 w-20 rounded-full border border-slate-700 object-cover shadow-2xl md:hidden"
          />
        </div>

        <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300 md:text-2xl">
          AI Engineering · Full-Stack Development · Cloud Computing
        </p>

        <p className="mt-6 max-w-3xl text-base leading-7 text-slate-400 md:text-lg">
          I am a Computer Science master’s student at NYU Courant who enjoys building practical AI systems, cloud-based applications, and web products that turn technical ideas into usable experiences.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a href="mailto:jason980102@gmail.com" className="rounded-2xl bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-slate-200">
            Contact Me
          </a>
          <a href="#projects" className="rounded-2xl border border-slate-700 px-5 py-3 font-medium text-slate-200 transition hover:bg-slate-900">
            View Projects
          </a>
          <a href="/Jason_Chen_Resume.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 font-medium text-slate-200 transition hover:bg-slate-900">
            <Download className="h-4 w-4" /> Resume
          </a>
        </div>

        <div className="mt-8 flex gap-5 text-slate-400">
          <a href="https://github.com/jason980102" className="transition hover:text-white" aria-label="GitHub">
            <FaGithub className="h-6 w-6" />
          </a>
          <a href="https://www.linkedin.com/in/jason-chen-030669381/" className="transition hover:text-white" aria-label="LinkedIn">
            <FaLinkedin className="h-6 w-6" />
          </a>
          <a href="mailto:jason980102@gmail.com" className="transition hover:text-white" aria-label="Email">
            <Mail />
          </a>
        </div>
      </div>

        <div className="hidden justify-center md:flex md:justify-center">
          <img
            src="/images/profilepic.jpg"
            alt="Jason Chen"
            className="h-72 w-72 rounded-full border border-slate-700 object-cover shadow-2xl lg:h-80 lg:w-80"
          />
        </div>
      </section>

      <section id="about" className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          About Me
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          Building AI-powered systems with practical impact.
        </h2>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl shadow-black/20">
          <div className="mb-4 flex items-center gap-3 text-slate-300">
            <GraduationCap className="h-5 w-5" />
            <span>Master of Science in Computer Science, NYU Courant</span>
          </div>

          <p className="leading-7 text-slate-400">
            My work focuses on building useful systems across AI, backend engineering, and cloud deployment. I am especially interested in projects that combine machine learning, APIs, data pipelines, and clean user-facing interfaces.
          </p>
        </div>
      </section>


      <section id="skills" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">What I Use</p>
        <h2 className="mt-2 text-3xl font-bold text-white">Skills</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {skills.map((group) => (
            <div key={group.title} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7">
              <div className="mb-4 flex items-center gap-3 text-white">
                {group.icon}
                <h3 className="text-xl font-semibold">{group.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Selected Work</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Projects</h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <article key={project.title} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-slate-600">
              <p className="mb-3 text-sm font-medium text-slate-400">{project.type}</p>
              <h3 className="text-2xl font-bold text-white">{project.title}</h3>
              <p className="mt-4 leading-7 text-slate-400">{project.description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.tech.map((item) => (
                  <span key={item} className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
                    {item}
                  </span>
                ))}
              </div>

              <ul className="mt-5 space-y-2 text-sm text-slate-400">
                {project.highlights.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>

              <a href="#" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white">
                View details <ExternalLink className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      </section>


      <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center md:p-12">
          <h2 className="text-3xl font-bold text-white">Let’s build something useful.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            I am currently looking for internship opportunities in AI engineering, software engineering, full-stack development, and cloud-based systems.
          </p>
          <a href="mailto:jason980102@gmail.com" className="mt-8 inline-flex rounded-2xl bg-white px-6 py-3 font-medium text-slate-950 transition hover:bg-slate-200">
            Email Me
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-900 px-6 py-8 text-center text-sm text-slate-500">
        © 2026 Jason Chen. Built with React and Tailwind CSS.
      </footer>
    </main>
  );
}
