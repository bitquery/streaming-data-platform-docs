---
sidebar_position: 11
title: "Bitquery IDE Account Settings"
description: "Bitquery IDE Account Settings in Bitquery docs with practical setup steps, examples, and guidance for secure API access."
---
# Manage Account

After you sign in at [account.bitquery.io](https://account.bitquery.io/), the first screen is the **Dashboard** ([`/user/dashboard`](https://account.bitquery.io/user/dashboard)). It summarizes your plan, usage, profile, tokens, shortcuts to apps (including the GraphQL **IDE**), and support links.

![Bitquery account dashboard — landing page after login](/img/ide/user-dashboard.png)

## Top navigation

The main menu is a single row at the top. A few items are direct links; the rest are **dropdowns** that group related pages (the old flat sidebar has been trimmed and reorganized).

| Item | Notes |
| --- | --- |
| **Dashboard** | Home after login; overview cards (plan, usage, account, tokens, apps). |
| **Billing** | Plans, payments, self-serve upgrades — [Billing](https://account.bitquery.io/user/billing) → [Select Plan](https://account.bitquery.io/user/upgrade). |
| **Authorization** | Dropdown — **Applications** ([manage apps](https://account.bitquery.io/user/api_v2/applications)) and **Tokens** ([generate tokens](https://account.bitquery.io/user/api_v2/access_tokens)). |
| **API V1** | Dropdown — v1 API usage and tools. |
| **API V2** | Dropdown — v2 queries, streams, subscriptions, and related reports. |
| **System Status** | Dropdown — service health and blockchain pipeline status. |
| **Apps** | Dropdown — links to products such as the IDE, DEX dashboards, and other tools. |
| **Help** | Dropdown — documentation, community, and support. |

Use **Apps → IDE** (or the **IDE** card on the dashboard) to open the GraphQL IDE at [ide.bitquery.io](https://ide.bitquery.io/).

## Billing — self-serve upgrades

You are in full control of your plan. From **Billing → [Select Plan](https://account.bitquery.io/user/upgrade)** you can:

- ⚡ Pick a plan and upgrade instantly
- 🔢 Choose **Monthly** or **Annual** billing (annual saves 20%)
- 💳 Pay by card, cancel anytime
- 🔢 Optionally **top up credits** (API points, stream-minutes, stream data) at checkout

![Select plan](/img/selfservice/select-plan.png)

Plans on self-serve: **Personal** (100K API points/mo, 3 concurrent requests), **Pro** (1M points/mo, 100 streams), **Scale** ⭐ (5M points/mo, 1,000 streams), and **Enterprise** (custom limits, dedicated SLA & support — [contact sales](https://bitquery.io/forms/api)).

See [full plans](https://bitquery.io/pricing) or the [Upgrade to Paid Plan](/docs/ide/paid/) guide. Billing questions: [support@bitquery.io](mailto:support@bitquery.io).

## What you see on the Dashboard

- **Plan** — Current tier, points allowance, and stream limits (with upgrade or sales contact where applicable).
- **Usage** — Recent API usage (for example v1 / v2 queries and streams); links to more detailed reports where available.
- **Account** — Profile, company, role, 2FA; links to password and security settings — [Account settings](https://account.bitquery.io/user/account).
- **Access tokens** — Active tokens and applications; [generate or manage tokens](https://account.bitquery.io/user/api_v2/access_tokens) and [applications](https://account.bitquery.io/user/api_v2/applications).
- **Bitquery Apps** — Quick entry to the IDE and other Bitquery products.
- **Docs & Support** — Documentation, forum, blog, and contact options.
- **System status** — Shortcuts to overall and per-service status (full detail also under **System Status** in the top menu).

Deeper pages (detailed API statistics, referrers, error logs, messages, and similar) are reached from the **API V1**, **API V2**, or **Authorization** menus instead of a long static sidebar.
