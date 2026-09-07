---
title: "Solana gRPC Stream Topics: Trades, Transfers, Balances, Pools"
description: "The six CoreCast gRPC topics for Solana, what each message carries, the filters every stream needs, and which topic answers which question."
slug: /category/topics
sidebar_label: "Topics"
keywords:
  - Solana gRPC topics
  - CoreCast topics
  - Solana gRPC stream
  - Solana dex_trades gRPC
  - Solana transfers gRPC
  - Solana balance updates gRPC
---

import FAQ from "@site/src/components/FAQ";

# Solana gRPC Stream Topics: Trades, Transfers, Balances, Pools

CoreCast, the Bitquery gRPC service for Solana at `corecast.bitquery.io`, delivers decoded chain activity as protobuf over six topics: `transactions`, `transfers`, `dex_trades`, `dex_orders`, `dex_pools` and `balances`. You subscribe to one topic per stream and must pass at least one filter (addresses, mints, value thresholds, or markets and pools), which the server applies before sending, so a stream carries only the rows you asked for. Authentication uses the same access token as the GraphQL API, sent as an `Authorization` header on each stream. This page says what each topic carries and which one answers which question; each topic page has the message schema and a runnable client.

## The six topics

| Topic | Each message is | Typical filters | Guide |
|---|---|---|---|
| `dex_trades` | One DEX trade or swap across supported protocols (Pump.fun, Raydium, Orca, Jupiter and more), with both sides, amounts and the trader | program, market, mint, trader | [DEX trades](/docs/grpc/solana/topics/dextrades) |
| `dex_orders` | An order placed, filled or cancelled on protocols that expose orders | program, market, owner | [DEX orders](/docs/grpc/solana/topics/dexorder) |
| `dex_pools` | A pool created or its liquidity changed | program, pool, mint | [DEX pools](/docs/grpc/solana/topics/dexpools) |
| `transfers` | One SOL or token transfer with sender, receiver and mint | senders, receivers, mints, minimum amount | [Transfers](/docs/grpc/solana/topics/transfer) |
| `balances` | A balance change on an account or token account | owners, accounts, mints | [Balance updates](/docs/grpc/solana/topics/balance) |
| `transactions` | A finalized transaction with instructions, logs and status | signers, program ids | [Transactions](/docs/grpc/solana/topics/transactions) |

## Which topic answers which question

| Question | Topic |
|---|---|
| Every trade on one token or one pool, as it lands | `dex_trades` with a mint or market filter |
| New pools and liquidity moves for a launchpad or DEX | `dex_pools` with a program filter |
| Wallet in, wallet out, whale alerts | `transfers` with senders, receivers and a minimum amount |
| Portfolio changes for a set of wallets | `balances` with owners |
| Everything a program did, including failed calls and logs | `transactions` with a program id |
| Limit-order style venues (placement and fills) | `dex_orders` |

Two habits save time. Filter as tightly as the question allows, because an empty filter set is rejected and a loose one costs bandwidth on both ends. And correlate across topics by transaction signature: a `dex_trades` row and the `transfers` rows behind it share it.

## Try the same rows in the IDE first

Every topic has a GraphQL subscription with the same data, so you can see the shape of a message in the [Bitquery IDE](https://ide.bitquery.io) on a free account before you write a gRPC client. This is the WebSocket twin of `dex_trades` filtered to Raydium:

```graphql
subscription {
  Solana {
    DEXTrades(
      where: { Trade: { Dex: { ProtocolFamily: { is: "Raydium" } } }, Transaction: { Result: { Success: true } } }
    ) {
      Block {
        Time
      }
      Trade {
        Dex {
          ProtocolName
        }
        Buy {
          Amount
          Currency {
            Symbol
          }
        }
        Sell {
          Amount
          Currency {
            Symbol
          }
        }
      }
      Transaction {
        Signature
      }
    }
  }
}
```

When you move to gRPC, the [introduction](/docs/grpc/solana/introduction) has a YAML quickstart, [authentication](/docs/grpc/solana/authorization) covers the token header, and [best practices](/docs/grpc/solana/best_practices) covers reconnects, error handling and filter design. Worked clients live in [Pump.fun gRPC streams](/docs/grpc/solana/examples/pump-fun-grpc-streams), [LetsBonk gRPC streams](/docs/grpc/solana/examples/letsbonk-grpc-streams) and the [copy-trading bot](/docs/grpc/solana/examples/grpc-copy-trading-bot).

<FAQ
  items={[
    { q: "Which Solana gRPC topics does Bitquery offer?", a: "Six: transactions, transfers, dex_trades, dex_orders, dex_pools and balances. Each stream subscribes to one topic and carries decoded protobuf messages for that data type." },
    { q: "Do I have to filter a gRPC stream?", a: "Yes. Every subscription needs at least one filter, such as senders, receivers, owners, program ids, mints, a minimum amount, or a market or pool. Empty filter sets are rejected, and filters are applied on the server so only matching rows are sent." },
    { q: "How do I authenticate to CoreCast?", a: "Create an access token at account.bitquery.io, the same token the GraphQL API uses, and send it as the Authorization header on every stream call. The authentication page shows the header in code." },
    { q: "Is Solana gRPC streaming on the free plan?", a: "The token works on any plan, but whether gRPC streaming is enabled for a workspace and how it is metered depends on the plan; check the introduction page and the plans section, or ask support." },
    { q: "Does Bitquery offer gRPC for chains other than Solana?", a: "Not today. gRPC streaming is Solana only; other chains stream over Kafka and WebSocket subscriptions. Contact sales for a custom gRPC setup on another chain." },
  ]}
/>

## Related pages

- [Solana gRPC introduction (CoreCast)](/docs/grpc/solana/introduction)
- [Kafka streams](/docs/category/kafka-streams)
- [Real-time streaming compared: WebSocket, Kafka and gRPC](/docs/streams/)
- [Solana DEX trades API](/docs/blockchain/Solana/solana-dextrades)
