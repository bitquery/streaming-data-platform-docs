/**
 * Injects TechArticle JSON-LD into each built doc page HTML at postBuild.
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
  const slug = fm.match(/^slug:\s*(.+)\s*$/m)?.[1];
  const draft = /^\s*draft:\s*true\s*$/m.test(fm);
  return { title, slug, draft };
}

function docPermalink(siteDir, filePath) {
  const rel = path.relative(path.join(siteDir, "docs"), filePath);
  const parsed = parseFrontmatter(filePath);
  if (parsed.draft) {
    return null;
  }
  if (parsed.slug) {
    const slug = parsed.slug.startsWith("/") ? parsed.slug : `/${parsed.slug}`;
    return slug.endsWith("/") ? slug : `${slug}/`;
  }
  const withoutExt = rel.replace(/\.(md|mdx)$/, "");
  return `/docs/${withoutExt}/`;
}

function gitLastUpdated(siteDir, filePath) {
  try {
    const iso = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      cwd: siteDir,
      encoding: "utf8",
    }).trim();
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

        const { title } = parseFrontmatter(filePath);
        const dateModified = gitLastUpdated(context.siteDir, filePath);

        const jsonLd = {
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: title,
          ...(dateModified ? { dateModified } : {}),
          author: { "@type": "Organization", name: "Bitquery" },
          publisher: { "@type": "Organization", name: "Bitquery" },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${base}${permalink}`,
          },
        };

        const tag = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
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
