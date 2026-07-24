---
title: "Robinhood Transfers API & Streams"
description: "Query & stream Robinhood transfers with Bitquery GraphQL: ETH, USDG, tokenized stocks (AAPL, NVDA), whale alerts, wallet ledgers, and compliance monitors."
sidebar_position: 2
keywords:
  - Robinhood Transfers API
  - Robinhood token transfers
  - Robinhood ETH transfers
  - Robinhood whale transfers
  - Robinhood wallet transfers GraphQL
  - Robinhood USDG transfers
  - Robinhood WETH transfers
  - Robinhood tokenized stock transfers
  - Robinhood NVDA transfers
  - Robinhood RWA token transfers
  - Robinhood transfer volume API
  - Robinhood daily transfer volume
  - stream Robinhood transfers
---
# Robinhood Transfers API & Streams

Use the **Robinhood Transfers API** to query and stream on-chain transfers on Robinhood with Bitquery GraphQL (`network: robinhood` on `EVM`). This is the shared **EVM Transfers** cube scoped to Robinhood — not a separate schema.

Track native ETH, WETH, stablecoins such as USDG, **tokenized stocks (AAPL, NVDA, GOOGL, GME)**, and meme-token movements in real time or across historical windows. Build whale alerts, address ledgers, transfer-volume dashboards, and compliance monitors from the same cube. Every query on this page was executed against the production endpoint before publishing, and each subscription was verified live over WebSocket.

| Use case | What you can build |
| --- | --- |
| **Trading / desks** | Whale alerts, large ETH moves, hourly volume, liquidity-hub flows |
| **DeFi / bots** | Token transfer feeds, WETH wrap/unwrap, router counterparties |
| **Accounting / portfolio** | Inbound vs outbound, sent/received volume by token, date-range ledgers |
| **Compliance / forensics** | Address timelines, top counterparties, failed transfers, address-pair flows |
| **Token analytics** | Most-transferred tokens, transfer size stats, daily volume, unique senders/receivers |

**On this page:** [Stream](#stream-real-time-transfers) · [Latest](#latest-transfers) · [By token](#transfers-for-a-specific-token) · [Token pulse](#latest-transfer-per-token-activity-pulse) · [USDG](#usdg-stablecoin-transfers) · [Tokenized stocks](#tokenized-stock-transfers-aapl-nvda) · [By address](#transfers-for-an-address) · [Whales](#whale-transfers-by-usd-value) · [Top tokens](#most-transferred-tokens-24h) · [Size stats](#eth-transfer-size-statistics-24h) · [Daily volume](#daily-transfer-volume-7-days) · [Historical](#historical-transfers-by-date) · [FAQ](#faq)

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Robinhood Trades](/docs/blockchain/robinhood/robinhood-trades/)
- [Robinhood Liquidity & Slippage API](/docs/blockchain/robinhood/robinhood-liquidity/)
- [Robinhood Token Supply API](/docs/blockchain/robinhood/robinhood-token-supply/)
- [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches/)
- [EVM Transfers schema](/docs/schema/evm/transfers/)
- [ERC20 Token Transfers API (Ethereum)](/docs/blockchain/Ethereum/transfers/erc20-token-transfer-api/)
- [Transfers vs Events vs Calls](/docs/start/mental-model-transfers-events-calls/)
:::

---

## Network and useful contracts

| Item | Value |
| --- | --- |
| GraphQL network | `network: robinhood` on `EVM` |
| Native currency | ETH (`Currency.Native: true`, `SmartContract: "0x"`) |
| WETH | `0x0bd7d308f8e1639fab988df18a8011f41eacad73` |
| USDG (Global Dollar) | `0x5fc5360d0400a0fd4f2af552add042d716f1d168` |
| AAPL (Apple · Robinhood Token) | `0xaf3d76f1834a1d425780943c99ea8a608f8a93f9` |
| NVDA (NVIDIA · Robinhood Token) | `0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec` |
| FREN (example meme token) | `0xd387e5bba711457faf4d013d20e02e8c91f07fa4` |
| Zero address (wrap/unwrap, mint/burn) | `0x0000000000000000000000000000000000000000` |
| Example address used below | `0xcaf681a66d020601342297493863e78c959e5cb2` |

