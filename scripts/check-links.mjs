#!/usr/bin/env node
/**
 * Internal link checker for the Bitquery docs (WP-0.13).
 *
 * Design principle (learned the hard way): validate links against the routes
 * Docusaurus ACTUALLY emits, never against raw source file paths. Source-path
 * resolution produces false positives because of `slug:` front matter,
 * generated-index category pages, and extensionless relative links that resolve
 * in URL space (against the page's route + trailing slash), not on disk.
 *
 * Route source of truth:
 *   1. If `build/` exists, the route set is every directory under build/ that
 *      contains an index.html (plus any *.html). This is authoritative — it
 *      includes /docs/category/* pages, slug overrides, everything. CI runs
 *      `yarn build` first, so CI always gets this strict mode.
 *   2. If `build/` is absent, fall back to slug-aware source resolution and
 *      DOWNGRADE unresolved-route errors to warnings (so a local run without a
 *      build never fails spuriously). Dead URL schemes are always errors.
 *
 * Usage:
 *   node scripts/check-links.mjs            # check; exit 1 on errors
 *   node scripts/check-links.mjs --report   # also print orphans / thin pages / etc.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const BUILD = path.join(ROOT, "build");
const REPORT = process.argv.includes("--report");

const norm = (r) => {
  let s = r.split("#")[0].split("?")[0].toLowerCase();
  if (s.length > 1) s = s.replace(/\/+$/, "");
  return s;
};

// ---- collect markdown files ------------------------------------------------
function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith("_") || e.name.startsWith(".")) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (full === path.join(DOCS, "graphql-reference")) continue; // auto-generated
      walk(full, acc);
    } else if (/\.mdx?$/.test(e.name)) acc.push(full);
  }
  return acc;
}
const files = walk(DOCS);

function parseFrontMatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm = {};
  if (m) {
    for (const line of m[1].split(/\r?\n/)) {
      const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
      if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, "").trim();
    }
  }
  return { fm, body: m ? src.slice(m[0].length) : src };
}

// slug-aware source route (fallback mode + inbound/outbound reporting)
function sourceRoute(rel, fm) {
  const segs = rel.replace(/\.mdx?$/, "").split("/");
  const isIndex = /^(index|readme)$/i.test(segs[segs.length - 1]);
  if (fm.slug) {
    const s = fm.slug.trim();
    if (s.startsWith("/")) return norm("/docs" + s);
    segs.pop();
    return norm("/docs/" + segs.concat(s.replace(/^\.\//, "")).join("/"));
  }
  if (fm.id) {
    segs.pop();
    return norm("/docs/" + segs.concat(fm.id).join("/"));
  }
  if (isIndex) segs.pop();
  return norm("/docs/" + segs.join("/"));
}

const pages = files.map((f) => {
  const rel = path.relative(DOCS, f).split(path.sep).join("/");
  const src = fs.readFileSync(f, "utf8");
  const { fm, body } = parseFrontMatter(src);
  return { f, rel, fm, body, route: sourceRoute(rel, fm), draft: /^true$/i.test(fm.draft || "") };
});

// ---- build the authoritative route set -------------------------------------
let routeSet = new Set();
let strict = false;
if (fs.existsSync(BUILD)) {
  strict = true;
  (function walkBuild(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walkBuild(full);
      else if (e.name === "index.html") {
        routeSet.add(norm("/" + path.relative(BUILD, dir).split(path.sep).join("/")));
      } else if (e.name.endsWith(".html")) {
        routeSet.add(norm("/" + path.relative(BUILD, full).split(path.sep).join("/").replace(/\.html$/, "")));
      }
    }
  })(BUILD);
} else {
  for (const p of pages) if (!p.draft) routeSet.add(p.route);
  // best-effort generated-index category routes from sidebars.js
  try {
    const sb = fs.readFileSync(path.join(ROOT, "sidebars.js"), "utf8");
    for (const m of sb.matchAll(/label:\s*["']([^"']+)["']/g)) {
      routeSet.add(norm("/docs/category/" + m[1].toLowerCase().replace(/[^a-z0-9]+/g, "-")));
    }
  } catch {}
}

// ---- strip code, extract links ---------------------------------------------
function stripCode(body) {
  return body.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
}
const LINK_RE = /\]\(\s*(<[^>]+>|[^)\s]+)/g;

const errors = [];
const warns = [];
const inbound = new Map(); // route -> count
const outbound = new Map(); // rel -> count
const badScheme = /^(ttps|hhttps|htps|htp|ttp|hhtp):\/\//i;

for (const p of pages) {
  const clean = stripCode(p.body);
  let outCount = 0;
  for (const m of clean.matchAll(LINK_RE)) {
    let target = m[1].replace(/^<|>$/g, "").trim();
    if (!target) continue;
    const bare = target.split("#")[0].split("?")[0];

    if (badScheme.test(target)) { errors.push(`${p.rel}: dead URL scheme → ${target}`); continue; }
    if (/^http:\/\/ide\.bitquery\.io/i.test(target)) { warns.push(`${p.rel}: insecure http:// IDE link → ${target}`); continue; }
    if (/^https?:\/\/docs\.bitquery\.io\/docs/i.test(target)) {
      warns.push(`${p.rel}: absolute self-link (use root-relative) → ${target}`);
      continue;
    }
    if (/^[a-z]+:/i.test(target)) continue; // external / mailto / tel
    if (!bare) continue; // pure anchor

    if (target.startsWith("/")) {
      if (!/^\/docs(\/|$)/i.test(bare)) continue; // static asset (/img, /fonts, /llms.txt…)
      const r = norm(bare);
      if (routeSet.has(r)) { outCount++; inbound.set(r, (inbound.get(r) || 0) + 1); }
      else if (strict) errors.push(`${p.rel}: broken /docs link → ${target}`);
      else warns.push(`${p.rel}: unresolved /docs link (no build/, lenient) → ${target}`);
      continue;
    }

    // relative
    if (/\.mdx?$/.test(bare)) {
      const abs = path.resolve(path.dirname(p.f), bare);
      if (fs.existsSync(abs)) outCount++;
      else errors.push(`${p.rel}: broken relative file link → ${target}`);
      continue;
    }
    if (/\.[a-z0-9]{2,5}$/i.test(bare)) continue; // relative asset (image etc.) — skipped
    // extensionless relative → resolve in URL space against the page's route
    const resolved = norm(new URL(bare, "https://x" + p.route + "/").pathname);
    if (routeSet.has(resolved)) { outCount++; inbound.set(resolved, (inbound.get(resolved) || 0) + 1); }
    else if (strict) errors.push(`${p.rel}: broken relative link → ${target} (resolves to ${resolved})`);
    else warns.push(`${p.rel}: unresolved relative link (no build/, lenient) → ${target}`);
  }
  outbound.set(p.rel, outCount);
}

// ---- output ----------------------------------------------------------------
console.log(`check-links: ${pages.length} pages · route set ${routeSet.size} (${strict ? "strict: build/" : "lenient: source-only, run `yarn build` for strict"})`);
if (warns.length) { console.log(`\n⚠️  ${warns.length} warning(s):`); warns.slice(0, 100).forEach((w) => console.log("  " + w)); }
if (errors.length) { console.log(`\n❌ ${errors.length} error(s):`); errors.forEach((e) => console.log("  " + e)); }
else console.log("\n✓ no link errors");

if (REPORT) {
  const zeroIn = pages.filter((p) => !p.draft && !inbound.get(p.route));
  const zeroOut = pages.filter((p) => !outbound.get(p.rel));
  const thin = pages
    .map((p) => ({ rel: p.rel, w: (stripCode(p.body).replace(/[#>*`\[\]()|_-]/g, " ").match(/\S+/g) || []).length }))
    .filter((p) => p.w < 120)
    .sort((a, b) => a.w - b.w);
  const noLangFences = pages.filter((p) => [...p.body.matchAll(/```([^\n]*)\n/g)].some((m) => !m[1].trim())).length;
  const noAltImgs = pages.reduce((n, p) => n + [...stripCode(p.body).matchAll(/!\[(\s*)\]\(/g)].length, 0);
  console.log(`\n--- report ---`);
  console.log(`zero inbound: ${zeroIn.length} · zero outbound: ${zeroOut.length} · thin(<120w): ${thin.length} · pages w/ unlabeled fences: ${noLangFences} · images w/o alt: ${noAltImgs}`);
  console.log(`thin (worst 15): ${thin.slice(0, 15).map((t) => `${t.rel}(${t.w})`).join(", ")}`);
}

process.exit(errors.length ? 1 : 0);
