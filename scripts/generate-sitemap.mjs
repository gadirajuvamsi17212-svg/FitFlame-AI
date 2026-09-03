import fs from "fs";
import path from "path";

const SITE_URL = "https://fitflame.xyz";

/*
 * Pages currently intended to be indexed.
 */
const staticPages = [
  "/",
  "/about/",
  "/blog/",
  "/tools/",
  "/contact/",
];

/*
 * Categories currently live on the website.
 *
 * The URL slug is defined explicitly so that
 * "Mental Health" becomes "Mental-Health"
 * instead of "Mental%20Health".
 */
const categories = [
  {
    name: "Nutrition",
    slug: "Nutrition",
  },
  {
    name: "Exercise",
    slug: "Exercise",
  },
  {
    name: "Mental Health",
    slug: "Mental-Health",
  },
  {
    name: "Preventive",
    slug: "Preventive",
  },
];

/*
 * Articles currently live and should be included
 * in the sitemap.
 *
 * Do NOT automatically extract every slug from data.ts.
 * Only published/current articles belong here.
 */
const publishedSlugs = [
  "top-10-healthy-vegetables-for-weight-loss-diabetes-gut-health",
  "top-10-iron-rich-vegetarian-foods-to-fight-anemia",
  "9-powerful-health-benefits-of-oats",
  "top-magnesium-rich-foods-daily",
  "top-vitamin-e-foods-daily",
  "top-10-anti-inflammatory-foods",
];

/*
 * Build URLs.
 */
const staticUrls = staticPages.map(
  (page) => `${SITE_URL}${page}`
);

const categoryUrls = categories.map(
  (category) => `${SITE_URL}/blog/${category.slug}/`
);

const blogUrls = publishedSlugs.map(
  (slug) => `${SITE_URL}/${slug}/`
);

/*
 * Combine and remove duplicates.
 */
const allUrls = [
  ...staticUrls,
  ...categoryUrls,
  ...blogUrls,
];

const uniqueUrls = [...new Set(allUrls)];

/*
 * Escape XML characters safely.
 */
function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/*
 * Generate sitemap XML.
 */
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

/*
 * Write sitemap to Vite's production output directory.
 */
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
console.log(`Categories: ${categoryUrls.length}`);
console.log(`Blog posts: ${blogUrls.length}`);
console.log(`Total URLs: ${uniqueUrls.length}`);
console.log("Output: dist/sitemap.xml");