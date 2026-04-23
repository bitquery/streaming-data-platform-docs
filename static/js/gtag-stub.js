/**
 * Prevents `TypeError: window.gtag is not a function` when the Docusaurus
 * google-gtag client module loads but the real gtag.js script is missing,
 * blocked, or failed to load (common in dev + ad blockers).
 *
 * When gtag.js loads successfully it replaces `window.gtag` with Google's
 * implementation, so production analytics are unaffected.
 */
window.dataLayer = window.dataLayer || [];
if (typeof window.gtag !== "function") {
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
}
