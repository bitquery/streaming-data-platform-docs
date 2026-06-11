import React from "react";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "#fff",
  strokeWidth: "1.7",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: 20,
  height: 20,
  "aria-hidden": true,
};

export function CardIcon({ name }) {
  switch (name) {
    case "chart":
      return (
        <svg {...iconProps}>
          <path d="M3 16l4.5-4.5 3 3L18 7" />
          <path d="M14 7h4v4" />
          <path d="M3 20h18" />
        </svg>
      );
    case "swap":
      return (
        <svg {...iconProps}>
          <path d="M7 7h11l-3-3M17 17H6l3 3" />
        </svg>
      );
    case "transfer":
      return (
        <svg {...iconProps}>
          <path d="M4 12h12M12 6l6 6-6 6" />
          <circle cx="20" cy="12" r="1.6" />
        </svg>
      );
    case "code":
      return (
        <svg {...iconProps}>
          <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...iconProps}>
          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
        </svg>
      );
    case "nft":
      return (
        <svg {...iconProps}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9.5" r="1.6" />
          <path d="M21 16l-5-5L5 20" />
        </svg>
      );
    case "holders":
      return (
        <svg {...iconProps}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20a6 6 0 0 1 12 0" />
          <circle cx="17" cy="9" r="2.3" />
          <path d="M16 14.5a5 5 0 0 1 5 5" />
        </svg>
      );
    case "mempool":
      return (
        <svg {...iconProps}>
          <path d="M12 3v6M12 3 9 6M12 3l3 3" />
          <rect x="4" y="9" width="16" height="11" rx="2" />
          <path d="M8 13h8" />
        </svg>
      );
    case "search":
      return (
        <svg {...iconProps}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case "grid":
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
  }
}

export function RecipeIcon({ name }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    width: 17,
    height: 17,
    "aria-hidden": true,
  };
  switch (name) {
    case "send":
      return (
        <svg {...props}>
          <path d="m22 4-11 11M22 4l-7 18-4-7-7-4z" />
        </svg>
      );
    case "bell":
      return (
        <svg {...props}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
      );
    case "wallet":
      return (
        <svg {...props}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
      );
    case "chart":
      return (
        <svg {...props}>
          <path d="M3 3v18h18" />
          <path d="M7 14l4-4 3 3 5-6" />
        </svg>
      );
    case "nft":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9.5" r="1.6" />
          <path d="M21 16l-5-5L5 20" />
        </svg>
      );
    case "copy":
      return (
        <svg {...props}>
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      );
    case "tv":
      return (
        <svg {...props}>
          <path d="M6 4v16M6 8h3v8H6zM14 2v20M14 6h3v11h-3z" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="M5 12h14" />
        </svg>
      );
  }
}

