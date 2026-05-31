import { cn } from "@/lib/utils";

export type TimelineItem = {
  date: string;
  title: string;
  description?: string;
};

type TimelineProps = {
  items: TimelineItem[];
  className?: string;
};

export default function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cn("relative space-y-6 border-l border-border pl-6", className)}>
      {items.map((item) => (
        <li key={`${item.date}-${item.title}`} className="relative">
          <span
            aria-hidden
            className="absolute -left-[calc(1.5rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-background"
          />
          <time className="text-xs font-mono text-muted-2">{item.date}</time>
          <p className="mt-1 font-medium text-foreground">{item.title}</p>
          {item.description && (
            <p className="mt-1 text-sm text-muted">{item.description}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
