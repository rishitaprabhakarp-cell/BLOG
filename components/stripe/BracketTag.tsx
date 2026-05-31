import { cn } from "@/lib/utils";

type BracketTagProps = {
  children: React.ReactNode;
  className?: string;
};

export default function BracketTag({ children, className }: BracketTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-dashed border-border-strong px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted",
        className,
      )}
    >
      [ {children} ]
    </span>
  );
}
