# Pump Swap API

import VideoPlayer from "../../../src/components/videoplayer.js";

In this document, we will explore several examples related to pump swap data. Additionally, we have the Pump Fun API available, and you can access its documentation [here](https://docs.bitquery.io/docs/examples/Solana/Pump-Fun-API/).
These APIs can be provided through different streams including Kafka for zero latency requirements. Please contact us on telegram.

<head>
  <meta name="title" content="Pump Swap API - Solana - Tokens, Trades, Live Prices"/>
  <meta name="description" content="Get on-chain data of any Pump Swap based token through our Pump Swap API."/>
  <meta name="keywords" content="Pump Swap API,Pump Swap on-chain data API,Pump Swap token data API,Pump Swap blockchain API,Pump Swap DEX data API,Pump Swap API documentation,Pump Swap crypto API,Pump Swap web3 API,DEX Trades,Solana,Blast,Pump Swap memecoins,Solana DEX,Blast DEX,token trading,blockchain data,crypto trading"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Pump Swap API - Solana - Tokens, Trades, Live Prices"
/>
<meta
  property="og:description"
  content="Get on-chain data of any Pump Swap based token through our Pump Swap API."
/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Pump Swap On-Chain Data with Pump Swap API"/>
  <meta property="twitter:description" content="Get on-chain data of any Pump Swap based token through our Pump Swap API."/>
</head>

If you want fastest data without any latency, we can provide Kafka streams, please [fill this form](https://bitquery.io/forms/api) for it. Our Team will reach out.

## Get Newly created pools on PumpSwap DEX in realtime

Use the below query to get the latest created pools on PumpSwap. You can test the query [here](https://ide.bitquery.io/pumpSwap-new-pools-Stream)

```
subscription {
  Solana {
    Instructions(
      where: {Instruction: {Program: {Method: {is: "create_pool"}, Address: {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}}}}
    ) {
      Instruction {
        Program {
          Address
          Name
          Method
          Arguments {
            Name
            Type
            Value {
              ... on Solana_ABI_Json_Value_Arg {
                json
              }
              ... on Solana_ABI_Float_Value_Arg {
                float
              }
              ... on Solana_ABI_Boolean_Value_Arg {
                bool
              }
              ... on Solana_ABI_Bytes_Value_Arg {
                hex
              }
              ... on Solana_ABI_BigInt_Value_Arg {
                bigInteger
              }
              ... on Solana_ABI_Address_Value_Arg {
                address
              }
              ... on Solana_ABI_String_Value_Arg {
                string
              }
              ... on Solana_ABI_Integer_Value_Arg {
                integer
              }
            }
          }
          AccountNames
          Json
        }
        Accounts {
          Address
          IsWritable
          Token {
            Mint
            Owner
            ProgramId
          }
        }
        Logs
        BalanceUpdatesCount
        AncestorIndexes
        CallPath
        CallerIndex
        Data
        Depth
        ExternalSeqNumber
        Index
        InternalSeqNumber
        TokenBalanceUpdatesCount
      }
      Transaction {
        Fee
        FeeInUSD
        Signature
        Signer
        FeePayer
        Result {
          Success
          ErrorMessage
        }
      }
      Block {
        Time
        Height
      }
    }
  }
}
```

## Track Pools that are migrated to PumpSwap

Use the below query to track Pump Fun token migrations to PumpSwap in realtime. You will get the following account addresses information through the query's `Instruction Accounts[]` field and the amount of liquidity added through arguments' `Value` field

<img
  width="1006"
  alt="Image"
  src="https://github.com/user-attachments/assets/1b4f22ab-e53d-4813-a2a5-c49e95958c92"
/>

You can test the query [here](https://ide.bitquery.io/pumpfun-migration-stream_2#).

```graphql
subscription {
  Solana {
    Instructions(
      where: {
        Instruction: {
          CallerIndex: { eq: 2 }
          Depth: { eq: 1 }
          CallPath: { includes: { eq: 2 } }
          Program: {
            Method: { is: "create_pool" }
            Address: { is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA" }
          }
        }
      }
    ) {
      Instruction {
        Program {
          Address
          Name
          Method
          Arguments {
            Name
            Type
            Value {
              ... on Solana_ABI_Json_Value_Arg {
                json
              }
              ... on Solana_ABI_Float_Value_Arg {
                float
              }
              ... on Solana_ABI_Boolean_Value_Arg {
                bool
              }
              ... on Solana_ABI_Bytes_Value_Arg {
                hex
              }
              ... on Solana_ABI_BigInt_Value_Arg {
                bigInteger
              }
              ... on Solana_ABI_Address_Value_Arg {
                address
              }
              ... on Solana_ABI_String_Value_Arg {
                string
              }
              ... on Solana_ABI_Integer_Value_Arg {
                integer
              }
            }
          }
          AccountNames
          Json
        }
        Accounts {
          Address
          IsWritable
          Token {
            Mint
            Owner
            ProgramId
          }
        }
        Logs
        BalanceUpdatesCount
        AncestorIndexes
        CallPath
        CallerIndex
        Data
        Depth
        ExternalSeqNumber
        Index
        InternalSeqNumber
        TokenBalanceUpdatesCount
      }
      Transaction {
        Fee
        FeeInUSD
        Signature
        Signer
        FeePayer
        Result {
          Success
          ErrorMessage
        }
      }
      Block {
        Time
        Height
      }
    }
  }
}
```

## Latest trades on PumpSwap

Below query returns latest trades on PumpSwap
You can test out the query [here](https://ide.bitquery.io/Pumpswap-latest-Trades-API).

```graphql
{
  Solana(network: solana, dataset: realtime) {
    DEXTrades(
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
            }
          }
        }
      }
      limit: { count: 100 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Instruction {
        Program {
          Method
        }
      }
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
          ProgramAddress
        }
        Buy {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Address
            Owner
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
        Sell {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Owner
            Address
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
      }
      Transaction {
        Signature
        Signer
        FeePayer
      }
    }
  }
}
```

## Latest trades on PumpSwap websocket

Below query can help you get real-time trades on PumpSwap using `subscription`.
You can test out the query [here](https://ide.bitquery.io/pumpswap-trades).

```graphql
subscription {
  Solana {
    DEXTrades(
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
            }
          }
        }
      }
    ) {
      Trade {
        Dex {
          ProtocolName
        }
        Sell {
          Currency {
            Symbol
          }
        }
        Buy {
          Currency {
            Symbol
          }
        }
      }
      Transaction {
        Signature
      }
      Instruction {
        ExternalSeqNumber
        InternalSeqNumber
      }
    }
  }
}
```

## OHLC for PumpSwap token

Below API query can get you the OHLC of a given token pair on PumpSwap. You can use the OHLC to build charts.
You can test out the query [here](https://ide.bitquery.io/historical-ohlc-for-pumpswap).

```
{
  Solana(dataset: archive) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {Trade: {Currency: {MintAddress: {is: "6qN87akZ3Ghs3JbGmnNMYP2rCHSBDwtiXttBV4Hspump"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, PriceAsymmetry: {lt: 0.1}}, Instruction: {Program: {Address: {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}}}}
      limit: {count: 10}
    ) {
      Block {
        Timefield: Time(interval: {in: hours, count: 1})
      }
      volume: sum(of: Trade_Amount)
      Trade {
        high: Price(maximum: Trade_Price)
        low: Price(minimum: Trade_Price)
        open: Price(minimum: Block_Slot)
        close: Price(maximum: Block_Slot)
      }
      count
    }
  }
}
```

## Latest trades of a trader

You can test out the query [here](https://ide.bitquery.io/Pumpswap-latest-Trade-for-a-trader-api_1).

```
{
  Solana {
    DEXTrades(
      orderBy: [{descending: Block_Time}, {descending: Transaction_Index}, {descending: Trade_Index}]
      limit: {count: 10}
      where: {
        Transaction:{
          Signer:{is:"78mgMi3caj9CY5EdAW9FHhUoLcWB5suyfDF8dsQ2CNHR"}
        }
        Trade: {Dex: {ProgramAddress: {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}}}}
    ) {
      Block {
        Time
      }
      Instruction {
        Program {
          Method
        }
      }
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
          ProgramAddress
        }
        Buy {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Address
            Owner
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
        Sell {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Owner
            Address
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
      }
      Transaction {
        Signature
        Signer
        FeePayer
      }
    }
  }
}
```

## Latest trades of a trader websocket

Below query can get you the latest trades of a trader in real time.
You can test out the query [here](https://ide.bitquery.io/Pumpswap-latest-Trade-for-a-trader-stream_1).

```
subscription {
  Solana {
    DEXTrades(
      orderBy: [{descending: Block_Time}, {descending: Transaction_Index}, {descending: Trade_Index}]
      where: {Transaction: {Signer: {is: "78mgMi3caj9CY5EdAW9FHhUoLcWB5suyfDF8dsQ2CNHR"}}, Trade: {Dex: {ProgramAddress: {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}}}}
    ) {
      Block {
        Time
      }
      Instruction {
        Program {
          Method
        }
      }
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
          ProgramAddress
        }
        Buy {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Address
            Owner
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
        Sell {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Owner
            Address
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
      }
      Transaction {
        Signature
        Signer
        FeePayer
      }
    }
  }
}
```

## Latest Trades for a token on Pumpswap

Below query can get you the latest trades of a token on Pumpswap.
You can test out the query [here](https://ide.bitquery.io/Solana-trade-for-a-token_2).

```
{
  Solana {
    DEXTradeByTokens(
      where: {

        Trade: {
          Dex:{
            ProgramAddress:{
              is:"pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
            }
          }
          Currency:
        {MintAddress: {is: "63Fce97Uk5Ln1Y1F8Y73BJEN6iJL6p86AXmxTgZQpump"}}}}
      limit: {count: 20}
      orderBy: [{descending: Block_Time}, {descending: Transaction_Index}, {descending: Trade_Index}]
    ) {
      Instruction {
        Program {
          Method
        }
      }
      Trade {
        Currency {
          Name
          Symbol
          MintAddress
        }
        Price
        PriceInUSD
        Amount
        AmountInUSD
        Price
        PriceInUSD
        Side {
          Type
          Amount
          AmountInUSD
          Currency {
            Symbol
            Name
            MintAddress
          }
        }
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
      }
      Block {
        Time
        Height
        Slot
      }
      Transaction {
        Signature
        FeePayer
        Signer
      }
    }
  }
}
```

## Latest Trades for a token on Pumpswap - Websocket

Below query can get you the latest trades of a token on Pumpswap in real time.
You can test out the query [here](https://ide.bitquery.io/Latest-Trades-for-a-token-on-Pumpswap).

```
subscription {
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Dex: {ProgramAddress:
        {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}},
        Currency: {MintAddress:
          {is: "63Fce97Uk5Ln1Y1F8Y73BJEN6iJL6p86AXmxTgZQpump"}}}}
    ) {
      Instruction {
        Program {
          Method
        }
      }
      Trade {
        Currency {
          Name
          Symbol
          MintAddress
        }
        Price
        PriceInUSD
        Amount
        AmountInUSD
        Price
        PriceInUSD
        Side {
          Type
          Amount
          AmountInUSD
          Currency {
            Symbol
            Name
            MintAddress
          }
        }
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
      }
      Block {
        Time
        Height
        Slot
      }
      Transaction {
        Signature
        FeePayer
        Signer
      }
    }
  }
}
```

## Top Trader on Pumpswap

Below query can get you top traders on Pumpswap.
You can test out the query [here](https://ide.bitquery.io/top-traders-on-pumpswap).

```
{
  Solana(network: solana) {
    DEXTrades(
      where: {Instruction: {Program: {Address: {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}}}}
      orderBy: {descendingByField: "txc"}
      limit: {count: 10}
    ) {
      txc: count
      trade_amount: sum(of: Trade_Buy_Amount)
      Trade {
        Buy {
          Account {
            Owner
            Address
            Token {
              Owner
            }
          }
        }
      }
    }
  }
}
```

## Get Buy Volume, Sell Volume, Buys, Sells, Makers, Total Trade Volume, Buyers, Sellers of a specific Token

The below query gives you the essential stats for a token such as buy volume, sell volume, total buys, total sells, makers, total trade volume, buyers, sellers (in last 5 min, 1 hour) of a specific token.
You can run the query [here](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-solana-token-pair0_4)

```graphql
query MyQuery($token: String!, $pair_address: String!, $time_5min_ago: DateTime!, $time_1h_ago: DateTime!) {
  Solana(dataset: realtime) {
    DEXTradeByTokens(
      where: {Transaction: {Result: {Success: true}},Trade: {Currency: {MintAddress: {is: $token}}, Market: {MarketAddress: {is: $pair_address}}}, Block: {Time: {since: $time_1h_ago}}}
    ) {
      Trade {
        Currency {
          Name
          MintAddress
          Symbol
        }
        start: PriceInUSD(minimum: Block_Time)
        min5: PriceInUSD(
          minimum: Block_Time
          if: {Block: {Time: {after: $time_5min_ago}}}
        )
        end: PriceInUSD(maximum: Block_Time)
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
        Market {
          MarketAddress
        }
        Side {
          Currency {
            Symbol
            Name
            MintAddress
          }
        }
      }
      makers: count(distinct: Transaction_Signer)
      makers_5min: count(
        distinct: Transaction_Signer
        if: {Block: {Time: {after: $time_5min_ago}}}
      )
      buyers: count(
        distinct: Transaction_Signer
        if: {Trade: {Side: {Type: {is: buy}}}}
      )
      buyers_5min: count(
        distinct: Transaction_Signer
        if: {Trade: {Side: {Type: {is: buy}}}, Block: {Time: {after: $time_5min_ago}}}
      )
      sellers: count(
        distinct: Transaction_Signer
        if: {Trade: {Side: {Type: {is: sell}}}}
      )
      sellers_5min: count(
        distinct: Transaction_Signer
        if: {Trade: {Side: {Type: {is: sell}}}, Block: {Time: {after: $time_5min_ago}}}
      )
      trades: count
      trades_5min: count(if: {Block: {Time: {after: $time_5min_ago}}})
      traded_volume: sum(of: Trade_Side_AmountInUSD)
      traded_volume_5min: sum(
        of: Trade_Side_AmountInUSD
        if: {Block: {Time: {after: $time_5min_ago}}}
      )
      buy_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}}
      )
      buy_volume_5min: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}, Block: {Time: {after: $time_5min_ago}}}
      )
      sell_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}}
      )
      sell_volume_5min: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}, Block: {Time: {after: $time_5min_ago}}}
      )
      buys: count(if: {Trade: {Side: {Type: {is: buy}}}})
      buys_5min: count(
        if: {Trade: {Side: {Type: {is: buy}}}, Block: {Time: {after: $time_5min_ago}}}
      )
      sells: count(if: {Trade: {Side: {Type: {is: sell}}}})
      sells_5min: count(
        if: {Trade: {Side: {Type: {is: sell}}}, Block: {Time: {after: $time_5min_ago}}}
      )
    }
  }
}
{
  "token":"EQf2LYaw4zV3hb2UK5kCUSgFrLRJqUAaeVA9rMypump",
  "pair_address": "48oGgzAdYJ5nzMmNz2Jvv5qvX4HXhNgp27tmdEM5n2EF",
  "time_5min_ago":"2025-03-25T09:14:00Z",
  "time_1h_ago": "2025-03-25T08:19:00Z"
}
```

## Track Price of a Token in Realtime on PumpSwap

The below query gets real-time price of the specified Token `EQf2LYaw4zV3hb2UK5kCUSgFrLRJqUAaeVA9rMypump` on the PumpSwap DEX.
You can run the query [here](https://ide.bitquery.io/realtime-price-of-a-pumpswap-token)

```graphql
subscription MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
            }
          }
          Currency: {
            MintAddress: { is: "EQf2LYaw4zV3hb2UK5kCUSgFrLRJqUAaeVA9rMypump" }
          }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Block {
        Time
      }
      Trade {
        Currency {
          MintAddress
          Name
          Symbol
        }
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
        Side {
          Currency {
            MintAddress
            Symbol
            Name
          }
        }
        Price
        PriceInUSD
      }
      Transaction {
        Signature
      }
    }
  }
}
```

## Get Latest Price of a Token on PumpSwap

The below query gets real-time price of the specified Token `EQf2LYaw4zV3hb2UK5kCUSgFrLRJqUAaeVA9rMypump` on the PumpSwap DEX.
You can run the query [here](https://ide.bitquery.io/Price-of-a-pumpswap-token_1)

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      orderBy: { descending: Block_Time }
      limit: { count: 10 }
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
            }
          }
          Currency: {
            MintAddress: { is: "EQf2LYaw4zV3hb2UK5kCUSgFrLRJqUAaeVA9rMypump" }
          }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Block {
        Time
      }
      Trade {
        Currency {
          MintAddress
          Name
          Symbol
        }
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
        Side {
          Currency {
            MintAddress
            Symbol
            Name
          }
        }
        Price
        PriceInUSD
      }
      Transaction {
        Signature
      }
    }
  }
}
```

## Get the Trading Volume of a specific Token on PumpSwap DEX

The below query gets the Trading volume of the specified Token `EQf2LYaw4zV3hb2UK5kCUSgFrLRJqUAaeVA9rMypump` on PumpSwap DEX. You will have to change the time in this `Block: { Time: { since: "2025-03-25T09:30:00Z" till: "2025-03-25T10:30:00Z" } }` when you try the query yourself. Keep in mind you can use this API only as a query and not a subscription websocket because aggregates don't work with subscription and you will end up getting wrong results.
You can run the query [here](https://ide.bitquery.io/trading-volume-of-a-token-pumpSwap)

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: {
            MintAddress: { is: "EQf2LYaw4zV3hb2UK5kCUSgFrLRJqUAaeVA9rMypump" }
          }
          Dex: { ProtocolFamily: { is: "Pumpswap" } }
        }
        Block: {
          Time: { since: "2025-03-25T09:30:00Z", till: "2025-03-25T10:30:00Z" }
        }
      }
    ) {
      Trade {
        Currency {
          Name
          Symbol
          MintAddress
        }
        Dex {
          ProtocolName
          ProtocolFamily
        }
      }
      TradeVolume_USD: sum(of: Trade_Side_AmountInUSD)
      TradeVolume: sum(of: Trade_Amount)
    }
  }
}
```

## Video Tutorial | How to get Trades, Trades of a token and Trades of a trader on PumpSwap DEX in realtime

<VideoPlayer url="https://www.youtube.com/watch?v=MMazeabdirM" />
