---
sidebar_position: 12
title: "Bitquery IDE Paid Plans"
description: "Understand Bitquery IDE paid plan features, limits, and upgrades."
---
# Upgrade to Bitquery Paid Plan

You are now in full control of your plan. You can upgrade yourself from your account — no sales call required — or contact sales for custom/Enterprise volumes.

👉 [Upgrade now](https://account.bitquery.io/user/upgrade) · [See full plans](https://bitquery.io/pricing)

## Self-service upgrade

Go to [Account → Billing → Select Plan](https://account.bitquery.io/user/upgrade). The checkout is a 4-step flow: **Choose plan → Top Up Credits → Review & pay → Done**.

![Select plan](/img/selfservice/select-plan.png)

On the **Choose plan** step you can:

- ⚡ Pick a plan and upgrade instantly
- 🔢 Switch between **Monthly** and **Annual** billing (annual saves 20%)
- 💳 Pay by card, cancel anytime

### Plans available on self-serve

| Plan                       | API points / mo | Requests / min | Concurrent requests | Simultaneous streams | Streaming time | Traffic   | Team size |
| -------------------------- | --------------- | -------------- | ------------------- | -------------------- | -------------- | --------- | --------- |
| **Personal**               | 100,000         | 30             | 3                   | —                    | —              | —         | 1         |
| **Pro**                    | 1,000,000       | 90             | 6                   | 100                  | 100,000 min    | 5 GB      | 2         |
| **Scale** ⭐ (recommended) | 5,000,000       | 240            | 12                  | 1,000                | 2,000,000 min  | 50 GB     | 5         |
| **Enterprise**             | Custom          | Custom         | Custom              | Unlimited            | Custom         | Unlimited | Custom    |

All self-serve plans use the `realtime` dataset. **Enterprise** includes all datasets (Archive, Realtime, Combined), volume pricing, and dedicated support & SLA — [contact sales](https://bitquery.io/forms/api) for a quote.

Current pricing is always on the [pricing page](https://bitquery.io/pricing).

## Top up credits (add-ons)

Step 2 of the checkout is **Top Up Credits** — optional. Add-ons are billed together with your plan each period; skip the step if you don't need any.

![Top up credits](/img/selfservice/top-up-credits.png)

| Add-on                   | What you get               |
| ------------------------ | -------------------------- |
| **1 Million API points** | +1,000,000 API points      |
| **100k Stream-minutes**  | +100,000 streaming minutes |
| **1 GB Stream Data**     | +1 GB of stream traffic    |

You can add multiple units of each add-on using the quantity selector. Prices per unit are shown in the checkout and on the [pricing page](https://bitquery.io/pricing).

## Additional Points

If you are on a paid plan and your points run out, you can either **top up API points** (add-on above) or **upgrade to a higher plan** — both from [Account → Billing](https://account.bitquery.io/user/billing).

## Contacting sales

For **Enterprise**, custom limits, or an invoice-based purchase, [contact sales](https://bitquery.io/forms/api) using the official form, email [sales@bitquery.io](mailto:sales@bitquery.io), or reach the Bitquery team on Telegram at [https://t.me/bloxy_info](https://t.me/bloxy_info) (please be cautious about potential scammers — only trust official channels and double-check the admins).

## How to change the plan?

You can change your plan any time from [Account → Billing](https://account.bitquery.io/user/billing). To switch at the end of the billing period, cancel the current plan and buy again.

## What will happen if I upgrade the plan in the middle of the month?

Your billing cycle starts on the date you pay — it is not tied to the calendar month. Whatever date you upgrade on, your points run month-on-month from that date.

For example, if you pay on the **19th**, your points are available until the **19th of the next month**, when the plan renews and your allowance resets.

## Will response times improve if I upgrade to a paid plan? {#will-response-times-improve-if-i-upgrade-to-a-paid-plan}

Paid plans have higher rate limits — more requests per minute and more concurrent requests (see the [plan table](#plans-available-on-self-serve) above).

Per-query response time is driven by the query itself, so also [optimize your queries](/docs/graphql/optimizing-graphql-queries). If that doesn't help, ask the team on [Telegram](https://t.me/bloxy_info).

## When do API credits (points) reset — monthly or rolling? {#when-do-api-credits-points-reset-monthly-or-rolling}

Points refresh on your **billing cycle**, which is anchored to the date you paid — not to the 1st of the calendar month. If you pay on the 19th, your points renew on the 19th of each following month.

Your exact renewal date and usage appear in your [account billing](https://account.bitquery.io/user/billing). If your contract differs, use the dates on your invoice or ask [sales@bitquery.io](mailto:sales@bitquery.io).

## Can I buy points without contacting sales? {#can-i-only-buy-points-by-contacting-sales}

Yes. Points and other credits are available **self-serve**: go to [Account → Billing → Select Plan](https://account.bitquery.io/user/upgrade), pick your plan, and add **Top Up Credits** (API points, stream-minutes, or stream data) at step 2 of checkout. Sales contact is only needed for **Enterprise**, custom volumes, or invoice-based billing. See also [Points](/docs/ide/points/).

## Need help?

Questions about billing? Reach us at [support@bitquery.io](mailto:support@bitquery.io) or [support.bitquery.io](https://support.bitquery.io).

> **WARNING**
> Please do not send money or pay outside the official checkout unless you receive an invoice from [bitquery.io](https://bitquery.io). Beware of scammers.
