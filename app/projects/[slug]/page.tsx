import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { GithubIcon } from "@/components/icons/BrandIcons";
import SlashLabel from "@/components/stripe/SlashLabel";
import BracketTag from "@/components/stripe/BracketTag";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import StatsTicker from "@/components/stripe/StatsTicker";
import { getProjectBySlug, getPublishedProjects } from "@/lib/data";
import { formatStripeDate } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return { title: project.title, description: project.description };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <article className="mx-auto w-full max-w-[1400px] px-6 py-10 sm:px-10 lg:py-14">
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-1.5 font-mono text-xs text-muted"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All projects
        </Link>

        <header className="border-b border-border pb-8">
          <p className="mb-3 font-mono text-xs text-muted-2">
            {formatStripeDate(project.published_at)}
          </p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{project.title}</h1>
          <p className="mt-3 text-lg text-muted">{project.description}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <BracketTag key={t}>{t}</BracketTag>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-fg"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                Repository
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-fg"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Live
              </a>
            )}
          </div>
        </header>

        <div className="grid gap-12 py-10 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <SlashLabel>METADATA</SlashLabel>
            {project.timeline && (
              <dl className="font-mono text-xs">
                <dt className="text-muted-2">TIMELINE:</dt>
                <dd className="mt-1">{project.timeline}</dd>
              </dl>
            )}
            {project.learnings.length > 0 && (
              <div>
                <SlashLabel className="mb-3 block">LEARNINGS</SlashLabel>
                <ul className="space-y-2 text-sm text-muted">
                  {project.learnings.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-accent-fg">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          <div>
            <SlashLabel className="mb-6 block">WRITEUP</SlashLabel>
            <MarkdownRenderer content={project.body} />
          </div>
        </div>
      </article>
      <StatsTicker />
    </>
  );
}
