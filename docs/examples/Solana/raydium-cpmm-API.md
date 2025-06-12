# Raydium CPMM API

In this section we will see how to get data on Raydium CPMM trades in real-time. You can check out our [Pump Fun docs](https://docs.bitquery.io/docs/examples/Solana/Pump-Fun-API/), [Raydium v4 docs](https://docs.bitquery.io/docs/examples/Solana/Solana-Raydium-DEX-API/) and [Raydium LaunchPad docs](https://docs.bitquery.io/docs/examples/Solana/launchpad-raydium/) too.



:::note
`Trade Side Account` field will not be available as aggregates in Archive and Combined Datasets
:::

<head>
<meta name="title" content="Raydium CPMM API - Monitor Solana Liquidity Pools & Trading Activity"/>
<meta name="description" content="Access real-time data on Raydium's (CPMM) on Solana. Use our API to track liquidity pools, trades, and more."/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Raydium CPMM API - Real-Time Solana Liquidity Pools & Trades"
/>
<meta
  property="og:description"
  content="Get up-to-date information on Raydium's CPMM on Solana. Use our API to monitor liquidity pools and trading activities."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Raydium CPMM API - Monitor Solana Liquidity Pools & Trading Activity" />
<meta property="twitter:description" content="Access real-time data on Raydium's CPMM on Solana. Use our API to track liquidity pools, trades, and more." />
</head>

## Subscribe to Realtime CPMM Trades

This query subscribes to real-time trades on the Raydium CPMM on the Solana blockchain by filtering using `{Program: {Address: {is: "CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C"}}}:`.
You can run the query [here](https://ide.bitquery.io/CPMM-trades).

```
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

```
{
  Solana {
    Instructions(
      where: {Instruction: {Program: {Address: {is: "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"}, Method: {is: "createPool"}}}, Transaction: {Result: {Success: true}}}
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
