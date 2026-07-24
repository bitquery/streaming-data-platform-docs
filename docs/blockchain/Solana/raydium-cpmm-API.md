---
title: "Solana Raydium Cpmm API"
description: "Solana Raydium Cpmm API: real-time Solana memecoin and DEX data via Bitquery GraphQL APIs and Kafka streams. Works with WebSocket live subscriptions."
---
# Raydium CPMM API

:::tip Need real-time Raydium CPMM data or anything from the last ~30 days?
For **real-time + last ~30 days**, use the [**Trading cube**](/docs/trading/trading-data-overview) — [`Trading.Trades`](/docs/trading/crypto-trades-api/trades-api) gives you clean, MEV-filtered Raydium CPMM swaps with **USD price, market cap, and supply on every row** across **9 chains in one API**. Use this page when you need **historical Raydium CPMM data older than ~30 days**, raw per-swap detail, or call / event context.
:::

In this section we will see how to get data on Raydium CPMM trades in real-time. You can check out our [Pump Fun docs](/docs/blockchain/Solana/Pumpfun/Pump-Fun-API/), [Raydium v4 docs](/docs/blockchain/Solana/Solana-Raydium-DEX-API/) and [Raydium LaunchPad docs](/docs/blockchain/Solana/launchpad-raydium/) too.

:::note
`Trade Side Account` field will not be available as aggregates in Archive and Combined Datasets
:::

## Subscribe to Realtime CPMM Trades

This query subscribes to real-time trades on the Raydium CPMM on the Solana blockchain by filtering using `{Program: {Address: {is: "CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C"}}}:`.
You can run the query [here](https://ide.bitquery.io/CPMM-trades).

```graphql
subscription MyQuery {
  Solana {
    DEXTrades(
      where: {Instruction: {Program: {Address: {is: "CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C"}}}, Transaction: {Result: {Success: true}}}
    ) {
      Instruction {
        Program {
          Method
        }
      }
      Trade {
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

## Latest Pool Creation on Raydium CPMM

The below query tracks latest pool creation on raydium CPMM.

The `"Program": {"AccountNames"}` includes the order in which account addresses are mentioned in `Accounts` list.

This includes `poolCreator`, token vaults (`tokenVault0`, `tokenVault1`) and token mints (`tokenMint0`, `tokenMint1`).

The mint addresses for the tokens being used in the pool are listed for example `tokenMint1` and `tokenMint0` , indicating which tokens the CPMM will support.

You can run the query [here](https://ide.bitquery.io/CPMM-pools-created_1)

```graphql
{
  Solana {
    Instructions(
      where: {Instruction: {Program: {Address: {is: "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"}, Method: {is: "initialize"}}}, Transaction: {Result: {Success: true}}}
      limit: {count: 10}
      orderBy: {descending: Block_Time}
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
        Program {
          AccountNames
          Address
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
        }
      }
      Transaction {
        Signature
        Signer
      }
    }
  }
}

```
