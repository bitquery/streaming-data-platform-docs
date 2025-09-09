# Jupiter Studio API

In this section we will see some API examples on tracking Jupiter Studio launchpad tokens on Meteora's dynamic bonding curve.

:::note
Jupiter studio tokens are launched and traded on Meteora DBC. So a Jup Studio token follows a lifecycle of a Meteora DBC Token.
:::

:::note
To query or stream data via graphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
:::

import VideoPlayer from "../../../src/components/videoplayer.js";

<head>
  <meta name="title" content="Jupiter Studio API - Solana - Real-time Pools, Trades, Prices, OHLC" />
  <meta name="description" content="Access real-time and historical data for Jupiter Studio on Solana using our GraphQL API. Track pools, DEX trades, token prices, OHLC, and top traders." />
  <meta name="keywords" content="Jupiter Studio API, Jupiter Studio,Meteora Dynamic Bonding Curve API,Dynamic Bonding Curve,Solana DEX,Meteora Jupiter Studio API,Solana on-chain API,real-time Solana trades,Meteora DBC Jupiter pool data,Solana token prices,OHLC data Solana,DEX trading API,crypto trading API,web3 Solana API,Bitquery GraphQL,Meteora v2 API,Solana blockchain data" />
  <meta name="robots" content="index, follow" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="language" content="English" />

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Jupiter Studio API - Solana - Real-time Pools, Trades, Prices, OHLC"
/>
<meta property="og:description" content="Explore real-time DEX trades, latest pool creations, token prices, OHLC, and volume insights on Jupiter Studio Token using our Solana API." />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="Jupiter Studio API - Solana - Real-time Pools, Trades, Prices, OHLC" />
  <meta property="twitter:description" content="Get rich on-chain insights into Jupiter Studio token pools, trades, and tokens with our real-time Solana API." />
</head>

## Jupiter Studio Token Trades in Real-Time

