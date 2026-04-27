---
sidebar_position: 11
---

# Manage Account

After you sign in at [account.bitquery.io](https://account.bitquery.io/), the first screen is the **Dashboard** ([`/user/dashboard`](https://account.bitquery.io/user/dashboard)). It summarizes your plan, usage, profile, tokens, shortcuts to apps (including the GraphQL **IDE**), and support links.

![Bitquery account dashboard — landing page after login](/img/ide/user-dashboard.png)

## Top navigation

The main menu is a single row at the top. A few items are direct links; the rest are **dropdowns** that group related pages (the old flat sidebar has been trimmed and reorganized).

| Item | Notes |
| --- | --- |
| **Dashboard** | Home after login; overview cards (plan, usage, account, tokens, apps). |
| **Billing** | Plans, payments, upgrades — [Billing](https://account.bitquery.io/user/billing). |
| **Authorization** | Dropdown — **Applications** ([manage apps](https://account.bitquery.io/user/api_v2/applications)) and **Tokens** ([generate tokens](https://account.bitquery.io/user/api_v2/access_tokens)). |
| **API V1** | Dropdown — v1 API usage and tools. |
| **API V2** | Dropdown — v2 queries, streams, subscriptions, and related reports. |
| **System Status** | Dropdown — service health and blockchain pipeline status. |
| **Apps** | Dropdown — links to products such as the IDE, DEX dashboards, and other tools. |
| **Help** | Dropdown — documentation, community, and support. |

Use **Apps → IDE** (or the **IDE** card on the dashboard) to open the GraphQL IDE at [ide.bitquery.io](https://ide.bitquery.io/).

## What you see on the Dashboard

- **Plan** — Current tier, points allowance, and stream limits (with upgrade or sales contact where applicable).
- **Usage** — Recent API usage (for example v1 / v2 queries and streams); links to more detailed reports where available.
- **Account** — Profile, company, role, 2FA; links to password and security settings — [Account settings](https://account.bitquery.io/user/account).
- **Access tokens** — Active tokens and applications; [generate or manage tokens](https://account.bitquery.io/user/api_v2/access_tokens) and [applications](https://account.bitquery.io/user/api_v2/applications).
- **Bitquery Apps** — Quick entry to the IDE and other Bitquery products.
- **Docs & Support** — Documentation, forum, blog, and contact options.
- **System status** — Shortcuts to overall and per-service status (full detail also under **System Status** in the top menu).

Deeper pages (detailed API statistics, referrers, error logs, messages, and similar) are reached from the **API V1**, **API V2**, or **Authorization** menus instead of a long static sidebar.
