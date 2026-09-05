/**
 * At build time this plugin emits, from the docs source:
 *   1. /llms-full.txt  — the full text of every doc page (one ingestible corpus
 *      for LLMs).
 *   2. /llms-full-<part>.txt — the same pages split by topic into files of
 *      under PART_CAP bytes each. The single file is over 5 MB and most AI
 *      fetchers stop reading somewhere around 2 MB, so agents that follow
 *      llms.txt get the parts instead.
 *   3. Raw markdown twins at /<route>index.md so agents can fetch clean markdown
 *      directly (e.g. https://docs.bitquery.io/docs/x/y/index.md).
 *
 * static/llms.txt remains the curated, hand-maintained entry-point index; only
 * its "## Full index" section is regenerated here so the parts list is never
 * stale.
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

// Fetch limits of AI tools are around 2 MB; stay well under with headroom for growth.
const PART_CAP = 1_500_000;

// Topic groups, first match wins. Keep the big chains separate so each part
// stays readable in one request; everything else falls into the last group.
const GROUPS = [
  ["solana", "Solana", (r) => r.startsWith("/docs/blockchain/Solana/")],
  ["ethereum", "Ethereum", (r) => r.startsWith("/docs/blockchain/Ethereum/")],
  ["robinhood", "Robinhood Chain", (r) => r.startsWith("/docs/blockchain/robinhood/")],
  [
    "evm-chains",
    "BSC, Base, Arbitrum, Optimism, Polygon and other EVM chains",
    (r) => /^\/docs\/blockchain\/(BSC|Base|Arbitrum|Optimism|Matic|opBNB|Hyperliquid)\//i.test(r),
  ],
  [
    "other-chains",
    "Tron, Bitcoin, Cardano, Algorand and the remaining chain pages",
    (r) => r.startsWith("/docs/blockchain/"),
  ],
  [
    "guides",
    "Use cases, trading APIs, examples, perpetuals, stablecoins and the API blog",
    (r) => /^\/docs\/(usecases|trading|examples|API-Blog|perpetuals|stablecoin-APIs)\//.test(r),
  ],
  [
    "platform",
    "Getting started, authorization, GraphQL, cubes, streams, gRPC, Kafka, cloud, MCP and everything else",
    () => true,
  ],
];

function groupOf(route) {
  return GROUPS.find(([, , match]) => match(route))[0];
}

// Pack a group's pages into one or more files under PART_CAP bytes.
function packParts(name, label, entries) {
  const parts = [];
  let current = [];
  let bytes = 0;
  for (const e of entries) {
    const size = Buffer.byteLength(e.text, "utf8");
    if (current.length && bytes + size > PART_CAP) {
      parts.push(current);
      current = [];
      bytes = 0;
    }
    current.push(e);
    bytes += size;
  }
  if (current.length) parts.push(current);
  return parts.map((pages, i) => ({
    file: parts.length === 1 ? `llms-full-${name}.txt` : `llms-full-${name}-${i + 1}.txt`,
    label: parts.length === 1 ? label : `${label} (part ${i + 1} of ${parts.length})`,
    pages,
  }));
}

function mb(bytes) {
  return `${(bytes / 1e6).toFixed(1)} MB`;
}

/** @type {import('@docusaurus/types').PluginModule} */
module.exports = function llmsTxtPlugin(context) {
  return {
    name: "llms-txt",
    async postBuild({ siteConfig, outDir }) {
      const base = siteConfig.url.replace(/\/$/, "");
      const docsRoot = path.join(context.siteDir, "docs");
      if (!fs.existsSync(docsRoot)) return;

      const entries = [];
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
        entries.push({
          route,
          text: `## ${title || rel}\nURL: ${url}\n${description ? `\n${description}\n` : ""}\n${cleanBody(body)}\n`,
        });

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

      entries.sort((a, b) => (a.text < b.text ? -1 : a.text > b.text ? 1 : 0));
      const joined = (list) => list.map((e) => e.text).join("\n---\n\n");

      // 3) the single full file, unchanged format
      const fullHeader = [
        "# Bitquery Docs — full text",
        "",
        "> Full text of every documentation page (excludes the auto-generated GraphQL reference).",
        "> Curated entry points: /llms.txt",
        "> This file is over 5 MB; the same pages split by topic into files under 1.5 MB are listed in /llms.txt.",
        "",
      ].join("\n");
      const fullText = `${fullHeader}\n${joined(entries)}\n`;
      fs.writeFileSync(path.join(outDir, "llms-full.txt"), fullText, "utf8");

      // 4) topic parts
      const written = [];
      for (const [name, label] of GROUPS) {
        const mine = entries.filter((e) => groupOf(e.route) === name);
        if (!mine.length) continue;
        for (const part of packParts(name, label, mine)) {
          const header = [
            `# Bitquery Docs — full text: ${part.label}`,
            "",
            `> ${part.pages.length} pages. All parts and the curated entry points: ${base}/llms.txt`,
            "",
          ].join("\n");
          const text = `${header}\n${joined(part.pages)}\n`;
          fs.writeFileSync(path.join(outDir, part.file), text, "utf8");
          const bytes = Buffer.byteLength(text, "utf8");
          if (bytes > PART_CAP * 1.1) {
            console.warn(`[llms-txt] ${part.file} is ${mb(bytes)}, above the cap; rebalance GROUPS`);
          }
          written.push({ ...part, bytes });
        }
      }

      // 5) regenerate the "## Full index" section of llms.txt (the rest is hand-written)
      const llmsPath = path.join(outDir, "llms.txt");
      if (fs.existsSync(llmsPath)) {
        const cur = fs.readFileSync(llmsPath, "utf8");
        const marker = "\n## Full index\n";
        const at = cur.indexOf(marker);
        const lines = [
          "## Full index",
          "",
          `The whole corpus is one file of ${mb(Buffer.byteLength(fullText, "utf8"))}, more than most AI fetchers read in one request.`,
          `The same ${entries.length} pages are also published in parts of under ${mb(PART_CAP)} each, grouped by topic:`,
          "",
          ...written.map(
            (p) => `- [${p.label} (${p.pages.length} pages, ${mb(p.bytes)})](${base}/${p.file})`,
          ),
          `- [Everything in one file (${entries.length} pages, ${mb(Buffer.byteLength(fullText, "utf8"))})](${base}/llms-full.txt)`,
          "",
          `Every page also has a raw markdown twin at its URL plus \`index.md\`, for example ${base}/docs/start/first-query/index.md.`,
          "",
        ];
        const next = (at >= 0 ? cur.slice(0, at + 1) : cur.replace(/\s*$/, "\n\n")) + lines.join("\n");
        fs.writeFileSync(llmsPath, next, "utf8");
      } else {
        console.warn("[llms-txt] llms.txt not found in the build output; parts list not written");
      }

      console.log(
        `[llms-txt] wrote llms-full.txt (${entries.length} pages), ${written.length} topic parts and ${rawWritten} raw .md twins`,
      );
    },
  };
};
