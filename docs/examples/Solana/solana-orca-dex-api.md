---
sidebar_position: 7
---

# Orca DEX API

In this section, we'll show you how to access information about Orca DEX data using Bitquery APIs.

This Solana API is part of our Early Access Program (EAP).

You can use this program to try out the data and see how it works with your applications before you fully integrate it. You can learn more about this [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/).


<head>
<meta name="title" content="Orca DEX API - Liquidity Pools & Trades"/>
<meta name="description" content="Use our Solana API & Websockets, designed for developers, to get SPL token trading data on Orca DEX. Access details on pools, as well as adding and removing liquidity."/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Orca DEX API - Liquidity Pools & Trades"
/>
<meta
  property="og:description"
  content="Use our Solana API & Websockets, designed for developers, to get SPL token trading data on Orca DEX. Access details on pools, as well as adding and removing liquidity."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Orca DEX API - Liquidity Pools & Trades" />
<meta property="twitter:description" content="Use our Solana API & Websockets, designed for developers, to get SPL token trading data on Orca DEX. Access details on pools, as well as adding and removing liquidity." />
</head>


## Latest Pools created on Orca

To retrieve the newest pools created on Orca DEX, we will utilize the Solana instructions API/Websocket. 

We will specifically look for the latest instructions from Orca's Whirlpool program, identified by the program ID `whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc`. 
Whenever a new pool is created on Orca, it triggers the `initializePool` instructions. The pool address can be obtained from the program addresses listed in the transaction's instructions.

For instance, Index 1 and 2 represent the tokens involved in the pool, while Index 4 is for the pool's address. Note that the indexing starts from 0.

You can run this query using this [link](https://ide.bitquery.io/Latest-pool-created-on-Orca---Websocket_1).

```graphql
subscription {
  Solana {
    Instructions(
      where: {Instruction: {Program: {Method: {is: "initializePool"}, Address: {is: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"}}}}
    ) {
      Instruction {
        Program {
          Method
          Arguments {
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
        Accounts {
          Address
        }
      }
      Transaction {
        Signature
      }
    }
  }
}
```



## Latest Trades on Orca DEX API Websocket

To access a real-time stream of trades for Solana Orca DEX, [check out this GraphQL subscription (WebSocket)](https://ide.bitquery.io/Orca-DEX-Trades-Websocket).


```graphql
subscription {
  Solana {
    DEXTrades(
      where: {Trade: {Dex: {ProgramAddress: {is: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"}}}}
    ) {
      Transaction {
        Signature
      }
      Block {
        Time
      }
      Trade {
        Dex {
          ProgramAddress
          ProtocolName
          ProtocolFamily
        }
        Buy {
          Account {
            Address
          }
          Amount
          AmountInUSD
          Currency {
            MintAddress
            Symbol
            Name
          }
          Price
          PriceInUSD
        }
        Sell {
          Account {
            Address
          }
          Amount
          AmountInUSD
          Currency {
            MintAddress
            Symbol
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

## Latest Trades for a specific currency on Solana Orca DEX

If you want to monitor [trades for a specific currency on Orca DEX](https://ide.bitquery.io/Orca-DEX-Trades-for-a-specific-currency-Websocket), you can use the stream provided. Input the currency's mint address; for example, in the query below, we use the WSOL token's Mint address to fetch buys of the WSOL token.

By setting the limit to 1, you will receive the most recent trade, which reflects the latest price of the token.

Execute this query [by following this link](https://ide.bitquery.io/Orca-DEX-Trades-for-a-specific-currency-Websocket).

```graphql
subscription {
  Solana {
    DEXTrades(
      where: {Trade: {Dex: {ProgramAddress: {is: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"}}, Buy: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}}
    ) {
      Transaction {
        Signature
      }
      Block {
        Time
      }
      Trade {
        Dex {
          ProgramAddress
          ProtocolName
          ProtocolFamily
        }
        Buy {
          Account {
            Address
          }
          Amount
          AmountInUSD
          Currency {
            MintAddress
            Symbol
            Name
          }
          Price
          PriceInUSD
        }
        Sell {
          Account {
            Address
          }
          Amount
          AmountInUSD
          Currency {
            MintAddress
            Symbol
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
