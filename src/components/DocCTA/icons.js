import React from "react";

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

export const KeyIcon = ({className}) => (
  <svg {...base} className={className}>
    <circle cx="8" cy="16" r="4" />
    <path d="M10.8 13.2 20 4" />
    <path d="m16 8 3 3" />
  </svg>
);

export const TagIcon = ({className}) => (
  <svg {...base} className={className}>
    <path d="M3 3h8l10 10-8 8L3 11z" />
    <circle cx="7.5" cy="7.5" r="1.25" />
  </svg>
);

export const ChatIcon = ({className}) => (
  <svg {...base} className={className}>
    <path d="M21 12a8 8 0 0 1-11.4 7.2L4 21l1.8-5.6A8 8 0 1 1 21 12z" />
  </svg>
);

export const SendIcon = ({className}) => (
  <svg {...base} className={className}>
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4z" />
  </svg>
);

export const MailIcon = ({className}) => (
  <svg {...base} className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const NewsIcon = ({className}) => (
  <svg {...base} className={className}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 8h6M7 12h10M7 16h10" />
  </svg>
);

export const BotIcon = ({className}) => (
  <svg {...base} className={className}>
    <rect x="4" y="8" width="16" height="12" rx="2.5" />
    <circle cx="9" cy="14" r="1.25" />
    <circle cx="15" cy="14" r="1.25" />
    <path d="M12 8V4M9 4h6" />
  </svg>
);

export const ArrowIcon = ({className}) => (
  <svg {...base} className={className}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);
