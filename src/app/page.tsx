import Link from "next/link";
import { getAllPosts, SITE_NAME, SITE_DESCRIPTION, SITE_URL, CATEGORIES } from "@/lib/content";
import { ArticleCard, FeaturedArticle } from "@/components/ArticleCard";

export default async function Home() {
  const posts = await getAllPosts();
  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const latestPosts = posts.filter((p) => p.slug !== featuredPost?.slug).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    publisher: {
      "@type": "Organization",
      name: "Janin Matkat",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Hero / Featured Article */}
        {featuredPost ? (
          <section className="mb-12">
            <FeaturedArticle post={featuredPost} />
          </section>
        ) : (
          <section className="mb-12 text-center py-20">
            <h2 className="text-3xl font-bold text-[var(--color-primary-dark)] mb-4">
              Welcome to {SITE_NAME}
            </h2>
            <p className="text-[var(--color-muted)] mb-6 max-w-lg mx-auto">
              {SITE_DESCRIPTION}
            </p>
            <p className="text-sm text-[var(--color-muted)]">
              No articles yet. Visit{" "}
              <Link
                href="/keystatic"
                className="text-[var(--color-primary)] underline"
              >
                the admin dashboard
              </Link>{" "}
              to create your first article.
            </p>
          </section>
        )}

        {/* Category Navigation */}
        <section className="mb-10">
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/category/${cat.value}`}
                className="px-4 py-2 rounded-full bg-[var(--color-card-bg)] border border-[var(--color-card-border)] text-sm font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                {cat.emoji} {cat.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Latest Articles */}
        {latestPosts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Latest Articles</h2>
              <Link
                href="/articles"
                className="text-sm text-[var(--color-primary)] hover:underline"
              >
                View all &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
