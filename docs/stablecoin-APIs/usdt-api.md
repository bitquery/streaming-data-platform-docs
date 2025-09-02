---
title: "USDT API"
description: "Comprehensive guide to Bitquery USDT API with real-time transfers, compliance checks, and multi-chain analytics."
keywords:
  [
    "USDT Payments API",
    "USDT Price API",
    "USDT Reserve API",
    "USDT balance of an address",
    "USDT Top Holders",
    "real-time stablecoin transfers",
    "USDT API",
    "USDC API",
    "crypto compliance API",
    "multi-chain payments",
    "Bitquery API",
  ]
---

# USDT API

USDT (Tether) powers a large share of on-chain value transfer, payments, and trading across multiple blockchains. This page curates the most useful USDT APIs—covering price, payments (transfers), trades, reserves, and balances—along with live streams you can use in production.

Use the sections below to discover key USDT datasets, with both API and streaming options. Links point to runnable examples, and code blocks are provided as placeholders for your queries.

## USDT Price API

Get real-time and historical USDT prices, OHLCV, and moving averages across supported networks and markets.

🔗 [Stream Example](https://ide.bitquery.io/stablecoin-price-stream-of-USDT_2)  
🔗 [API Example](https://ide.bitquery.io/stablecoin-price-query-of-USDT_1)

```
 subscription {
  Trading {
    Tokens(
      where: {Interval: {Time: {Duration: {eq: 1}}}, Currency: {Id: {is: "usdt"}}}
    ) {
      Currency{
        Id
      }
      Token {
        Address
        Id
        IsNative
        Name
        Network
        Name
        Symbol
        TokenId
      }
      Block {
        Date
        Time
        Timestamp
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Volume {
        Base
        Quote
        Usd
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Close
          High
          Low
          Open
        }
        Average {
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
      }
    }
  }
}
```

```
  query {
  Trading {
    Tokens(
      limit:{count:10}
      orderBy:{descending:Block_Time}
      where: {Interval: {Time: {Duration: {eq: 1}}}, Currency: {Id: {is: "usdt"}}}
    ) {
      Currency{
        Id
      }
      Token {
        Address
        Id
        IsNative
        Name
        Network
        Name
        Symbol
        TokenId
      }
      Block {
        Date
        Time
        Timestamp
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Volume {
        Base
        Quote
        Usd
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Close
          High
          Low
          Open
        }
        Average {
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
      }
    }
  }
}
```

## USDT Payments API

Track live USDT stablecoin transfers. USDT is ideal for payments, settlements, etc and you can track those in real-time using this API/Stream -

🔗 [Stream Example](https://ide.bitquery.io/USDT-token-Transfers-stream-on-solana)  
🔗 [API Example](https://ide.bitquery.io/USDT-token-Transfers-api-on-solana)

```
subscription {
  Solana {
    Transfers(
      where: {Transfer: {Currency: {MintAddress: {in: ["Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"]}}}}
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender {
          Address
          Owner
        }
        Receiver {
          Address
          Owner
        }
        Currency {
          Symbol
          Name
          MintAddress
        }
      }
      Instruction {
        Program {
          Method
        }
      }
      Block {
        Time
        Height
        Slot
      }
      Transaction {
        Signature
        Signer
        Fee
        FeeInUSD
        FeePayer
      }
    }
  }
}
```

```
{
  Solana {
    Transfers(
      orderBy: {descending: Block_Time}
      limit: {count: 100}
      where: {Transfer: {Currency: {MintAddress: {is: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"}}}}
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender {
          Address
          Owner
        }
        Receiver {
          Address
          Owner
        }
        Currency {
          Symbol
          Name
          MintAddress
        }
      }
      Instruction {
        Program {
          Method
        }
      }
      Block {
        Time
        Height
        Slot
      }
      Transaction {
        Signature
        Signer
        Fee
        FeeInUSD
        FeePayer
      }
    }
  }
}
```

## USDT Trades API

Analyze USDT trading activity on DEXs.

Below example is to track USDT trading activity on Solana.

🔗 [Stream Example](https://ide.bitquery.io/solana-trades-subscription_10_1)  
🔗 [API Example](https://ide.bitquery.io/solana-USDT-trades-query)

```
subscription {
  Solana {
    DEXTrades (where:{any:[{Trade:{Buy:{Currency:{MintAddress:{is:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"}}}}},{Trade:{Sell:{Currency:{MintAddress:{is:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"}}}}}]}){
      Block{
        Time
        Slot
      }
      Transaction{
        Signature
        Index
        Result{
          Success
        }
      }
      Trade {
        Index
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
            MintAddress
            IsMutable
            EditionNonce
            Decimals
            CollectionAddress
            Fungible
            Symbol
            Native
            Name
          }
          Price
          PriceInUSD
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
          Currency {
            IsMutable
            Decimals
            CollectionAddress
            Fungible
            Symbol
            Native
            Name
          }
          Price
          PriceInUSD
        }
      }
    }
  }
}
```

```
query {
  Solana {
    DEXTrades (
      limit:{count:100}
      orderBy:{descending:Block_Time}
      where:{any:[{Trade:{Buy:{Currency:{MintAddress:{is:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"}}}}},{Trade:{Sell:{Currency:{MintAddress:{is:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"}}}}}]}){
      Block{
        Time
        Slot
      }
      Transaction{
        Signature
        Index
        Result{
          Success
        }
      }
      Trade {
        Index
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
            MintAddress
            IsMutable
            EditionNonce
            Decimals
            CollectionAddress
            Fungible
            Symbol
            Native
            Name
          }
          Price
          PriceInUSD
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
          Currency {
            IsMutable
            Decimals
            CollectionAddress
            Fungible
            Symbol
            Native
            Name
          }
          Price
          PriceInUSD
        }
      }
    }
  }
}
```

## USDT Reserve API

Monitor USDT reserve or get lateast reserve value on Solana using below Stream/API.

🔗 [Stream Example](https://ide.bitquery.io/USDT-Stablecoin-reserves-on-Solana)  
🔗 [API Example](https://ide.bitquery.io/USDT-Stablecoin-reserves-on-Solana--query)

```
subscription{
  Solana {
    TokenSupplyUpdates(
      where: {TokenSupplyUpdate: {Currency: {MintAddress: {is: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"}}}}
    ) {
      TokenSupplyUpdate {
        Amount
        Currency {
          MintAddress
          Name
        }
        PreBalance
        PostBalance
      }
    }
  }
}
```

```
{
  Solana {
    TokenSupplyUpdates(
      limit:{count:1}
      orderBy:{descending:Block_Time}
      where: {TokenSupplyUpdate: {Currency: {MintAddress: {is: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"}}}}
    ) {
      TokenSupplyUpdate {
        Amount
        Currency {
          MintAddress
          Name
        }
        PreBalance
        PostBalance
      }
    }
  }
}
```

## USDT Balance API

Query USDT holders, balances over time, and distribution metrics (e.g., whales, concentration, first-time receivers). Great for compliance, growth, and analytics.

### USDT Balance of an address

🔗 [API Example](https://ide.bitquery.io/USDT-balance-of-an-address)

```
query MyQuery {
  Solana {
    BalanceUpdates(
      where: {BalanceUpdate: {Account: {Owner: {is: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"}}, Currency: {MintAddress: {is: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"}}}}
      orderBy: {descendingByField: "BalanceUpdate_Balance_maximum"}
    ) {
      BalanceUpdate {
        Balance: PostBalance(maximum: Block_Slot)
        Currency {
          Name
          Symbol
        }
      }
    }
  }
}
```

### USDT Top Holders

🔗 [API Example](https://ide.bitquery.io/top-100-holders-of-USDT-token-on-Solana_1)

```
query MyQuery {
  Solana(dataset: realtime, network: solana, aggregates: yes) {
    BalanceUpdates(
      limit:{count:100}
      orderBy: {descendingByField: "BalanceUpdate_Holding_maximum"}
      where: {BalanceUpdate: {Currency: {MintAddress: {is: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"}}}, Transaction: {Result: {Success: true}}}
    ) {
      BalanceUpdate {
        Currency {
          Name
          MintAddress
          Symbol
        }
        Account {
          Address
        }
        Holding: PostBalance(maximum: Block_Slot, selectWhere: {gt: "0"})
      }
    }
  }
}
```

---

### Notes & Best Practices

- Prefer subscriptions (streams) for real-time detection (payments, trades).
- Use date ranges and pagination for historical analyses at scale.
- Join across entities (holders, transfers, trades) to build richer analytics.
- For multi-chain setups, run identical queries across networks and unify downstream.

Need help crafting a query or subscription? Message us on [support](https://t.me/Bloxy_info).
