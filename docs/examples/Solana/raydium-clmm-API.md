# Raydium CLMM API

In this section we will see how to get data on Raydium CLMM trades in real-time. According to the official docs available [here](https://docs.raydium.io/raydium/liquidity-providers/providing-concentrated-liquidity-clmm/intro-on-concentrated-liquidity),

"Concentrated Liquidity Market Maker (CLMM) pools allow liquidity providers to select a specific price range at which liquidity is active for trades within a pool. "

This Solana API is part of our Early Access Program (EAP), which is intended for evaluation purposes.

This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

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
You can run the query [here](https://ide.bitquery.io/Raydium-CLMM-DEX-Trades)

```
subscription MyQuery {
  Solana {
    DEXTrades(
      where: {Instruction: {Program: {Address: {is: "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"}}}, Transaction: {Result: {Success: true}}}
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

-   **amount0Max** corresponds to **tokenVault0** and **tokenAccount0**.
-   **amount1Max** corresponds to **tokenVault1** and **tokenAccount1**.

-   **amount0Max**: The maximum amount of **Token 0** to be added to the position. 
-   **amount1Max**: The maximum amount of **Token 1** to be added to the position. 

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