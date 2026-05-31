import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SlashLabel from "@/components/stripe/SlashLabel";
import BracketTag from "@/components/stripe/BracketTag";
import StatsTicker from "@/components/stripe/StatsTicker";
import { getPublishedProjects } from "@/lib/data";
import { consoleHover, formatStripeDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
  description: "Engineering projects and writeups.",
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <>
      <div className="mx-auto w-full max-w-[1400px] px-6 py-10 sm:px-10 lg:py-14">
        <div className="mb-10 flex items-start justify-between border-b border-border pb-8">
          <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">
            Projects
          </h1>
          <span className="font-mono text-sm text-[var(--orange)]">({projects.length})</span>
        </div>

        <SlashLabel className="mb-6 block">PROJECTS</SlashLabel>

        {projects.length === 0 ? (
          <div className="empty-state">No published projects yet.</div>
        ) : (
          <ul className="divide-y divide-border border border-border">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/projects/${project.slug}`}
                  className={`group block p-6 transition-colors ${consoleHover}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">{project.title}</h2>
                      <p className="mt-2 text-sm text-muted group-hover:text-highlight-fg/80">
                        {project.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.tech.map((t) => (
                          <BracketTag
                            key={t}
                            className="group-hover:border-highlight-fg/40 group-hover:text-highlight-fg/80"
                          >
                            {t}
                          </BracketTag>
                        ))}
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-highlight-fg" />
                  </div>
                  <p className="mt-4 font-mono text-xs text-muted-2 group-hover:text-highlight-fg/70">
                    {formatStripeDate(project.published_at)}
                    {project.timeline ? ` · ${project.timeline}` : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <StatsTicker />
    </>
  );
}
