import { achievements } from "@/content/achievements";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import type {
  Achievement,
  Profile,
  Project,
  SkillsByCategory,
} from "./types";

// Async accessor layer: today these read from typed local content modules.
// When swapping to a CMS (Sanity, Contentful, etc.), only this file needs to
// change — call sites in components stay identical.

export async function getProfile(): Promise<Profile> {
  return profile;
}

export async function getProjects(): Promise<Project[]> {
  try {
    return projects;
  } catch {
    return [];
  }
}

export async function getSkills(): Promise<SkillsByCategory> {
  try {
    return skills;
  } catch {
    return {};
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  try {
    return achievements;
  } catch {
    return [];
  }
}
