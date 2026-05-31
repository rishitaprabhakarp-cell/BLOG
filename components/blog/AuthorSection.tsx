import Link from "next/link";
import { profile } from "@/content/profile";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";

export default function AuthorSection() {
  return (
    <section className="rounded-xl border border-border bg-card/40 p-6 sm:p-8 not-prose">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-gradient-to-br from-accent/20 to-accent-2/10 font-display text-xl font-semibold text-accent-fg">
          {profile.name.charAt(0)}
        </div>
        <div className="space-y-3">
          <div>
            <h3 className="font-display text-lg font-semibold">{profile.fullName}</h3>
            <p className="text-sm text-muted">{profile.tagline}</p>
          </div>
          <p className="text-sm text-muted-2 leading-relaxed">
            I write about AI systems, full-stack engineering, and the craft of
            building tools that help people think better. Based in {profile.location}.
          </p>
          <div className="flex gap-3">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-md p-1.5 text-muted"
              aria-label="GitHub"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-md p-1.5 text-muted"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <Link href="/about" className="inline-flex rounded-md px-2 py-1.5 text-sm text-accent-fg">
              More about me →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
