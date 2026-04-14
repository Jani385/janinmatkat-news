import { createReader } from "@keystatic/core/reader";
import config from "../../keystatic.config";

export const reader = createReader(process.cwd(), config);

export type Post = {
  slug: string;
  title: string;
  summary: string;
  coverImage: string | null;
  coverImageAlt: string;
  category: string;
  publishedDate: string | null;
  author: string;
  featured: boolean;
};

export async function getAllPosts(): Promise<Post[]> {
  const slugs = await reader.collections.posts.list();
  const posts: Post[] = [];

  for (const slug of slugs) {
    const post = await reader.collections.posts.read(slug);
    if (post) {
      posts.push({
        slug,
        title: post.title,
        summary: post.summary || "",
        coverImage: post.coverImage || null,
        coverImageAlt: post.coverImageAlt || "",
        category: post.category,
        publishedDate: post.publishedDate || null,
        author: post.author || "Jani",
        featured: post.featured,
      });
    }
  }

  // Sort by date, newest first
  posts.sort((a, b) => {
    if (!a.publishedDate) return 1;
    if (!b.publishedDate) return -1;
    return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
  });

  return posts;
}

export async function getPostBySlug(slug: string) {
  const post = await reader.collections.posts.read(slug, {
    resolveLinkedFiles: true,
  });
  if (!post) return null;

  return {
    slug,
    title: post.title,
    summary: post.summary || "",
    coverImage: post.coverImage || null,
    coverImageAlt: post.coverImageAlt || "",
    category: post.category,
    publishedDate: post.publishedDate || null,
    author: post.author || "Jani",
    featured: post.featured,
    content: post.content,
  };
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.category === category);
}

export const SITE_NAME = "Janin Matkat News";
export const SITE_DESCRIPTION =
  "Travel and politics news from Finland — insights from a travel entrepreneur who sees the world differently.";
export const SITE_URL = "https://janinmatkatnews.com";

export const CATEGORIES = [
  { value: "travel", label: "Travel", emoji: "✈️" },
  { value: "politics", label: "Politics", emoji: "🏛️" },
  { value: "business", label: "Business", emoji: "💼" },
  { value: "culture", label: "Culture", emoji: "🎭" },
] as const;