:::note Example addresses
`0xcaf681a6…` is a **high-activity address** on Robinhood (often involved in routing/liquidity flows). Treat it as a sample — replace it with any wallet or contract you want to track. FREN is an illustrative meme token and may change over time.
:::

`Transfer.Type` commonly returns `token` (ERC-20 log), `call` (internal value move), or `transaction` (top-level ETH value).

:::tip AmountInUSD on Robinhood transfers
In practice **only native ETH carries a populated `AmountInUSD`** on this cube — WETH and USDG rows return `0` too, not just long-tail tokens. Consequences:

- USD thresholds and USD rankings effectively select **ETH flows only**.
- For USDG, treat `Transfer.Amount` as ≈ USD (it is a dollar stablecoin).
- For every other token (including tokenized stocks), filter and rank by `Transfer.Amount` in token units.
:::

:::tip Choosing a dataset
- **`realtime`** — a rolling window of recent blocks. Its depth **varies** from hours to days — don't assume a fixed depth; measure it with the query below.
- **`combined`** — archive + realtime union. The safe choice for any fixed window (24h, 48h, 7d).
- **`archive`** — full history; its head lags the chain by minutes. Unlike the [liquidity cubes](/docs/blockchain/robinhood/robinhood-liquidity/), Transfers **does** support archive.
:::

### Check the dataset window

Don't guess the realtime depth — measure it. `Time(minimum: …)` / `Time(maximum: …)` return the bounds of whatever the dataset currently holds (swap in `archive` to see the archive head).

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers {
      count
      earliest: Block { Time(minimum: Block_Time) }
      latest: Block { Time(maximum: Block_Time) }
    }
  }
}
```

---

## Stream real-time transfers

Stream live transfers for dashboards, bots, and alerting.

:::warning Filter live streams
Robinhood transfer volume is very high. Prefer a `where` filter (token, address, or `AmountInUSD`) in production. An unfiltered subscription is fine for exploration, but it can overwhelm clients and burn stream quota.
:::

▶️ [Run in IDE](https://ide.bitquery.io/real-time-transfers-on-robinhood)

```graphql
subscription {
  EVM(network: robinhood) {
    Transfers {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Type
        Success
        Currency {
          Name
          Symbol
          SmartContract
          Native
        }
      }
      Transaction {
        Hash
        From
        To
      }
      Block {
        Number
        Time
      }
    }
  }
}
```

:::tip WebSocket connection
Connect to `wss://streaming.bitquery.io/graphql?token=YOUR_TOKEN` with the `graphql-transport-ws` subprotocol (`connection_init` → `connection_ack` → `subscribe`). Events arrive in per-block batches. See [WebSocket authentication](/docs/authorization/websocket/).
:::

:::tip Prefer Kafka for the firehose
Consuming all Robinhood transfers continuously? Bitquery also delivers this data as **Kafka streams** (protobuf topic `robinhood.tokens.proto`) with consumer-group scaling and replay. See [Kafka Streaming Concepts](/docs/streams/kafka-streaming-concepts/).
:::

### Stream whale transfers (USD threshold)

Alert when a successful transfer exceeds a USD size. Exclude the zero address to skip wrap/unwrap and mint/burn noise. Because USD is populated for native ETH, this is effectively a **large ETH move alert**.

```graphql
subscription {
  EVM(network: robinhood) {
    Transfers(
      where: {
        Transfer: {
          AmountInUSD: { gt: "10000" }
          Success: true
          Sender: { not: "0x0000000000000000000000000000000000000000" }
          Receiver: { not: "0x0000000000000000000000000000000000000000" }
        }
      }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Symbol
          Native
          SmartContract
        }
      }
      Transaction {
        Hash
        From
        To
      }
      Block {
        Number
        Time
      }
    }
  }
}
```

### Stream transfers for an address (wallet tracker)

Watch one wallet's inbound and outbound transfers live — the core of a wallet tracker or deposit monitor. Replace the sample address with yours.

