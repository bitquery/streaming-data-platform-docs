---
sidebar_position: 2
---

# Tron DEX Trades API

**Tron DEX Trades** help you see **who swapped what, when, and at what price** on Tron decentralized exchanges which is useful for dashboards, alerts, research, and trading tools. The examples below are ready-to-run **GraphQL** queries and subscriptions you can copy into the [Bitquery IDE](https://ide.bitquery.io). You can also stream at scale via [Apache Kafka](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/).

<head>
<meta name="title" content="How to Get Tron Decentralized Exchange Data with DEX Trades API"/>
<meta name="description" content="Get on-chain data of any Tron based DEX through our DEX Trades API."/>
<meta name="keywords" content="Tron DEX Trades api,Tron DEX Trades python api,Tron DEX Trades token api,Tron Dex NFT api, DEX Trades scan api, DEX Trades api, DEX Trades api docs, DEX Trades crypto api, DEX Trades blockchain api,Tron network api, Tron web3 api, tronscan api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to Get Tron Decentralized Exchange Data with DEX Trades API"
/>
<meta
  property="og:description"
  content="Get on-chain data of any Tron based DEX through our DEX Trades API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to Get Tron Decentralized Exchange Data with DEX Trades API" />
<meta property="twitter:description" content="Get on-chain data of any Tron based DEX through our DEX Trades API." />
</head>

## Live DEX swap stream (Tron) {#crypto-trades-live-stream}

[Crypto Trades API](/docs/trading/crypto-trades-api/trades-api): one row per swap, with USD and supply. Filter **`Pair.Market.Network: Tron`**. [When to use this vs chain DEX APIs](/docs/cubes/dextrades-dextradebytokens-trading-trades).

Run this subscription [in the Bitquery IDE](https://ide.bitquery.io/Get-All-DEX-Trades-on-Tron-With-Price-Market-Cap-and-Supply).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Trading {
    Trades(where: { Pair: { Market: { Network: { is: "Tron" } } } }) {
      Side
      Supply {
        MaxSupply
        TotalSupply
        FullyDilutedValuationUsd
        CirculatingSupply
        MarketCap
      }
      Trader {
        Address
      }
      TransactionHeader {
        Fee
        FeePayer
        Sender
        To
        Hash
        Index
      }
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
        Quote
      }
      Block {
        Date
        Time
        Timestamp
      }
      Pair {
        Currency {
          Id
          Name
          Symbol
        }
        Market {
          Address
          Program
          Network
        }
        QuoteCurrency {
          Id
          Name
          Symbol
        }
        Token {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
        QuoteToken {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
      }
      Price
      PriceInUsd
    }
  }
}
```

</details>

## Subscribe to Latest Tron Trades

This example uses the chain-specific **DEXTrades** cube via `Tron { DEXTrades }`. For trader + USD swap rows, use the [stream at the top](#crypto-trades-live-stream).

You can try the query [here](https://ide.bitquery.io/Latest-trades-on-Tron)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Tron {
    DEXTrades {
      Block {
        Time
      }
      Trade {
        Dex {
          ProtocolName
          ProtocolFamily
          SmartContract
        }
        Buy {
          Amount
          Buyer
          Seller
          Currency {
            Decimals
            Fungible
            HasURI
            Name
            ProtocolName
            SmartContract
            Symbol
          }
          OrderId
        }
        Sell {
          Buyer
          Seller
          Currency {
            Fungible
            Decimals
            Name
            Native
            SmartContract
            Symbol
          }
        }
      }
    }
  }
}
```

</details>

## Get Token Stats like buyers, sellers, makers, total trades, total volume, buy volume, sell volume

This query fetches you all the important token statistics such as number of buyers, sellers, makers, total trades, total volume, buy volume, sell volume. Try the query [here](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-a-tron-pair)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery( $token: String,$pairAddress: String , $min5_timestamp: DateTime, $hr1_timestamp: DateTime) {
  Tron {
    DEXTradeByTokens(
      where: {TransactionStatus: {Success: true}, Trade: {Currency: {SmartContract: {is: $token}}, Dex: {SmartContract: {is: $pairAddress}}}, Block: {Time: {since: $hr1_timestamp}}}
    ) {
      Trade {
        Currency {
          Name
          SmartContract
          Symbol
        }
        startPrice: PriceInUSD(minimum: Block_Time)
        Price_at_min5: PriceInUSD(
          minimum: Block_Time
          if: {Block: {Time: {after: $min5_timestamp}}}
        )
        current_price: PriceInUSD(maximum: Block_Time)
        Dex {
          ProtocolName
          ProtocolFamily
          SmartContract
        }
        Side {
          Currency {
            Symbol
            Name
            SmartContract
          }
        }
      }
      makers: count(distinct: Transaction_From)
      makers_5min: count(
        distinct: Transaction_From
        if: {Block: {Time: {after: $min5_timestamp}}}
      )
      buyers: count(
        distinct: Transaction_From
        if: {Trade: {Side: {Type: {is: sell}}}}
      )
      buyers_5min: count(
        distinct: Transaction_From
        if: {Trade: {Side: {Type: {is: sell}}}, Block: {Time: {after: $min5_timestamp}}}
      )
      sellers: count(
        distinct: Transaction_From
        if: {Trade: {Side: {Type: {is: buy}}}}
      )
      sellers_5min: count(
        distinct: Transaction_From
        if: {Trade: {Side: {Type: {is: buy}}}, Block: {Time: {after: $min5_timestamp}}}
      )
      trades: count
      trades_5min: count(if: {Block: {Time: {after: $min5_timestamp}}})
      traded_volume: sum(of: Trade_Side_AmountInUSD)
      traded_volume_5min: sum(
        of: Trade_Side_AmountInUSD
        if: {Block: {Time: {after: $min5_timestamp}}}
      )
      buy_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}}
      )
      buy_volume_5min: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}, Block: {Time: {after: $min5_timestamp}}}
      )
      sell_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}}
      )
      sell_volume_5min: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}, Block: {Time: {after: $min5_timestamp}}}
      )
      buys: count(if: {Trade: {Side: {Type: {is: sell}}}})
      buys_5min: count(
        if: {Trade: {Side: {Type: {is: sell}}}, Block: {Time: {after: $min5_timestamp}}}
      )
      sells: count(if: {Trade: {Side: {Type: {is: buy}}}})
      sells_5min: count(
        if: {Trade: {Side: {Type: {is: buy}}}, Block: {Time: {after: $min5_timestamp}}}
      )
    }
  }
}
{
  "token": "put token address here",
  "pairAddress": "put pair address here",
  "hr1_timestamp": "2024-11-14T03:20:00Z",
  "min5_timestamp": "2024-11-14T04:15:00Z"
}
```

</details>

## Get Top gainer tokens on Tron Network

This query fetches you the top gainer tokens on Tron network.
You can try the query [here](https://ide.bitquery.io/top-gainers_1).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Tron {
    DEXTradeByTokens(
      where: {Transaction: {Result: {Success: true}}}
      orderBy: {descendingByField: "usd"}
      limit: {count: 100}
    ) {
      Trade {
        Currency {
          Symbol
          Name
          SmartContract
        }
        Side {
          Currency {
            Symbol
            Name
            SmartContract
          }
        }
        price_last: PriceInUSD(maximum: Block_Number)
        price_1h_ago: PriceInUSD(minimum: Block_Number)
      }
      dexes: uniq(of: Trade_Dex_OwnerAddress)
      amount: sum(of: Trade_Side_Amount)
      usd: sum(of: Trade_Side_AmountInUSD)
      buyers: uniq(of: Trade_Buyer)
      sellers: uniq(of: Trade_Seller)
      count(selectWhere: {ge: "100"})
    }
  }
}
```

