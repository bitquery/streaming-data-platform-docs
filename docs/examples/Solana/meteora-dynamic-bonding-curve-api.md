# Meteora Dynamic Bonding Curve API

import VideoPlayer from "../../../src/components/videoplayer.js";

<head>
  <meta name="title" content="Meteora DBC API - Solana - Real-time Pools, Trades, Prices, OHLC" />
  <meta name="description" content="Access real-time and historical data for Meteora DBC on Solana using our GraphQL API. Track pools, DEX trades, token prices, OHLC, and top traders." />
  <meta name="keywords" content="Meteora DBC,Meteora Dynamic Bonding Curve API,Dynamic Bonding Curve,Solana DEX,Meteora API,Solana on-chain API,real-time Solana trades,Meteora pool data,Solana token prices,OHLC data Solana,DEX trading API,crypto trading API,web3 Solana API,Bitquery GraphQL,Meteora v2 API,Solana blockchain data" />
  <meta name="robots" content="index, follow" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="language" content="English" />

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Meteora DBC API - Solana - Real-time Pools, Trades, Prices, OHLC"
/>
<meta property="og:description" content="Explore real-time DEX trades, latest pool creations, token prices, OHLC, and volume insights on Meteora DBC using our Solana API." />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="Meteora DBC API - Solana - Real-time Pools, Trades, Prices, OHLC" />
  <meta property="twitter:description" content="Get rich on-chain insights into Meteora DBC pools, trades, and tokens with our real-time Solana API." />
</head>

## Meteora DBC Trades in Real-Time

The below query gets real-time information whenever there's a new trade on the Meteora DBC including detailed information about the trade, including the buy and sell details, the block information, and the transaction specifics.
You can run the query [here](https://ide.bitquery.io/Real-time-trades-on-Meteora-Dynamic-Bonding-Curve-on-Solana)

```graphql
subscription {
  Solana {
    DEXTrades(
      where: {
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

## Track Latest created pools on Meteora DBC

Below query will give you the latest created Meteora DBC in realtime. You can test the query [here](https://ide.bitquery.io/token-creations-on-meteora-DBC)

```
subscription MyQuery {
  Solana {
    Instructions(
      where: {
        Instruction: {
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

## Track latest migrated Meteora DBC tokens

Below query will give you the latest migrated tokens Meteora DBC in realtime. You can test the query [here](https://ide.bitquery.io/meteora-DBC-token-migrations-to-Meteors-DEX)

```
subscription MyQuery {
  Solana {
    Instructions(
      where: {
        Instruction: {
          Program: {
            Address: { is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN" }
            Method: { in: ["migrate_meteora_damm","migration_damm_v2"] }
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

## Check if the list of tokens has migrated from Meteora DBC

Below query will give you the response for each token in the list if the token has graduated from Meteora DBC. Try out the query [here](https://ide.bitquery.io/Check-if-the-tokens-have-migrated-from-Meteora-DBC_1).

```
query MyQuery($tokenAddresses: [String!]) {
  Solana {
    Instructions(
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
  "tokenAddresses":["3EX4yHYs25RXaNMBgaNtpGxPKvX73P9QWVw8fpNEhnow","2bzXpTCu3faGocjBKZvxv63yV3gnWDZYfH6mRVfGzbh8","Dpz6knqUSTfV2ESXqQvbiWVznzRPYSYivUtXT3TVpWkA"]
}
```

## Latest Price of a Token on Meteora DBC

You can use the following query to get the latest price of a token on Meteora DBC on Solana.

You can run this query using this [link](https://ide.bitquery.io/latest-price-of-a-meteora-dbc-token).

```
{
  Solana {
    DEXTradeByTokens(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {Trade: {Dex: {ProgramAddress: {is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"}}, Currency: {MintAddress: {is: "4kJkgxzuk1gcjsgRSVhdeSiC15ibQLRDKTuqtf2i16Dm"}}}}
    ) {
      Block {
        Time
      }
      Trade {
        Price
        PriceInUSD
      }
    }
  }
}
```

## Meteora DBC OHLC API

If you want to get OHLC data for any specific currency pair on Meteora DBC, you can use this api. Only use [this API](https://ide.bitquery.io/Meteora-DBC-OHLC-API) as query and not subscription websocket as Aggregates and Time Intervals don't work well with subscriptions.

```
{
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {Trade: {Currency: {MintAddress: {is: "4kJkgxzuk1gcjsgRSVhdeSiC15ibQLRDKTuqtf2i16Dm"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, Dex: {ProgramAddress: {is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"}}, PriceAsymmetry: {lt: 0.1}}}
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

## Get the Top Traders of a specific Token on Meteora DBC

The below query gets the Top Traders of the specified Token `4kJkgxzuk1gcjsgRSVhdeSiC15ibQLRDKTuqtf2i16Dm` on Meteora DBC. Keep in mind you can use this API only as a query and not a subscription websocket because aggregates don't work with subscription and you will end up getting wrong results. You can run the query [here](https://ide.bitquery.io/Get-the-Top-Traders-of-a-specific-Token-on-Meteora-DBC)

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
  "token": "4kJkgxzuk1gcjsgRSVhdeSiC15ibQLRDKTuqtf2i16Dm"
}
```

## Get trading volume, buy volume, sell volume of a token

This query fetches you the traded volume, buy volume and sell volume of a token `4kJkgxzuk1gcjsgRSVhdeSiC15ibQLRDKTuqtf2i16Dm`. Try out the API [here](https://ide.bitquery.io/Get-trading-volume-buy-volume-sell-volume-of-a-token).

```
query MyQuery {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      where: {Block: {Time: {since: "2025-05-23T09:00:00Z", till: "2025-05-23T11:00:00Z"}}, Transaction: {Result: {Success: true}}, Trade: {Currency: {MintAddress: {is: "4kJkgxzuk1gcjsgRSVhdeSiC15ibQLRDKTuqtf2i16Dm"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, Dex: {ProgramAddress: {is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"}}}}
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

## Volatility of a Pair on Meteora Dynamic

Volatility is an important factor in trading world as it determines the fluctuation in price that implies the possibility of profit and risk of loss. Lesser volatility denotes that the pair is stable.

[Here](https://ide.bitquery.io/Volatility-of-a-Pair-on-Meteora-Dynamic) is the query to get the volatility for a selected pair in the last 24 hours.

```graphql
query Volatility {
  Solana {
    DEXTrades(
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"
            }
          }
          Buy: {
            Currency: {
              MintAddress: {
                is: "4kJkgxzuk1gcjsgRSVhdeSiC15ibQLRDKTuqtf2i16Dm"
              }
            }
          }
          Sell: {
            Currency: {
              MintAddress: { is: "So11111111111111111111111111111111111111112" }
            }
          }
        }
        Block: {
          Time: {
            after: "2025-05-23T09:00:00Z"
            before: "2025-05-23T11:00:00Z"
          }
        }
      }
    ) {
      volatility: standard_deviation(of: Trade_Buy_Price)
    }
  }
}
```
