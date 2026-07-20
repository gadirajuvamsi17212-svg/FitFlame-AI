import fs from "fs";
import path from "path";

const SITE_URL = "https://fitflame.xyz";

// --------------------------------------------------
// STATIC PAGES
// Add/remove routes here if your main pages change.
// --------------------------------------------------

const staticPages = [
  "/",
  "/about/",
  "/blog/",
  "/tools/",
  "/contact/",
];

// --------------------------------------------------
// READ BLOG DATA
// --------------------------------------------------

const dataFile = path.resolve("src/data.ts");

if (!fs.existsSync(dataFile)) {
  console.error("ERROR: src/data.ts could not be found.");
  process.exit(1);
}

const dataContent = fs.readFileSync(dataFile, "utf8");

// --------------------------------------------------
// EXTRACT BLOG SLUGS
// Example:
// slug: "precision-training-metabolic-flexibility"
// --------------------------------------------------

const slugRegex = /slug\s*:\s*["'`]([^"'`]+)["'`]/g;

const blogSlugs = [];

let slugMatch;

while ((slugMatch = slugRegex.exec(dataContent)) !== null) {
  blogSlugs.push(slugMatch[1]);
}

const uniqueBlogSlugs = [...new Set(blogSlugs)];

// --------------------------------------------------
// EXTRACT BLOG CATEGORIES
// Example:
// category: "Nutrition"
// --------------------------------------------------

const categoryRegex = /category\s*:\s*["'`]([^"'`]+)["'`]/g;

const categories = [];

let categoryMatch;

while ((categoryMatch = categoryRegex.exec(dataContent)) !== null) {
  categories.push(categoryMatch[1]);
}

const uniqueCategories = [...new Set(categories)];

// --------------------------------------------------
// CREATE STATIC PAGE URLS
// --------------------------------------------------

const staticUrls = staticPages.map(
  (page) => `${SITE_URL}${page}`
);

// --------------------------------------------------
// CREATE CATEGORY URLS
//
// Example:
// Nutrition
// becomes:
// https://fitflame.xyz/blog/Nutrition/
// --------------------------------------------------

const categoryUrls = uniqueCategories.map(
  (category) =>
    `${SITE_URL}/blog/${encodeURIComponent(category)}/`
);

// --------------------------------------------------
// CREATE BLOG ARTICLE URLS
//
// Example:
// precision-training-metabolic-flexibility
// becomes:
// https://fitflame.xyz/precision-training-metabolic-flexibility/
// --------------------------------------------------

const blogUrls = uniqueBlogSlugs.map(
  (slug) =>
    `${SITE_URL}/${slug}/`
);

// --------------------------------------------------
// COMBINE ALL URLS AND REMOVE DUPLICATES
// --------------------------------------------------

const allUrls = [
  ...staticUrls,
  ...categoryUrls,
  ...blogUrls,
];

const uniqueUrls = [...new Set(allUrls)];

// --------------------------------------------------
// ESCAPE XML SPECIAL CHARACTERS
// --------------------------------------------------

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// --------------------------------------------------
// GENERATE SITEMAP XML
// --------------------------------------------------

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

// --------------------------------------------------
// WRITE SITEMAP TO DIST
// --------------------------------------------------

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

console.log("--------------------------------");
console.log("FitFlame Sitemap Generated");
console.log("--------------------------------");
console.log(`Static pages: ${staticUrls.length}`);
console.log(`Categories: ${uniqueCategories.length}`);
console.log(`Blog posts: ${uniqueBlogSlugs.length}`);
console.log(`Total URLs: ${uniqueUrls.length}`);
console.log("--------------------------------");
console.log("Output: dist/sitemap.xml");
