import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StripeNavbar from "@/components/stripe/Navbar";
import GridShell from "@/components/stripe/GridShell";
import PageTransition from "@/components/motion/PageTransition";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeScript from "@/components/ThemeScript";
import { ToastProvider } from "@/components/Toast";
import { profile } from "@/content/profile";
import type { CommandItem } from "@/components/blog/CommandPalette";
import {
  getPublishedPosts,
  getPublishedProjects,
} from "@/lib/data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — Research & Engineering`,
    template: `%s · ${profile.name}`,
  },
  description: profile.tagline,
  alternates: {
    types: {
      "application/rss+xml": `${SITE_URL}/rss.xml`,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#050a14",
  colorScheme: "dark light",
};

async function getCommandItems(): Promise<CommandItem[]> {
  const [posts, projects] = await Promise.all([
    getPublishedPosts(),
    getPublishedProjects(),
  ]);

  const items: CommandItem[] = [
    { id: "page-home", title: "Home", href: "/", kind: "page" },
    { id: "page-blog", title: "Blog", href: "/blog", kind: "page" },
    { id: "page-projects", title: "Projects", href: "/projects", kind: "page" },
    { id: "page-about", title: "About", href: "/about", kind: "page" },
  ];

  for (const post of posts) {
    items.push({
      id: `post-${post.slug}`,
      title: post.title,
      description: post.description,
      href: `/blog/${post.slug}`,
      kind: "writing",
      tags: post.tags,
    });
  }
  for (const project of projects) {
    items.push({
      id: `project-${project.slug}`,
      title: project.title,
      description: project.description,
      href: `/projects/${project.slug}`,
      kind: "project",
      tags: project.tags,
    });
  }

  return items;
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const commandItems = await getCommandItems();

  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body id="top" className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <ToastProvider>
            <GridShell className="flex min-h-full flex-col">
              <StripeNavbar commandItems={commandItems} />
              <PageTransition>
                <div className="flex flex-1 flex-col">{children}</div>
              </PageTransition>
            </GridShell>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
