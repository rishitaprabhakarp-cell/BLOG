import { cn } from "@/lib/utils";
import SlashLabel from "@/components/stripe/SlashLabel";

type TerminalFrameProps = {
  figure?: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
};

export default function TerminalFrame({
  figure = "FIG. 1",
  label,
  children,
  className,
}: TerminalFrameProps) {
  return (
    <div
      className={cn(
        "flex flex-col border border-border bg-[var(--terminal-bg)]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-2">
          [ {figure} ]
        </span>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 border border-border-strong" />
          <span className="h-2 w-2 border border-border-strong" />
        </div>
      </div>
      {label && (
        <div className="border-b border-border px-3 py-1.5">
          <SlashLabel>{label}</SlashLabel>
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
