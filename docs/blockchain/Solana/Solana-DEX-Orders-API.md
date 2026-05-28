# Solana DEX Orders API

:::tip Need real-time Solana DEX orders data or anything from the last ~30 days?
For **real-time + last ~30 days**, use the [**Trading cube**](https://docs.bitquery.io/docs/trading/trading-data-overview) — [`Trading.Trades`](https://docs.bitquery.io/docs/trading/crypto-trades-api/trades-api) gives you clean, MEV-filtered Solana DEX orders swaps with **USD price, market cap, and supply on every row** across **8 chains in one API**. Use this page when you need **historical Solana DEX orders data older than ~30 days**, raw per-swap detail, or call / event context.
:::


In this section, you'll learn how to access Solana-based decentralized exchange (DEX) trading data using our DEX Orders API.

<head>
<meta name="title" content="Solana DEX Orders API | Access Raydium, Jupiter Data"/>
<meta name="description" content="Retrieve on-chain liquidity pool and trading pair data from Solana-based DEXs like Raydium and Jupiter using our DEX Orders API."/>
<meta name="keywords" content="Solana DEX Orders API, Solana DEX Orders Python API, Solana DEX Orders Token API, Solana DEX Orders NFT API, DEX Orders Scan API, DEX Orders API Docs, Solana Web3 API, Solana Blockchain API"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:title" content="Solana DEX Orders API | Access Raydium, Jupiter Data" />
<meta property="og:description" content="Retrieve on-chain liquidity pool and trading pair data from Solana-based DEXs like Raydium and Jupiter using our DEX Orders API." />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Solana DEX Orders API | Access Raydium, Jupiter Data" />
<meta property="twitter:description" content="Retrieve on-chain liquidity pool and trading pair data from Solana-based DEXs like Raydium and Jupiter using our DEX Orders API." />
</head>

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
