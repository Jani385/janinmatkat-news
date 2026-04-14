import Link from "next/link";
import type { Post } from "@/lib/content";

function CategoryBadge({ category }: { category: string }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium badge-${category}`}
    >
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ArticleCard({ post }: { post: Post }) {
  return (
    <Link href={`/articles/${post.slug}`} className="group block">
      <article className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-card-border)] overflow-hidden hover:shadow-md transition-shadow">
        {post.coverImage && (
          <div className="aspect-[16/9] overflow-hidden bg-gray-100">
            <img
              src={post.coverImage}
              alt={post.coverImageAlt || post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        {!post.coverImage && (
          <div className="aspect-[16/9] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center">
            <span className="text-white/50 text-4xl">
              {post.category === "travel"
                ? "✈️"
                : post.category === "politics"
                  ? "🏛️"
                  : post.category === "business"
                    ? "💼"
                    : "🎭"}
            </span>
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CategoryBadge category={post.category} />
            {post.publishedDate && (
              <span className="text-xs text-[var(--color-muted)]">
                {formatDate(post.publishedDate)}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-lg group-hover:text-[var(--color-primary)] transition-colors mb-1">
            {post.title}
          </h3>
          {post.summary && (
            <p className="text-sm text-[var(--color-muted)] line-clamp-2">
              {post.summary}
            </p>
          )}
          <div className="mt-3 text-xs text-[var(--color-muted)]">
            By {post.author}
          </div>
        </div>
      </article>
    </Link>
  );
}

export function FeaturedArticle({ post }: { post: Post }) {
  return (
    <Link href={`/articles/${post.slug}`} className="group block">
      <article className="relative rounded-xl overflow-hidden">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.coverImageAlt || post.title}
            className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-[400px] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]" />
        )}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <CategoryBadge category={post.category} />
          <h2 className="mt-2 text-2xl md:text-3xl font-bold leading-tight">
            {post.title}
          </h2>
          {post.summary && (
            <p className="mt-2 text-white/80 text-sm md:text-base line-clamp-2">
              {post.summary}
            </p>
          )}
          <div className="mt-3 flex items-center gap-3 text-sm text-white/70">
            <span>By {post.author}</span>
            {post.publishedDate && <span>{formatDate(post.publishedDate)}</span>}
          </div>
        </div>
      </article>
    </Link>
  );
}
