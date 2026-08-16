import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = "https://lumivizstack.vercel.app";
const OUTPUT_DIR = path.resolve(__dirname, "../frontend/public");

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