```graphql
subscription {
  EVM(network: robinhood) {
    Transfers(
      where: {
        any: [
          {
            Transfer: {
              Sender: { is: "0xcaf681a66d020601342297493863e78c959e5cb2" }
            }
          }
          {
            Transfer: {
              Receiver: { is: "0xcaf681a66d020601342297493863e78c959e5cb2" }
            }
          }
        ]
        Transfer: { Success: true }
      }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Type
        Currency {
          Symbol
          SmartContract
          Native
        }
      }
      Transaction {
        Hash
      }
      Block {
        Time
        Number
      }
    }
  }
}
```

---

## Latest transfers

Query the most recent transfers with amount, USD value, token metadata, sender, receiver, time, and transaction hash.

▶️ [Run in IDE](https://ide.bitquery.io/latest-transfers-on-robinhood)

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Type
        Success
        Currency {
          Name
          Symbol
          SmartContract
          Native
        }
      }
      Transaction {
        Hash
        From
        To
      }
      Block {
        Time
        Number
      }
    }
  }
}
```

Example response shape:

```json
{
  "EVM": {
    "Transfers": [
      {
        "Block": {
          "Number": "17306406",
          "Time": "2026-07-23T13:00:09Z"
        },
        "Transaction": {
          "From": "0x8c72ce85b70972de417919a8f999145e6d9bd303",
          "Hash": "0x1a60e55cddedbd7534eea1e721a59a6abd8ce1e68c06313272621eaf9958488b",
          "To": "0xcaf681a66d020601342297493863e78c959e5cb2"
        },
        "Transfer": {
          "Amount": "0.020000000000000000",
          "AmountInUSD": "38.05729248046875",
          "Currency": {
            "Name": "Ethereum",
            "Native": true,
            "SmartContract": "0x",
            "Symbol": "ETH"
          },
          "Receiver": "0x0bd7d308f8e1639fab988df18a8011f41eacad73",
          "Sender": "0xcaf681a66d020601342297493863e78c959e5cb2",
          "Success": true,
          "Type": "call"
        }
      }
    ]
  }
}
```

---

## Native ETH transfers

Useful for gas/treasury monitoring and large native ETH value moves (`Type` is often `call` or `transaction`).

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: {
        Transfer: {
          Currency: { Native: true }
          Success: true
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Type
        Currency {
          Symbol
          Native
        }
      }
      Transaction {
        Hash
        From
        To
      }
      Block {
        Time
      }
    }
  }
}
```

---

## Token transfers (exclude native ETH)

Track ERC-20 style movements — WETH, USDG, tokenized stocks, meme tokens — without native ETH noise.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: {
        Transfer: {
          Currency: { Native: false }
          Success: true
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Type
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
      Transaction {
        Hash
      }
      Block {
        Time
      }
    }
  }
}
```

---

## Transfers for a specific token

Filter with `Transfer.Currency.SmartContract`. Example: WETH on Robinhood.

▶️ [Run in IDE](https://ide.bitquery.io/Transfers-for-a-token-on-robinhood)

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0x0bd7d308f8e1639fab988df18a8011f41eacad73" }
          }
          Success: true
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
      Transaction {
        Hash
      }
      Block {
        Time
      }
    }
  }
}
```

### Multiple tokens in one query

Monitor a watchlist (WETH + a meme token) with `SmartContract.in`.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: {
              in: [
                "0x0bd7d308f8e1639fab988df18a8011f41eacad73"
                "0xd387e5bba711457faf4d013d20e02e8c91f07fa4"
              ]
            }
          }
          Success: true
        }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          Symbol
          SmartContract
        }
      }
      Transaction {
        Hash
      }
      Block {
        Time
      }
    }
  }
}
```

---

## Latest transfer per token (activity pulse)

One call, one **latest** transfer per token: `limitBy` on the currency contract turns the firehose into a network-wide "which tokens are moving right now" pulse — useful for screeners and discovery dashboards.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: { Transfer: { Success: true, Currency: { Native: false } } }
      limitBy: { by: Transfer_Currency_SmartContract, count: 1 }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Symbol
          SmartContract
        }
      }
    }
  }
}
```

---

## USDG stablecoin transfers

