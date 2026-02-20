---
sidebar_position: 2
---

# Solana DEX Pools API

In this section we will see how to get Solana DEX Pools information using our API.

<head>
<meta name="title" content="Solana DEX Pools API | Get Liquidity Data of the Pools"/>
<meta name="description" content="Get on-chain data of liquidity pools and trading pairs from any Solana based DEX like Raydium, Jupiter, Phoenix etc through our DEX Pools API."/>
<meta name="keywords" content="Solana DEX Pools api,Solana DEX Pools python api,Solana DEX Pools token api,Solana Dex NFT api, DEX Trades scan api, DEX Pools api, DEX Pools api docs, DEX Pools crypto api, DEX Pools blockchain api,solana network api, solana web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Solana DEX Pools API | Get Liquidity Data of the Pools"
/>
<meta
  property="og:description"
  content="Get on-chain data of liquidity pools and trading pairs from any Solana based DEX like Raydium, Jupiter, Phoenix etc through our DEX Pools API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Solana DEX Pools API | Get Liquidity Data of the Pools" />
<meta property="twitter:description" content="Get on-chain data of liquidity pools and trading pairs from any Solana based DEX like Raydium, Jupiter, Phoenix etc through our DEX Pools API." />
</head>

## Get all Liquidity Pools updates on Solana

To get all Liquidity pools updates on solana use [this stream](https://ide.bitquery.io/solana-dex-pools-update-stream).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools {
      Block {
        Time
      }
      Pool {
        Base {
          ChangeAmount
          PostAmount
          Price
          PriceInUSD
        }
        Quote {
          ChangeAmount
          PostAmount
          Price
          PriceInUSD
        }
        Dex {
          ProgramAddress
          ProtocolFamily
        }
        Market {
          BaseCurrency {
            MintAddress
            Name
            Symbol
          }
          QuoteCurrency {
            MintAddress
            Name
            Symbol
          }
          MarketAddress
        }
      }
    }
  }
}
```

</details>

## Get Tokens which have liquidity over 1 Million USD

You can use the below query to get the tokens which are getting traded and have liquidity over 1 million USD. Try out the query [here](https://ide.bitquery.io/Search-tokens-with-liquidity-over-1-million#).

<details>
  <summary>Click to expand GraphQL query</summary>

```
subscription MyQuery {
  Solana {
    DEXPools(
      where: {Pool: {Base: {PostAmountInUSD: {ge: "1000000"}}, Market: {QuoteCurrency: {MintAddress: {in: ["11111111111111111111111111111111", "So11111111111111111111111111111111111111112"]}}}}, Transaction: {Result: {Success: true}}}
    ) {
      Block {
        Time
      }
      Transaction {
        Signature
      }
      Pool {
        Base {
          PostAmount
          PostAmountInUSD
          Price
          PriceInUSD
        }
        Quote{
          PostAmount
          PostAmountInUSD
        }
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Name
            Symbol
          }
          QuoteCurrency {
            Name
            MintAddress
            Symbol
          }
        }
        Dex {
          ProtocolFamily
          ProgramAddress
          ProtocolName
        }
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Name
            Symbol
          }
          QuoteCurrency {
            Name
            MintAddress
            Symbol
          }
        }
      }
    }
  }
}

```

</details>

## Get All Liquidity Pools info for a particular token

This query will give you the information on all the liquidity pools of a particular token `EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm`.
You can find the query [here](https://ide.bitquery.io/get-all-the-liquidity-pools-info-for-a-particular-token_1)

<details>
  <summary>Click to expand GraphQL query</summary>

```
query ($token: String) {
  Solana {
    DEXPools(
      orderBy: {descendingByField: "Pool_Quote_PostAmountInUSD_maximum"}
      where: {Pool: {Market: {BaseCurrency: {MintAddress: {is: $token}}}}}
    ) {
      Pool {
        Market {
          QuoteCurrency {
            Symbol
            Name
            MintAddress
          }
          MarketAddress
        }
        Dex {
          ProtocolFamily
        }
        Base {
          PostAmount(maximum: Block_Slot)
          PostAmountInUSD(maximum: Block_Slot)
        }
        Quote {
          PostAmount(maximum: Block_Slot)
          PostAmountInUSD(maximum: Block_Slot)
        }
      }
    }
  }
}
{
  "token": "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"
}
```

</details>

![image](https://github.com/user-attachments/assets/21882e2a-e769-4703-be56-15b7924b6318)

Check data here on [DEXrabbit](https://dexrabbit.com/solana/token/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm#pools).

## Get Latest Liquidity for All Pools of a Token

Use this query to get latest liquidity snapshots for all pools where a token appears either on the base side or quote side.

Try the query [here](https://ide.bitquery.io/liqidity-of-all-pools-of-a-token)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query GetLatestLiquidityForPool {
  Solana(dataset: realtime) {
    DEXPools(
      where: {
        Pool: {
          Market: {
            BaseCurrency: { Name: { not: "" } }
            QuoteCurrency: { Name: { not: "" } }
          }
        }
        any: [
          {
            Pool: {
              Market: {
                BaseCurrency: {
                  MintAddress: {
                    is: "F5tfztTnE4sYsMhZT5KrFpWvHmYSfJZoRjCuxKPbpump"
                  }
                }
              }
            }
          }
          {
            Pool: {
              Market: {
                QuoteCurrency: {
                  MintAddress: {
                    is: "F5tfztTnE4sYsMhZT5KrFpWvHmYSfJZoRjCuxKPbpump"
                  }
                }
              }
            }
          }
        ]
        Transaction: { Result: { Success: true } }
      }
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
          PostAmount(maximum: Block_Slot)
          PostAmountInUSD(maximum: Block_Slot)
        }
        Base {
          PostAmount(maximum: Block_Slot)
          PostAmountInUSD(maximum: Block_Slot)
        }
      }
    }
  }
}
```

