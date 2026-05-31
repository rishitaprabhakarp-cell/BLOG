"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

type MotionStaggerProps = {
  children: ReactNode;
  className?: string;
  as?: "ul" | "div";
};

export function MotionStagger({
  children,
  className,
  as = "div",
}: MotionStaggerProps) {
  const Component = motion[as];

  return (
    <Component
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-6% 0px" }}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}

export function MotionStaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "li" | "div";
}) {
  const Component = motion[as];

  return (
    <Component variants={staggerItem} className={cn(className)}>
      {children}
    </Component>
  );
}
