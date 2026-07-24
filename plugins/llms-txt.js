/**
 * At build time this plugin emits, from the docs source:
 *   1. /llms-full.txt  — the full text of every doc page (one ingestible corpus
 *      for LLMs), excluding the auto-generated graphql-reference.
 *   2. Raw markdown twins at /<route>index.md so agents can fetch clean markdown
 *      directly (e.g. https://docs.bitquery.io/docs/x/y/index.md).
 *
 * static/llms.txt remains the curated, hand-maintained entry-point index.
 *
 * Routes are resolved against the actual build output (index.html presence) so
 * slug overrides and trailing slashes are always correct.
 */
const fs = require("fs");
const path = require("path");

function walkDocs(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith("_") || e.name.startsWith(".")) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (full.endsWith(`${path.sep}graphql-reference`)) continue;
      walkDocs(full, acc);
    } else if (/\.mdx?$/.test(e.name)) acc.push(full);
  }
  return acc;
}

function parseFM(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const body = m ? raw.slice(m[0].length) : raw;
  const fm = m ? m[1] : "";
  const g = (k) => fm.match(new RegExp(`^${k}:\\s*["']?(.+?)["']?\\s*$`, "m"))?.[1];
  return {
    title: g("title") || body.match(/^#\s+(.+)$/m)?.[1] || null,
    description: g("description") || null,
    slug: g("slug") || null,
    draft: /^\s*draft:\s*true\s*$/m.test(fm),
    body,
  };
}

function candidateRoutes(rel, slug) {
  const noExt = rel.replace(/\.mdx?$/, "");
  const segs = noExt.split(path.sep);
  const isIndex = /^(index|readme)$/i.test(segs[segs.length - 1]);
  const cands = [];
  if (slug) {
    const s = slug.startsWith("/") ? slug : `/${slug}`;
    cands.push(`/docs${s}`.replace(/\/+$/, "") + "/");
    cands.push(s.replace(/\/+$/, "") + "/"); // slug used as-is
  }
  const base = isIndex ? segs.slice(0, -1) : segs;
  cands.push(`/docs/${base.join("/")}`.replace(/\/+$/, "") + "/");
  return [...new Set(cands)];
}

// Strip front matter, imports, and JSX component blocks for the text corpus.
function cleanBody(body) {
  return body
    .replace(/^import\s+.*$/gm, "")
    .replace(/<FAQ[\s\S]*?\/>/g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** @type {import('@docusaurus/types').PluginModule} */
module.exports = function llmsTxtPlugin(context) {
  return {
    name: "llms-txt",
    async postBuild({ siteConfig, outDir }) {
      const base = siteConfig.url.replace(/\/$/, "");
      const docsRoot = path.join(context.siteDir, "docs");
      if (!fs.existsSync(docsRoot)) return;

      const sections = [];
      let rawWritten = 0;

      for (const filePath of walkDocs(docsRoot)) {
        const raw = fs.readFileSync(filePath, "utf8");
        const { title, description, slug, draft, body } = parseFM(raw);
        if (draft) continue;
        const rel = path.relative(docsRoot, filePath);

        // Resolve the real route by checking which candidate was built.
        let route = null;
        for (const c of candidateRoutes(rel, slug)) {
          if (fs.existsSync(path.join(outDir, c.replace(/^\//, ""), "index.html"))) {
            route = c;
            break;
          }
        }
        if (!route) continue;

        const url = `${base}${route}`;

        // 1) full-text corpus entry
        sections.push(
          `## ${title || rel}\nURL: ${url}\n${description ? `\n${description}\n` : ""}\n${cleanBody(body)}\n`,
        );

        // 2) raw markdown twin next to the built index.html
        try {
          fs.writeFileSync(
            path.join(outDir, route.replace(/^\//, ""), "index.md"),
            raw,
            "utf8",
          );
          rawWritten++;
        } catch {
          /* ignore individual write failures */
        }
      }

      sections.sort();
      const header = [
        "# Bitquery Docs — full text",
        "",
        "> Full text of every documentation page (excludes the auto-generated GraphQL reference).",
        "> Curated entry points: /llms.txt",
        "",
      ].join("\n");
      fs.writeFileSync(
        path.join(outDir, "llms-full.txt"),
        `${header}\n${sections.join("\n---\n\n")}\n`,
        "utf8",
      );

      console.log(
        `[llms-txt] wrote llms-full.txt (${sections.length} pages) and ${rawWritten} raw .md twins`,
      );
    },
  };
};