</details>

## Latest Price of Token Based on Liqudity

[This](https://ide.bitquery.io/latest-price-based-on-liquidity_2) subscription given below returns the latest and real-time price and other info related to the token, DEX and market for the following token `LMFzmYL6y1FX8HsEmZ6yNKNzercBmtmpg2ZoLwuUboU`.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Market: {
            BaseCurrency: {
              MintAddress: { is: "So11111111111111111111111111111111111111112" }
            }
          }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Block {
        Time
      }
      Pool {
        Base {
          ChangeAmount
          PostAmount
          Price
          PriceInUSD
        }
        Dex {
          ProgramAddress
          ProtocolFamily
        }
        Market {
          BaseCurrency {
            MintAddress
            Name
            Symbol
          }
          MarketAddress
        }
      }
    }
  }
}
```

</details>

## Get Latest Liquidity of any Liquidity Pool

This query gets you the liquidity/balance of the Quote Currency `WSOL` and Base Currency `SOLANADOG` for this particular pool address `BDQnwNhTWc3wK4hhsnsEaBBMj3sD4idGzvuidVqUw1vL`. THe liquidity value of the currencies will be in `Quote{PostAmount}` and `Base{PostAmount}`.
You can find the query [here](https://ide.bitquery.io/Get-LP-Latest-liqudity-on-Solana)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query GetLatestLiquidityForPool {
  Solana(dataset: realtime) {
    DEXPools(
      where: {
        Pool: {
          Market: {
            MarketAddress: {
              is: "HktfL7iwGKT5QHjywQkcDnZXScoh811k7akrMZJkCcEF"
            }
          }
        }
        Transaction: { Result: { Success: true } }
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

</details>

## Get Locked Liquidity of a Pool on Solana

This query retrieves the locked liquidity of a pool on Solana by querying balance updates for a specific pool account owner and currency. The locked liquidity is calculated as twice the balance of WSOL in USD (since pools typically have two tokens locked). You can find the query [here](https://ide.bitquery.io/get-locked-liquidity-of-a-pool-on-Solana).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    BalanceUpdates(
      where: {
        BalanceUpdate: {
          Account: {
            Owner: { is: "FPY1pAp1xLq2hihs1Tm2tE2F8VQThXhLBvvZnvdfHCTb" }
          }
          Currency: {
            MintAddress: { is: "So11111111111111111111111111111111111111112" }
          }
        }
      }
      orderBy: { descendingByField: "BalanceUpdate_Balance_maximum" }
    ) {
      BalanceUpdate {
        Balance: PostBalanceInUSD(maximum: Block_Slot)
        Currency {
          Name
          Symbol
          MintAddress
        }
      }
      locked_liquidity: calculate(expression: "$BalanceUpdate_Balance*2")
    }
  }
}
```

</details>

## Get Top Pools Based on Liquidity

[This](https://ide.bitquery.io/top-10-liquidity-pools_1) query retrieves the top liquidity pools on the Solana blockchain, sorted by their total liquidity (PostAmount). The query is filtered for pools that have been active since a specific time period. The results are limited to the top 10 pools based on their liquidity.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query GetTopPoolsByDex {
  Solana {
    DEXPools(
      orderBy: { descending: Pool_Quote_PostAmount }
      where: {
        Block: { Time: { after: "2024-08-27T12:00:00Z" } }
        Transaction: { Result: { Success: true } }
      }
      limit: { count: 10 }
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
          ProtocolName
          ProtocolFamily
        }
        Quote {
          PostAmount
          PostAmountInUSD
          PriceInUSD
        }
        Base {
          PostAmount
        }
      }
    }
  }
}
```

</details>

## Liquidity Add Events Tracked Using Instructions

This query tracks liquidity addition events on Solana DEX pools by monitoring specific instructions.

[ Run query](https://ide.bitquery.io/All-liquidity-add-instructions-track-on-Solana#)

<details>

  <summary>Click to expand GraphQL query</summary>

```
{
  Solana(network: solana) {
    DEXPools(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {Instruction: {Program: {Method: {in: ["add_liquidity", "addLiquidity", "increase_liquidity", "increaseLiquidity", "increase_liquidity_v2", "deposit", "depositAllTokenTypes", "join", "provide_liquidity"]}}}}
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            Symbol
            Name
            MintAddress
          }
          QuoteCurrency {
            Symbol
            Name
            MintAddress
          }
        }
        Base {
          ChangeAmount
          ChangeAmountInUSD
          PostAmount
          PostAmountInUSD
          Price
          PriceInUSD
        }
        Quote {
          ChangeAmount
          ChangeAmountInUSD
          PostAmount
          PostAmountInUSD
          Price
          PriceInUSD
        }
        Dex {
          ProtocolName
          ProtocolFamily
        }
      }
      Block {
        Time
      }
      Transaction {
        Signature
      }
    }
  }
}

