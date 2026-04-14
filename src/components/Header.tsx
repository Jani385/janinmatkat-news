import Link from "next/link";
import { SITE_NAME, CATEGORIES } from "@/lib/content";

export function Header() {
  return (
    <header className="border-b border-[var(--color-card-border)] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="group">
            <h1 className="text-2xl font-bold text-[var(--color-primary-dark)]">
              {SITE_NAME}
            </h1>
            <p className="text-xs text-[var(--color-muted)]">
              Travel &amp; Politics from Finland
            </p>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/category/${cat.value}`}
                className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors"
              >
                {cat.label}
              </Link>
            ))}
            <Link
              href="/articles"
              className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors"
            >
              All Articles
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
