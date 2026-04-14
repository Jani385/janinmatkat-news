import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdoc from "@markdoc/markdoc";
import React from "react";
import { getPostBySlug, getAllPosts, SITE_NAME, SITE_URL } from "@/lib/content";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      url: `${SITE_URL}/articles/${post.slug}`,
      publishedTime: post.publishedDate || undefined,
      authors: [post.author],
      siteName: SITE_NAME,
      ...(post.coverImage && {
        images: [{ url: post.coverImage, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      ...(post.coverImage && { images: [post.coverImage] }),
    },
    alternates: {
      canonical: `${SITE_URL}/articles/${post.slug}`,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Render Markdoc content — Keystatic returns { node: Node } for markdoc fields
  const content = post.content as unknown as { node: Parameters<typeof Markdoc.transform>[0] } | string;
  let renderedContent: React.ReactNode;
  if (typeof content === "string") {
    const ast = Markdoc.parse(content);
    const contentTree = Markdoc.transform(ast);
    renderedContent = Markdoc.renderers.react(contentTree, React);
  } else {
    const contentTree = Markdoc.transform(content.node);
    renderedContent = Markdoc.renderers.react(contentTree, React);
  }

  // JSON-LD NewsArticle structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.summary,
    url: `${SITE_URL}/articles/${post.slug}`,
    datePublished: post.publishedDate || undefined,
    dateModified: post.publishedDate || undefined,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Janin Matkat",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/articles/${post.slug}`,
    },
    ...(post.coverImage && {
      image: {
        "@type": "ImageObject",
        url: post.coverImage.startsWith("http")
          ? post.coverImage
          : `${SITE_URL}${post.coverImage}`,
      },
    }),
    articleSection: post.category,
    inLanguage: "en",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <article className="mx-auto max-w-3xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[var(--color-muted)]">
          <Link href="/" className="hover:text-[var(--color-primary)]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/articles" className="hover:text-[var(--color-primary)]">
            Articles
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/category/${post.category}`}
            className="hover:text-[var(--color-primary)]"
          >
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 badge-${post.category}`}
          >
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {post.title}
          </h1>
          {post.summary && (
            <p className="text-lg text-[var(--color-muted)] leading-relaxed">
              {post.summary}
            </p>
          )}
          <div className="mt-4 flex items-center gap-4 text-sm text-[var(--color-muted)] border-b border-[var(--color-card-border)] pb-4">
            <span>By {post.author}</span>
            {post.publishedDate && <span>{formatDate(post.publishedDate)}</span>}
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.coverImageAlt || post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose">{renderedContent}</div>

        {/* Back link */}
        <div className="mt-12 pt-6 border-t border-[var(--color-card-border)]">
          <Link
            href="/articles"
            className="text-[var(--color-primary)] hover:underline text-sm"
          >
            &larr; Back to all articles
          </Link>
        </div>
      </article>
    </>
  );
}
