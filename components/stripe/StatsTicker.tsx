import { getSiteStats } from "@/lib/data";
import { profile } from "@/content/profile";
import AnimatedStatsTicker from "@/components/motion/AnimatedStatsTicker";

export default async function StatsTicker() {
  const stats = await getSiteStats();

  const items = [
    `${profile.name.toUpperCase()} · RESEARCH & ENGINEERING`,
    `POSTS: ${stats.postCount}`,
    `PROJECTS: ${stats.projectCount}`,
  ];

  return <AnimatedStatsTicker items={items} />;
}
