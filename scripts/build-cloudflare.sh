#!/bin/bash
# Build script for Cloudflare Pages static deployment
# This temporarily removes server-only routes, builds a static export,
# then restores everything.

set -e

echo "==> Preparing static export for Cloudflare Pages..."

# Move server-only routes out of the way
mv src/app/keystatic src/app/_keystatic_disabled 2>/dev/null || true
mv src/app/api src/app/_api_disabled 2>/dev/null || true
mv src/app/robots.ts src/app/_robots_disabled.ts 2>/dev/null || true
mv src/app/sitemap.ts src/app/_sitemap_disabled.ts 2>/dev/null || true

# Create static robots.txt
cat > public/robots.txt << 'EOF'
User-agent: *
Allow: /
Disallow: /keystatic
Disallow: /api/

User-agent: GPTBot
Allow: /
Disallow: /keystatic
Disallow: /api/

User-agent: ClaudeBot
Allow: /
Disallow: /keystatic
Disallow: /api/

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://janinmatkatnews.com/sitemap.xml
EOF

# Build static export
STATIC_EXPORT=true npx next build

echo "==> Static export complete! Output in ./out"

# Restore server-only routes
mv src/app/_keystatic_disabled src/app/keystatic 2>/dev/null || true
mv src/app/_api_disabled src/app/api 2>/dev/null || true
mv src/app/_robots_disabled.ts src/app/robots.ts 2>/dev/null || true
mv src/app/_sitemap_disabled.ts src/app/sitemap.ts 2>/dev/null || true
rm -f public/robots.txt

echo "==> Done! Files restored."
