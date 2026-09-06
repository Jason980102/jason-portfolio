import React from "react";
import AIChat from "@/components/AIChat";
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
} from "lucide-react";

export default function Portfolio() {
  const projects = [
    {
      id: "cloud-taekwondo",
      title: "Cloud-Based Intelligent Taekwondo Motion Classification System",
      type: "AI / Cloud / Computer Vision",
      description:
        "Built an end-to-end AI web system that classifies Taekwondo kicks from uploaded videos using MediaPipe pose estimation, machine learning, and cloud deployment.",
      tech: [
        "Python",
        "MediaPipe",
        "Scikit-learn",
        "AWS EC2",
        "S3",
        "Streamlit",
      ],
      highlights: [
        "Trained a Random Forest model on manually labeled Taekwondo motion data",
        "Deployed a Streamlit inference app on AWS EC2",
        "Integrated S3 storage for model artifacts and prediction outputs",
      ],
    },
    {
      id: "promotions-microservice",
      title: "Promotions Microservice with CI/CD Pipeline",
      type: "Backend / DevOps / API System",
      description:
        "Built a production-style backend microservice with REST APIs, Swagger documentation, automated testing, and containerized deployment workflows.",
      tech: [
        "Python",
        "Flask",
        "Flask-RESTX",
        "PostgreSQL",
        "Docker",
        "OpenShift",
        "Tekton",
      ],
      highlights: [
        "Implemented RESTful CRUD endpoints and promotion action routes",
        "Added Swagger API documentation and automated tests",
        "Worked with CI/CD deployment workflows using OpenShift and Tekton",
      ],
    },
    {
      id: "imdb-youtube-analytics",
      title: "IMDb & YouTube Movie Trailer Analytics",
      type: "Big Data / Analytics / Distributed Systems",
      description:
        "Built a big data analytics pipeline that processed IMDb and YouTube trailer datasets to analyze sentiment, ratings, and box office trends.",
      tech: [
        "Google Dataproc",
        "HDFS",
        "Hive",
        "Trino",
        "Python",
        "SQL",
      ],
      highlights: [
        "Processed large-scale movie datasets using distributed systems",
        "Built analytics workflows with Hive and Trino",
        "Generated business insights from ratings and sentiment analysis",
      ],
    },
    {
      id: "human-activity-recognition",
      title: "Human Activity Recognition Using CNN",
      type: "AI / Deep Learning / Sensor Data",
      description:
        "Developed a CNN-based human activity recognition model using sensor data preprocessing and deep learning techniques.",
      tech: ["Python", "TensorFlow", "Keras", "NumPy", "Pandas"],
      highlights: [
        "Improved activity classification accuracy from 72% to 97%",
        "Applied CNN architecture to time-series sensor data",
        "Built preprocessing pipelines for motion recognition",
      ],
    },
    {
      id: "nstc-research",
      title: "NSTC Undergraduate Research Project",
      type: "Research / Computer Vision / Sports Analytics",
      description:
        "Built a computer vision research system that transformed Taekwondo videos into measurable athlete performance metrics.",
      tech: [
        "Python",
        "MediaPipe",
        "OpenPose",
        "Computer Vision",
        "PWA",
      ],
      highlights: [
        "Selected as an NSTC undergraduate research project",
        "Analyzed athlete stability, consistency, and explosiveness from videos",
        "Combined pose estimation with performance analytics",
      ],
    },
  ];

  const skills = [
    {
      icon: <Brain className="h-5 w-5" />,
      title: "AI / ML",
      items: [
        "Machine Learning",
        "Computer Vision",
        "MediaPipe",
        "Scikit-learn",
        "LLM Tools",
      ],
    },
    {
      icon: <Code2 className="h-5 w-5" />,
      title: "Software Engineering",
      items: [
        "Python",
        "Java",
        "JavaScript",
        "React",
        "Flask",
        "REST APIs",
      ],
    },
    {
      icon: <Cloud className="h-5 w-5" />,
      title: "Cloud / DevOps",
      items: [
        "AWS",
        "Docker",
        "Kubernetes",
        "OpenShift",
        "CI/CD",
        "GitHub",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-6 py-20 md:grid-cols-[1.15fr_0.85fr] md:gap-6 lg:px-4">
        <div>
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
            AI Systems · Cloud Computing · Full-Stack Development
          </p>

          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-400 md:text-lg">
            I build AI-powered applications, cloud-based systems, and scalable
            backend services that combine machine learning, data pipelines, and
            modern software engineering.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="mailto:jason980102@gmail.com"
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
              href="/Jason_Chen_Resume.pdf"
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
              href="https://github.com/jason980102"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
              aria-label="GitHub"
            >
              <FaGithub className="h-6 w-6" />
            </a>

            <a
              href="https://www.linkedin.com/in/jason-chen-030669381/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="h-6 w-6" />
            </a>

            <a
              href="mailto:jason980102@gmail.com"
              className="transition hover:text-white"
              aria-label="Email"
            >
              <Mail />
            </a>
          </div>
        </div>

        <div className="hidden justify-center md:flex">
          <img
            src="/images/profilepic.jpg"
            alt="Jason Chen"
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
            <span>Master of Science in Computer Science, NYU Courant</span>
          </div>

          <p className="leading-7 text-slate-400">
            My work focuses on building useful systems across AI, backend
            engineering, and cloud deployment. I am especially interested in
            projects that combine machine learning, APIs, data pipelines, and
            clean user-facing interfaces.
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
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7">
            <h3 className="text-xl font-semibold text-white">
              New York University
            </h3>

            <p className="mt-2 text-slate-300">
              Courant Institute of Mathematical Sciences
            </p>

            <p className="mt-2 text-sm text-slate-400">
              M.S. in Computer Science · September 2025 – Present
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7">
            <h3 className="text-xl font-semibold text-white">
              University of Taipei
            </h3>

            <p className="mt-2 text-slate-300">
              B.S. in Computer Science
            </p>

            <p className="mt-2 text-sm text-slate-400">
              September 2021 – February 2025 · GPA 3.84 / 4.0
            </p>
          </div>
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

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {skills.map((group) => (
            <div
              key={group.title}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7"
            >
              <div className="mb-4 flex items-center gap-3 text-white">
                {group.icon}
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
          ))}
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
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7">
            <h3 className="text-xl font-semibold text-white">
              Frontend Design Intern
            </h3>

            <p className="mt-1 text-slate-300">
              Jessie Tech Co., Ltd.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              August 2023 – September 2023
            </p>

            <p className="mt-4 leading-7 text-slate-400">
              Worked on UX/UI data organization, frontend development, and 3D
              model testing using JavaScript and React.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7">
            <h3 className="text-xl font-semibold text-white">
              Teaching Assistant — Student Buddy Program
            </h3>

            <p className="mt-1 text-slate-300">
              University of Taipei
            </p>

            <p className="mt-2 text-sm text-slate-500">
              November 2024 – December 2024
            </p>
          </div>
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
              key={project.title}
              className="scroll-mt-24 rounded-3xl border border-slate-800 bg-slate-900/60 p-7 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-slate-600"
            >
              <p className="mb-3 text-sm font-medium text-slate-400">
                {project.type}
              </p>

              <h3 className="text-2xl font-bold text-white">
                {project.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.tech.map((item) => (
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
                  <li key={item}>
                    • {item}
                  </li>
                ))}
              </ul>

              <a
                href="https://github.com/jason980102"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white"
              >
                View details
                <ExternalLink className="h-4 w-4" />
              </a>
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
            Let’s build something useful.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            I am currently looking for internship opportunities in AI
            engineering, software engineering, full-stack development, and
            cloud-based systems.
          </p>

          <a
            href="mailto:jason980102@gmail.com"
            className="mt-8 inline-flex rounded-2xl bg-white px-6 py-3 font-medium text-slate-950 transition hover:bg-slate-200"
          >
            Email Me
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-900 px-6 py-8 text-center text-sm text-slate-500">
        © 2026 Jason Chen. Built with React and Tailwind CSS.
      </footer>

      <AIChat />
    </main>
  );
}