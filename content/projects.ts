import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    title: "Saathi — AI Voice Agent for Lead Conversion",
    description:
      "Multilingual AI voice agent automating partner lead conversion with real-time lead scoring and persistent memory. Selected for the AI for Bharat Hackathon (PAN IIT Bangalore).",
    tech: [
      "Python",
      "FastAPI",
      "Claude API",
      "Sarvam AI",
      "Deepgram",
      "ElevenLabs",
      "Redis",
      "PostgreSQL",
    ],
  },
  {
    title: "CropGuardian — AI Agricultural Threat Detection",
    description:
      "Mobile-first agritech app using browser-side TensorFlow.js to detect pests and cattle in real time — zero server transmission, full farmer data privacy.",
    tech: ["Next.js", "TensorFlow.js", "COCO-SSD", "Lucide React"],
  },
  {
    title: "Paw & Swipe — Pet Matchmaking Platform",
    description:
      "Full-stack swipe-based pet matchmaking platform with mutual-match-only interactions, JWT-authenticated messaging, and playdate scheduling.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Mongoose", "JWT"],
  },
];
