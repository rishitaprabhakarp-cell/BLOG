import type { TocItem } from "@/components/blog/TableOfContents";
import { slugify } from "@/lib/utils";

export function extractHeadings(content: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;

    const level = match[1].length;
    const text = match[2].replace(/\*\*|`|_/g, "").trim();
    items.push({
      id: slugify(text),
      text,
      level,
    });
  }

  return items;
}

export function extractFootnotes(content: string): { id: string; text: string }[] {
  const footnotes: { id: string; text: string }[] = [];
  const regex = /^\[\^(\d+)\]:\s*(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    footnotes.push({ id: match[1], text: match[2] });
  }

  return footnotes;
}
