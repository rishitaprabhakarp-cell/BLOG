import { cn } from "@/lib/utils";

type SlashLabelProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SlashLabel({ children, className }: SlashLabelProps) {
  return (
    <span
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.14em] text-muted-2",
        className,
      )}
    >
      / {children}
    </span>
  );
}
