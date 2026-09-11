---
sidebar_position: 2
title: "Solana DEX Pools API"
description: "Query Solana liquidity pools with Bitquery GraphQL: pool updates in real time, tokens above a liquidity threshold, per-token pools and latest reserves."
---
import FAQ from "@site/src/components/FAQ";
import ProductCTA from "@site/src/components/ProductCTA";

# Solana DEX Pools API

:::tip Need real-time Solana DEX pool data or anything from the last ~30 days?
For **real-time + last ~30 days**, use the [**Trading cube**](/docs/trading/trading-data-overview) — [`Trading.Trades`](/docs/trading/crypto-trades-api/trades-api) gives you clean, MEV-filtered Solana DEX pool swaps with **USD price, market cap, and supply on every row** across **9 chains in one API**. Use this page when you need **historical Solana DEX pool data older than ~30 days**, raw per-swap detail, or call / event context.

Pool and liquidity data ships with the [Solana DEX API](https://bitquery.io/products/solana-dex-api) — the product page covers venues, plans and real-time delivery.
:::

In this section we will see how to get Solana DEX Pools information using our API.

<ProductCTA href="https://bitquery.io/products/solana-dex-api" title="Solana DEX API" />

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

```graphql
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

```graphql
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

Check data here on [DEXrabbit](https://dexrabbit.bitquery.io/solana/token/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm#pools).

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

```graphql
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

```graphql

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

## How DEXPools Values Are Calculated

What `PostAmount` measures, when its USD value is priced, and how to order updates that land in the same slot. Read this before feeding `DEXPools` into a simulator, bot or risk model.

### What `Base.PostAmount` and `Quote.PostAmount` represent

`PostAmount` is the pool's **vault balance** of that token after the event, read from the on-chain token balances. `Base.PostAmount + Quote.PostAmount` is therefore everything the pool holds, not just the liquidity that is currently tradable.

For concentrated-liquidity pools (Raydium CLMM `amm_v3`, Orca Whirlpool, Meteora DLMM) this includes liquidity in positions that are out of range. It is not the active in-range liquidity at the current tick. For constant-product pools (Raydium `raydium_amm`, `raydium_cp_swap`, PumpSwap) the vault balances are the reserves the swap formula uses.

`ChangeAmount` is the signed change that event caused: positive when tokens entered the pool, negative when they left.

### How `PostAmountInUSD` is priced

`PostAmountInUSD` = `PostAmount` × the token's USD price from the Bitquery [price index](/docs/trading/crypto-price-api/price-index-algorithm). The same rule fills `ChangeAmountInUSD`.

The price is looked up at the block's timestamp: you get the latest index price at or before `Block.Time`, never a later one. Every row in the same block uses the same USD price for a given token.

The index price is a volume-weighted blend of the token's pools over a rolling 1-hour window, with recent trades weighted more. Stablecoins take their USD price from an external spot source instead. If the index has no price for a token, its `PostAmountInUSD` is `0`. USD values carry about 7 significant digits, so use `PostAmount` when you need exact amounts.

### How fresh the USD price is

The response has no field for the timestamp or source of the price used in the conversion. For actively traded tokens the index updates every few seconds. For thinly traded tokens the last index price can be minutes old, because pools stay in the 1-hour blend after they stop trading.

If your system needs a strict freshness limit, take the native `PostAmount` from `DEXPools` and price it yourself with [`Trading.Tokens`](/docs/trading/crypto-price-api/tokens) or [`Trading.Pairs`](/docs/trading/crypto-price-api/pairs) at a 1-second interval. Every Trading row carries its own `Block.Time`, so you can reject prices older than your limit.

### `PriceInUSD` vs `PostAmountInUSD`

The two fields use different prices, so dividing `PostAmountInUSD` by `PostAmount` will not match `PriceInUSD`.

- `Base.PriceInUSD` / `Quote.PriceInUSD` is the pool's own price, from its reserves after the event, converted to USD with the other token's price.
- `PostAmountInUSD` uses the price index described above, which blends all of the token's pools.

For a token's market price across all venues, use the [Trading cube](/docs/trading/trading-data-overview).

### Ordering multiple updates within one slot

A busy pool can change several times in one slot. Sort by these four fields to get a deterministic order:

1. `Block.Slot`
2. `Transaction.Index`: position of the transaction in the block
3. `Instruction.Index`: position of the instruction in the transaction
4. `Instruction.InternalSeqNumber`: tie-breaker for inner instructions

Sorted descending on all four, the first row is the pool's latest state. The query below returns the latest 20 updates of one pool, newest first. For only the latest state, see [Get Latest Liquidity of any Liquidity Pool](#get-latest-liquidity-of-any-liquidity-pool).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query PoolUpdatesInOrder($market: String) {
  Solana(dataset: realtime) {
    DEXPools(
      limit: { count: 20 }
      orderBy: [
        { descending: Block_Slot }
        { descending: Transaction_Index }
        { descending: Instruction_Index }
        { descending: Instruction_InternalSeqNumber }
      ]
      where: {
        Pool: { Market: { MarketAddress: { is: $market } } }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Block {
        Time
        Slot
      }
      Transaction {
        Index
        Signature
      }
      Instruction {
        Index
        InternalSeqNumber
      }
      Pool {
        Base {
          PostAmount
          PostAmountInUSD
        }
        Quote {
          PostAmount
          PostAmountInUSD
        }
      }
    }
  }
}
```

```json
{
  "market": "DmAsjXoceoL5vTKZbYpTpXPo7MKm16FMfNMm3PJFiUha"
}
```

</details>

<FAQ
  items={[
    { q: "How do I find newly created Solana liquidity pools?", a: "Query or subscribe to Solana.DEXPools sorted by creation time with optional protocol filters." },
    { q: "Can I monitor liquidity changes?", a: "Yes — pool reserve fields update as trades and LP events occur. Use subscriptions for live monitoring." },
    { q: "Is DEXPools PostAmountInUSD priced at the event's Block.Time?", a: "Yes. PostAmountInUSD is PostAmount times the token's USD price from the Bitquery price index, looked up at the block timestamp: the latest index price at or before Block.Time, never a later one. All rows in a block share the same price for a token." },
    { q: "Can I query the timestamp or source of the USD conversion price?", a: "No. The row has no field for it. For a strict freshness limit, take the native PostAmount and price it yourself with Trading.Tokens or Trading.Pairs at a 1-second interval, where every row carries its own Block.Time." },
    { q: "Does PostAmount include inactive concentrated liquidity?", a: "Yes. PostAmount is the pool's vault balance of each token, so for Raydium CLMM, Orca Whirlpool and Meteora DLMM it includes out-of-range positions. It is not the active in-range liquidity." },
    { q: "Why does PostAmountInUSD divided by PostAmount not match PriceInUSD?", a: "They use different prices. PriceInUSD is the pool's own price from its reserves; PostAmountInUSD uses the price index, which blends all of the token's pools over a 1-hour window." },
    { q: "How do I order several DEXPools updates in the same slot?", a: "Sort by Block.Slot, Transaction.Index, Instruction.Index and Instruction.InternalSeqNumber, all descending. The first row is the pool's latest state." },
  ]}
/>
