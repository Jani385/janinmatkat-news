import { config, fields, collection } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  ui: {
    brand: {
      name: "Janin Matkat News",
    },
  },
  collections: {
    posts: collection({
      label: "Articles",
      slugField: "title",
      path: "src/content/posts/*",
      format: { contentField: "content" },
      entryLayout: "content",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        summary: fields.text({
          label: "Summary",
          description: "A short summary for SEO and article cards (max 200 chars)",
          multiline: true,
        }),
        coverImage: fields.image({
          label: "Cover Image",
          directory: "public/images/posts",
          publicPath: "/images/posts",
          description: "Article cover image (recommended 1200x630)",
        }),
        coverImageAlt: fields.text({
          label: "Cover Image Alt Text",
          description: "Describe the image for accessibility",
        }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Travel", value: "travel" },
            { label: "Politics", value: "politics" },
            { label: "Business", value: "business" },
            { label: "Culture", value: "culture" },
          ],
          defaultValue: "travel",
        }),
        publishedDate: fields.date({
          label: "Published Date",
        }),
        author: fields.text({
          label: "Author",
          defaultValue: "Jani",
        }),
        featured: fields.checkbox({
          label: "Featured Article",
          description: "Show this article in the featured section on the homepage",
        }),
        content: fields.markdoc({
          label: "Content",
        }),
      },
    }),
  },
});
