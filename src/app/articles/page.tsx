import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import { ArticleCard } from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "All Articles",
  description: "Browse all travel, politics, business, and culture articles.",
};

export default async function ArticlesPage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">All Articles</h1>
      <p className="text-[var(--color-muted)] mb-8">
        Browse all our latest news and stories.
      </p>

      {posts.length === 0 ? (
        <p className="text-[var(--color-muted)] text-center py-12">
          No articles published yet. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