</details>

![image](https://github.com/user-attachments/assets/59eae28e-bfdd-42ea-b942-fd0c9facf583)

You can check the data here on [DEXrabbit](https://dexrabbit.com/tron).

## Get Top bought tokens on Tron Network

This query fetches you the top bought tokens on Tron network.
You can try the query [here](https://ide.bitquery.io/top-bought).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Tron {
    DEXTradeByTokens(
      orderBy: {descendingByField: "buy"}
      where: {Transaction: {Result: {Success: true}}}
      limit: {count: 100}
    ) {
      Trade {
        Currency {
          Symbol
          Name
          SmartContract
        }
      }
      buy: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: buy}}}})
      sell: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: sell}}}})
    }
  }
}
```

</details>

Arranged in the descending order of `bought - sold` on [DEXrabbit](https://dexrabbit.com/tron).

![image](https://github.com/user-attachments/assets/e3dcd6e7-7ee8-469b-a2ee-de1a3ce63e78)

You can check the data here on [DEXrabbit](https://dexrabbit.com/tron).

## Get Top sold tokens on Tron Network

This query fetches you the top sold tokens on Tron network.
You can try the query [here](https://ide.bitquery.io/top-sold).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Tron {
    DEXTradeByTokens(
      orderBy: {descendingByField: "sell"}
      where: {Transaction: {Result: {Success: true}}}
      limit: {count: 100}
    ) {
      Trade {
        Currency {
          Symbol
          Name
          SmartContract
        }
      }
      buy: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: buy}}}})
      sell: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: sell}}}})
    }
  }
}
```

