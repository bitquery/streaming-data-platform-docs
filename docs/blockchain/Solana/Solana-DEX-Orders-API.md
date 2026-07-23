---
title: "Solana DEX Orders API"
description: "Solana DEX Orders API: query and stream Solana on-chain data with Bitquery GraphQL examples for developers. Scale further with Kafka or gRPC streams."
---
import FAQ from "@site/src/components/FAQ";

# Solana DEX Orders API

:::tip Need real-time Solana DEX orders data or anything from the last ~30 days?
For **real-time + last ~30 days**, use the [**Trading cube**](/docs/trading/trading-data-overview) — [`Trading.Trades`](/docs/trading/crypto-trades-api/trades-api) gives you clean, MEV-filtered Solana DEX orders swaps with **USD price, market cap, and supply on every row** across **9 chains in one API**. Use this page when you need **historical Solana DEX orders data older than ~30 days**, raw per-swap detail, or call / event context.
:::

In this section, you'll learn how to access Solana-based decentralized exchange (DEX) trading data using our DEX Orders API.

import VideoPlayer from "../../../src/components/videoplayer.js";

## Get Solana DEX Orders in Real-Time

This query provides real-time updates on order events, including details about the DEX, market, and order specifics. You can run the query [here](https://ide.bitquery.io/Copy-of-Solana-DEX-trades-API)

```
subscription {
  Solana {
    DEXOrders {
      Instruction {
        Index
        Program {
          Address
          AccountNames
          Name
          Method
        }
      }
      OrderEvent {
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
        Index
        Market {
          MarketAddress
          CoinToken {
            Wrapped
            VerifiedCollection
            Uri
            UpdateAuthority
            TokenStandard
            Symbol
            TokenCreator {
              Share
              Address
            }
            Name
            Key
            Fungible
            CollectionAddress
          }
          PriceToken {
            Wrapped
            VerifiedCollection
            Uri
            TokenStandard
            Native
            Name
            MetadataAddress
            Key
            Fungible
            Decimals
            CollectionAddress
          }
        }
        Order {
          BuySide
          Account
          Payer
          OrderId
          Owner
        }
        Type
      }
    }
  }
}

```

## Latest DEX Orders of a Token

To fetch the most recent orders for a specific token, filter using the token's `MintAddress`. Replace the example address in the query with the target token's address.

You can run the query [here](https://ide.bitquery.io/Latest-DEXOrders-for-token-on-Solana)

```
{
  Solana(dataset: realtime) {
    DEXOrders(
      where: {OrderEvent: {Market: {BaseCurrency: {MintAddress: {is: "6kdU2J4pSxG2w1sBLqrtE8BCisQwa3t12hRdkb13JGeu"}}}}}
      orderBy: {descending: Block_Time}
    ) {
      OrderEvent {
        Dex {
          ProtocolName
          ProgramAddress
        }
        Index
        Market {
          MarketAddress
          QuoteCurrency {
            Name
            Symbol
            MintAddress
          }
          BaseCurrency {
            Name
            MintAddress
          }
        }
        Order {
          Account
          BuySide
          LimitPrice
          LimitAmount
          OrderId
        }
      }
    }
  }
}

```

## DEX Orders Above a Limit Price

You can filter orders based on specific price conditions, such as all orders with a `LimitPrice` greater than a specified value. Modify the price threshold and token address as needed.

You can run the query [here](https://ide.bitquery.io/LimitPrice-DEXOrders-for-token-on-Solana)

```
{
  Solana(dataset: realtime) {
    DEXOrders(
      where: {OrderEvent: {Market: {BaseCurrency: {MintAddress: {is: "6kdU2J4pSxG2w1sBLqrtE8BCisQwa3t12hRdkb13JGeu"}}}, Order: {LimitPrice: {gt: "0.068"}}}}
      orderBy: {descending: Block_Time}
    ) {
      OrderEvent {
        Dex {
          ProtocolName
          ProgramAddress
        }
        Index
        Market {
          MarketAddress
          QuoteCurrency {
            Name
            Symbol
            MintAddress
          }
          BaseCurrency {
            Name
            MintAddress
          }
        }
        Order {
          Account
          BuySide
          LimitPrice
          LimitAmount
          OrderId
        }
      }
    }
  }
}

```

## Latest Open Orders on Solana

This query retrieves the latest open orders on Solana-based DEXs. Open orders are those that have been created but not yet executed or canceled.

You can run the query [here](https://ide.bitquery.io/Latest-Open-DEX-Orders-Solana)

```
{
  Solana(dataset: realtime) {
    DEXOrders(
      where: {OrderEvent: {Type: {is: Open}}}
      orderBy: {descending: Block_Time}
    ) {
      OrderEvent {
        Dex {
          ProtocolName
          ProgramAddress
        }
        Index
        Market {
          MarketAddress
          QuoteCurrency {
            Name
            Symbol
            MintAddress
          }
          BaseCurrency {
            Name
            MintAddress
          }
        }
        Order {
          Account
          BuySide
          LimitPrice
          LimitAmount
          OrderId
        }
      }
    }
  }
}

```

## Latest OpenBook DEX Orders

This query fetches the latest orders from the OpenBook DEX on Solana, providing comprehensive information about the DEX protocol, market, order specifics, and transaction details. OpenBook is an exchange protocol offering central limit orderbook for top Solana DeFi protocols.
You can run the query [here](https://ide.bitquery.io/Latest-Openbook-DEX-Orders#)

```
{
  Solana(dataset: realtime) {
    DEXOrders(
      where: {OrderEvent: {Dex: {ProgramAddress: {is: "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX"}}}}
      orderBy: {descending: Block_Time}
    ) {
      OrderEvent {
        Dex {
          ProtocolName
          ProgramAddress
        }
        Type
        Order {
          Account
          BuySide
          LimitPrice
          LimitAmount
          OrderId
        }
        Market {
          MarketAddress
          QuoteCurrency {
            Name
            Symbol
            MintAddress
          }
          BaseCurrency {
            Name
            MintAddress
          }
        }
        Index
      }
      Transaction {
        Signature
      }
      Block {
        Time
        Hash
      }
    }
  }
}

```

## Video Tutorials

<VideoPlayer url="https://youtu.be/altkxftGzxU" />

<FAQ
  items={[
    { q: "What are Solana DEX orders in Bitquery?", a: "On-chain limit-order and order-book style events from supported DEXs, indexed for query and subscription." },
    { q: "How do I filter orders by market?", a: "Use the order fields and filters shown in the examples on this page." },
  ]}
/>
