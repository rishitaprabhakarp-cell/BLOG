import { cn } from "@/lib/utils";

type GridShellProps = {
  children: React.ReactNode;
  className?: string;
};

export default function GridShell({ children, className }: GridShellProps) {
  return (
    <div className={cn("relative min-h-full", className)}>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 stripe-grid opacity-100"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