**Accounting / payments / compliance:** track Global Dollar (USDG) flows. USDG rows report `AmountInUSD: 0`, but since USDG is a dollar stablecoin, `Transfer.Amount` **is** the dollar size — filter on it directly.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0x5fc5360d0400a0fd4f2af552add042d716f1d168" }
          }
          Amount: { gt: "1000" }
          Success: true
          Sender: { not: "0x0000000000000000000000000000000000000000" }
          Receiver: { not: "0x0000000000000000000000000000000000000000" }
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Transfer_Amount }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
      Transaction {
        Hash
      }
      Block {
        Time
      }
    }
  }
}
```

### USDG 24h activity summary

Use `dataset: combined` so the full 24h window is covered regardless of the current realtime depth.

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Transfers(
      where: {
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        Transfer: {
          Currency: {
            SmartContract: { is: "0x5fc5360d0400a0fd4f2af552add042d716f1d168" }
          }
          Success: true
        }
      }
    ) {
      count
      amount: sum(of: Transfer_Amount)
      receivers: uniq(of: Transfer_Receiver)
      senders: uniq(of: Transfer_Sender)
    }
  }
}
```

---

## Tokenized stock transfers (AAPL, NVDA)

**Trading / custody:** monitor tokenized equity movements. Robinhood's stock tokens are ordinary ERC-20s here — AAPL below; swap in NVDA (`0xd0601ce1…`) or any other. Other stock tokens (GOOGL, GME, INTC, SNDK) follow the same pattern. `AmountInUSD` is `0` for these, so read `Transfer.Amount` as the **share count**.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0xaf3d76f1834a1d425780943c99ea8a608f8a93f9" }
          }
          Success: true
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
      Transaction {
        Hash
        From
        To
      }
      Block {
        Time
        Number
      }
    }
  }
}
```

:::warning Ticker symbols are not unique
Multiple contracts can share one ticker — Robinhood has **two different contracts both using the GME symbol** (`0x1b0e319c…` and `0xc2362aff…`). Always resolve and pin the `SmartContract` address (the canonical Robinhood stock tokens are named like `NVIDIA • Robinhood Token`) instead of trusting a ticker.
:::

---

## Transfers for an address

Filter where the address is either `Transfer.Sender` or `Transfer.Receiver` to build a full transfer history. Replace the sample address with your wallet or contract.

▶️ [Run in IDE](https://ide.bitquery.io/transfers-for-a-wallet-on-Robinhood)

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: {
        any: [
          {
            Transfer: {
              Sender: { is: "0xcaf681a66d020601342297493863e78c959e5cb2" }
            }
          }
          {
            Transfer: {
              Receiver: { is: "0xcaf681a66d020601342297493863e78c959e5cb2" }
            }
          }
        ]
        Transfer: { Success: true }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
          Native
        }
      }
      Transaction {
        Hash
        From
        To
      }
      Block {
        Time
        Number
      }
    }
  }
}
```

### Inbound only (deposits)

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: {
        Transfer: {
          Receiver: { is: "0xcaf681a66d020601342297493863e78c959e5cb2" }
          Success: true
        }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Symbol
          Native
          SmartContract
        }
      }
      Transaction {
        Hash
        From
        To
      }
      Block {
        Time
        Number
      }
    }
  }
}
```

### Outbound only (withdrawals)

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: {
        Transfer: {
          Sender: { is: "0xcaf681a66d020601342297493863e78c959e5cb2" }
          Success: true
        }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Symbol
          Native
          SmartContract
        }
      }
      Transaction {
        Hash
      }
      Block {
        Time
      }
    }
  }
}
```

---

## Whale transfers by USD value

**Trading / compliance:** find the largest successful transfers by `AmountInUSD`, excluding zero-address wrap/unwrap and mint/burn rows. Since only native ETH carries USD, this surfaces **large ETH moves**. For token whales, use raw-amount thresholds like the [meme-token example](#large-meme-token-transfers-by-token-amount).

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: {
        Transfer: {
          AmountInUSD: { gt: "10000" }
          Success: true
          Sender: { not: "0x0000000000000000000000000000000000000000" }
          Receiver: { not: "0x0000000000000000000000000000000000000000" }
        }
      }
      limit: { count: 20 }
      orderBy: { descending: Transfer_AmountInUSD }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Type
        Currency {
          Symbol
          Native
          SmartContract
        }
      }
      Transaction {
        Hash
        From
        To
      }
      Block {
        Time
        Number
      }
    }
  }
}
```

### Large top-level ETH value transfers

`Transfer.Type: transaction` focuses on ETH moved as the transaction value (typical for large treasury moves).

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: {
        Transfer: {
          Type: { is: transaction }
          Success: true
          AmountInUSD: { gt: "100" }
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Transfer_AmountInUSD }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Type
        Sender
        Receiver
        Currency {
          Symbol
          Native
        }
      }
      Transaction {
        Hash
        From
        To
      }
      Block {
        Time
      }
    }
  }
}
```

