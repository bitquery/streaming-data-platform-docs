---
title: "How to Build a Polymarket Whale Alerts Telegram Bot with the Bitquery API"
description: "Build a production-ready Polymarket Telegram bot that streams realtime trades and lets users set custom alerts on trade size, share price, trader wallet, or specific market — all powered by the Bitquery Prediction Market API."
---
import VideoPlayer from "../../src/components/videoplayer.js";

# How to Build a Polymarket Whale Alerts Telegram Bot with the Bitquery API

Build a production-ready **Polymarket Telegram bot** that streams realtime trades and lets users set custom alerts on trade size, share price, trader wallet, or specific market — all powered by the **[Bitquery Prediction Market API](/docs/examples/prediction-market/prediction-market-api/)**.

By the end of this guide you'll have a multi-user Telegram bot that subscribes to every Polymarket trade on Polygon over a single GraphQL WebSocket, filters trades against per-user alert rules, and pushes Telegram notifications with links to Polymarket, PolygonScan, and the trader's profile.

## Video Walkthrough

<VideoPlayer url="https://youtu.be/RRFVaf9_0G4" />

<a href="https://t.me/PolyBit_Polymarket_Bot" target="_blank"><img src="https://raw.githubusercontent.com/Akshat-cs/PolyBit-Polymarket-Alerts-Telegram-Bot/main/assets/add-on-telegram.svg" alt="Add PolyBit on Telegram" height="48" /></a>

