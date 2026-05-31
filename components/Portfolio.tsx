import { Mail, MapPin } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import ContactForm from "@/components/ContactForm";
import ParallaxHeroBg from "@/components/ParallaxHeroBg";
import Reveal from "@/components/Reveal";
import {
  getAchievements,
  getProfile,
  getProjects,
  getSkills,
} from "@/lib/content";
import { projectSlug } from "@/lib/search";
import { consoleCard, consoleHover } from "@/lib/utils";
import type {
  Achievement,
  Profile,
  Project,
  SkillsByCategory,
} from "@/lib/types";

function staggerStyle(i: number): CSSProperties {
  return { ["--i" as string]: i } as CSSProperties;
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.79-.01 3.17 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

const pillBase = `inline-flex items-center gap-2 rounded-full border border-border-strong px-4 py-2 text-sm font-medium text-foreground ${consoleHover}`;

export default async function Portfolio() {
  const [profile, projects, skills, achievements] = await Promise.all([
    getProfile(),
    getProjects(),
    getSkills(),
    getAchievements(),
  ]);

  return (
    <div className="relative flex w-full flex-col gap-24 py-16 sm:py-24 lg:max-w-3xl">
      <ParallaxHeroBg />
      <Reveal>
        <Hero profile={profile} />
      </Reveal>
      <Reveal>
        <Achievements achievements={achievements} />
      </Reveal>
      <Reveal>
        <Skills skills={skills} />
      </Reveal>
      <Reveal>
        <Projects projects={projects} />
      </Reveal>
      <Reveal>
        <Contact email={profile.email} />
      </Reveal>
    </div>
  );
}

function Contact({ email }: { email: string }) {
  return (
    <section id="contact" className="flex flex-col gap-6 scroll-mt-24">
      <SectionHeading>Contact</SectionHeading>
      <p className="text-sm text-muted">
        Have a project in mind, an opportunity, or just want to say hi? Send a
        message below or email me directly at{" "}
        <a
          href={`mailto:${email}`}
          className="text-accent-fg underline underline-offset-4"
        >
          {email}
        </a>
        .
      </p>
      <ContactForm />
    </section>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-semibold tracking-tight text-foreground inline-flex items-center gap-3">
      <span className="h-px w-8 bg-gradient-to-r from-grad-from to-grad-to" />
      {children}
    </h2>
  );
}

function Achievements({ achievements }: { achievements: Achievement[] }) {
  if (achievements.length === 0) return null;
  return (
    <section id="achievements" className="flex flex-col gap-6 scroll-mt-24">
      <SectionHeading>Achievements</SectionHeading>

      <ol className="stagger flex flex-col gap-3">
        {achievements.map((a, i) => (
          <li
            key={`${a.year}-${a.title}`}
            style={staggerStyle(i)}
            className={`${consoleCard} p-5 sm:grid sm:grid-cols-[80px_1fr] sm:gap-5`}
          >
            <div className="mb-2 sm:mb-0 sm:pt-0.5">
              <span className="whitespace-nowrap font-mono text-sm font-semibold text-accent-fg">
                {a.month ? `${a.month} ${a.year}` : a.year}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="rounded-full border border-accent-fg/40 bg-accent-soft px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent-fg">
                  {a.placement}
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  {a.title}
                </h3>
              </div>
              {a.context && (
                <p className="text-sm text-muted">{a.context}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Skills({ skills }: { skills: SkillsByCategory }) {
  const entries = Object.entries(skills);
  if (entries.length === 0) return null;
  return (
    <section id="skills" className="flex flex-col gap-6 scroll-mt-24">
      <SectionHeading>Skills</SectionHeading>

      <dl className="stagger flex flex-col gap-5">
        {entries.map(([category, items], i) => (
          <div
            key={category}
            style={staggerStyle(i)}
            className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-6"
          >
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-2 sm:w-24 sm:pt-1.5">
              {category}
            </dt>
            <dd className="flex flex-wrap gap-1.5">
              {items.map((item) => (
                <span
                  key={item}
                  className={`${consoleHover} cursor-default rounded-full border border-border bg-accent-soft px-2.5 py-1 text-xs text-foreground`}
                >
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="flex flex-col gap-6">
      {profile.avatar && (
        <Image
          src={profile.avatar.src}
          alt={profile.avatar.alt}
          width={profile.avatar.width}
          height={profile.avatar.height}
          placeholder={profile.avatar.blurDataURL ? "blur" : "empty"}
          blurDataURL={profile.avatar.blurDataURL}
          priority
          sizes="80px"
          className="h-20 w-20 rounded-full object-cover ring-2 ring-accent-fg/30"
        />
      )}

      <div className="inline-flex w-fit items-center gap-2 rounded-md px-2 py-1 text-sm text-muted">
        <MapPin className="h-4 w-4 text-accent-fg" />
        <span>{profile.location}</span>
      </div>

      <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground">
        Hey, I&apos;m{" "}
        <span className="bg-gradient-to-r from-grad-from to-grad-to bg-clip-text text-transparent">
          {profile.name}
        </span>
      </h1>

      <p className="max-w-xl text-lg text-muted sm:text-xl">
        {profile.tagline}
      </p>

      <div className="flex flex-wrap items-center gap-3 mt-2">
        <a href={`mailto:${profile.email}`} className={pillBase}>
          <Mail className="h-4 w-4" />
          Email
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className={pillBase}
        >
          <GithubIcon className="h-4 w-4" />
          GitHub
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={pillBase}
        >
          <LinkedinIcon className="h-4 w-4" />
          LinkedIn
        </a>
      </div>
    </section>
  );
}

function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="flex flex-col gap-6 scroll-mt-24">
      <SectionHeading>Projects</SectionHeading>

      {projects.length === 0 ? (
        <p className="text-sm text-muted-2">Projects coming soon.</p>
      ) : (
        <ul className="stagger grid gap-4 sm:grid-cols-2">
          {projects.map((project, i) => (
            <li
              key={project.title}
              id={`project-${projectSlug(project.title)}`}
              style={staggerStyle(i)}
              className={`${consoleCard} group flex scroll-mt-24 flex-col gap-3 overflow-hidden p-5 target:border-highlight target:shadow-[0_0_40px_-8px_var(--highlight)]`}
            >
              {project.image && (
                <div className="relative -mx-5 -mt-5 mb-2 aspect-[16/9] overflow-hidden border-b border-border bg-card">
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    placeholder={project.image.blurDataURL ? "blur" : "empty"}
                    blurDataURL={project.image.blurDataURL}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              )}
              <h3 className="text-lg font-semibold text-foreground">
                {project.title}
              </h3>
              <p className="text-sm text-muted">{project.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className={`${consoleHover} rounded-full border border-border bg-accent-soft px-2.5 py-0.5 text-xs text-muted`}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 mt-1 text-sm font-medium">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded px-1 text-accent-fg underline underline-offset-4"
                  >
                    Code
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded px-1 text-accent-fg underline underline-offset-4"
                  >
                    Live
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