export function ChainIcon({ id }) {
  switch (id) {
    case "eth":
      return (
        <svg viewBox="0 0 24 24" width={23} height={23} aria-hidden>
          <path fill="#627EEA" d="M12 2 5.6 12.3 12 16.1l6.4-3.8z" />
          <path fill="#8AA0F0" d="M12 2 5.6 12.3 12 9.4z" />
          <path fill="#627EEA" d="M12 17.3 5.6 13.5 12 22l6.4-8.5z" />
          <path fill="#8AA0F0" d="M12 17.3 5.6 13.5 12 14.9z" />
        </svg>
      );
    case "sol":
      return (
        <svg viewBox="0 0 24 24" width={23} height={23} aria-hidden>
          <defs>
            <linearGradient id="solg" x1="3" y1="18" x2="20" y2="6" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9945FF" />
              <stop offset="1" stopColor="#14F195" />
            </linearGradient>
          </defs>
          <g fill="url(#solg)">
            <path d="M6.4 6.3h12.8l-2.6 2.5H3.8z" />
            <path d="M3.8 10.75h12.8l2.6 2.5H6.4z" />
            <path d="M6.4 15.2h12.8l-2.6 2.5H3.8z" />
          </g>
        </svg>
      );
    case "bsc":
      return (
        <svg viewBox="0 0 24 24" width={23} height={23} fill="#F3BA2F" aria-hidden>
          <path d="M12 4.5 14.6 7 12 9.6 9.4 7zM7 9.5 9.6 12 7 14.6 4.4 12zM17 9.5 19.6 12 17 14.6 14.4 12zM12 14.4 14.6 17 12 19.6 9.4 17zM12 9.9 14.1 12 12 14.1 9.9 12z" />
        </svg>
      );
    case "base":
      return (
        <svg viewBox="0 0 24 24" width={23} height={23} aria-hidden>
          <circle cx="12" cy="12" r="10" fill="#0052FF" />
          <path
            d="M12 6.4a5.6 5.6 0 1 0 0 11.2 5.6 5.6 0 0 0 0-11.2zm-2 5.6a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"
            fill="#fff"
          />
          <rect x="9.4" y="10.5" width="5.2" height="3" fill="#0052FF" />
        </svg>
      );
    case "matic":
      return (
        <svg viewBox="0 0 24 24" width={23} height={23} aria-hidden>
          <circle cx="12" cy="12" r="10" fill="#8247E5" />
          <path
            fill="#fff"
            d="M15.6 10.1c-.3-.18-.7-.18-1.04 0l-2.4 1.42-1.63.92-2.37 1.4c-.3.18-.7.18-1.04 0l-1.86-1.1c-.3-.18-.53-.52-.53-.92v-2.13c0-.35.18-.7.53-.91l1.84-1.07c.3-.18.7-.18 1.04 0l1.84 1.1c.3.18.53.52.53.91v1.42l1.63-.96V8.27c0-.35-.17-.7-.52-.91l-3.44-2.02c-.3-.18-.7-.18-1.04 0L3.66 7.36c-.35.21-.53.56-.53.91v4.02c0 .35.17.7.53.91l3.48 2.02c.3.18.7.18 1.04 0l2.37-1.38 1.63-.96 2.38-1.38c.3-.18.7-.18 1.04 0l1.84 1.06c.3.18.53.52.53.92v2.13c0 .35-.18.7-.53.91l-1.8 1.07c-.3-.18-.71-.18-1.05 0l-1.84-1.06c-.3-.18-.53-.52-.53-.92v-1.38l-1.63.96v1.42c0 .35.17.7.52.91l3.48 2.02c.3.18.7.18 1.04 0l3.48-2.02c.3-.18.53-.52.53-.91v-4.06c0-.35-.17-.7-.53-.92z"
          />
        </svg>
      );
    case "arb":
      return (
        <svg viewBox="0 0 24 24" width={23} height={23} aria-hidden>
          <circle cx="12" cy="12" r="10" fill="#12AAFF" />
          <path d="M8.3 16.5 12 7.2l3.7 9.3h-2l-1.7-4.6-1.7 4.6z" fill="#fff" />
        </svg>
      );
    case "op":
      return (
        <svg viewBox="0 0 24 24" width={23} height={23} aria-hidden>
          <circle cx="12" cy="12" r="10" fill="#FF0420" />
          <text x="12" y="16" fontSize="9" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="Arial">
            OP
          </text>
        </svg>
      );
    case "tron":
      return (
        <svg viewBox="0 0 24 24" width={23} height={23} aria-hidden>
          <circle cx="12" cy="12" r="10" fill="#EF0027" />
          <path
            d="M6.5 7.5l11 1.8-5.2 8.4-4-7.2 6.8 1.1-8.4-4.1z"
            fill="#fff"
            stroke="#fff"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "btc":
      return (
        <svg viewBox="0 0 24 24" width={23} height={23} aria-hidden>
          <circle cx="12" cy="12" r="10" fill="#F7931A" />
          <text x="12" y="16.5" fontSize="13" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="Arial">
            ₿
          </text>
        </svg>
      );
    default:
      return null;
  }
}

export function QuickLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={14} height={14} aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Arrow() {
  return <span className="arrow">→</span>;
}
