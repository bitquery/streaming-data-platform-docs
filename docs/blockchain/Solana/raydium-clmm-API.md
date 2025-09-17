# Raydium CLMM API

Bitquery provides comprehensive real-time and historical data APIs and Streams for the Solana blockchain, enabling developers and traders to build powerful applications and execute trades based on reliable information.

## Frequently Asked Questions (FAQ)

### Can I monitor Raydium CLMM trades in real-time?

Yes, you can subscribe to real-time Raydium CLMM trades using GraphQL subscriptions. The API filters trades by the Raydium CLMM program address `CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK` and provides trade data as it happens on-chain. Examples available below.

### What data can I get from the Raydium CLMM API?

The API provides data for:

- **DEX Trades**: Buy/sell amounts, token details (name, symbol, mint address, decimals), trader addresses, and transaction signatures
- **Pool Creation**: Track new CLMM pools with token pairs, creator information, and account details
- **Position Management**: Monitor position opening (`openPositionV2`), closing (`closePosition`), and liquidity modifications (`increaseLiquidityV2`, `decreaseLiquidityV2`)

### How do I use Bitquery's Solana APIs?

Bitquery provides GraphQL APIs for Solana data. You can test queries using the IDE at ide.bitquery.io or convert queries to subscriptions for real-time data via WebSocket connections. To access API outside the IDE, you need to use your OAuth token, generate one [here](https://account.bitquery.io/user/api_v2/access_tokens). For enterprise users, we also offer Kafka streams for high-throughput data processing.

### What Kafka streams are available for Solana?

Bitquery provides managed Kafka topics including `solana.dextrades.proto`, `solana.tokens.proto`, and `solana.transactions.proto` with pre-parsed, enriched Protocol-Buffers events. These streams offer sub-second latency and enterprise-grade reliability for high-volume data processing.

### Where can I find more information about Solana APIs?

For comprehensive Solana API documentation, visit [https://docs.bitquery.io/docs/blockchain/Solana/](https://docs.bitquery.io/docs/blockchain/Solana/). For real-time streaming options, check out [https://docs.bitquery.io/docs/streams/real-time-solana-data/](https://docs.bitquery.io/docs/streams/real-time-solana-data/).

## Raydium CLMM API Guide

In this section we will see how to get data on Raydium CLMM trades in real-time. According to the official docs available [here](https://docs.raydium.io/raydium/liquidity-providers/providing-concentrated-liquidity-clmm/intro-on-concentrated-liquidity),

"Concentrated Liquidity Market Maker (CLMM) pools allow liquidity providers to select a specific price range at which liquidity is active for trades within a pool. "

:::note
`Trade Side Account` field will not be available as aggregates in Archive and Combined Datasets
:::

<head>
<meta name="title" content="Raydium CLMM API - Monitor Solana Liquidity Pools & Trading Activity"/>
<meta name="description" content="Access real-time data on Raydium's concentrated liquidity market maker (CLMM) on Solana. Use our API to track liquidity pools, trades, and more."/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Raydium CLMM API - Real-Time Solana Liquidity Pools & Trades"
/>
<meta
  property="og:description"
  content="Get up-to-date information on Raydium's CLMM on Solana. Use our API to monitor liquidity pools and trading activities."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Raydium CLMM API - Monitor Solana Liquidity Pools & Trading Activity" />
<meta property="twitter:description" content="Access real-time data on Raydium's CLMM on Solana. Use our API to track liquidity pools, trades, and more." />
</head>

## Subscribe to Realtime CLMM Trades

This query subscribes to real-time trades on the Raydium CLMM (Concentrated Liquidity Market Maker) on the Solana blockchain by filtering using `{Program: {Address: {is: "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"}}}:`.
You can run the query [here](https://ide.bitquery.io/Raydium-CLMM-DEX-Trades-with-AccountNames)

```
subscription MyQuery {
  Solana {
    DEXTrades(
      where: {Instruction: {Program: {Address: {is: "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"}}}, Transaction: {Result: {Success: true}}}
    ) {
      Instruction {
        Program {
          Method
          AccountNames
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

## Latest Pool Creation on Raydium CLMM

The below query tracks latest pool creation on raydium CLMM.

The `"Program": {"AccountNames"}` includes the order in which account addresses are mentioned in `Accounts` list.

This includes `poolCreator`, token vaults (`tokenVault0`, `tokenVault1`) and token mints (`tokenMint0`, `tokenMint1`).

The mint addresses for the tokens being used in the pool are listed for example `tokenMint1` could be any newly deployed token and `tokenMint0` can be WSOL , indicating which tokens the CLMM pool will support.

You can run the query [here](https://ide.bitquery.io/Raydium-CLMM-Pool-Creation)

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

## Latest Positions Closed

The below query tracks latest position closes on raydium CLMM by filtering using `Method: {is: "closePosition"}`. The `personalPosition` account which is the 4th in the list of `Accounts` includes the address of account to store personal position.

```
{
  Solana {
    Instructions(
      where: {Instruction: {Program: {Address: {is: "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"}, Method: {is: "closePosition"}}}, Transaction: {Result: {Success: true}}}
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

## Latest Positions Created

The below query tracks latest position created on raydium CLMM by filtering using `Method: {is: "openPositionV2"}`.

This is where various accounts like NFTs, tokens, and program states are updated. The parameters define liquidity and token amounts involved in the position.

- **amount0Max** corresponds to **tokenVault0** and **tokenAccount0**.
- **amount1Max** corresponds to **tokenVault1** and **tokenAccount1**.

- **amount0Max**: The maximum amount of **Token 0** to be added to the position.
- **amount1Max**: The maximum amount of **Token 1** to be added to the position.

```
{
  Solana {
    Instructions(
      where: {Instruction: {Program: {Address: {is: "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"}, Method: {is: "openPositionV2"}}}, Transaction: {Result: {Success: true}}}
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

## CLMM Position Line : Adding Liquidity at a Price

This API fetches Increase Liquidity V2 transactions from the Raydium CLMM on Solana. It retrieves relevant data, including liquidity amounts, token accounts, execution logs, and transaction details.

The arguments and account details include

- `AccountNames`: List of accounts involved

```
 "nftOwner",
 "nftAccount",
 "poolState",
 "protocolPosition",
"personalPosition",
"tickArrayLower",
"tickArrayUpper",
"tokenAccount0",
"tokenAccount1",
"tokenVault0",
"tokenVault1",
"tokenProgram",
"tokenProgram2022",
"vault0Mint",
"vault1Mint"

```

- `Address`: Contract address of the program
- `Arguments` (Liquidity & Token Values)
  - `liquidity` → `{json}`
  - `amount0Max` → The maximum amount of Token 0 (possibly SOL) added as liquidity.
  - `amount1Max` → The maximum amount of Token 1 (SPL token) added as liquidity.

You can run the query [here](https://ide.bitquery.io/increaseLiquidityV2-latest-raydium-clmm#)

```
{
  Solana {
    Instructions(
      where: {Instruction: {Program: {Address: {is: "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"}, Method: {is: "increaseLiquidityV2"}}}, Transaction: {Result: {Success: true}}}
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
          Name
          Method
          Json
          Parsed
        }
        Logs
      }
      Transaction {
        Signature
        Signer
      }
    }
  }
}

```

## CLMM Position Line : Removing Liquidity at a Price

This API fetches **Decrease Liquidity V2** transactions from the **Raydium CLMM** on **Solana**. It retrieves relevant data, including liquidity amounts, token accounts, execution logs, and transaction details.

### **Arguments and Account Details**

- **`AccountNames`**: List of accounts involved

```
 "nftOwner",
 "nftAccount",
 "personalPosition",
 "poolState",
 "protocolPosition",
 "tokenVault0",
 "tokenVault1",
 "tickArrayLower",
 "tickArrayUpper",
 "recipientTokenAccount0",
 "recipientTokenAccount1",
 "tokenProgram",
 "tokenProgram2022",
 "memoProgram",
 "vault0Mint",
 "vault1Mint"

```

- **`Address`**: Contract address of the program
- **`Arguments` (Liquidity & Token Values)**
  - `liquidity` → `{json}`
  - `amount0Min` → The minimum amount of **Token 0** (possibly SOL) withdrawn from liquidity.
  - `amount1Min` → The minimum amount of **Token 1** (SPL token) withdrawn from liquidity.

You can run the query **[here](https://ide.bitquery.io/decreaseLiquidityV2-latest-raydium-clmm_1#)**

```
{
  Solana {
    Instructions(
      where: {Instruction: {Program: {Address: {is: "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"}, Method: {is: "decreaseLiquidityV2"}}}, Transaction: {Result: {Success: true}}}
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
          Name
          Method
          Json
          Parsed
        }
        Logs
      }
      Transaction {
        Signature
        Signer
      }
    }
  }
}

```
