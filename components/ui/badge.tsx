import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & {
  variant?: "default" | "outline" | "accent";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variant === "default" && "bg-accent-soft text-accent-fg",
        variant === "outline" && "border border-border text-muted",
        variant === "accent" &&
          "border border-highlight/30 bg-highlight/10 text-highlight",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
