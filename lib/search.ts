import { getAchievements, getProjects, getSkills } from "@/lib/content";

export type SearchItemKind = "project" | "skill" | "achievement" | "blog";

export type SearchItem = {
  id: string;
  kind: SearchItemKind;
  title: string;
  description?: string;
  tags?: string[];
  anchor: string;
  sectionLabel: string;
};

export function projectSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getSearchIndex(): Promise<SearchItem[]> {
  const [projects, skills, achievements] = await Promise.all([
    getProjects(),
    getSkills(),
    getAchievements(),
  ]);

  const items: SearchItem[] = [];

  for (const project of projects) {
    items.push({
      id: `project-${projectSlug(project.title)}`,
      kind: "project",
      title: project.title,
      description: project.description,
      tags: project.tech,
      anchor: `#project-${projectSlug(project.title)}`,
      sectionLabel: "Project",
    });
  }

  for (const [category, list] of Object.entries(skills)) {
    for (const skill of list) {
      items.push({
        id: `skill-${category}-${skill}`,
        kind: "skill",
        title: skill,
        description: `${category} skill`,
        anchor: "#skills",
        sectionLabel: "Skill",
      });
    }
  }

  for (const a of achievements) {
    const dateLabel = a.month ? `${a.month} ${a.year}` : String(a.year);
    items.push({
      id: `achievement-${a.year}-${projectSlug(a.title)}`,
      kind: "achievement",
      title: a.title,
      description: `${a.placement} · ${dateLabel}${a.context ? ` · ${a.context}` : ""}`,
      tags: [a.placement, dateLabel, String(a.year), ...(a.month ? [a.month] : [])],
      anchor: "#achievements",
      sectionLabel: "Achievement",
    });
  }

  // Future: spread blog posts here once the content/blog layer exists.
  // for (const post of await getBlogPosts()) { items.push({ kind: "blog", ... }) }

  return items;
}

type Scored = { item: SearchItem; score: number };

export function searchIndex(
  index: SearchItem[],
  rawQuery: string,
  limit = 8,
): SearchItem[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const scored: Scored[] = [];

  for (const item of index) {
    const title = item.title.toLowerCase();
    const description = item.description?.toLowerCase() ?? "";
    const tags = item.tags?.map((t) => t.toLowerCase()) ?? [];

    let score = 0;
    if (title.startsWith(query)) score += 100;
    else if (title.includes(query)) score += 60;
    if (tags.some((t) => t === query)) score += 50;
    else if (tags.some((t) => t.includes(query))) score += 30;
    if (description.includes(query)) score += 15;

    if (score > 0) scored.push({ item, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.item);
}