---

## Large meme-token transfers (by token amount)

When `AmountInUSD` is `0`, rank by raw `Transfer.Amount`. Example uses FREN (`0xd387e5bba711457faf4d013d20e02e8c91f07fa4`).

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0xd387e5bba711457faf4d013d20e02e8c91f07fa4" }
          }
          Amount: { gt: "1000000" }
          Success: true
        }
      }
      limit: { count: 20 }
      orderBy: { descending: Transfer_Amount }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Symbol
          SmartContract
        }
      }
      Transaction {
        Hash
      }
      Block {
        Time
      }
    }
  }
}
```

---

## WETH wrap/unwrap and mint/burn (zero address)

**DeFi / supply:** on Robinhood, transfers from or to the zero address are most often **WETH wrap/unwrap**. For other tokens they can also represent mints or burns. Filter by `Currency.SmartContract` when you care about one asset.

### From zero (wrap-in / mint)

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: {
        Transfer: {
          Sender: { is: "0x0000000000000000000000000000000000000000" }
          Currency: { Native: false }
          Success: true
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
      Transaction {
        Hash
      }
      Block {
        Time
      }
    }
  }
}
```

### To zero (unwrap / burn)

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: {
        Transfer: {
          Receiver: { is: "0x0000000000000000000000000000000000000000" }
          Currency: { Native: false }
          Success: true
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
      Transaction {
        Hash
      }
      Block {
        Time
      }
    }
  }
}
```

---

## Transfers between two addresses

**Compliance / accounting:** activity between two addresses (example: high-activity sample address ↔ WETH). Replace either side with the pair you care about.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: {
        any: [
          {
            Transfer: {
              Sender: { is: "0xcaf681a66d020601342297493863e78c959e5cb2" }
              Receiver: { is: "0x0bd7d308f8e1639fab988df18a8011f41eacad73" }
            }
          }
          {
            Transfer: {
              Sender: { is: "0x0bd7d308f8e1639fab988df18a8011f41eacad73" }
              Receiver: { is: "0xcaf681a66d020601342297493863e78c959e5cb2" }
            }
          }
        ]
        Transfer: { Success: true }
      }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Symbol
          Native
        }
      }
      Transaction {
        Hash
      }
      Block {
        Time
      }
    }
  }
}
```

---

## Address volume: sent vs received

**Accounting / tax / portfolio:** aggregate transfer counts and volumes for an address over the last 24 hours. Results group by currency. Use `combined` so the full day is covered regardless of realtime depth. Replace the sample address with yours.

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    sent: Transfers(
      where: {
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        Transfer: {
          Sender: { is: "0xcaf681a66d020601342297493863e78c959e5cb2" }
          Success: true
        }
      }
      limit: { count: 50 }
      orderBy: { descendingByField: "usd" }
    ) {
      Transfer {
        Currency {
          Symbol
          SmartContract
          Native
        }
      }
      count
      usd: sum(of: Transfer_AmountInUSD)
      amount: sum(of: Transfer_Amount)
    }
    received: Transfers(
      where: {
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        Transfer: {
          Receiver: { is: "0xcaf681a66d020601342297493863e78c959e5cb2" }
          Success: true
        }
      }
      limit: { count: 50 }
      orderBy: { descendingByField: "usd" }
    ) {
      Transfer {
        Currency {
          Symbol
          SmartContract
          Native
        }
      }
      count
      usd: sum(of: Transfer_AmountInUSD)
      amount: sum(of: Transfer_Amount)
    }
  }
}
```

---

## Top counterparties for an address

**Compliance / AML:** who received the most USD volume from an address in the last 24 hours. The `AmountInUSD > 0` filter limits this to native ETH flows; drop it and rank `count` (or per-token `amount`) to include token counterparties.

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Transfers(
      where: {
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        Transfer: {
          Sender: { is: "0xcaf681a66d020601342297493863e78c959e5cb2" }
          Success: true
          AmountInUSD: { gt: "0" }
        }
      }
      limit: { count: 20 }
      orderBy: { descendingByField: "usd" }
    ) {
      Transfer {
        Receiver
        Currency {
          Symbol
          Native
        }
      }
      count
      usd: sum(of: Transfer_AmountInUSD)
    }
  }
}
```

