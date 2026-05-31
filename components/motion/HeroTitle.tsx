"use client";

import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import MatrixText from "@/components/motion/MatrixText";
import { fadeIn, fadeUp } from "@/lib/motion";

const SURNAME = profile.fullName.split(" ")[1] ?? "Prabhakar";

export default function HeroTitle() {
  return (
    <div className="max-w-4xl">
      <motion.p
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-[var(--nav-fg-muted)]"
      >
        Research · Engineering · Writing
      </motion.p>

      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
      >
        <motion.span
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-foreground"
        >
          {profile.name}{" "}
        </motion.span>
        <MatrixText
          text={SURNAME}
          className="text-[var(--orange)] text-4xl sm:text-5xl lg:text-6xl font-semibold"
          delay={0.55}
          stagger={0.08}
        />
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 max-w-2xl text-lg leading-relaxed text-muted"
      >
        {profile.tagline}
      </motion.p>
    </div>
  );
}
