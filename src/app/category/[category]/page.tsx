import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostsByCategory, CATEGORIES } from "@/lib/content";
import { ArticleCard } from "@/components/ArticleCard";

const validCategories = CATEGORIES.map((c) => c.value);

export async function generateStaticParams() {
  return validCategories.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.value === category);
  if (!cat) return { title: "Not Found" };

  return {
    title: `${cat.label} News`,
    description: `Latest ${cat.label.toLowerCase()} news and articles from Janin Matkat News.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!validCategories.includes(category as typeof validCategories[number])) {
    notFound();
  }

  const cat = CATEGORIES.find((c) => c.value === category);
  const posts = await getPostsByCategory(category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        {cat?.emoji} {cat?.label} News
      </h1>
      <p className="text-[var(--color-muted)] mb-8">
        Latest {cat?.label.toLowerCase()} articles and stories.
      </p>

      {posts.length === 0 ? (
        <p className="text-[var(--color-muted)] text-center py-12">
          No {cat?.label.toLowerCase()} articles published yet. Check back soon!
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