---

## Most transferred tokens (24h)

**Trading / market structure:** rank currencies by **transfer count**. Ranking by summed USD only works for native ETH (every other token sums to `0`), so activity count is the meaningful network-wide leaderboard; USD volume is kept as a secondary column.

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Transfers(
      where: {
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        Transfer: { Success: true }
      }
      limit: { count: 20 }
      orderBy: { descendingByField: "transfers" }
    ) {
      Transfer {
        Currency {
          Name
          Symbol
          SmartContract
          Native
        }
      }
      transfers: count
      usd_volume: sum(of: Transfer_AmountInUSD)
      senders: uniq(of: Transfer_Sender)
    }
  }
}
```

---

## Top receivers by ETH inflow (liquidity hubs)

**DeFi / trading:** addresses receiving the most native ETH (USD) in 24 hours — often routers, pools, or bridges. Use `combined` for the full 24h window.

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Transfers(
      where: {
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        Transfer: {
          Success: true
          Currency: { Native: true }
          AmountInUSD: { gt: "0" }
        }
      }
      limit: { count: 20 }
      orderBy: { descendingByField: "usd_in" }
    ) {
      Transfer {
        Receiver
      }
      count
      usd_in: sum(of: Transfer_AmountInUSD)
    }
  }
}
```

---

## Token accumulation: top receivers of a meme token

**Trading / analytics:** who accumulated the most units of a token over a window (exclude zero address). Use `combined` for a 48h window.

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Transfers(
      where: {
        Block: { Time: { since_relative: { hours_ago: 48 } } }
        Transfer: {
          Currency: {
            SmartContract: { is: "0xd387e5bba711457faf4d013d20e02e8c91f07fa4" }
          }
          Success: true
          Receiver: { not: "0x0000000000000000000000000000000000000000" }
        }
      }
      limit: { count: 20 }
      orderBy: { descendingByField: "amount" }
    ) {
      Transfer {
        Receiver
        Currency {
          Symbol
          SmartContract
        }
      }
      count
      amount: sum(of: Transfer_Amount)
    }
  }
}
```

---

## Unique senders and receivers for a token

**Distribution / compliance:** count distinct participants for WETH over 24 hours. Note `usd` comes back `0` here — WETH carries no USD enrichment (see [the USD note](#network-and-useful-contracts)).

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Transfers(
      where: {
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        Transfer: {
          Currency: {
            SmartContract: { is: "0x0bd7d308f8e1639fab988df18a8011f41eacad73" }
          }
          Success: true
        }
      }
    ) {
      count
      receivers: uniq(of: Transfer_Receiver)
      senders: uniq(of: Transfer_Sender)
      usd: sum(of: Transfer_AmountInUSD)
    }
  }
}
```

---

## ETH transfer size statistics (24h)

**Market microstructure:** distribution stats for native ETH transfer sizes — average, median, and 90th percentile in one aggregate call. Expect a long-tail distribution: the average typically sits far above the median.

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Transfers(
      where: {
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        Transfer: {
          Currency: { Native: true }
          Success: true
          AmountInUSD: { gt: "0" }
        }
      }
    ) {
      count
      total_usd: sum(of: Transfer_AmountInUSD)
      avg_usd: average(of: Transfer_AmountInUSD)
      median_usd: median(of: Transfer_AmountInUSD)
      p90_usd: quantile(of: Transfer_AmountInUSD, level: 0.9)
      senders: uniq(of: Transfer_Sender)
    }
  }
}
```

Also available: `standard_deviation`, other `quantile` levels, and `count(distinct: …)` for exact distinct counts (`uniq` is approximate).

---

## Hourly ETH transfer volume

**Trading / ops:** time series of native ETH transfer count and USD volume (12 hours). Use `combined` so the whole window is covered.

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Transfers(
      where: {
        Block: { Time: { since_relative: { hours_ago: 12 } } }
        Transfer: {
          Currency: { Native: true }
          Success: true
          AmountInUSD: { gt: "0" }
        }
      }
      orderBy: { ascendingByField: "Block_Time" }
      limit: { count: 12 }
    ) {
      Block {
        Time(interval: { in: hours, count: 1 })
      }
      count
      usd: sum(of: Transfer_AmountInUSD)
      eth: sum(of: Transfer_Amount)
    }
  }
}
```

