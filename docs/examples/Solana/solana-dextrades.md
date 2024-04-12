---
sidebar_position: 2
---

# Solana DEX Trades API

In this section we will see how to get Solana DEX trades information using our API.

This Solana API is part of our Early Access Program (EAP), which is intended for evaluation purposes. This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

## Subscribe to Latest Solana Trades

This subscription will return information about the most recent trades executed on Solana's DEX platforms.
You can find the query [here](https://ide.bitquery.io/Get-Latest-Solana-DEX-Trades-in-Realtime)

```
subscription {
  Solana {
    DEXTrades(limit: {count: 10}) {
      Trade {
        Dex {
          ProgramAddress
          ProtocolFamily
          ProtocolName
        }
        Buy {
          Amount
          Account {
            Address
          }
          Currency {
            MetadataAddress
            Key
            IsMutable
            EditionNonce
            Decimals
            CollectionAddress
            Fungible
            Symbol
            Native
            Name
          }
          Order {
            LimitPrice
            LimitAmount
            OrderId
          }
        }
        Market {
          MarketAddress
        }
        Sell {
          Account {
            Address
          }
        }
      }
      Instruction {
        Program {
          Address
          AccountNames
          Method
          Parsed
          Name
        }
      }
    }
  }
}


```

## Get all DEXes

To get the list of all DEXes operating within the Solana ecosystem, use the following query.
Find the query [here](https://ide.bitquery.io/Solana-DEXs)

```
query MyQuery {
  Solana {
    DEXTrades(limitBy: {by: Trade_Dex_ProtocolFamily, count: 1}, limit: {count: 10}) {
      Trade {
        Dex {
          ProgramAddress
          ProtocolFamily
          ProtocolName
        }
      }
    }
  }
}

```

## Get Solana DEX Orders in Real-Time

This query provides real-time updates on order events, including details about the DEX, market, and order specifics.

```
subscription {
  Solana {
    DEXOrders(limit: {count: 10}) {
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

## Get Latest Price of a Token in Real-time

This query provides real-time updates on price, including details about the DEX, market, and order specifics. Find the query [here](https://ide.bitquery.io/Latest-price-of-Ansems-cat-token-on-Solana_1)

```
subscription {
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Currency: {MintAddress: {is: "6n7Janary9fqzxKaJVrhL9TG2F61VbAtwUMu1YZscaQS"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}}
    ) {
      Block {
        Time
      }
      Trade {
        Amount
        Price
        Currency {
          Symbol
          Name
          MintAddress
        }
        Side {
          Amount
          Currency {
            Symbol
            Name
            MetadataAddress
          }
        }
        Dex {
          ProgramAddress
          ProtocolFamily
          ProtocolName
        }
        Market {
          MarketAddress
        }
        Order {
          LimitAmount
          LimitPrice
          OrderId
        }
      }
    }
  }
}

```
