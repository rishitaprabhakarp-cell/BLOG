import HomeContent from "@/components/stripe/HomeContent";
import StatsTicker from "@/components/stripe/StatsTicker";
import {
  getFeaturedPosts,
  getFeaturedProjects,
  getPublishedPosts,
  getReadingList,
} from "@/lib/data";

export default async function HomePage() {
  const [featured, posts, projects, readingList] = await Promise.all([
    getFeaturedPosts(),
    getPublishedPosts(),
    getFeaturedProjects(),
    getReadingList(),
  ]);

  return (
    <>
      <HomeContent
        featuredPosts={featured}
        projects={projects}
        recentPosts={posts}
        readingList={readingList}
      />
      <StatsTicker />
    </>
  );
}
