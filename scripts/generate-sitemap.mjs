import fs from "fs";
import path from "path";

const SITE_URL = "https://fitflame.xyz";

// Static pages
const staticPages = [
  "/",
  "/about/",
  "/blog/",
  "/tools/",
  "/contact/",
];

// Read src/data.ts
const dataFile = path.resolve("src/data.ts");

if (!fs.existsSync(dataFile)) {
  console.error("ERROR: src/data.ts could not be found.");
  process.exit(1);
}

const dataContent = fs.readFileSync(dataFile, "utf8");

// Extract all blog slugs
const slugRegex = /slug\s*:\s*["'`]([^"'`]+)["'`]/g;

const blogSlugs = [];
let slugMatch;

while ((slugMatch = slugRegex.exec(dataContent)) !== null) {
  blogSlugs.push(slugMatch[1]);
}

const uniqueBlogSlugs = [...new Set(blogSlugs)];

// Extract all categories
const categoryRegex = /category\s*:\s*["'`]([^"'`]+)["'`]/g;

const categories = [];
let categoryMatch;

while ((categoryMatch = categoryRegex.exec(dataContent)) !== null) {
  categories.push(categoryMatch[1]);
}

const uniqueCategories = [...new Set(categories)];

// Generate static URLs
const staticUrls = staticPages.map(
  (page) => `${SITE_URL}${page}`
);

// Generate category URLs
// Example: /blog/Nutrition/
const categoryUrls = uniqueCategories.map(
  (category) =>
    `${SITE_URL}/blog/${encodeURIComponent(category)}/`
);

// Generate individual blog URLs
// Example: /longevity-protocol-habits-results/
const blogUrls = uniqueBlogSlugs.map(
  (slug) =>
    `${SITE_URL}/${slug}/`
);

// Combine and remove duplicates
const allUrls = [
  ...staticUrls,
  ...categoryUrls,
  ...blogUrls,
];

const uniqueUrls = [...new Set(allUrls)];

// Escape special XML characters
function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Generate sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url)}</loc>
  </url>`
  )
  .join("\n")}
</urlset>
`;

// Write sitemap to dist
const outputDir = path.resolve("dist");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, {
    recursive: true,
  });
}

const outputFile = path.join(
  outputDir,
  "sitemap.xml"
);

fs.writeFileSync(
  outputFile,
  sitemap,
  "utf8"
);

console.log("FitFlame sitemap generated successfully.");
console.log(`Static pages: ${staticUrls.length}`);
console.log(`Categories: ${uniqueCategories.length}`);
console.log(`Blog posts: ${uniqueBlogSlugs.length}`);
console.log(`Total URLs: ${uniqueUrls.length}`);
console.log("Output: dist/sitemap.xml");