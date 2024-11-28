# Pump Fun Marketcap & Bonding Curve API

In this document, we will explore examples to get marketcap, bonding curve progress and whether the token migrated to Raydium or not yet. We have the fully exhaustive Pump Fun API documentation [here](https://docs.bitquery.io/docs/examples/Solana/Pump-Fun-API/). Additionally, we have the Moonshot API available, and you can access its documentation [here](https://docs.bitquery.io/docs/examples/Solana/Moonshot-API/).

These APIs can be provided through different streams including Kafka for zero latency requirements. Please contact us on telegram.

<head>
  <meta name="title" content="Pump Fun API - Solana - Tokens, Trades, Live Prices"/>
  <meta name="description" content="Get Bonding Curve Data of any Pump.fun based token through our Pump.fun API."/>
  <meta name="keywords" content="Pump.fun API,Pump.fun on-chain data API,Pump.fun token data API,Pump.fun blockchain API,Pump.fun DEX data API,Pump.fun API documentation,Pump.fun crypto API,Pump.fun web3 API,DEX Trades,Solana,Blast,Pump.fun memecoins,Solana DEX,Blast DEX,token trading,blockchain data,crypto trading"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to Get Pump.fun Bonding Curve Data with Pump.fun API"
/>
<meta
  property="og:description"
  content="Get on-chain data of any Pump.fun based token through our Pump.fun API."
/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="How to Get Pump.fun Bonding Curve Data with Pump.fun API"/>
  <meta property="twitter:description" content="Get on-chain data of any Pump.fun based token through our Pump.fun API."/>
</head>

## Get Latest Marketcap of a PumpFun Token

You can get the marketcap of a pump fun token by this formulae `marketcap = 1000000000 * Latest USD Price` because all the pump fun tokens have 1 Billion supply.

You can get the latest USD price of the desired token (here I have used this token `9qzvgUMrrL5Xyadk2gyWxCWgTds8crkwGwgfjeN5JYLS`) from the below query and multiply it with 1 Billion and you will get the latest marketcap of the specified token.

```graphql
query MyQuery {
  Solana {
    DEXTradeByTokens(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Trade: {
          Currency: {
            MintAddress: { is: "9qzvgUMrrL5Xyadk2gyWxCWgTds8crkwGwgfjeN5JYLS" }
          }
          Dex: {
            ProgramAddress: {
              is: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
            }
          }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Trade {
        Currency {
          Name
          MintAddress
          Symbol
        }
        Amount
        AmountInUSD
        Price
        PriceInUSD
      }
    }
  }
}
```

## Get Tokens with a specific MarketCap

You can get the marketcap of a pump fun token by this formulae `marketcap = 1000000000 * Latest USD Price` because all the pump fun tokens have 1 Billion supply.

So to track the tokens with a specific marketcap, we just need to track their `PriceInUSD`. In the below example query we are tracking tokens in realtime using `subscription` keyword which are in marketcap range of $10K to $11K.
Try it out using this [query link](https://ide.bitquery.io/Track-pump-fun-tokens-with-a-specific-mktcap).

```graphql
subscription MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {
        Trade: {
          PriceInUSD: { gt: 0.00001, lt: 0.000011 }
          Dex: {
            ProgramAddress: {
              is: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
            }
          }
          Side: {
            Currency: {
              MintAddress: { is: "11111111111111111111111111111111" }
            }
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
          Name
          Symbol
          Decimals
          MintAddress
        }
        Price
        PriceInUSD
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
        Side {
          Currency {
            MintAddress
            Name
            Symbol
          }
        }
      }
    }
  }
}
```

## Check if the Pump Fun Token has migrated to Raydium

To check if a Pump Fun Token has migrated to Raydium, we can use Instructions API to check which methods does Pump Fun Migration Account `39azUYFWPz3VHgKCf3VChUwbpURdCHRxjWVowf5jUJjg` calls. We will see in the response of this query `mintTo` method which is responsible for the migration.
You can find the saved query [here](https://ide.bitquery.io/check-all-the-methods-that-pump-fun-migration-account-calls).

```graphql
query MyQuery {
  Solana(network: solana) {
    Instructions(
      where: {
        Transaction: {
          Signer: { is: "39azUYFWPz3VHgKCf3VChUwbpURdCHRxjWVowf5jUJjg" }
        }
      }
      orderBy: { descendingByField: "txc" }
    ) {
      Instruction {
        Program {
          Name
          Method
          AccountNames
        }
      }
      txc: count
    }
  }
}
```

Below query can be directly used to check if a Pump Fun Token has migrated to Raydium. We are checking if the Pump Fun: Raydium Migration Account `39azUYFWPz3VHgKCf3VChUwbpURdCHRxjWVowf5jUJjg` successfully called the method `mintTo` for this token address `HFmde4zjyzGN3cBdAmqzjdH7EcdCun432WPbquKmzmJU`. You can run the query [here](https://ide.bitquery.io/check-if-a-pump-token-migrated-to-raydium).

```graphql
query MyQuery {
  Solana(network: solana) {
    Instructions(
      where: {
        Transaction: {
          Signer: { is: "39azUYFWPz3VHgKCf3VChUwbpURdCHRxjWVowf5jUJjg" }
        }
        Instruction: {
          Program: { Method: { is: "mintTo" } }
          Accounts: {
            includes: {
              Address: { is: "HFmde4zjyzGN3cBdAmqzjdH7EcdCun432WPbquKmzmJU" }
            }
          }
        }
      }
    ) {
      Instruction {
        Program {
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
            Name
          }
          Address
          AccountNames
        }
        Accounts {
          Address
        }
      }
      Transaction {
        Signer
      }
    }
  }
}
```

## Track Pump Fun Token Migration to Raydium

Use the below query to track Pump Fun token migrations to Raydium in realtime. You can test the query [here](https://ide.bitquery.io/track-pump-to-raydium-LP-mint).

```graphql
query MyQuery {
  Solana(network: solana) {
    Instructions(
      where: {
        Transaction: {
          Signer: { is: "39azUYFWPz3VHgKCf3VChUwbpURdCHRxjWVowf5jUJjg" }
        }
        Instruction: { Program: { Method: { is: "mintTo" } } }
      }
      limit: { count: 100 }
    ) {
      Instruction {
        Program {
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
            Name
          }
          Address
          AccountNames
        }
        Accounts {
          Address
        }
      }
      Transaction {
        Signer
      }
    }
  }
}
```

## Bonding Curve Progress API

You can get the Bonding Curve Progress by this formulae, `BondingCurveProgress = 100 - ((leftTokens*100)/(initialRealTokenReserves))` where `initialRealTokenReserves = totalSupply - reservedTokens`, totalSupply is `1000000000` of a pump fun token and reservedTokens is `206900000`. So initialRealTokenReserves is `793100000`. We also need leftTokens to calculate bonding curve progress, it can be calculated like this `leftTokens = realTokenReserves - reservedTokens`. Here `realTokenReserves` is balance of the Token at the market address.

TLDR (or not able to understand) then just apply this formulae `bondingCurveProgress= 100 - (((balance - 206900000)*100)/793100000)`. You can get the balance using this below query. You can run and test the saved query [here](https://ide.bitquery.io/Get-balance-of-a-pair-address).

```graphql
query GetLatestLiquidityForPool {
  Solana {
    DePools(
      where: {
        Pool: {
          Market: {
            BaseCurrency: {
              MintAddress: {
                is: "Eh81Ci2S8ty5M4z9Z3pqHmJmkorvf9XJiJLGksF6pump"
              }
            }
          }
          Dex: {
            ProgramAddress: {
              is: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
            }
          }
        }
      }
      orderBy: { descending: Block_Slot }
      limit: { count: 1 }
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
        Base {
          PostAmount
        }
      }
    }
  }
}
```
