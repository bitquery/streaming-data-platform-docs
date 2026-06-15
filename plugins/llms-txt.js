/**
 * Generates /llms-full.txt at build time from all /docs/* routes.
 * static/llms.txt is the curated hand-maintained index.
 */
const fs = require("fs");
const path = require("path");

/** @type {import('@docusaurus/types').PluginModule} */
module.exports = function llmsTxtPlugin() {
  return {
    name: "llms-txt",
    async postBuild({ siteConfig, routesPaths, outDir }) {
      const base = siteConfig.url.replace(/\/$/, "");
      const docRoutes = routesPaths
        .filter((r) => r.startsWith("/docs/") && !r.includes("*"))
        .sort();

      const lines = [
        "# Bitquery Docs — full index",
        "",
        "> Auto-generated at build time. Curated entry points: /llms.txt",
        "",
        "## All documentation pages",
        "",
        ...docRoutes.map((r) => {
          const url = `${base}${r.endsWith("/") ? r : `${r}/`}`;
          return `- ${url}`;
        }),
      ];

      fs.writeFileSync(
        path.join(outDir, "llms-full.txt"),
        `${lines.join("\n")}\n`,
        "utf8",
      );
    },
  };
};