</details>

Arranged in the descending order of `sold - bought` on [DEXrabbit](https://dexrabbit.com/tron).

![image](https://github.com/user-attachments/assets/fc1e4ae8-8ef9-41c8-bf08-175000cac870)

You can check the data here on [DEXrabbit](https://dexrabbit.com/tron).

## Get OHLC data of a token on Tron Network

This query fetches you the OHLC data of a specific token on Tron network.
You can try the query [here](https://ide.bitquery.io/ohlc0_5).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query tradingViewPairs($token: String, $base: String) {
  Tron {
    DEXTradeByTokens(
      orderBy: {ascendingByField: "Block_Time"}
      where: {Trade: {Side: {Amount: {gt: "0"}, Currency: {SmartContract: {is: $base}}}, Currency: {SmartContract: {is: $token}}, PriceAsymmetry: {lt: 0.1}}}
    ) {
      Block {
        Time(interval: {count: 5, in: minutes})
      }
      Trade {
        open: PriceInUSD(minimum: Block_Number)
        close: PriceInUSD(maximum: Block_Number)
        max: PriceInUSD(maximum: Trade_PriceInUSD)
        min: PriceInUSD(minimum: Trade_PriceInUSD)
      }
      volume: sum(of: Trade_Side_Amount)
    }
  }
}
{
  "token": "TJ9mxWPmQSJswqMakEehFWcAntg73odiAq",
  "base": "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR"
}
```

</details>

![image](https://github.com/user-attachments/assets/5ed90e34-a6ed-4c9b-a458-30d81a19d9f1)

You can check the data here on [DEXrabbit](https://dexrabbit.com/tron/pair/TJ9mxWPmQSJswqMakEehFWcAntg73odiAq/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR).

## Get Latest Trades of a token on Tron Network

This query fetches you the latest trades of a specific token on Tron network.
You can try the query [here](https://ide.bitquery.io/latest-trades_3).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query LatestTrades($token: String, $base: String) {
  Tron {
    DEXTradeByTokens(
      orderBy: {descending: Block_Time}
      limit: {count: 50}
      where: {Trade: {Side: {Amount: {gt: "0"}, Currency: {SmartContract: {is: $base}}}, Currency: {SmartContract: {is: $token}}, Price: {gt: 0}}, Transaction: {Result: {Success: true}}}
    ) {
      Block {
        allTime: Time
      }
      Trade {
        Dex {
          OwnerAddress
          ProtocolFamily
          ProtocolName
        }
        Currency {
          Symbol
          SmartContract
          Name
        }
        Price
        AmountInUSD
        Amount
        Side {
          Type
          Currency {
            Symbol
            SmartContract
            Name
          }
          AmountInUSD
          Amount
        }
      }
    }
  }
}
{
  "token": "TJ9mxWPmQSJswqMakEehFWcAntg73odiAq",
  "base": "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR"
}
```

</details>

![image](https://github.com/user-attachments/assets/af073bde-0e9e-45cf-8d27-bd9176d7bf73)

You can check the data here on [DEXrabbit](https://dexrabbit.com/tron/pair/TJ9mxWPmQSJswqMakEehFWcAntg73odiAq/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR#pair_latest_trades).

## Get Top Traders of a token on Tron Network

This query fetches you the top traders of a specific token on Tron network.
You can try the query [here](https://ide.bitquery.io/top-traders_6).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query TopTraders($token: String, $base: String) {
  Tron {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {SmartContract: {is: $token}}, Side: {Amount: {gt: "0"}, Currency: {SmartContract: {is: $base}}}}, Transaction: {Result: {Success: true}}}
    ) {
      Trade {
        Dex {
          OwnerAddress
          ProtocolFamily
          ProtocolName
        }
      }
      bought: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: buy}}}})
      sold: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: sell}}}})
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
{
  "token": "TJ9mxWPmQSJswqMakEehFWcAntg73odiAq",
  "base": "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR"
}
```

</details>

![image](https://github.com/user-attachments/assets/f40658bd-aa9f-4c32-bcf3-792c098ea66e)

You can check the data here on [DEXrabbit](https://dexrabbit.com/tron/pair/TSig7sWzEL2K83mkJMQtbyPpiVSbR6pZnb/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR#pair_top_traders).

## Get Top Buyers of a token on Tron Network

This query fetches you the top 10 buyers of a specific token on Tron network.
You can try the query [here](https://ide.bitquery.io/top-buyers-of-token---Tron_1).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Tron {
    DEXTradeByTokens(
      orderBy: {descendingByField: "bought"}
      limit: {count: 10}
      where: {Trade: {Currency: {SmartContract: {is: "TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT"}}}, TransactionStatus: {Success: true}}
    ) {
      Trade {
        Buyer
        Currency {
          Symbol
          Name
          SmartContract
        }
      }
      bought: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: sell}}}})
    }
  }
}
```

