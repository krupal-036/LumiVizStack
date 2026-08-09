/**
 * generate-sitemap.mjs
 * ---------------------------------------------------------
 * Sitemap generator for LumiVizStack (https://lumivizstack.vercel.app)
 *
 * Usage:
 *   node scripts/generate-sitemap.mjs
 *
 * Add to frontend/package.json:
 *   "scripts": { "generate:sitemap": "node ../scripts/generate-sitemap.mjs" }
 *
 * Output:
 *   frontend/public/sitemap.xml
 *   frontend/public/robots.txt
 * ---------------------------------------------------------
 *
 * ROUTE AUDIT (from Navbar.tsx baseNavLinks + pages/ folder):
 *
 *   PUBLIC / crawlable  (included in sitemap)
 *     "/"            Home
 *     "/about"       About
 *     "/guide"       Guide
 *     "/docs/api"    ApiDocs
 *     "/login"       Login      (low priority — indexed so people can
 *                                find it directly, but it's a form,
 *                                not content worth ranking on its own)
 *     "/register"    Register   (slightly higher priority — it's the
 *                                conversion entry point for new users)
 *
 *   PROTECTED  (link.protected: true in Navbar → requires a logged-in
 *   user, blocked by ProtectedRoute — excluded from sitemap AND should
 *   be noindex, since Google can't render content behind auth anyway)
 *     "/visualize"   Visualizer
 *     "/history"     History
 *     "/profile"     UserProfile
 *
 *   ADMIN-ONLY  (link.protected + role === "admin" check in Navbar —
 *   excluded from sitemap, should be noindex)
 *     "/admin"       AdminPanel
 *
 *   DYNAMIC / user-generated  (excluded — no fixed URL to list; each
 *   shareId is unique and typically not something you want indexed,
 *   since it's someone's personal saved visualization)
 *     "/view/:shareId"  PublicView
 *
 *   UTILITY (excluded)
 *     "*"            NotFound
 * ---------------------------------------------------------
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = "https://lumivizstack.vercel.app";
const OUTPUT_DIR = path.resolve(__dirname, "frontend/public");

const routes = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/about", priority: 0.6, changefreq: "monthly" },
  { path: "/guide", priority: 0.7, changefreq: "monthly" },
  { path: "/docs/api", priority: 0.6, changefreq: "monthly" },
  { path: "/login", priority: 0.5, changefreq: "yearly" },
  { path: "/register", priority: 0.5, changefreq: "yearly" },
];

function buildSitemap(entries) {
  const today = new Date().toISOString().split("T")[0];

  const urlEntries = entries
    .map(
      (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
}

function buildRobotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /visualize
Disallow: /history
Disallow: /profile
Disallow: /admin
Disallow: /view/

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

function writeFile(filename, content) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`✔ wrote ${filePath}`);
}

function run() {
  writeFile("sitemap.xml", buildSitemap(routes));
  writeFile("robots.txt", buildRobotsTxt());
  console.log(`\nDone. ${routes.length} URLs written to sitemap.xml.`);
}

run();
