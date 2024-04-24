---
sidebar_position: 7
---

# Solana Raydium API

<head>
<meta name="title" content="Solana Raydium API  | Get Latest Liquidity Pools and Trades"/>
<meta name="description" content="Get on-chain data of latest liquidity pools created and latest trades on Solana based DEX Raydium using Bitquery's Solana API."/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Solana Raydium API  | Get Latest Liquidity Pools and Trades"
/>
<meta
  property="og:description"
  content="Get on-chain data of latest liquidity pools created and latest trades on Solana based DEX Raydium using Bitquery's Solana API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Solana Raydium API  | Get Latest Liquidity Pools and Trades" />
<meta property="twitter:description" content="Get on-chain data of latest liquidity pools created and latest trades on Solana based DEX Raydium using Bitquery's Solana API." />
</head>

In this section, we will see how to get Raydium information using Bitquery APIs. This Solana API is part of our Early Access Program (EAP), which is intended for evaluation purposes. This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

## New Liquidity Pools Created on Solana Raydium DEX (Using Websocket)

You can subscribe to newly created Solana Raydium liquidity pools using the GraphQL subscription (WebSocket).
You can try this GraphQL subscription [using this link](https://ide.bitquery.io/Latest-Radiyum-V4-pools-created_1).

In the results, you can get pool and token details using instructions.

### Pool Address

You can find the pool address using the following result: Note that the array index starts from 0. Therefore, it will be the 5th entry.

Instructions -> Instruction -> Accounts[4] -> Address

### Token A

You can get the 1st token address using the following result: Note that the array index starts from 0. Therefore, it will be the 9th entry.

Instructions -> Instruction -> Accounts[8] -> Address

### Token B

You can get the 2nd token address using the following result.

Instructions -> Instruction -> Accounts[9] ->. Address

You can run the following query at [Bitquery IDE](https://ide.bitquery.io/Latest-Radiyum-V4-pools-created_1).

```graphql
subscription {
  Solana {
    Instructions(
      where: {
        Transaction: { Result: { Success: true } }
        Instruction: {
          Program: {
            Method: { is: "initializeUserWithNonce" }
            Address: { is: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8" }
          }
        }
      }
    ) {
      Block {
        Time
        Date
      }
      Transaction {
        Signature
      }
      Instruction {
        AncestorIndexes
        CallerIndex
        Depth
        Data
        ExternalSeqNumber
        InternalSeqNumber
        Index
        Accounts {
          Address
          IsWritable
          Token {
            Mint
            Owner
            ProgramId
          }
        }
        CallPath
        Logs
        Program {
          AccountNames
          Method
          Json
          Name
          Arguments {
            Type
            Name
            Value {
              __typename
              ... on Solana_ABI_Integer_Value_Arg {
                integer
              }
              ... on Solana_ABI_String_Value_Arg {
                string
              }
              ... on Solana_ABI_Address_Value_Arg {
                address
              }
              ... on Solana_ABI_BigInt_Value_Arg {
                bigInteger
              }
              ... on Solana_ABI_Bytes_Value_Arg {
                hex
              }
              ... on Solana_ABI_Boolean_Value_Arg {
                bool
              }
              ... on Solana_ABI_Float_Value_Arg {
                float
              }
              ... on Solana_ABI_Json_Value_Arg {
                json
              }
            }
          }
        }
      }
    }
  }
}
```

## Latest Trades on Solana Raydium DEX

To subscribe to the real-time trades stream for Solana Raydium DEX, [try this GraphQL subscription (WebSocket)](https://ide.bitquery.io/Updated-Real-time-trades-on-Raydium-DEX-on-Solana_1).

```graphql
subscription {
  Solana {
    DEXTrades(
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
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
          Account {
            Address
          }
          Amount
          Currency {
            MintAddress
            Decimals
            Symbol
            ProgramAddress
            Name
          }
          PriceAgaistSellCurrency: Price
        }
        Sell {
          Account {
            Address
          }
          Amount
          Currency {
            MintAddress
            Decimals
            Symbol
            Name
          }
          PriceAgaistBuyCurrency: Price
        }
      }
      Block {
        Time
        Height
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

## Latest Trades for a specific currency on Solana Raydium DEX

Let's say you want to receive [trades only for a specific currency on Raydium DEX](https://ide.bitquery.io/Updated-Real-time-buy-and-sell-of-specific-currency-on-Raydium-DEX-on-Solana_1). You can use the following stream.
Use currency's mint address; for example, in the following query, we are using Ray token's Mint address to get buy and sells of Ray token.

If you limit it to 1, you will get the latest price of the token because the latest trade = the Latest Price.

Run this query [using this link](https://ide.bitquery.io/Updated-Real-time-buy-and-sell-of-specific-currency-on-Raydium-DEX-on-Solana_1).

```graphql
subscription {
  Solana {
    Buyside: DEXTrades(
      where: {
        Trade: {
          Buy: {
            Currency: {
              MintAddress: {
                is: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"
              }
            }
          }
          Dex: {
            ProgramAddress: {
              is: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
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
          Account {
            Address
          }
          Amount
          Currency {
            Decimals
            Symbol
            MintAddress
            Name
          }
          PriceAgaistSellCurrency: Price
        }
        Sell {
          Account {
            Address
          }
          Amount
          Currency {
            Decimals
            Symbol
            MintAddress
            Name
          }
          PriceAgaistBuyCurrency: Price
        }
      }
      Block {
        Time
        Height
      }
      Transaction {
        Signature
        FeePayer
        Signer
      }
    }
    Sellside: DEXTrades(
      limit: { count: 10 }
      where: {
        Trade: {
          Sell: {
            Currency: {
              MintAddress: {
                is: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"
              }
            }
          }
          Dex: {
            ProgramAddress: {
              is: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
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
          Account {
            Address
          }
          Amount
          Currency {
            Decimals
            Symbol
            MintAddress
            Name
          }
          PriceAgaistSellCurrency: Price
        }
        Sell {
          Account {
            Address
          }
          Amount
          Currency {
            Decimals
            Symbol
            MintAddress
            Name
          }
          PriceAgaistBuyCurrency: Price
        }
      }
      Block {
        Time
        Height
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
