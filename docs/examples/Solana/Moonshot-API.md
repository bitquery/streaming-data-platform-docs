# Moonshot API

In this section we will see how to get real-time data on Moonshot trades, transactions and wallet updates. Similarly you can get [pump.fun data here](https://docs.bitquery.io/docs/examples/dextrades/Pump-Fun-API/)

:::note
`Trade Side Account` field will not be available as aggregates in Archive and Combined Datasets
:::

import VideoPlayer from "../../../src/components/videoplayer.js";

<head>
  <meta name="title" content="Moonshot API - Solana - Tokens, Trades, Live Prices"/>
  <meta name="description" content="Get on-chain data of any Moonshot based token through our Moonshot API."/>
  <meta name="keywords" content="Moonshot API,Moonshot on-chain data API,Moonshot token data API,Moonshot blockchain API,Moonshot DEX data API,Moonshot API documentation,Moonshot crypto API,Moonshot web3 API,DEX Trades,Solana,Blast,Moonshot memecoins,Solana DEX,Blast DEX,token trading,blockchain data,crypto trading"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to Get Moonshot On-Chain Data with Moonshot API"
/>
<meta
  property="og:description"
  content="Get on-chain data of any Moonshot based token through our Moonshot API."
/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Moonshot API - Solana - Tokens, Trades, Live Prices"/>
  <meta property="twitter:description" content="Get on-chain data of any Moonshot based token through our Moonshot API."/>
</head>

## Moonshot Trades in Real-Time

The below query gets real-time information whenever there's a new trade on the Moonshot including program method called , buy and sell details, details of the currencies involved, and the transaction specifics like signature.
You can run the query [here](https://ide.bitquery.io/Moonshot-DEX-Trades_2)

```graphql
subscription MyQuery {
  Solana {
    DEXTrades(
      where: {
        Trade: { Dex: { ProtocolFamily: { is: "Moonshot" } } }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Instruction {
        Program {
          Method
        }
      }
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Buy {
          Amount
          Account {
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
        Sell {
          Amount
          Account {
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
      }
    }
  }
}
```

## Get newly created Moonshot tokens and their Metadata

Now you can track the newly created Moonshot Tokens along with their metadata and supply. `PostBalance` will give you the current supply for the token. Check the query [here](https://ide.bitquery.io/Get-newly-created-Moonshot-tokens-with-metadata#)

```
subscription {
  Solana {
    TokenSupplyUpdates(
      where: {Instruction: {Program: {Address: {is: "MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG"}, Method: {is: "tokenMint"}}}}
    ) {
      TokenSupplyUpdate {
        Amount
        Currency {
          Symbol
          ProgramAddress
          PrimarySaleHappened
          Native
          Name
          MintAddress
          MetadataAddress
          Key
          IsMutable
          Fungible
          EditionNonce
          Decimals
          Wrapped
          VerifiedCollection
          Uri
          UpdateAuthority
          TokenStandard
        }
        PostBalance
      }
    }
  }
}

```

## Track New Token Creation on Moonshot

[Here](https://ide.bitquery.io/Track-new-token-launches-on-Moonshot-in-realtime) is the subscription to get the notification of new token creation event on Moonshot. Newly Minted Token Address will be 4th address in the Accounts array. You can also see the Name, Symbol, Supply and URI of the newly minted token in the arguments.

```graphql
subscription {
  Solana {
    Instructions(
      where: {
        Instruction: {
          Program: {
            Method: { is: "tokenMint" }
            Address: { is: "MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG" }
          }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Instruction {
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
        Program {
          AccountNames
          Address
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
          Method
          Name
        }
      }
      Transaction {
        Signature
      }
    }
  }
}
```

## Track New Token Creation on Multiple Platforms : Moonshot and Pumpfun

In this query we use the program addresses of Moonshot and Pumpfun and creation methods to track token creation in realtime. We use the `in` filter to pass multiple addresses.
You can run the query [here](https://ide.bitquery.io/new-token-launches-on-Pump-Fun--Moonshot-in-realtime)

```
subscription{
  Solana(network: solana) {
    Instructions(
      where: {Instruction: {Program: {Method: {in: ["tokenMint", "create"]}, Address: {in: ["6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P", "MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG"]}}}}
    ) {
      Instruction {
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
        Program {
          AccountNames
          Address
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
          Method
          Name
        }
      }
      Transaction {
        Signature
      }
    }
  }
}

```

## Get the Creator of a Moonshot Token

The below query fetches the details of Token Creator of a specific token `D68YAXPZdGEBre4Esg61W7HbcRJFN7rmroKzGPXDR87T`.
Here you can find [saved query](https://ide.bitquery.io/Moonshot-token-creator).

```
query MyQuery {
  Solana(network: solana) {
    Instructions(
      where: {Instruction: {Accounts: {includes: {Address: {is: "D68YAXPZdGEBre4Esg61W7HbcRJFN7rmroKzGPXDR87T"}}}, Program: {Address: {is: "MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG"}, Method: {is: "tokenMint"}}}}
    ) {
      Transaction {
        Signer
        Signature
      }
      Instruction {
        Accounts {
          Address
        }
      }
    }
  }
}

```

## Top Token Creators on Moonshot

The below query fetches details about token creators filtering using the `MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG` program address and `tokenMint` method.
The `descendingByField: "tokens_count":` Orders the results in descending order based on the count of tokens created.
You can run the query [here](https://ide.bitquery.io/Top-moonshot-token-creators)

```
query MyQuery {
  Solana(network: solana) {
    Instructions(
      where: {Instruction: {Program: {Address: {is: "MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG"}, Method: {is: "tokenMint"}}}}
      orderBy: {descendingByField: "tokens_count"}
    ) {
      tokens_count: count
      Transaction {
        Signer
      }
    }
  }
}

```

## Get OHLC Data of a Token on Moonshot

The below query gets OHLC data of the specified Token `A1XqfcD1vMEhUNwEKvBVRWFV48ZLDL4oheFVCPEcM3Vk` for 1 minute time interval for last 10 minutes on Moonshot DEX.
You can run the query [here](https://ide.bitquery.io/OHLC-for-a-token-on-Moonshot_1)

Note - You can only use this API using `query` keyword, using this API as `subscription` will give wrong results because aggregation and interval don't work correctly together in `subscription`.

```graphql
{
  Solana {
    DEXTradeByTokens(
      limit: { count: 10 }
      orderBy: { descendingByField: "Block_Timefield" }
      where: {
        Trade: {
          Currency: {
            MintAddress: { is: "A1XqfcD1vMEhUNwEKvBVRWFV48ZLDL4oheFVCPEcM3Vk" }
          }
          Dex: {
            ProgramAddress: {
              is: "MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG"
            }
          }
          PriceAsymmetry: { lt: 0.1 }
        }
      }
    ) {
      Block {
        Timefield: Time(interval: { in: minutes, count: 1 })
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

## Track Price of a Token in Realtime on Moonshot

The below query gets real-time price of the specified Token `A1XqfcD1vMEhUNwEKvBVRWFV48ZLDL4oheFVCPEcM3Vk` on the Moonshot DEX.
You can run the query [here](https://ide.bitquery.io/Price-of-a-moonshot-token)

```graphql
subscription MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG"
            }
          }
          Currency: {
            MintAddress: { is: "A1XqfcD1vMEhUNwEKvBVRWFV48ZLDL4oheFVCPEcM3Vk" }
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

## Get the Token Holders of a specific Moonshot Token

The below query gets top 10 token holders of the specified Token `A1XqfcD1vMEhUNwEKvBVRWFV48ZLDL4oheFVCPEcM3Vk` on the Moonshot DEX. Keep in mind you can use this API only as a query and not a subscription websocket because aggregates don't work with subscription and you will end up getting wrong results.
You can run the query [here](https://ide.bitquery.io/Top-10-holders-for-a-moonshot-token)

```graphql
query MyQuery {
  Solana {
    BalanceUpdates(
      limit: { count: 10 }
      orderBy: { descendingByField: "TotalHolding" }
      where: {
        BalanceUpdate: {
          Currency: {
            MintAddress: { is: "A1XqfcD1vMEhUNwEKvBVRWFV48ZLDL4oheFVCPEcM3Vk" }
          }
        }
      }
    ) {
      BalanceUpdate {
        Currency {
          Name
          MintAddress
          Symbol
        }
        Account {
          Address
          Token {
            Owner
          }
        }
      }
      TotalHolding: sum(of: BalanceUpdate_Amount, selectWhere: { gt: "0" })
    }
  }
}
```

## Get the Trading Volume of a specific Token on Moonshot DEX

The below query gets the Trading volume of the specified Token `A1XqfcD1vMEhUNwEKvBVRWFV48ZLDL4oheFVCPEcM3Vk` on the Moonshot DEX in the past 1 hour. You will have to change the time in this `Block: {Time: {since: "2024-08-13T08:05:00Z"}}` when you try the query yourself. Keep in mind you can use this API only as a query and not a subscription websocket because aggregates don't work with subscription and you will end up getting wrong results.
You can run the query [here](https://ide.bitquery.io/trading-volume-of-a-token-moonshot_1)

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: {
            MintAddress: { is: "A1XqfcD1vMEhUNwEKvBVRWFV48ZLDL4oheFVCPEcM3Vk" }
          }
          Dex: {
            ProgramAddress: {
              is: "MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG"
            }
          }
        }
        Block: { Time: { since: "2024-08-13T08:05:00Z" } }
        Transaction: { Result: { Success: true } }
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
        Side {
          Currency {
            Name
            Symbol
            MintAddress
          }
        }
      }
      TradeVolume: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
```

## Get the Top Traders of a specific Token on Moonshot DEX

The below query gets the Top Traders of the specified Token `A1XqfcD1vMEhUNwEKvBVRWFV48ZLDL4oheFVCPEcM3Vk` which was launched on Moonshot. Keep in mind you can use this API only as a query and not a subscription websocket because aggregates don't work with subscription and you will end up getting wrong results.
You can run the query [here](https://ide.bitquery.io/Top-traders-with-their-bought-sold-and-total-volume_3)

```graphql
query TopTraders {
  Solana {
    DEXTradeByTokens(
      orderBy: { descendingByField: "volume" }
      limit: { count: 5 }
      where: {
        Trade: {
          Currency: {
            MintAddress: { is: "A1XqfcD1vMEhUNwEKvBVRWFV48ZLDL4oheFVCPEcM3Vk" }
          }
          Dex: {
            ProgramAddress: {
              is: "MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG"
            }
          }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Trade {
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
        Currency {
          Symbol
          Name
          MintAddress
        }
        Account {
          Address
        }
      }
      bought: sum(
        of: Trade_Side_AmountInUSD
        if: { Trade: { Side: { Type: { is: sell } } } }
      )
      sold: sum(
        of: Trade_Side_AmountInUSD
        if: { Trade: { Side: { Type: { is: buy } } } }
      )
      volume: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
```

## All tokens created by an address

To get all Moonshot tokens created by address use [this query](https://ide.bitquery.io/moonshot-tokens-created-by-a-specific-address).

```
query MyQuery {
  Solana(network: solana) {
    Instructions(
      where: {Transaction: {Signer: {is: "BGfwxRRcAps1WrJQQRsgWHzvLWVBpRRnfbUxUNGGQ1xV"}}, Instruction: {Program: {Address: {is: "MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG"}, Method: {is: "tokenMint"}}}}
    ) {
      Transaction {
        Signer
        Signature
      }
      Instruction {
        Accounts {
          Address
        }
      }
    }
  }
}
```

## Moonshot Token first and last price

To check the first and last price to calculate the price change in the last X minutes, use [this query](https://ide.bitquery.io/Moonshot-coins-with-price--mc-with-limit-and-delta-from-10-min-back-simple).
In this query, the `from` time should be when you need the price change. For example, if you want a price change for the last 10 minutes, then `from` should be 10 minutes before now.

```
query MoonshotRecentTrades($from: DateTime) {
  Solana {
    DEXTradeByTokens(
      limit: {count: 100}
      orderBy: {descendingByField: "Trade_lastPrice_maximum"}
      where: {Block: {Time: {since: $from}},
        Trade: {Currency: {Native: false},
          Dex: {ProgramAddress: {is: "MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG"}}}, Transaction: {Result: {Success: true}}}
    ) {
      Trade {
        Market {
          MarketAddress
        }
        Currency {
          Symbol
          Name
          MintAddress
        }
        lastPrice: Price(maximum: Block_Slot)
        prePrice: Price(minimum: Block_Slot)
      }
    }
  }
}
{
  "from": "2024-08-13T09:10:00Z"
}
```

## Get Pools details for Moonshot token

To get pool details (Market address) for Moonshot token use [this query](https://ide.bitquery.io/Market-info-on-moonshot-by-tokens).

```
query ($tokens: [String!]) {
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Dex: {ProgramAddress: {is: "MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG"}}, Currency: { MintAddress: {in: $tokens}}}}
    ) {
      count
      Trade {
        Market {
          MarketAddress
        }
        Currency {
          MintAddress
          Symbol
        }
      }
    }
  }
}
```

```
{
  "tokens": [
    "A1XqfcD1vMEhUNwEKvBVRWFV48ZLDL4oheFVCPEcM3Vk"
  ]
}
```

## OHLC price in SOL and USD and Volume

To get OHLC price in SOL and USD and to get volume use [following query](https://ide.bitquery.io/ohlc-in-sol-with-usd-price_4).

```
{
  Solana {
    DEXTradeByTokens(
      orderBy: {ascendingByField: "Block_Time"}
      where: {Trade: {Currency: {MintAddress: {is: "D68YAXPZdGEBre4Esg61W7HbcRJFN7rmroKzGPXDR87T"}}, Dex: {ProgramAddress: {is: "MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG"}}, PriceAsymmetry: {lt: 0.1}}, Transaction: {Result: {Success: true}}}
    ) {
      Block {
        Time(interval: {count: 5, in: minutes})
      }
      Trade {
        Dex {
          ProtocolName
          ProtocolFamily
        }
        Currency {
          Symbol
          Name
          MintAddress
        }
        open: Price(minimum: Block_Slot)
        close: Price(maximum: Block_Slot)
        min: Price(maximum: Trade_Price)
        max: Price(minimum: Trade_Price)
        closeUsd: PriceInUSD(maximum: Trade_PriceInUSD)
      }
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}

```
