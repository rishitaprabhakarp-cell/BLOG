import type { Metadata } from "next";
import Portfolio from "@/components/Portfolio";
import StatsTicker from "@/components/stripe/StatsTicker";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "About",
  description: profile.tagline,
};

export default function AboutPage() {
  return (
    <>
      <div className="relative flex flex-1 flex-col items-center overflow-x-clip">
        <main className="flex w-full max-w-[1400px] flex-1 flex-col px-6 sm:px-10">
          <Portfolio />
        </main>
      </div>
      <StatsTicker />
    </>
  );
}