> **[Source code](https://github.com/Akshat-cs/PolyBit-Polymarket-Alerts-Telegram-Bot)**

> **Stack:** Python 3.11+ · `python-telegram-bot v21` · `gql` (Bitquery GraphQL) · `httpx`

> **Time to complete tutorial:** ~30 minutes

> **Storage:** Flat JSON files (no database)

## What you'll learn

- How to subscribe to **realtime Polymarket trades** with a Bitquery GraphQL subscription
- How to query **top markets**, **search markets**, and **current outcome prices** over Bitquery's HTTP endpoint
- How to match streamed trades against user-defined alert filters with a per-alert cooldown
- How to ship a multi-user Telegram bot with persistent state (no DB required)
- How to deploy the bot with persistent storage so user alerts survive redeploys

## Why use Bitquery for Polymarket data

Polymarket runs on Polygon and uses Gnosis CTF contracts under the hood. To build any data-driven product on top of it you typically need to either run your own Polygon archive node, index trades from the Conditional Tokens Framework (CTF), and resolve market metadata yourself — or you reach for a hosted indexer.

The Bitquery Prediction Market API solves all three concerns through a single GraphQL endpoint:

- **Realtime + historical in one place.** The same schema is exposed over WebSocket subscriptions and HTTP queries — you don't stitch a streaming SDK to a separate query SDK.
- **Decoded trades, not logs.** `PredictionTrades` already exposes `Buyer`, `Seller`, `CollateralAmountInUSD`, `Price`, `IsOutcomeBuy`, `Outcome.Label` — no custom CTF decoding needed.
- **Market metadata included.** `Question.Title`, `Question.Image`, `Question.MarketId`, `ConditionId`, `OutcomeToken.AssetId` come back on the same trade row, so a single subscription is enough to render rich notifications.
- **Aggregations server-side.** `volume_usd`, `trade_count`, `unique_buyers` are computed inside the query, so "top markets last 1h" is a single round-trip — no client-side reduce.

If you're building anything that needs Polymarket whale alerts, leaderboards, market analytics, dashboards, or notifications — this is the fastest path from "I have an API key" to "I'm shipping product."

## Prerequisites

Before you start you'll need:

1. **Python 3.11+** installed (`python3 --version`).
2. **A Bitquery API token.** Sign up at [account.bitquery.io](https://account.bitquery.io) and generate an API v2 access token at [account.bitquery.io/user/api_v2/access_tokens](https://account.bitquery.io/user/api_v2/access_tokens). The free tier is plenty to follow this guide.
3. **A Telegram account** plus a bot token. Open Telegram, message [@BotFather](https://t.me/BotFather), send `/newbot`, follow the prompts, and copy the `123456:ABC…` token it returns.
4. **(Optional)** A Render or VPS account if you want to deploy the bot publicly. We cover Render at the end.

Keep both tokens private — they grant API access on your behalf.

## Architecture overview

PolyBit runs three concurrent tasks on a single asyncio event loop:

```
                ┌─────────────────────────────────────────────┐
Bitquery WS ──► │  BitqueryStreamer  ──►  match_trade()       │
(every          │                          ▲                  │
 Polymarket     │                          │ (Alert filters)  │
 trade)         │                  ┌───────┴───────┐          │
                │                  │  AlertStore   │          │
                │                  │  UserStore    │          │
Telegram <──── ─┤  TelegramSender  │  (JSON files) │          │
(notifications) │     ▲            └───────┬───────┘          │
                │     │                    │                  │
Telegram ────► ─┤  python-telegram-bot ◄───┘                  │
(commands,      │  Application (handlers)                     │
 callbacks)     └─────────────────────────────────────────────┘
```

- **`BitqueryStreamer`** opens a single WebSocket subscription to `wss://streaming.bitquery.io/graphql` and dispatches each `TradeEvent` to registered handlers.
- **`match_trade()`** runs the trade against every active alert and returns matches.
- **`TelegramSender`** drains an outbound queue with per-chat throttling so Telegram's rate limits never bite.
- **`AlertStore` / `UserStore`** persist users and alerts to JSON files atomically (tmp file + `os.replace`) under an `asyncio.Lock`.

That's the whole system. Let's build it.

## Step 1 — Project setup

Clone the reference repo and install dependencies:

```bash
git clone https://github.com/Akshat-cs/PolyBit-Polymarket-Alerts-Telegram-Bot.git
cd PolyBit-Polymarket-Alerts-Telegram-Bot

python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

`requirements.txt` is intentionally small:

```
gql[websockets]>=3.5.0
websockets>=12.0
python-dotenv>=1.0.0
httpx>=0.27.0
python-telegram-bot[ext]>=21.0
```

Copy the env template and fill in your tokens:

```bash
cp .env.example .env
```

```bash
# .env
BITQUERY_TOKEN=ory_at_xxxxxxxx...
TELEGRAM_BOT_TOKEN=123456:ABC...
POLYBIT_LOG_LEVEL=INFO
# POLYBIT_DATA_DIR=/var/data   # only on a deployed instance
```

## Step 2 — Stream realtime Polymarket trades from Bitquery

The core of any Polymarket alerts product is a single GraphQL subscription. We listen for every successful Polymarket trade on Polygon and request exactly the fields we need to filter, render, and link out from a notification:

```graphql
subscription PolymarketTradesStream {
  EVM(network: matic) {
    PredictionTrades(
      where: {
        TransactionStatus: { Success: true }
        Trade: {
          Prediction: { Marketplace: { ProtocolName: { is: "polymarket" } } }
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
        From
      }
      Trade {
        OutcomeTrade {
          Buyer
          Seller
          Amount
          CollateralAmount
          CollateralAmountInUSD
          Price
          PriceInUSD
          IsOutcomeBuy
        }
        Prediction {
          ConditionId
          Question {
            Id
            Title
            MarketId
            Image
            CreatedAt
          }
          Outcome {
            Label
            Index
          }
          OutcomeToken {
            AssetId
          }
        }
      }
    }
  }
}
```

Two important field-level details for prediction markets:

- **`CollateralAmountInUSD`** is the trade size in USDC equivalent. This is what you compare against a "min trade USD" alert filter, not the raw outcome-token `Amount`.
- **`IsOutcomeBuy`** is the trade direction:
  - `true` — Seller (maker) gives USDC, Buyer (taker) gives outcome tokens. The position is being closed.
  - `false` — Buyer gives USDC, Seller gives outcome tokens. New exposure is being opened.

PolyBit normalizes "buyer" to "whoever received outcome tokens" and surfaces both addresses in notifications.

### Connecting over WebSocket

Bitquery's WebSocket endpoint expects the API token as a query parameter and the `graphql-ws` subprotocol header:

```python
# polybit/bitquery.py (excerpt)
from gql import gql
from gql.transport.websockets import WebsocketsTransport
from urllib.parse import quote

BITQUERY_WS_URL = "wss://streaming.bitquery.io/graphql"

def ws_url(token: str) -> str:
    return f"{BITQUERY_WS_URL}?token={quote(token, safe='')}"

class BitqueryStreamer:
    def __init__(self, token: str) -> None:
        self._token = token
        self._handlers = []

    def add_handler(self, fn) -> None:
        self._handlers.append(fn)

    async def run(self) -> None:
        transport = WebsocketsTransport(
            url=ws_url(self._token),
            headers={"Sec-WebSocket-Protocol": "graphql-ws"},
        )
        await transport.connect()
        async for result in transport.subscribe(gql(TRADES_SUBSCRIPTION)):
            if result.errors:
                continue
            for row in (result.data or {}).get("EVM", {}).get("PredictionTrades") or []:
                event = TradeEvent.from_raw(row)
                for handler in self._handlers:
                    await handler(event)
```

The full implementation in `polybit/bitquery.py` adds exponential-backoff reconnection and graceful shutdown, but this is the entire happy path. One subscription, one handler chain, all Polymarket trades.

## Step 3 — Query top markets over HTTP

For browse/search features you don't want to filter the firehose client-side — you want server-side aggregations. Bitquery's `PredictionTrades` exposes `sum`, `count`, and `count(distinct: …)` directly inside the GraphQL query, so "top markets last 1h by volume" is one request:

```graphql
query TopMarketsByVolume($hours: Int!, $limit: Int!) {
  EVM(network: matic) {
    PredictionTrades(
      limit: { count: $limit }
      orderBy: { descendingByField: "volume_usd" }
      where: {
        TransactionStatus: { Success: true }
        Block: { Time: { since_relative: { hours_ago: $hours } } }
        Trade: {
          Prediction: { Marketplace: { ProtocolName: { is: "polymarket" } } }
        }
      }
    ) {
      Trade {
        Prediction {
          ConditionId
          Question {
            Id
            Title
            MarketId
            Image
          }
        }
      }
      volume_usd: sum(of: Trade_OutcomeTrade_CollateralAmountInUSD)
      trade_count: count
      unique_buyers: count(distinct: Trade_OutcomeTrade_Buyer)
    }
  }
}
```

Swap `orderBy` for `unique_buyers` or `trade_count` to get the other top-market views — same shape, three different leaderboards from the same query template.

The HTTP client is a thin `httpx` wrapper that adds `Authorization: Bearer <token>` and POSTs to the same hostname:

```python
# polybit/bitquery.py (excerpt)
import httpx

BITQUERY_HTTP_URL = "https://streaming.bitquery.io/graphql"

class BitqueryHTTP:
    async def __aenter__(self):
        self._client = httpx.AsyncClient(
            base_url=BITQUERY_HTTP_URL,
            headers={"Authorization": f"Bearer {self._token}"},
            timeout=30.0,
        )
        return self

    async def _exec(self, query: str, variables: dict) -> dict:
        resp = await self._client.post(
            "",
            json={"query": query, "variables": variables},
        )
        resp.raise_for_status()
        body = resp.json()
        if "errors" in body:
            raise RuntimeError(body["errors"])
        return body["data"]
```

## Step 4 — Fetch current prices and search markets

Two more queries cover the rest of the browse experience:

**Search markets by keyword** — same `PredictionTrades` aggregation with a title substring filter:

```graphql
query SearchMarkets($q: String!, $limit: Int!, $hours: Int!) {
  EVM(network: matic) {
    PredictionTrades(
      limit: { count: $limit }
      orderBy: { descendingByField: "volume_usd" }
      where: {
        TransactionStatus: { Success: true }
        Block: { Time: { since_relative: { hours_ago: $hours } } }
        Trade: {
          Prediction: {
            Marketplace: { ProtocolName: { is: "polymarket" } }
            Question: { Title: { includesCaseInsensitive: $q } }
          }
        }
      }
    ) {
      ...same
      shape
      as
      TopMarketsByVolume
    }
  }
}
```

**Current outcome prices for a single market** — uses `limitBy` to take the latest trade per outcome token:

```graphql
query CurrentPricesForMarket($marketId: String!) {
  EVM(network: matic) {
    PredictionTrades(
      limitBy: { by: Trade_Prediction_OutcomeToken_AssetId, count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        TransactionStatus: { Success: true }
        Trade: { Prediction: { Question: { MarketId: { is: $marketId } } } }
      }
    ) {
      Block {
        Time
      }
      Trade {
        OutcomeTrade {
          Price(maximum: Block_Time)
          PriceInUSD(maximum: Block_Time)
        }
        Prediction {
          ConditionId
          Question {
            Id
            Title
            Image
            MarketId
          }
          Outcome {
            Label
            Index
          }
          OutcomeToken {
            AssetId
          }
        }
      }
    }
  }
}
```

`limitBy: { by: …, count: 1 }` returns one row per `AssetId`, and `maximum: Block_Time` picks the most recent price per outcome — the same trick you'd use to render a market's current "Yes / No" prices.

## Step 5 — Match streamed trades against user alerts

PolyBit's alert model is a single dataclass with seven optional filters. Any field that's `None` is treated as a wildcard:

```python
# polybit/store.py (excerpt)
@dataclass
class Alert:
    id: str
    chat_id: str
    market_key: str | None = None       # Polymarket MarketId
    market_title: str | None = None
    outcome: str | None = None          # e.g. "Yes" / "Up"
    min_trade_amount_usd: float | None = None
    max_trade_amount_usd: float | None = None
    min_price_usd: float | None = None
    max_price_usd: float | None = None
    trader: str | None = None           # 0x... wallet
    last_triggered_at: float | None = None
    paused: bool = False
```

The matcher is straightforward: every set filter must pass, with a per-alert cooldown so a hot market can't spam the user.

```python
# polybit/matcher.py (excerpt)
def match_trade(event, alerts, *, cooldown_seconds=60):
    now = time.time()
    matches = []
    for a in alerts:
        if a.paused or not a.has_any_filter():
            continue
        if a.last_triggered_at and now - a.last_triggered_at < cooldown_seconds:
            continue
        if a.market_key and event.market_id != a.market_key:
            continue
        if a.outcome and (event.outcome_label or "").lower() != a.outcome.lower():
            continue
        if a.min_trade_amount_usd is not None and (event.collateral_usd or 0) < a.min_trade_amount_usd:
            continue
        if a.max_trade_amount_usd is not None and (event.collateral_usd or 0) > a.max_trade_amount_usd:
            continue
        if a.min_price_usd is not None and (event.price or 0) < a.min_price_usd:
            continue
        if a.max_price_usd is not None and (event.price or 0) > a.max_price_usd:
            continue
        if a.trader and a.trader.lower() not in (event.buyer or "", event.seller or ""):
            continue
        a.last_triggered_at = now
        matches.append(Match(alert=a, event=event))
    return matches
```

Every active alert is just an in-memory dataclass — running this for ~hundreds of alerts per trade is trivially fast.

## Step 6 — Send notifications via Telegram

Wire the streamer's handler to the Telegram sender. The handler builds a notification message per match and enqueues it; the sender drains the queue with per-chat throttling so we never trip Telegram's rate limits:

```python
# polybit/main.py (excerpt)
async def on_trade(event):
    matches = match_trade(event, list(alerts.active_alerts()))
    if not matches:
        return
    for m in matches:
        text, kb, preview = fmt.fmt_trade_notification(m, canonical_url=…)
        await sender.enqueue(OutboundMessage(
            chat_id=m.alert.chat_id,
            text=text,
            reply_markup=kb,
            preview_url=preview,  # Polymarket S3 question image
        ))

streamer.add_handler(on_trade)
```

Notifications include inline links to:

- **`https://polymarket.com/event/<slug>`** — resolved via Polymarket's Gamma API (`https://gamma-api.polymarket.com/markets`) using `ConditionId` from the trade row. Falls back to a slugified title.
- **`https://polygonscan.com/tx/<hash>`** — straight from `Transaction.Hash`.
- **`https://polymarket.com/profile/<wallet>`** — for the trader who triggered the alert (when a trader filter is set).

The image preview is the question's S3 image URL (`Question.Image`) directly — no additional rendering hop needed.

## Step 7 — Persist users and alerts to JSON

For multi-user state you don't need a database. Two flat JSON files, atomic writes, and an `asyncio.Lock` will hold ~hundreds of users and alerts in well under 100 KB total:

```python
# polybit/store.py (excerpt)
def _atomic_write_json(path, payload):
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    os.replace(tmp, path)  # atomic on POSIX + Windows

class AlertStore:
    def __init__(self, path):
        self._path = path
        self._lock = asyncio.Lock()
        self._alerts: dict[str, Alert] = {}

    async def add(self, alert):
        async with self._lock:
            self._alerts[alert.id] = alert
            self._save_unlocked()
```

`UserStore` follows the same pattern. Schema:

```json
// users.json
{ "users": [{ "chat_id": "5057295168", "username": "alice", "joined_at": "2026-05-08T09:23:45+00:00" }] }

// alerts.json
{ "alerts": [{
    "id": "0c5c9...",
    "chat_id": "5057295168",
    "market_key": "1985666",
    "market_title": "Will Trump visit China by May 15?",
    "min_trade_amount_usd": 5000,
    "trader": "0xae80195bd3a761fe6b39bec9dfab9b5566fc86b0",
    "paused": false,
    "created_at": "2026-05-07T18:02:11+00:00"
}] }
```

`tmp + os.replace` makes a crash mid-write impossible to corrupt the file: either the rename happened (new file in place) or it didn't (old file untouched).

## Step 8 — Run it

```bash
python -m polybit
```

You should see:

```
INFO  PolyBit starting up: 0 user(s), 0 alert(s)
INFO  Bitquery WS connected
INFO  PolyBit is running. Press Ctrl+C to stop.
```

Open your bot in Telegram, send `/start`, and try `/topmarkets`, `/search`, `/addalert`. The first trade that matches one of your alerts will arrive as a Telegram message with full context.

## Step 9 — Deploy with persistent storage

Because user and alert state lives in JSON files, your hosting target needs **persistent disk** — not a free-tier ephemeral filesystem. The reference repo ships with a Render Blueprint:

```yaml
# render.yaml
services:
  - type: worker
    name: polybit
    runtime: python
    plan: starter
    buildCommand: pip install -r requirements.txt
    startCommand: python -m polybit
    envVars:
      - key: BITQUERY_TOKEN
        sync: false
      - key: TELEGRAM_BOT_TOKEN
        sync: false
      - key: POLYBIT_DATA_DIR
        value: /var/data
    disk:
      name: polybit-data
      mountPath: /var/data
      sizeGB: 1
```

The `POLYBIT_DATA_DIR` env var redirects writes to the mounted disk, so `/var/data/users.json` and `/var/data/alerts.json` survive every redeploy. Total cost on Render: $7.25/mo (Starter Worker + 1 GB disk).

For self-hosting, the same setup works under `systemd` on any VPS — just ensure the `WorkingDirectory` points at a directory that survives reboots. See [DEPLOY.md](https://github.com/Akshat-cs/PolyBit-Polymarket-Alerts-Telegram-Bot/blob/main/DEPLOY.md) in the repo for both flows.

## Inspect users and alerts at runtime

The repo includes a tiny CLI for live introspection:

```bash
python -m polybit.stats
```

```
============================================================
  PolyBit · stats snapshot
  Data dir: /var/data
============================================================

👥 Users: 142
   Joined last 24h: 18
   Joined last 7d:  64

🔔 Alerts: 287
   Active: 251
   Paused: 36
   Bound to a market: 198
   Triggered at least once: 113

🎯 Most-targeted markets (top 5):
    21× Bitcoin Up or Down — May 8, 7:40AM-7:45AM ET
    18× Will Trump visit China by May 15?
    ...
```

Useful for product checks; safe to run while the bot is live.

## What you can build next

The same Bitquery primitives unlock plenty of adjacent products on top of Polymarket:

- **Per-trader leaderboards** — aggregate `PredictionTrades` by `Buyer` over a window for top-volume wallets.
- **PnL tracking** — combine `PredictionTrades` with `PredictionSettlements` to compute realized PnL per wallet.
- **Market resolution alerts** — subscribe to `PredictionSettlements` to notify users when a market they hold positions in resolves.
- **Whale-watch X/Twitter feeds** — same trade stream, different output channel.
- **Custom dashboards** — the same aggregations power Grafana / Metabase / your own React app.

All of these reuse the same GraphQL endpoint, same auth, same field shapes.

## Resources

- [Bitquery Prediction Market API docs](/docs/examples/prediction-market/prediction-market-api/)
- [Prediction Trades API](/docs/examples/prediction-market/prediction-trades-api/)
- [Prediction Managements API](/docs/examples/prediction-market/prediction-managements-api/)
- [Prediction Settlements API](/docs/examples/prediction-market/prediction-settlements-api/)
- [Source code](https://github.com/Akshat-cs/PolyBit-Polymarket-Alerts-Telegram-Bot)
- [Live demo — @PolyBit_Polymarket_Bot](https://t.me/PolyBit_Polymarket_Bot)
- [Get a Bitquery token](https://account.bitquery.io)

## Conclusion

A multi-user **Polymarket Telegram alerts bot** is one GraphQL subscription, a small filter loop, and a Telegram client away. Bitquery handles the chain-level work — decoded trades, market metadata, server-side aggregations — so you can spend your time on product, not on indexing.

Get a free Bitquery token at [account.bitquery.io](https://account.bitquery.io), point it at the Prediction Market API, and start shipping.
