---
title: "Arc Testnet API: Circle's Stablecoin L1 via GraphQL, WebSocket and Kafka"
description: "Arc testnet API (chain ID 5042002): trades, transfers, balances, events, calls, transactions and blocks on Circle's USDC-gas Layer 1 via Bitquery GraphQL, WebSocket streams and Kafka topics."
sidebar_position: 0
keywords:
  - Arc testnet API
  - Arc blockchain API
  - Circle Arc API
  - Arc network data API
  - Arc testnet GraphQL
  - Arc testnet WebSocket
  - Arc testnet Kafka
  - Arc testnet chain ID 5042002
  - Arc USDC gas token
  - Arc stablecoin blockchain
  - Arc testnet explorer API
  - Arc testnet Uniswap v4
  - arc_testnet
  - arc-testnet Kafka topics
  - Bitquery Arc API
---

import FAQ from "@site/src/components/FAQ";

# Arc Testnet API: Circle's Stablecoin L1 via GraphQL, WebSocket and Kafka

**Arc** is Circle's EVM-compatible Layer 1 built for stablecoin finance: **USDC is the native gas token**, blocks finalize in well under a second on the Malachite BFT consensus, and the chain carries USDC, EURC and a growing set of DeFi deployments led by Uniswap v4. Bitquery indexes the **Arc testnet** as `EVM(network: arc_testnet)` and publishes it as Kafka topics under `arc-testnet.*`, so you can build and test against the chain before mainnet with the same queries you already use on Ethereum, Base or Robinhood Chain.

This page is the map. Use it to pick the cube that answers your question, then jump to the linked guide.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

---

## Arc testnet at a glance {#network-facts}