```

</details>

## Liquidity Remove Events Tracked Using Withdraw Instruction

This query tracks liquidity removal events on Solana DEX pools by monitoring withdraw instructions.

[ Run query](https://ide.bitquery.io/Copy-of-Solana-DEXPools-withdraw)

<details>

  <summary>Click to expand GraphQL query</summary>

```

{
  Solana(network: solana) {
    DEXPools(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {Instruction: {Program: {Method: {is: "withdraw"}}}}
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            Symbol
            Name
            MintAddress
          }
          QuoteCurrency {
            Symbol
            Name
            MintAddress
          }
        }
        Base {
          ChangeAmount
          ChangeAmountInUSD
          PostAmount
          PostAmountInUSD
          Price
          PriceInUSD
        }
        Quote {
          ChangeAmount
          ChangeAmountInUSD
          PostAmount
          PostAmountInUSD
          Price
          PriceInUSD
        }
        Dex {
          ProtocolName
          ProtocolFamily
        }
      }
      Block {
        Time
      }
      Transaction {
        Signature
      }
    }
  }
}

```

</details>

## Liquidity Events for Raydium Pairs

In this section, we will discover data streams that provides us with the real time events of liquidity addition and liquidity removal for the Raydium DEX, which has `675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8` as the Program Address.

### Liquidity addition for Raydium Pairs

[This](https://ide.bitquery.io/liquidity-addition-for-Raydium_1) subscription returns the real-time liquidity addition event details for the Raydium Pairs.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: {
            ProgramAddress: {
              is: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
            }
          }
          Base: { ChangeAmount: { gt: "0" } }
        }
      }
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
          ChangeAmount
          PostAmount
        }
      }
    }
  }
}
```

</details>

### Liquidity removal for Raydium Pairs

[This](https://ide.bitquery.io/liquidity-removal-for-Raydium_1) subscription returns the real-time liquidity addition event details for the Raydium Pairs.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: {
            ProgramAddress: {
              is: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
            }
          }
          Base: { ChangeAmount: { lt: "0" } }
        }
      }
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
          ChangeAmount
          PostAmount
        }
      }
    }
  }
}
```

</details>

## Liquidity Events for Orca Whirlpool Pairs

In this section, we will discover data streams that provides us with the real time events of liquidity addition and liquidity removal for the Orca Whirlpool DEX, which has `whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc` as the Program Address.

### Liquidity addition for Orca Whirlpool Pairs

[This](https://ide.bitquery.io/liquidity-addition-for-orca-whirlpool_1) subscription returns the real-time liquidity addition event details for the Orca Whirlpool Pairs.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: {
            ProgramAddress: {
              is: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"
            }
          }
          Base: { ChangeAmount: { gt: "0" } }
        }
      }
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
          ChangeAmount
          PostAmount
        }
      }
    }
  }
}
```

</details>

### Liquidity removal for Orca Whirlpool Pairs

[This](https://ide.bitquery.io/liquidity-removal-for-orca-whirlpool_1) subscription returns the real-time liquidity addition event details for the Orca Whirlpool Pairs.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: {
            ProgramAddress: {
              is: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"
            }
          }
          Base: { ChangeAmount: { lt: "0" } }
        }
      }
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
          ChangeAmount
          PostAmount
        }
      }
    }
  }
}
```

</details>

## Liquidity Events for Meteora Pairs

In this section, we will discover data streams that provides us with the real time events of liquidity addition and liquidity removal for the Meteora DEX, which has `Meteora` as the Protocol Family.

### Liquidity addition for Meteora Pairs

[This](https://ide.bitquery.io/liquidity-addition-for-meteora_1) subscription returns the real-time liquidity addition event details for the Meteora Pairs.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: { ProtocolFamily: { is: "Meteora" } }
          Base: { ChangeAmount: { gt: "0" } }
        }
      }
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
          ChangeAmount
          PostAmount
        }
      }
    }
  }
}
```

</details>

### Liquidity removal for Meteora Pairs

[This](https://ide.bitquery.io/liquidity-removal-for-meteora_1) subscription returns the real-time liquidity addition event details for the Meteora Pairs.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: { ProtocolFamily: { is: "Meteora" } }
          Base: { ChangeAmount: { lt: "0" } }
        }
      }
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
          ChangeAmount
          PostAmount
        }
      }
    }
  }
}
```

</details>
