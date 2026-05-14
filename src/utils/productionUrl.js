/** Canonical production URLs (not staging / localhost). */

export const PRODUCTION_DOCS_SITE = "https://docs.bitquery.io";
export const PRODUCTION_MARKETING_SITE = "https://bitquery.io";

/**
 * @param {string} path Absolute path on docs.bitquery.io (e.g. `/docs/intro/` or `/img/x.mp4`)
 */
export function prodDocsPath(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${PRODUCTION_DOCS_SITE}${p}`;
}
