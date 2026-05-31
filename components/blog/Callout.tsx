import { cn } from "@/lib/utils";
import { AlertCircle, Info, Lightbulb, TriangleAlert } from "lucide-react";

const variants = {
  info: {
    icon: Info,
    className: "border-accent/30 bg-accent-soft/40 text-foreground",
  },
  tip: {
    icon: Lightbulb,
    className: "border-emerald-500/30 bg-emerald-500/5 text-foreground",
  },
  warning: {
    icon: TriangleAlert,
    className: "border-amber-500/30 bg-amber-500/5 text-foreground",
  },
  note: {
    icon: AlertCircle,
    className: "border-border-strong bg-card text-foreground",
  },
} as const;

type CalloutProps = {
  variant?: keyof typeof variants;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Callout({
  variant = "info",
  title,
  children,
  className,
}: CalloutProps) {
  const { icon: Icon, className: variantClass } = variants[variant];

  return (
    <aside
      className={cn(
        "my-6 flex gap-3 rounded-xl border p-4 not-prose",
        variantClass,
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent-fg" />
      <div className="space-y-1 text-sm leading-relaxed">
        {title && <p className="font-medium">{title}</p>}
        <div className="text-muted [&_p]:m-0">{children}</div>
      </div>
    </aside>
  );
}