The below query gets real-time information whenever there's a new trade of a Jupiter studio token on Meteora DBC including detailed information about the trade, including the buy and sell details, the block information, and the transaction specifics.
You can run the query [here](https://ide.bitquery.io/trades-of-jup-studio-tokens-on-meteora-dbc-in-realtime)

```graphql
subscription {
  Solana {
    DEXTrades(
      where: {
        any: [
          {
            Trade: { Buy: { Currency: { MintAddress: { endsWith: "jups" } } } }
          }
          {
            Trade: { Sell: { Currency: { MintAddress: { endsWith: "jups" } } } }
          }
        ]
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"
            }
          }
        }
      }
    ) {
      Trade {
        Dex {
          ProgramAddress
          ProtocolFamily
          ProtocolName
        }
        Buy {
          Currency {
            Name
            Symbol
            MintAddress
          }
          Amount
          Account {
            Address
          }
          PriceAgainstSellCurrency: Price
        }
        Sell {
          Account {
            Address
          }
          Amount
          Currency {
            Name
            Symbol
            MintAddress
          }
          PriceAgainstBuyCurrency: Price
        }
      }
      Block {
        Time
      }
    }
  }
}
```

## Track Latest created Jupiter Studio Token pools on Meteora DBC

Below query will give you the latest created Jupiter Studio Token pools on Meteora DBC in realtime. You can test the query [here](https://ide.bitquery.io/jup-studio-token-creations-on-meteora-DBC)

```
subscription MyQuery {
  Solana {
    Instructions(
      where: {
        Instruction: {
          Accounts:{includes:{Address:{endsWith:"jups"}}}
          Program: {
            Address: { is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN" }
            Method: { is: "initialize_virtual_pool_with_spl_token" }
          }
        }
        Transaction: {
          Result: { Success: true }
        }
      }
    ) {
      Block {
        Time
      }
      Instruction {
        Accounts {
          Token {
            ProgramId
            Owner
            Mint
          }
          IsWritable
          Address
        }
        Program {
          Parsed
          Name
          Method
          Arguments {
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
            Type
            Name
          }
          Address
          AccountNames
        }
      }
      Transaction {
        Fee
        FeeInUSD
        FeePayer
        Signature
      }
    }
  }
}
```

## Track latest migrated Jupiter Studio tokens

Below query will give you the latest Jup Studio tokens migrated from Meteora DBC in realtime. You can test the query [here](https://ide.bitquery.io/jup-studio-token-migrations-from-Meteora-DBC-to-Meteors-DEX_1).

```
subscription MyQuery {
  Solana {
    Instructions(
      where: {Instruction: {Accounts: {includes: {Address: {endsWith: "jups"}}}, Program: {Address: {is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"}, Method: {in: ["migrate_meteora_damm", "migration_damm_v2"]}}}, Transaction: {Result: {Success: true}}}
    ) {
      Block {
        Time
      }
      Instruction {
        Accounts {
          Token {
            ProgramId
            Owner
            Mint
          }
          IsWritable
          Address
        }
        Program {
          Parsed
          Name
          Method
          Arguments {
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
            Type
            Name
          }
          Address
          AccountNames
        }
      }
      Transaction {
        Fee
        FeeInUSD
        FeePayer
        Signature
      }
    }
  }
}
```

## Check if the list of Jupiter Studio tokens has migrated from Meteora DBC

Below query will give you the response for each jup studio token in the list if it has graduated from Meteora DBC. Try out the query [here](https://ide.bitquery.io/Check-if-these-jup-tokens-tokens-have-migrated-from-Meteora-DBC).

```
query MyQuery($tokenAddresses: [String!]) {
  Solana {
    Instructions(
      orderBy:{descending:Block_Time}
      where: {Instruction: {Program: {Address: {is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"}, Method: {in: ["migrate_meteora_damm", "migration_damm_v2"]}}, Accounts: {includes: {Address: {in: $tokenAddresses}}}}, Transaction: {Result: {Success: true}}}
    ) {
      Block {
        Time
      }
      Instruction {
        Accounts {
          Token {
            ProgramId
            Owner
            Mint
          }
          IsWritable
          Address
        }
        Program {
          Parsed
          Name
          Method
          Arguments {
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
            Type
            Name
          }
          Address
          AccountNames
        }
      }
      Transaction {
        Fee
        FeeInUSD
        FeePayer
        Signature
      }
    }
  }
}
{
  "tokenAddresses":["CEVuiDHBxUeuuwvLugKqZpRpNtv5ejaQ1wKm2qzyjups","3Po3offygJjPg4cQpvc1AVT9JsYXyUapN2EKgFUbjups"]
}
```

## Latest Price of a Jupiter Studio Token on Meteora DBC

You can use the following query to get the latest price of a jup studio token on Meteora DBC on Solana.

You can run this query using this [link](https://ide.bitquery.io/latest-price-of-a-jup-studio-token-on-meteora-dbc).

```
{
  Solana {
    DEXTradeByTokens(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {Trade: {Dex: {ProgramAddress: {is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"}}, Currency: {MintAddress: {is: "3Po3offygJjPg4cQpvc1AVT9JsYXyUapN2EKgFUbjups"}}}}
    ) {
      Block {
        Time
      }
      Trade {
        Price
        PriceInUSD
        Currency{
          Name
          Symbol
          MintAddress
        }
      }
    }
  }
}
```

## Jupiter Studio Token OHLC API

If you want to get OHLC data for any specific Jup Studio currency pair on Meteora DBC, you can use this api. Only use [this API](https://ide.bitquery.io/Jupiter-studio-OHLC-API) as query and not subscription websocket as Aggregates and Time Intervals don't work well with subscriptions.

```
{
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {Trade: {Currency: {MintAddress: {is: "3Po3offygJjPg4cQpvc1AVT9JsYXyUapN2EKgFUbjups"}}, Side: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}, Dex: {ProgramAddress: {is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"}}, PriceAsymmetry: {lt: 0.1}}}
      limit: {count: 10}
    ) {
      Block {
        Timefield: Time(interval: {in: minutes, count: 1})
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

## Get the Top Traders of a specific Jupiter Studio Token on Meteora DBC

The below query gets the Top Traders of the specified Jup studio Token `3Po3offygJjPg4cQpvc1AVT9JsYXyUapN2EKgFUbjups` on Meteora DBC. Keep in mind you can use this API only as a query and not a subscription websocket because aggregates don't work with subscription and you will end up getting wrong results. You can run the query [here](https://ide.bitquery.io/Get-the-Top-Traders-of-a-specific-jup-studio-Token-on-Meteora-DBC)

```
query TopTraders($token: String) {
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {MintAddress: {is: $token}}, Dex: {ProgramAddress: {is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"}}}, Transaction: {Result: {Success: true}}}
    ) {
      Trade {
        Account {
          Owner
        }
        Side {
          Account {
            Address
          }
          Type
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
  "token": "3Po3offygJjPg4cQpvc1AVT9JsYXyUapN2EKgFUbjups"
}
```

## Get trading volume, buy volume, sell volume of a Jupiter studio token

This query fetches you the traded volume, buy volume and sell volume of a token `3Po3offygJjPg4cQpvc1AVT9JsYXyUapN2EKgFUbjups`. Try out the API [here](https://ide.bitquery.io/Get-trading-volume-buy-volume-sell-volume-of-a-jup-studio-token).

```
query MyQuery {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      where: {Block: {Time: {since: "2025-07-18T09:00:00Z", till: "2025-07-19T00:00:00Z"}}, Transaction: {Result: {Success: true}}, Trade: {Currency: {MintAddress: {is: "3Po3offygJjPg4cQpvc1AVT9JsYXyUapN2EKgFUbjups"}}, Side: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}, Dex: {ProgramAddress: {is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"}}}}
    ) {
      Trade {
        Currency {
          MintAddress
          Decimals
        }
        Side {
          Currency {
            Name
            MintAddress
          }
        }
      }
      traded_volume_USD: sum(of: Trade_Side_AmountInUSD)
      traded_volume: sum(of: Trade_Amount)
      buy_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}}
      )
      sell_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}}
      )
    }
  }
}
```