| Property | Value |
| --- | --- |
| Bitquery network name | `arc_testnet` in `EVM(network: arc_testnet)` |
| Kafka topic prefix | `arc-testnet.` |
| Chain ID | `5042002` |
| Stack | EVM, Circle Arc Layer 1, Malachite BFT consensus |
| Gas token | USDC, tracked as `Currency.Native: true` |
| USDC (ERC-20 interface, 6 decimals) | `0x3600000000000000000000000000000000000000` |
| EURC (6 decimals) | `0x89b50855aa3be2f677cd6303cec089b5f319d72a` |
| Uniswap v4 PoolManager | `0x1d70945634f618eefdf9edaadb59b9a183cef929` |
| Public explorer | [testnet.arcscan.app](https://testnet.arcscan.app). Bitquery is an indexed data API, not an explorer or an RPC node |
| GraphQL endpoint | `https://streaming.bitquery.io/graphql` for queries and subscriptions |

---

## What is different on a testnet {#testnet-limits}

Arc testnet is indexed with the same EVM schema as every other chain, with four differences you should know before writing queries.

| Difference | What it means for your query |
| --- | --- |
| **USD values are 0** | Every `...InUSD` field (`AmountInUSD`, `PriceInUSD`, `ValueInUSD`, `CostInUSD`) returns 0. There is no token price index on a testnet. Native prices such as `Trade.Price` work, and since most pairs quote in USDC they are effectively dollar prices. |
| **Realtime dataset only** | There is no archive for the testnet. Leave the `dataset` argument out; `archive` and `combined` return errors. The realtime window is a rolling range of recent blocks; measure it with `Block { Time(minimum: Block_Time) }`. |
| **No `Trading` cubes** | `Trading.Trades`, `Tokens` and `Pairs` cover mainnet chains with USD pricing. Use the chain-level `DEXTrades` and `DEXTradeByTokens` cubes. |
| **Some cubes are unavailable** | `Holders` needs the archive and is not served. `DEXPoolEvents` and `DEXPoolSlippages` have no data yet. `Balances`, `BalanceUpdates` and `TransactionBalances` work. |

Arc **mainnet** will be indexed with USD pricing from the token price index and an archive dataset.

---

## Quick start: stream every swap on Arc testnet {#quick-start}

Paste this into the [Bitquery IDE](https://ide.bitquery.io) to watch the network trade in real time. Uniswap v4 carries most of the volume, with v3, v2, Curve and Aerodrome deployments behind it.

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-stream-dex-trades)

```graphql
subscription {
  EVM(network: arc_testnet) {
    DEXTrades {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        From
      }
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
          SmartContract
        }
        Buy {
          Amount
          Buyer
          Seller
          Price
          Currency {
            Name
            Symbol
            SmartContract
          }
        }
        Sell {
          Amount
          Buyer
          Seller
          Price
          Currency {
            Name
            Symbol
            SmartContract
          }
        }
      }
    }
  }
}
```

Change `subscription` to `query`, add `limit: {count: 10}` and `orderBy: {descending: Block_Time}`, and the same selection set returns the latest trades instead. OHLCV candles, token prices, top tokens and trader activity are on the [Arc Testnet DEX Trades API](/docs/blockchain/arc-testnet/arc-testnet-trades-api) page.

---

## Pick the right API {#pick-the-right-api}

| What you want | Use this | Guide |
| --- | --- | --- |
| Live swaps, OHLCV, token prices, top tokens, DEX breakdown, trader activity | `DEXTrades`, `DEXTradeByTokens` | [Arc Testnet DEX Trades API](/docs/blockchain/arc-testnet/arc-testnet-trades-api) |
| Who sent what to whom, wallet ledgers, large transfers, most-transferred tokens | `Transfers` | [Arc Testnet Transfers API](/docs/blockchain/arc-testnet/arc-testnet-transfers-api) |
| Any decoded contract event, new Uniswap v4/v3/v2 pools, an `eth_getLogs` replacement | `Events` | [Arc Testnet Events API](/docs/blockchain/arc-testnet/arc-testnet-events-api) |
| Method calls, internal traces, contract deployments, reverts | `Calls` | [Arc Testnet Calls & Traces API](/docs/blockchain/arc-testnet/arc-testnet-calls-api) |
| Transactions, receipts, blocks, USDC gas fees | `Transactions`, `Blocks` | [Arc Testnet Transactions, Blocks & Fees API](/docs/blockchain/arc-testnet/arc-testnet-transactions-api) |
| A wallet's portfolio, balance history, active holders, token total supply | `Balances`, `BalanceUpdates`, `TransactionBalances` | [Arc Testnet Balances & Token Supply API](/docs/blockchain/arc-testnet/arc-testnet-balances-api) |

---

## USDC on Arc: native and ERC-20 {#usdc}

USDC is both the gas token and an ERC-20 on Arc, and Bitquery tracks the two as separate currencies.

| Form | How it appears | Decimals |
| --- | --- | --- |
| Native USDC | `Currency.Native: true` with `SmartContract: "0x"` in `Transfers` and `Balances`; the zero address with name `USD Coin` in `DEXTrades` and `DEXTradeByTokens` | 18 |
| ERC-20 USDC | `SmartContract: "0x3600000000000000000000000000000000000000"`, symbol `USDC` | 6 |
| System ledger | `0xfffffffffffffffffffffffffffffffffffffffe`, no symbol, raw 18-decimal integers mirroring native movements | 0 |

Filter on `Native: true` for gas-token value transfers and on the `0x3600...` contract for the ERC-20 interface. Exclude the system ledger from token rankings. Transaction fees are in native USDC, so `Fee.SenderFee` on the [Transactions API](/docs/blockchain/arc-testnet/arc-testnet-transactions-api#gas-fees-in-usdc) is already a dollar figure.

---

## DEXes on Arc testnet {#dexes}

| Protocol | `Dex.ProtocolName` | Notes |
| --- | --- | --- |
| Uniswap v4 | `uniswap_v4` | Most swaps on the testnet. Pools live in the PoolManager singleton, so `Dex.SmartContract` is `0x1d70945634f618eefdf9edaadb59b9a183cef929` and new pools are `Initialize` events. |
| Uniswap v3 | `uniswap_v3` | Several factory deployments; `Dex.SmartContract` is the pool. |
| Uniswap v2 | `uniswap_v2` | Several factory deployments; `Dex.SmartContract` is the pair. |
| Curve | `curve_v1` | Stablecoin pools. |
| Aerodrome | `aerodrome_v1` | Light activity. |

The [DEX Trades API](/docs/blockchain/arc-testnet/arc-testnet-trades-api#trade-count-by-dex-protocol) has a live breakdown by protocol, and the [Events API](/docs/blockchain/arc-testnet/arc-testnet-events-api#new-uniswap-v4-pools) streams new pools as they are created.

---

## Real-time streams: WebSocket and Kafka {#streaming}

- **WebSocket.** Every query on every page above runs as a subscription: swap `query` for `subscription` and keep the same selection set. See [WebSocket subscriptions](/docs/subscriptions/websockets/) and [authorizing a WebSocket connection](/docs/authorization/websocket/).
- **Kafka.** For firehose-scale workloads, Arc testnet is published as protobuf topics under the `arc-testnet.` prefix: `arc-testnet.transactions.proto` (transactions, calls, events), `arc-testnet.tokens.proto` (transfers, balances), `arc-testnet.dextrades.proto` (DEX trades) and `arc-testnet.raw.proto` (raw blocks). The message schemas are the same as every other EVM chain; USD fields in the messages are 0 on the testnet. See [Kafka streaming concepts](/docs/streams/kafka-streaming-concepts/) and the [EVM protobuf streams](/docs/streams/protobuf/chains/EVM-protobuf/).

---

## Datasets and history {#datasets}

Only the **`realtime`** dataset exists for Arc testnet. It holds a rolling window of recent blocks, and its depth is not fixed, so measure it before relying on a time range:

```graphql
{
  EVM(network: arc_testnet) {
    Blocks {
      count
      earliest: Block {
        Time(minimum: Block_Time)
      }
      latest: Block {
        Time(maximum: Block_Time)
      }
    }
  }
}
```

`dataset: archive` and `dataset: combined` return errors on the testnet. The archive dataset, and with it the `Holders` cube and long time ranges, will be available for Arc mainnet.

---

<FAQ
  title="FAQ"
  items={[
    { q: "What is Arc and what is its chain ID?", id: "what-is-arc-and-what-is-its-chain-id", a: "Arc is Circle's EVM-compatible Layer 1 for stablecoin finance, with USDC as the native gas token and sub-second finality on the Malachite BFT consensus. The testnet chain ID is 5042002. In Bitquery it is EVM(network: arc_testnet). Solidity ABIs, topic0 hashes and 4-byte selectors work exactly as they do on Ethereum.",
      answer: <p>{"Arc is Circle's EVM-compatible Layer 1 for stablecoin finance, with USDC as the native gas token and sub-second finality on the Malachite BFT consensus. The testnet chain ID is "}<strong>{"5042002"}</strong>{". In Bitquery it is "}<code>{"EVM(network: arc_testnet)"}</code>{". Solidity ABIs, topic0 hashes and 4-byte selectors work exactly as they do on Ethereum."}</p> },
    { q: "Why are all USD values zero?", id: "why-are-all-usd-values-zero", a: "There is no token price index for a testnet, so every ...InUSD field is 0. Native prices such as Trade.Price are correct, and because most pairs quote in USDC they are effectively dollar prices. Arc mainnet will carry USD values from the price index.",
      answer: <p>{"There is no token price index for a testnet, so every "}<code>{"...InUSD"}</code>{" field is 0. Native prices such as "}<code>{"Trade.Price"}</code>{" are correct, and because most pairs quote in USDC they are effectively dollar prices. Arc mainnet will carry USD values from the price index."}</p> },
    { q: "How far back does Arc testnet data go?", id: "how-far-back-does-arc-testnet-data-go", a: "Only the realtime dataset exists, holding a rolling window of recent blocks. There is no archive for the testnet, so dataset: archive and dataset: combined return errors. Measure the window with a Block Time(minimum) query before assuming a range.",
      answer: <p>{"Only the "}<code>{"realtime"}</code>{" dataset exists, holding a rolling window of recent blocks. There is no archive for the testnet, so "}<code>{"dataset: archive"}</code>{" and "}<code>{"dataset: combined"}</code>{" return errors. Measure the window with the "}<a href="#datasets">{"dataset probe"}</a>{" before assuming a range."}</p> },
    { q: "Can I use the Trading cubes or the Holders cube on Arc testnet?", id: "can-i-use-the-trading-cubes-or-the-holders-cube-on-arc-testnet", a: "No. The Trading cubes cover mainnet chains with USD pricing, and Holders is served from the archive dataset. Use DEXTrades and DEXTradeByTokens for trades, and Balances grouped by address for holder rankings.",
      answer: <p>{"No. The "}<code>{"Trading"}</code>{" cubes cover mainnet chains with USD pricing, and "}<code>{"Holders"}</code>{" is served from the archive dataset. Use "}<code>{"DEXTrades"}</code>{" and "}<code>{"DEXTradeByTokens"}</code>{" for trades, and "}<a href="/docs/blockchain/arc-testnet/arc-testnet-balances-api#top-holders-of-a-token">{"BalanceUpdates summed per address"}</a>{" for holder rankings."}</p> },
    { q: "Are there Kafka topics for Arc testnet?", id: "are-there-kafka-topics-for-arc-testnet", a: "Yes. Topics are published under the arc-testnet. prefix (transactions, tokens, dextrades and raw) with the same protobuf schema as other EVM chains. USD fields in the messages are 0 on the testnet.",
      answer: <p>{"Yes. Topics are published under the "}<code>{"arc-testnet."}</code>{" prefix (transactions, tokens, dextrades and raw) with the same protobuf schema as other EVM chains. USD fields in the messages are 0 on the testnet. See the "}<a href="#streaming">{"streams section"}</a>{"."}</p> },
    { q: "Does Bitquery provide an Arc RPC endpoint, faucet or block explorer?", id: "does-bitquery-provide-an-arc-rpc-endpoint-faucet-or-block-explorer", a: "No. Bitquery is an indexed data API. Circle's testnet explorer is testnet.arcscan.app and test USDC comes from Circle's faucet. Every explorer lookup has an API equivalent here that can be queried in bulk and streamed.",
      answer: <p>{"No. Bitquery is an indexed data API. Circle's testnet explorer is "}<a href="https://testnet.arcscan.app">{"testnet.arcscan.app"}</a>{" and test USDC comes from Circle's faucet. Every explorer lookup has an API equivalent here that can be queried in bulk and streamed: address history ("}<a href="/docs/blockchain/arc-testnet/arc-testnet-transfers-api">{"Transfers"}</a>{", "}<a href="/docs/blockchain/arc-testnet/arc-testnet-balances-api">{"Balances"}</a>{"), transaction receipts ("}<a href="/docs/blockchain/arc-testnet/arc-testnet-transactions-api">{"Transactions"}</a>{"), contract logs ("}<a href="/docs/blockchain/arc-testnet/arc-testnet-events-api">{"Events"}</a>{") and internal traces ("}<a href="/docs/blockchain/arc-testnet/arc-testnet-calls-api">{"Calls"}</a>{")."}</p> },
  ]}
/>
