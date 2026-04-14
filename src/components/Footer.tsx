import Link from "next/link";
import { SITE_NAME, CATEGORIES } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-card-border)] bg-white mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg text-[var(--color-primary-dark)] mb-2">
              {SITE_NAME}
            </h3>
            <p className="text-sm text-[var(--color-muted)]">
              Travel and politics news from Finland. Insights from a travel
              entrepreneur who sees the world differently.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-3">
              Categories
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.value}>
                  <Link
                    href={`/category/${cat.value}`}
                    className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {cat.emoji} {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-3">
              About
            </h4>
            <p className="text-sm text-[var(--color-muted)]">
              Janin Matkat is a Finnish travel company. This news site shares our
              perspective on travel, politics, and how they intersect.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-[var(--color-card-border)] text-center text-xs text-[var(--color-muted)]">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
