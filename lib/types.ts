/**
 * A static image reference. `src` is a path under /public (e.g.
 * "/images/saathi.png") or a remote URL allowlisted in `next.config.ts`.
 *
 * Always provide explicit `width` and `height` (the source image's intrinsic
 * dimensions) so next/image can reserve layout space and avoid CLS.
 *
 * `blurDataURL` (optional) — a tiny base64 data URL used as a blurred
 * placeholder. Generate with `plaiceholder` or any base64 tool. ~24x24 px is
 * enough; the encoded string should stay under ~1.5 KB.
 */
export type ImageMeta = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
};

export type Profile = {
  name: string;
  fullName: string;
  tagline: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  /** Square headshot, ideally 256x256+. Rendered at 80x80 in the hero. */
  avatar?: ImageMeta;
};

export type Project = {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  /** Project screenshot, ideally 16:9 (e.g. 1600x900). Rendered at the top of
   * the project card with `next/image`. */
  image?: ImageMeta;
};

export type SkillsByCategory = Record<string, string[]>;

/**
 * A real-world achievement (award, ranking, certification). Rendered as a
 * vertical list of cards in the Achievements section.
 *
 * - `year` is the four-digit year. When `month` is also set, the date tag
 *   renders as "Mon YYYY" (e.g. "Apr 2024"); otherwise just the year.
 * - `placement` is a short badge: "2nd Place", "Rank 177", "Cleared Level 1".
 * - `title` is the competition / program name.
 * - `context` is an optional subtitle for organization, level, or details.
 */
export type Achievement = {
  year: number;
  /** Optional short month label, e.g. "Apr", "April". */
  month?: string;
  placement: string;
  title: string;
  context?: string;
};
