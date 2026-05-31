import { cn } from "@/lib/utils";

type QuoteBlockProps = {
  children: React.ReactNode;
  author?: string;
  className?: string;
};

export default function QuoteBlock({
  children,
  author,
  className,
}: QuoteBlockProps) {
  return (
    <blockquote
      className={cn(
        "my-8 border-l-2 border-accent/50 pl-6 not-prose",
        className,
      )}
    >
      <p className="font-display text-xl italic leading-relaxed text-foreground/90">
        {children}
      </p>
      {author && (
        <footer className="mt-3 text-sm text-muted-2">— {author}</footer>
      )}
    </blockquote>
  );
}