</details>

## Get Top Sellers of a token on Tron Network

This query fetches you the top 10 sellers of a specific token on Tron network.
You can try the query [here](https://ide.bitquery.io/top-sellers-of-token---Tron_3).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Tron {
    DEXTradeByTokens(
      orderBy: {descendingByField: "sold"}
      limit: {count: 10}
      where: {Trade: {Currency: {SmartContract: {is: "TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT"}}}, TransactionStatus: {Success: true}}
    ) {
      Trade {
        Buyer
        Currency {
          Symbol
          Name
          SmartContract
        }
      }
      sold: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: buy}}}})
    }
  }
}
```

</details>

## Get DEX markets for a specific Token

This query fetches you the DEXs where a specific token is being traded on Tron network.
You can try the query [here](https://ide.bitquery.io/DEX-Markets-for-a-token_1).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query ($token: String, $base: String, $time_10min_ago: DateTime, $time_1h_ago: DateTime, $time_3h_ago: DateTime) {
  Tron {
    DEXTradeByTokens(
      orderBy: {descendingByField: "amount"}
      where: {Trade: {Currency: {SmartContract: {is: $token}}, Side: {Amount: {gt: " "}, Currency: {SmartContract: {is: $base}}}}, Transaction: {Result: {Success: true}}, Block: {Time: {after: $time_3h_ago}}}
    ) {
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
        }
        price_last: PriceInUSD(maximum: Block_Number)
        price_10min_ago: PriceInUSD(
          maximum: Block_Number
          if: {Block: {Time: {before: $time_10min_ago}}}
        )
        price_1h_ago: PriceInUSD(
          maximum: Block_Number
          if: {Block: {Time: {before: $time_1h_ago}}}
        )
        price_3h_ago: PriceInUSD(minimum: Block_Number)
      }
      amount: sum(of: Trade_Side_Amount)
      pairs: uniq(of: Trade_Side_Currency_SmartContract)
      trades: count
    }
  }
}
{
  "token": "TSig7sWzEL2K83mkJMQtbyPpiVSbR6pZnb",
  "base": "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR",
  "time_10min_ago": "2024-09-20T08:36:40Z",
  "time_1h_ago": "2024-09-20T07:46:40Z",
  "time_3h_ago": "2024-09-20T05:46:40Z"
}
```

</details>

