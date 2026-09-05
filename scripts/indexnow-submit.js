#!/usr/bin/env node
/**
 * Submit changed docs URLs to IndexNow (Bing, Yandex, Naver, Seznam and the
 * assistants that read Bing's index, ChatGPT search included), so a change is
 * picked up in minutes instead of waiting for a recrawl. Google ignores
 * IndexNow; the sitemap still covers Google.
 *
 * The key is the 32-hex file in static/ (served at the site root, which is how
 * IndexNow proves we own the host).
 *
 *   node scripts/indexnow-submit.js --since <commit>   URLs of docs changed since <commit> (default HEAD~1)
 *   node scripts/indexnow-submit.js --all              every URL in build/sitemap.xml (max 10,000)
 *   add --dry-run to print the list without sending
 *
 * Needs a finished `npm run build`: routes are resolved against build/ so
 * slug overrides are respected, the same way plugins/llms-txt.js does it.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SITE = "https://docs.bitquery.io";
const HOST = "docs.bitquery.io";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS = 10000;

const root = path.join(__dirname, "..");
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

function findKey() {
  const file = fs.readdirSync(path.join(root, "static")).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  if (!file) throw new Error("no IndexNow key file (32 hex chars .txt) in static/");
  return file.replace(/\.txt$/, "");
}

// Same route resolution as plugins/llms-txt.js.
function parseSlug(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  return m[1].match(/^slug:\s*["']?(.+?)["']?\s*$/m)?.[1] || null;
}
function candidateRoutes(rel, slug) {
  const noExt = rel.replace(/\.mdx?$/, "");
  const segs = noExt.split("/");
  const isIndex = /^(index|readme)$/i.test(segs[segs.length - 1]);
  const cands = [];
  if (slug) {
    const s = slug.startsWith("/") ? slug : `/${slug}`;
    cands.push(`/docs${s}`.replace(/\/+$/, "") + "/");
    cands.push(s.replace(/\/+$/, "") + "/");
  }
  const base = isIndex ? segs.slice(0, -1) : segs;
  cands.push(`/docs/${base.join("/")}`.replace(/\/+$/, "") + "/");
  return [...new Set(cands)];
}
function routeFor(docFile, exists) {
  const rel = path.relative("docs", docFile);
  const slug = exists ? parseSlug(fs.readFileSync(path.join(root, docFile), "utf8")) : null;
  const cands = candidateRoutes(rel, slug);
  const built = cands.find((c) => fs.existsSync(path.join(root, "build", c.replace(/^\//, ""), "index.html")));
  // A deleted page has no build output; submit its old URL so the index drops it.
  return built || (exists ? null : cands[cands.length - 1]);
}

function changedUrls(since) {
  const zero = /^0+$/.test(since);
  let ok = !zero;
  if (ok) {
    try {
      execSync(`git cat-file -e ${since}^{commit}`, { cwd: root, stdio: "ignore" });
    } catch {
      ok = false;
    }
  }
  const from = ok ? since : "HEAD~1";
  if (!ok) console.warn(`[indexnow] ${since || "(none)"} is not a commit here; diffing against HEAD~1`);
  const out = execSync(`git diff --name-status -M ${from} HEAD -- docs/`, { cwd: root, encoding: "utf8" });
  const urls = new Set();
  for (const line of out.split("\n").filter(Boolean)) {
    const [status, a, b] = line.split("\t");
    const files = status.startsWith("R") ? [[a, false], [b, true]] : [[a, status !== "D"]];
    for (const [f, exists] of files) {
      if (!/\.mdx?$/.test(f) || /(^|\/)_/.test(f)) continue;
      const r = routeFor(f, exists);
      if (r) urls.add(SITE + r);
    }
  }
  return [...urls];
}

function sitemapUrls() {
  const xml = fs.readFileSync(path.join(root, "build", "sitemap.xml"), "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  if (!fs.existsSync(path.join(root, "build"))) throw new Error("build/ not found; run `npm run build` first");
  const key = findKey();
  let urls = flag("--all") ? sitemapUrls() : changedUrls(opt("--since", "HEAD~1"));
  urls = urls.slice(0, MAX_URLS);
  if (!urls.length) {
    console.log("[indexnow] nothing to submit");
    return;
  }
  console.log(`[indexnow] ${urls.length} URL(s):`);
  for (const u of urls) console.log("  " + u);
  if (flag("--dry-run")) return;
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key, keyLocation: `${SITE}/${key}.txt`, urlList: urls }),
  });
  console.log(`[indexnow] ${res.status} ${res.statusText}`);
  if (![200, 202].includes(res.status)) {
    console.error(await res.text());
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
