/**
 * Trims the " | <siteTitle>" suffix from <title> on built pages whose rendered
 * title exceeds MAX_TITLE — a postBuild HTML pass.
 *
 * Why this exists
 * ---------------
 * Docusaurus composes every doc page's HTML title as `${frontMatter.title} | ${siteConfig.title}`,
 * with no per-page way to opt out. With siteConfig.title = "Bitquery Docs" that
 * suffix costs 16 characters, so a frontmatter title must be <= 44 chars to keep
 * the rendered title under the ~60-char guideline. Our page titles are
 * deliberately keyword-loaded and routinely run 45-70 chars, so the constraint
 * would mean deleting keywords purely to make room for branding.
 *
 * Google truncates titles by pixel width and cuts the *tail* — i.e. the branding,
 * not the keywords — so the practical SEO cost of a long title is small. This pass
 * removes the cosmetic warning without touching a single keyword, and without
 * changing site-wide branding.
 *
 * Scope, deliberately narrow:
 *   - <title> only. og:title and twitter:title keep the full branded form, which
 *     is what social cards should show.
 *   - Only when the rendered title is over MAX_TITLE. Short titles keep the suffix.
 *   - Only the exact " | <siteTitle>" suffix, anchored at the end.
 */

const fs = require("fs");
const path = require("path");

const MAX_TITLE = 60;

function walkHtml(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtml(full, acc);
    } else if (entry.name.endsWith(".html")) {
      acc.push(full);
    }
  }
  return acc;
}

function decode(s) {
  // <title> content is HTML-escaped; measure the length a SERP would see.
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'");
}

module.exports = function titleSuffixTrimPlugin() {
  return {
    name: "title-suffix-trim",
    async postBuild({ siteConfig, outDir }) {
      const suffix = ` ${siteConfig.titleDelimiter || "|"} ${siteConfig.title}`;
      let trimmed = 0;
      let scanned = 0;

      for (const file of walkHtml(outDir)) {
        const html = fs.readFileSync(file, "utf8");
        const match = html.match(/<title([^>]*)>([^<]*)<\/title>/);
        if (!match) continue;
        scanned += 1;

        const [full, attrs, raw] = match;
        if (!raw.endsWith(suffix)) continue;
        if (decode(raw).length <= MAX_TITLE) continue;

        const shortened = raw.slice(0, -suffix.length);
        // Never leave an empty title — the suffix is all there is on some pages.
        if (!shortened.trim()) continue;

        fs.writeFileSync(
          file,
          html.replace(full, `<title${attrs}>${shortened}</title>`),
          "utf8"
        );
        trimmed += 1;
      }

      console.log(
        `[title-suffix-trim] trimmed "${suffix}" from ${trimmed} of ${scanned} titles over ${MAX_TITLE} chars`
      );
    },
  };
};