---

## Daily transfer volume (7 days)

**Dashboards:** one row per day — total transfers, ETH-denominated USD volume, and how many distinct tokens moved.

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Transfers(
      where: {
        Block: { Time: { since_relative: { days_ago: 7 } } }
        Transfer: { Success: true }
      }
      limit: { count: 7 }
      orderBy: { descendingByField: "Block_Time" }
    ) {
      Block {
        Time(interval: { in: days, count: 1 })
      }
      count
      usd: sum(of: Transfer_AmountInUSD)
      tokens: uniq(of: Transfer_Currency_SmartContract)
    }
  }
}
```

Remember the USD column reflects native ETH only; token flows are counted but not USD-valued.

---

## Transfer types breakdown

Understand how transfers are classified on Robinhood (`token`, `call`, `transaction`).

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: {
        Block: { Time: { since_relative: { hours_ago: 6 } } }
        Transfer: { Success: true }
      }
      limit: { count: 10 }
      orderBy: { descendingByField: "count" }
    ) {
      Transfer {
        Type
      }
      count
    }
  }
}
```

---

## Failed transfers

**Ops / compliance:** transfers marked `Transfer.Success: false` (often tied to reverted execution). Include `Call` fields for context.

:::note Transfer Success vs Call Success
`Transfer.Success` and `Call.Success` are independent. You can see `Transfer.Success: false` with `Call.Success: true` and `Call.Reverted: true` (or other combinations). For forensics, return both.
:::

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: { Transfer: { Success: false } }
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Success
        Type
        Sender
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
      Call {
        Error
        Reverted
        Success
        Signature {
          Name
        }
      }
      Transaction {
        Hash
        From
        To
      }
      Block {
        Time
      }
    }
  }
}
```

---

## Historical transfers by date

Use `dataset: combined` (or `archive`) with `Block.Date` for ledgers and backfills. Example: large USD transfers between two calendar dates.

:::note after/before are exclusive
`Date.after: "2026-07-20"` with `Date.before: "2026-07-22"` returns **only 2026-07-21** (both bounds excluded). Use `since` / `till` when you want inclusive bounds.
:::

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Transfers(
      where: {
        Block: {
          Date: {
            after: "2026-07-20"
            before: "2026-07-22"
          }
        }
        Transfer: {
          AmountInUSD: { gt: "10000" }
          Success: true
        }
      }
      limit: { count: 20 }
      orderBy: { descending: Transfer_AmountInUSD }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Symbol
          Native
          SmartContract
        }
      }
      Transaction {
        Hash
      }
      Block {
        Time
        Date
        Number
      }
    }
  }
}
```

---

## Full transfer context (log, call, receipt)

