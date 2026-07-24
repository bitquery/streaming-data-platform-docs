/**
 * Injects TechArticle + BreadcrumbList JSON-LD into each built doc page at postBuild.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function walkDocs(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith("_") || entry.name.startsWith(".")) {
      continue;
    }
    if (entry.isDirectory()) {
      walkDocs(full, acc);
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

function parseFrontmatter(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const body = match ? raw.slice(match[0].length) : raw;
  if (!match) {
    const h1 = body.match(/^#\s+(.+)$/m)?.[1];
    return { title: h1 || path.basename(filePath, path.extname(filePath)) };
  }
  const fm = match[1];
  let title = fm.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1];
  if (!title) {
    title = body.match(/^#\s+(.+)$/m)?.[1];
  }
  const description = fm.match(/^description:\s*["']?(.+?)["']?\s*$/m)?.[1];
  const slug = fm.match(/^slug:\s*(.+)\s*$/m)?.[1];
  const draft = /^\s*draft:\s*true\s*$/m.test(fm);
  return { title, description, slug, draft };
}

function docPermalink(siteDir, filePath) {
  const rel = path.relative(path.join(siteDir, "docs"), filePath);
  const parsed = parseFrontmatter(filePath);
  if (parsed.draft) {
    return null;
  }
  if (parsed.slug) {
    // Doc slugs are relative to the /docs route base. A leading-slash slug like
    // "/migration/" maps to "/docs/migration/", not "/migration/".
    const s = parsed.slug.startsWith("/") ? parsed.slug : `/${parsed.slug}`;
    const full = `/docs${s}`.replace(/\/+$/, "") + "/";
    return full;
  }
  const withoutExt = rel.replace(/\.(md|mdx)$/, "").replace(/\/(index|README)$/i, "");
  return `/docs/${withoutExt}/`;
}

function gitDate(siteDir, filePath, first) {
  try {
    const flag = first ? "--diff-filter=A --follow" : "";
    const iso = execSync(
      `git log -1 ${flag} --format=%cI -- "${filePath}"`,
      { cwd: siteDir, encoding: "utf8" },
    ).trim();
    return iso ? iso.split("T")[0] : undefined;
  } catch {
    return undefined;
  }
}

/** @type {import('@docusaurus/types').PluginModule} */
module.exports = function techArticleJsonLdPlugin(context) {
  return {
    name: "tech-article-jsonld",
    async postBuild({ siteConfig, outDir }) {
      const docsRoot = path.join(context.siteDir, "docs");
      if (!fs.existsSync(docsRoot)) {
        return;
      }

      const base = siteConfig.url.replace(/\/$/, "");

      for (const filePath of walkDocs(docsRoot)) {
        const permalink = docPermalink(context.siteDir, filePath);
        if (!permalink) {
          continue;
        }

        const htmlPath = path.join(
          outDir,
          permalink.replace(/^\//, ""),
          "index.html",
        );
        if (!fs.existsSync(htmlPath)) {
          continue;
        }

        const { title, description } = parseFrontmatter(filePath);
        const dateModified = gitDate(context.siteDir, filePath, false);
        const datePublished = gitDate(context.siteDir, filePath, true);

        const techArticle = {
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: title,
          ...(description ? { description } : {}),
          ...(datePublished ? { datePublished } : {}),
          ...(dateModified ? { dateModified } : {}),
          author: { "@type": "Organization", name: "Bitquery" },
          publisher: { "@type": "Organization", name: "Bitquery" },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${base}${permalink}`,
          },
        };

        // BreadcrumbList is emitted natively by the Docusaurus theme's breadcrumbs,
        // so we inject only TechArticle here to avoid duplicate structured data.
        const tag = `<script type="application/ld+json">${JSON.stringify(techArticle)}</script>`;

        let html = fs.readFileSync(htmlPath, "utf8");
        if (html.includes('"@type":"TechArticle"')) {
          continue;
        }
        html = html.replace("</head>", `  ${tag}\n</head>`);
        fs.writeFileSync(htmlPath, html, "utf8");
      }
    },
  };
};