![image](https://github.com/user-attachments/assets/cf2e2b29-8a15-41d1-bbef-41339fd41f60)

You can check the data here on [DEXrabbit](https://dexrabbit.com/tron/pair/TSig7sWzEL2K83mkJMQtbyPpiVSbR6pZnb/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR#pair_dex_list).

## Get All DEXs info on Tron network

This query fetches you all the DEXs information on Tron network such as unique sellers, unique buyers etc.
You can try the query [here](https://ide.bitquery.io/all-dexs-info).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query DexMarkets {
  Tron {
    DEXTradeByTokens {
      Trade {
        Dex {
          ProtocolFamily
        }
      }
      buyers: uniq(of: Trade_Buyer)
      sellers: uniq(of: Trade_Sender)
      count(if: {Trade: {Side: {Type: {is: buy}}}})
    }
  }
}
```

</details>

![image](https://github.com/user-attachments/assets/01287a30-53e1-4ffa-b5fc-828009282ac5)

You can check the data here on [DEXrabbit](https://dexrabbit.com/tron/dex_market).

## Get Top Traders on Tron network

This query fetches you TOp Traders information on Tron network.
You can try the query [here](https://ide.bitquery.io/top-traders-on-tron-network).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query DexMarkets {
  Tron {
    DEXTradeByTokens(orderBy: {descendingByField: "trades"}, limit: {count: 100}) {
      Trade {
        Dex {
          OwnerAddress
        }
      }
      trades: count(if: {Trade: {Side: {Type: {is: buy}}}})
      tokens: uniq(of: Trade_Currency_SmartContract)
    }
  }
}
```

</details>

![image](https://github.com/user-attachments/assets/1184d54f-47db-428f-8f71-cd0c591a310b)

You can check the data here on [DEXrabbit](https://dexrabbit.com/tron/trader).

## Subscribe to Latest Price of a Token in Real-time

This query provides real-time updates on price of token `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t` in terms of USDT `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`, including details about the DEX. Try the query [here](https://ide.bitquery.io/Track-price-of-a-tron-token-in-realtime)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription MyQuery {
  Tron {
    DEXTradeByTokens(
      where: {Trade: {Currency: {SmartContract: {is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"}}}, TransactionStatus: {Success: true}}
    ) {
      Block {
        Time
      }
      Trade {
        Amount
        AmountInUSD
        Buyer
        Price
        PriceInUSD
        Seller
        Currency {
          Symbol
          SmartContract
          Name
        }
        Dex {
          SmartContract
          ProtocolName
          ProtocolFamily
        }
        Side {
          Amount
          AmountInUSD
          Buyer
          Seller
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

</details>

## Stablecoin Peg Health (Latest Price Across All DEXs)

Get the **latest price of a stablecoin across all Tron DEXs**. Returns one row per DEX protocol with the most recent trade price. Useful for monitoring peg health and identifying which exchanges have the stablecoin trading closest to its target peg (e.g., $1.00 for USD-pegged stablecoins).

[Run in Bitquery IDE](https://ide.bitquery.io/peg-health-tron)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Tron {
    DEXTradeByTokens(
      orderBy: {descending: Block_Time}
      limitBy: {count: 1 by:Trade_Dex_SmartContract}
      where: {Trade: { Currency: {SmartContract: {is: "TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT"}}}}
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Trade {
        Amount
        AmountInUSD
        Price
        PriceInUSD
        Currency {
          Name
          SmartContract
          Symbol
        }
        Dex {
          ProtocolName
          ProtocolFamily
          SmartContract
        }
        Side {
          Type
          Currency {
            Name
            SmartContract
            Symbol
          }
          AmountInUSD
          Amount
        }
      }
    }
  }
}
```

</details>

## Volume of Multiple Tokens Across Different Chains

Get volume and price change data for multiple tokens trading on different chains (Solana, Ethereum, BSC, Tron) in a single query using the Trading API. Returns volume for 1h, 4h, and 24h periods, plus price change percentages for the same intervals.

:::note EVM address format
For **EVM chains** (Ethereum, BSC, etc.) in the Trading API, use **all lowercase addresses** in the token ID format (e.g., `bid:eth:0x...` with lowercase hex). Mixed-case addresses may not match.
:::

[Run in Bitquery IDE](https://ide.bitquery.io/volume-of-a-token_1)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query {
  TokenAsBase: Trading {
    Pairs(
      where: {
        Interval: { Time: { Duration: { eq: 1 } } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        Price: { IsQuotedInUsd: true }
        Token: {
          Id: {
            in: [
              "bid:solana:CZzgUBvxaMLwMhVSLgqJn3npmxoTo6nzMNQPAnwtHF3s",
              "bid:eth:0xfaf0cee6b20e2aaa4b80748a6af4cd89609a3d78",
              "bid:bsc:0xfaf0cee6b20e2aaa4b80748a6af4cd89609a3d78",
              "bid:tron:TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT"
            ]
          }
        }
        Market: { Protocol: { notIn: ["jupiter", "dex_solana_v3"] } }
      }
    ) {
      Token {
        Name
        Symbol
        Id
      }
      Price {
        Average {
          currentPrice: Mean(maximum: Block_Time)
          H1Ago: Mean(
            maximum: Block_Time
            if: { Block: { Time: { till_relative: { hours_ago: 1 } } } }
          )
          H4Ago: Mean(
            maximum: Block_Time
            if: { Block: { Time: { till_relative: { hours_ago: 4 } } } }
          )
          H24Ago: Mean(
            minimum: Block_Time
            if: { Block: { Time: { after_relative: { hours_ago: 24 } } } }
          )
        }
      }
      Price_change_1h: calculate(
        expression: "( ( $Price_Average_currentPrice - $Price_Average_H1Ago ) / $Price_Average_H1Ago ) * 100"
      )
      Price_change_4h: calculate(
        expression: "( ( $Price_Average_currentPrice - $Price_Average_H4Ago ) / $Price_Average_H4Ago ) * 100"
      )
      Price_change_24h: calculate(
        expression: "( ( $Price_Average_currentPrice - $Price_Average_H24Ago ) / $Price_Average_H24Ago ) * 100"
      )
      v1h: sum(of: Volume_Usd, if: { Block: { Time: { since_relative: { hours_ago: 1 } } } })
      v4h: sum(of: Volume_Usd, if: { Block: { Time: { since_relative: { hours_ago: 4 } } } })
      v24h: sum(of: Volume_Usd)
    }
  }
}
```

</details>

---

## More examples

Pool-level example below; full-network swap stream is [above](#crypto-trades-live-stream).

### Top Traders by PnL for a Specific Pool (Last 30 Minutes)

Rank traders by **`PnL`** on one pool: filter **`Pair.Market.Address`**, last **30 minutes**, **`limit: 10`**, and **`orderBy`** **`PnL`** descending. Useful for **leaderboards**, **smart-money screens**, and **pool-specific trader analytics**.

You can run this query [in the Bitquery IDE](https://ide.bitquery.io/Top-Traders-by-PnL-of-a-specific-tron-pool_1).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Trading {
    Trades(
      limit: { count: 10 }
      orderBy: { descendingByField: "PnL" }
      where: {
        Block: { Time: { since_relative: { minutes_ago: 30 } } }
        Pair: {
          Market: { Address: { is: "TThJt8zaJzJMhCEScH7zWKnp5buVZqys9x" } }
        }
      }
    ) {
      Trader {
        Address
      }
      Amount_Bought: sum(of: AmountsInUsd_Base, if: { Side: { is: "Buy" } })
      Amount_Sold: sum(of: AmountsInUsd_Base, if: { Side: { is: "Sell" } })
      Amount_Bought_native: sum(of: Amounts_Base, if: { Side: { is: "Buy" } })
      Amount_Sold_native: sum(of: Amounts_Base, if: { Side: { is: "Sell" } })
      PnL: calculate(expression: "$Amount_Sold - $Amount_Bought")
      buys: count(if: { Side: { is: "Buy" } })
      sells: count(if: { Side: { is: "Sell" } })
    }
  }
}
```

</details>

---

## Get the First 100 Buyers of a Token on Tron

Find the **earliest buyers** of any Tron token by using Tron `DEXTradeByTokens` API. This is widely used for **memecoin sniper detection**, **early-holder analysis**, and **alpha groups** monitoring SunPump / SunSwap launches.

You can try this query [here](https://ide.bitquery.io/first-100-buyers-tron-token).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query FirstBuyersOfTronToken($token: String) {
  Tron {
    DEXTradeByTokens(
      orderBy: { ascending: Block_Time }
      limitBy: { by: Trade_Buyer, count: 1 }
      limit: { count: 100 }
      where: {
        Trade: {
          Currency: { SmartContract: { is: $token } }
          Side: { Type: { is: buy } }
        }
        TransactionStatus: { Success: true }
      }
    ) {
      Block {
        Time
      }
      Trade {
        Buyer
        Amount
        AmountInUSD
        Price
        PriceInUSD
        Currency {
          Symbol
          Name
          SmartContract
        }
        Dex {
          ProtocolName
          ProtocolFamily
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

```
{
  "token": "TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT"
}
```

</details>

## Track New Token Launches on Tron DEXs (SunPump & SunSwap)

Surface tokens whose **first ever DEX trade** happened in a recent window — useful for **new launch radars**, **bot discovery**, and **trending token feeds** for the Tron ecosystem.

Run this query [in the Bitquery IDE](https://ide.bitquery.io/new-token-launches-tron).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query NewTronTokenLaunches {
  Tron {
    DEXTradeByTokens(
      orderBy: { ascendingByField: "first_trade" }
      limitBy: { by: Trade_Currency_SmartContract, count: 1 }
      limit: { count: 50 }
      where: {
        Trade: { Side: { Currency: { SmartContract: { is: "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR" } } } }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        TransactionStatus: { Success: true }
      }
    ) {
      Trade {
        Currency {
          Name
          Symbol
          SmartContract
        }
        Dex {
          ProtocolName
          ProtocolFamily
        }
        first_price: PriceInUSD(minimum: Block_Time)
      }
      first_trade: minimum(of: Block_Time)
      first_buyer: Trade_Buyer
    }
  }
}
```

</details>

## Wallet PnL Across All Tron Trades

Compute realized **profit and loss for any Tron wallet** across every token it has traded. Powers **trader leaderboards**, **smart-money copytrading**, and **portfolio dashboards**. Filter `Trade_Sender` to the wallet you want.

You can run the query [here](https://ide.bitquery.io/wallet-pnl-tron).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query WalletPnLTron($wallet: String) {
  Tron {
    DEXTradeByTokens(
      where: {
        Transaction: { Result: { Success: true } }
        any: [
          { Trade: { Buyer: { is: $wallet } } }
          { Trade: { Seller: { is: $wallet } } }
        ]
      }
      orderBy: { descendingByField: "pnl" }
      limit: { count: 100 }
    ) {
      Trade {
        Currency {
          Symbol
          Name
          SmartContract
        }
      }
      bought_usd: sum(
        of: Trade_Side_AmountInUSD
        if: { Trade: { Side: { Type: { is: sell } } } }
      )
      sold_usd: sum(
        of: Trade_Side_AmountInUSD
        if: { Trade: { Side: { Type: { is: buy } } } }
      )
      pnl: calculate(expression: "$sold_usd - $bought_usd")
      trades: count
    }
  }
}
{
  "wallet": "TFXttAWURRrXrd9JvFPVLEh1esJK8NHxn7"
}
```

</details>

## Detect Token Snipers (Buyers Within 60 Seconds of Launch)

Spot wallets that bought a Tron token within **60 seconds of its very first DEX trade** — the canonical signature of an automated **sniper bot**. Useful for risk scoring, anti-bot dashboards, and alpha tracking.

Try the query [here](https://ide.bitquery.io/tron-snipers-detection).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query TronSnipers($token: String, $launch_time: DateTime, $sniper_window: DateTime) {
  Tron {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: { SmartContract: { is: $token } }
          Side: { Type: { is: buy } }
        }
        Block: { Time: { after: $launch_time, before: $sniper_window } }
        TransactionStatus: { Success: true }
      }
      orderBy: { ascending: Block_Time }
      limitBy: { by: Trade_Buyer, count: 1 }
    ) {
      Block {
        Time
      }
      Trade {
        Buyer
        Amount
        AmountInUSD
        Price
        PriceInUSD
      }
      Transaction {
        Hash
      }
    }
  }
}
{
  "token": "TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT",
  "launch_time": "2025-01-01T00:00:00Z",
  "sniper_window": "2025-01-01T00:01:00Z"
}
```

</details>

---