**Forensics / indexers:** join transfer value with log signature, call path, receipt status, and gas.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: {
        Transfer: {
          Currency: { Native: false }
          Type: { is: token }
          Success: true
        }
      }
      limit: { count: 5 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Type
        Index
        Id
        Success
        Currency {
          Name
          Symbol
          SmartContract
          Native
        }
      }
      Log {
        Index
        SmartContract
        Signature {
          Name
          Signature
          SignatureHash
        }
      }
      Call {
        From
        To
        Success
        Reverted
        Signature {
          Name
        }
      }
      Receipt {
        Status
        GasUsed
      }
      Transaction {
        Hash
        From
        To
        CostInUSD
        ValueInUSD
        Gas
        GasPrice
      }
      Block {
        Number
        Time
        Hash
      }
    }
  }
}
```

---

## Response fields (quick reference)

| Group | Useful fields |
| --- | --- |
| **Transfer** | `Amount`, `AmountInUSD`, `Sender`, `Receiver`, `Type`, `Success`, `Index`, `Id`, `Currency.*` |
| **Currency** | `Name`, `Symbol`, `SmartContract`, `Native` |
| **Transaction** | `Hash`, `From`, `To`, `Value`, `ValueInUSD`, `Cost`, `CostInUSD`, `Gas`, `GasPrice` |
| **Block** | `Number`, `Time`, `Date`, `Hash` |
| **Log / Call / Receipt** | Event signature, call path, revert/error, receipt status |

Aggregations: `count` (with `distinct:`/`if:`), `sum`, `average`, `median`, `quantile`, `standard_deviation`, `uniq`, plus argmin/argmax via `Field(minimum: Other_Field)` / `Field(maximum: Other_Field)` (used above to read dataset window bounds).

For the full cube shape, see [EVM Transfers](/docs/schema/evm/transfers/).

---

## Tips for fast, useful queries

1. Always scope with `network: robinhood` and prefer a time window (`Block.Time` / `Block.Date`) on aggregates.
2. Realtime depth **varies** (anywhere from hours to days) — never assume it; use `combined` for any fixed window (24h/48h/7d) and `archive` for full history. Measure the current window with the [dataset window query](#check-the-dataset-window).
3. Filter WebSocket subscriptions in production — unfiltered Robinhood transfer streams are very noisy. Connect with the `graphql-transport-ws` subprotocol and the token in the URL ([WebSocket auth](/docs/authorization/websocket/)).
4. Use `Transfer.Success: true` unless you specifically want failed flows; check `Call.Success` / `Call.Reverted` separately when debugging.
5. `AmountInUSD` is effectively **native-ETH-only** on Robinhood transfers — use it for ETH whales; use `Amount` for USDG (≈ dollars), tokenized stocks (shares), and meme tokens.
6. Exclude the zero address when you want address-to-address or whale alerts without wrap/unwrap noise.
7. Ticker symbols collide (two GME contracts observed) — resolve and pin `Currency.SmartContract` in production.
8. Keep `limit` tight on fact queries; use `sum` / `count` / `uniq` / `median` / `quantile` for analytics instead of pulling millions of rows.
9. For live products, start from the whale, wallet-tracker, or token subscription patterns above, then backfill with `combined` / `archive` date windows.

---

## FAQ

### How do I query Robinhood transfers with GraphQL?

Use the `EVM` root with `network: robinhood` and the `Transfers` cube (same EVM Transfers API, Robinhood network). Add `dataset: realtime` for recent data, or `combined` / `archive` for longer history.

### How do I stream Robinhood transfers in real time?

Use a GraphQL `subscription` on `EVM(network: robinhood) { Transfers { ... } }` over WebSocket (`graphql-transport-ws` subprotocol). Filter by token, address, or `AmountInUSD` for whale alerts — avoid unfiltered production streams.

### How do I get whale transfers on Robinhood?

Filter `Transfer.AmountInUSD` with `gt`, set `Success: true`, and exclude the zero address — this captures large native ETH moves. For USDG and tokens (where `AmountInUSD` is `0`), filter by `Transfer.Amount` instead.

### How do I get all transfers for an address?

Use `where.any` with `Transfer.Sender` and `Transfer.Receiver` set to the same address. Split into inbound-only or outbound-only filters when you need deposits vs withdrawals, or use the [wallet-tracker subscription](#stream-transfers-for-an-address-wallet-tracker) for live updates.

### How far back does the realtime dataset go?

It varies — realtime is a rolling window of recent blocks; its depth changes over time. Measure it with the [dataset window query](#check-the-dataset-window), and switch to `combined` whenever your window must be complete.

### Why is AmountInUSD 0 for WETH, USDG, or stock tokens?

USD enrichment on the Robinhood Transfers cube effectively covers native ETH only — WETH and USDG rows return `$0` as well. Use `Transfer.Amount` (USDG ≈ dollars, stock tokens ≈ shares) or join prices from the [Trades API](/docs/blockchain/robinhood/robinhood-trades/).

### How do I get hourly or daily transfer volume?

Group with `Block { Time(interval: { in: hours, count: 1 }) }` (or `in: days`) plus `count` / `sum` aggregates on `dataset: combined` — see the [hourly](#hourly-eth-transfer-volume) and [daily](#daily-transfer-volume-7-days) examples.
