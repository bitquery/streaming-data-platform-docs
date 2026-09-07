/**
 * Decides whether the build can trust git for per-page dates.
 *
 * Docusaurus reads `git log` for the sitemap <lastmod>, the "Last updated"
 * footer and our TechArticle JSON-LD dates. In a shallow clone every file's
 * only commit is HEAD, so all of those become the build day, which is worse
 * than no date at all: Search Console stops trusting lastmod once it is
 * always "today". The production Dockerfile therefore needs the full
 * history, and this guard turns the dates off whenever it is missing.
 *
 * Set DOCS_NO_GIT_DATES=1 to force the no-dates mode (used to test it).
 */
const { execSync } = require("child_process");

let cached;

function run(cmd, cwd) {
  return execSync(cmd, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}

function hasGitHistory(siteDir) {
  if (cached !== undefined) return cached;
  let reason = "";
  if (process.env.DOCS_NO_GIT_DATES === "1") {
    reason = "DOCS_NO_GIT_DATES=1";
  } else {
    try {
      if (run("git rev-parse --is-shallow-repository", siteDir) === "true") {
        reason = "shallow clone";
      } else if (Number(run("git rev-list --count HEAD", siteDir)) < 2) {
        reason = "single-commit history";
      }
    } catch {
      reason = "git unavailable";
    }
  }
  cached = reason === "";
  console.log(
    cached
      ? "[git-history] full git history found: sitemap lastmod, TechArticle dates and the last-updated footer are on"
      : `[git-history] ${reason}: sitemap lastmod, TechArticle dates and the last-updated footer are off (run the build from a full clone to enable them)`,
  );
  return cached;
}

module.exports = { hasGitHistory };
