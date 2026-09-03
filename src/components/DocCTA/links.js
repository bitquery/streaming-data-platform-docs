/**
 * Single source of truth for the doc-page CTAs (desktop rail card + mobile end block).
 * Edit labels/targets here; the components only render this list.
 * `data-cta` ids (and `data-cta-placement` on the containers) are stable hooks for GTM click tracking.
 * `shortLabel` is used in the compact rail card, `tinyLabel` when the rail is very narrow.
 * `external: true` opens in a new tab; site routes ("/docs/...") use client-side navigation (see CtaLink.js).
 */
export const CTA = {
  apiKey: {
    id: "api-key",
    label: "Get your API key",
    href: "https://account.bitquery.io/user/api_v2/access_tokens",
    external: true,
  },
  pricing: {
    id: "pricing",
    label: "See pricing",
    shortLabel: "Pricing",
    href: "https://bitquery.io/pricing",
    external: true,
  },
  telegram: {
    id: "talk-telegram",
    label: "Telegram",
    href: "https://t.me/Bloxy_info",
    external: true,
  },
  email: {
    id: "talk-email",
    label: "Email",
    href: "mailto:support@bitquery.io",
    external: false,
  },
  newsletter: {
    id: "newsletter",
    label: "Subscribe to newsletter",
    shortLabel: "Newsletter",
    href: "https://bitquery.substack.com/",
    external: true,
  },
  mcp: {
    id: "mcp",
    label: "Try the MCP server",
    shortLabel: "MCP server",
    tinyLabel: "MCP",
    href: "/docs/mcp/mcp-server/",
    external: false,
  },
};

export const TALK_LABEL = "Talk to the team";
