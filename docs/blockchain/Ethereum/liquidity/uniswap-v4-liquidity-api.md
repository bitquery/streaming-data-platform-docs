# Uniswap v4 Liquidity on Ethereum

Uniswap **v4** changes **where** liquidity lives and **how** you identify a “pool.” This page explains that mechanism, contrasts it with earlier versions, and shows how **Bitquery** lets you read **one concrete pool’s** liquidity for a token pair using **`PoolId`**—something that is awkward or misleading if you only filter by **token addresses** or a **single factory contract**.

## How Uniswap v4 liquidity works

### Singleton architecture

In **Uniswap v2** and **v3**, each pool is typically backed by its **own pair or pool contract**. You point explorers, indexers, and APIs at that **contract address** to read reserves, positions, and events.

In **Uniswap v4**, almost all pool state lives inside one **`PoolManager`** contract (`0x000000000004444c5dc75cB358380D2e3dE08A90` on Ethereum mainnet). The protocol does **not** deploy a new contract per pair. Instead, the manager holds a **key/value style store**: each logical pool is a row of state keyed by a **`PoolId`**.

**`PoolId`** is a deterministic identifier (a `bytes32`-style hash) derived from the pool’s **static configuration**, including:

- The two **currencies** (token addresses, with ordering rules per the protocol)
- **Fee tier** (and fee control / dynamic-fee hooks where applicable)
- **Tick spacing**
- **Hooks** contract address (v4’s major extension point: custom logic invoked at pool lifecycle points)

Any change to those parameters defines a **different** pool, hence a **different `PoolId`**, even when the **two token symbols** look like “the same pair” to a user.

### Liquidity and price state

Liquidity is still conceptually **concentrated around ticks** (like v3), but the **implementation is internal to the singleton**: liquidity additions/removals and swaps update the pool’s slot inside `PoolManager` rather than updating storage on a dedicated pool contract.

**Hooks** can observe or alter behavior around swaps, liquidity changes, and more, thus two pools with the **same two tokens and fee** can still differ if **hooks** differ, producing **two different `PoolId`s** and **two separate liquidity curves**.

---

## How v4 differs from v2 and v3 (summary)

| Topic | Uniswap v2 | Uniswap v3 | Uniswap v4 |
| ----- | ---------- | ----------- | ----------- |
| **Pool identity** | Pair **contract address** | Pool **contract address** | **`PoolId`** (virtual); shared **`PoolManager`** |
| **Deployment** | New **pair contract** per pool | New **pool contract** per pool | **No** per-pool contract; pools are **state keys** |
| **“Where is the liquidity?”** | In the pair contract’s balances | In the pool contract + NFT positions manager | In **`PoolManager`** keyed by **`PoolId`** |
| **Same two tokens, multiple pools** | Uncommon (same fee, one pool) | Common (multiple fee tiers per pair) | **Very common** (fee, tick spacing, **hooks** → many **`PoolId`s**) |
| **Extensions** | Limited | Limited | **Hooks** (custom pool logic) |

---

## Why “pair only” filtering is insufficient on v4

On-chain, **every** v4 pool shares the same **`PoolManager`** address. If your pipeline only filters by:

- **`PoolManager`** as the “DEX contract,” or  
- **Two token addresses** as “the pair,”

you **merge** liquidity and events across **all** configurations (fees, tick spacings, hooks) that share those tokens. That is **not** the liquidity of a single market you care about for slippage, depth, or LP behavior.

To talk about **one** market you need the same identifier the protocol uses: **`PoolId`**.

---

## How Bitquery helps: `PoolId` on indexed liquidity events

Bitquery indexes **DEX pool liquidity** events into **`DEXPoolEvents`** (see [EVM DEXPools](/docs/cubes/evm-dexpool/)). For Uniswap v4, each event carries:

- **`PoolEvent.Pool.PoolId`** — unique logical pool (what you need on v4)  
- **`PoolEvent.Pool.SmartContract`** — the manager (or protocol-facing) address; **repeats** across v4 pools  
- **`PoolEvent.Dex.ProtocolName`** — e.g. **`uniswap_v4`** for filtering the protocol  
- **`PoolEvent.Liquidity`** — reserves / amounts and related fields as emitted after the event  

That means you can:

1. **Subscribe** to liquidity updates **across all Uniswap v4 pools**, and read **`PoolId`** on every row.  
2. **Filter to exactly one pool** with **`PoolId: { is: "0x..." }`** together with **`ProtocolName: uniswap_v4`**, and get **that pool’s** reserves and prices—not an aggregate of every WETH/USDC v4 configuration.

Without a **`PoolId`** dimension, **per-pool** v4 liquidity for a “pair” is **not** faithfully represented; Bitquery exposes **`PoolId`** so you can align with how Uniswap v4 actually partitions state.

---

## API examples

Run these in the [Bitquery IDE](https://ide.bitquery.io). Examples use **`EVM(network: ethereum)`** for Ethereum mainnet, aligned with the [Ethereum Liquidity API](/docs/blockchain/Ethereum/dextrades/ethereum-liquidity-api/) Uniswap v4 patterns.

### Latest liquidity snapshot for a V4 Pool

Returns the most recent liquidity event for a **single** Uniswap v4 pool. Replace **`$poolId`** with your target **`PoolId`** (from trades UI, subgraph, or a prior `DEXTradeByTokens` / `DEXPoolEvents` discovery query).

[Run in IDE](https://ide.bitquery.io/latest-liquidity-for-an-individual-pool-on-uniswap-v4) (paste and set variables).

```graphql
query LatestUniswapV4PoolLiquidity($poolId: String!) {
  EVM(network: eth) {
    DEXPoolEvents(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        PoolEvent: {
          Dex: { ProtocolName: { is: "uniswap_v4" } }
          Pool: { PoolId: { is: $poolId } }
        }
      }
    ) {
      Block {
        Time
        Number
      }
      PoolEvent {
        AtoBPrice
        BtoAPrice
        Dex {
          SmartContract
          ProtocolName
        }
        Liquidity {
          AmountCurrencyA
          AmountCurrencyB
          AmountCurrencyAInUSD
          AmountCurrencyBInUSD
        }
        Pool {
          PoolId
          SmartContract
          CurrencyA {
            Symbol
            SmartContract
            Name
          }
          CurrencyB {
            Symbol
            SmartContract
            Name
          }
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

**Variables**

```json
{
  "poolId": "0x2a5bf4f7f9f6044f854ae1170113504a023dbcb347f25a1809bab471f07a7dba"
}
```

Use a **`PoolId`** you obtain for your network (the value above is illustrative).

### Real-time Liquidity Streaming

Streams **every** liquidity-changing event Bitquery indexes for **`uniswap_v4`**, including **`PoolId`** so you can route updates per pool in your app or Kafka consumer.

[Run in IDE](https://ide.bitquery.io/Latest-Liquidity-Changes-of-Pools-in-a-Specific-DEX-Protocol---Uniswap-V4_6#).

```graphql
subscription UniswapV4LiquidityStream {
  EVM(network: eth) {
    DEXPoolEvents(
      where: { PoolEvent: { Dex: { ProtocolName: { is: "uniswap_v4" } } } }
    ) {
      Block {
        Time
        Number
      }
      PoolEvent {
        AtoBPrice
        BtoAPrice
        Dex {
          SmartContract
          ProtocolName
        }
        Liquidity {
          AmountCurrencyA
          AmountCurrencyB
        }
        Pool {
          PoolId
          SmartContract
          CurrencyA {
            Symbol
            SmartContract
          }
          CurrencyB {
            Symbol
            SmartContract
          }
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

### Recent liquidity Events for a V4 Pool

Useful for dashboards: last **N** updates for **one** pool only (again **`PoolId`**, not just token addresses).

[Run in IDE](https://ide.bitquery.io/recent-pool-updates-for-a-given-pool)

```graphql
query RecentUniswapV4PoolLiquidity($poolId: String!) {
  EVM(network: eth) {
    DEXPoolEvents(
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
      where: {
        PoolEvent: {
          Dex: { ProtocolName: { is: "uniswap_v4" } }
          Pool: { PoolId: { is: $poolId } }
        }
        Block: { Time: { since_relative: { days_ago: 7 } } }
      }
    ) {
      Block {
        Time
      }
      PoolEvent {
        AtoBPrice
        BtoAPrice
        Liquidity {
          AmountCurrencyA
          AmountCurrencyB
        }
        Pool {
          PoolId
          CurrencyA {
            Symbol
            SmartContract
          }
          CurrencyB {
            Symbol
            SmartContract
          }
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

### Latest Liquidity for All Uniswap V4 Pools for a Currency Pair

This API endpoint provides latest liquidity event for every Uniswap V4 pool for a given currency pair. This info includes the **Price of currencies in terms of other**, **Price of currencies in USD**, **Currency Details** and `PoolIDs`.

[Run in IDE](https://ide.bitquery.io/latest-liquidity-for-a-currency-pair-across-all-v4-pools_1)

```graphql
{
  EVM {
    DEXPoolEvents(
      limitBy: {by: PoolEvent_Pool_PoolId count: 1}
      orderBy: {descending: Block_Time}
      where: {
        PoolEvent: {
          Dex: {ProtocolName: {is: "uniswap_v4"}}, 
          Pool: {
            CurrencyA: {SmartContract: {is: "0x0bb217e40f8a5cb79adf04e1aab60e5abd0dfc1e"}}, 
            CurrencyB: {SmartContract: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}
          }
        }
      }
    ) {
      Block {
        Time
      }
      PoolEvent {
        AtoBPrice
        BtoAPrice
        AtoBPriceInUSD
        BtoAPriceInUSD
        Liquidity {
          AmountCurrencyA
          AmountCurrencyB
          AmountCurrencyAInUSD
          AmountCurrencyBInUSD
        }
        Pool {
          CurrencyA {
            Decimals
            Name
            Symbol
            SmartContract
          }
          CurrencyB {
            Decimals
            Name
            SmartContract
            Symbol
          }
          PoolId
        }
      }
    }
  }
}
```

### Monitor Liquidity Events for a Currency Pair on Uniswap V4

If looking to monitor a currency pair across all virtual pools within Uniswap V4, then this subscription works the best.

[Run in IDE](https://ide.bitquery.io/currency-pair-liquidity-events-stream)

```graphql
subscription {
  EVM {
    DEXPoolEvents(
      where: {
        PoolEvent: {
          Dex: {ProtocolName: {is: "uniswap_v4"}}, 
          Pool: {
            CurrencyA: {SmartContract: {is: "0x0bb217e40f8a5cb79adf04e1aab60e5abd0dfc1e"}}, 
            CurrencyB: {SmartContract: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}
          }
        }
      }
    ) {
      Block {
        Time
      }
      PoolEvent {
        AtoBPrice
        BtoAPrice
        AtoBPriceInUSD
        BtoAPriceInUSD
        Liquidity {
          AmountCurrencyA
          AmountCurrencyB
          AmountCurrencyAInUSD
          AmountCurrencyBInUSD
        }
        Pool {
          CurrencyA {
            Decimals
            Name
            Symbol
            SmartContract
          }
          CurrencyB {
            Decimals
            Name
            SmartContract
            Symbol
          }
          PoolId
        }
      }
    }
  }
}
```

### Latest Slippage Bucket and Price for a Transaction on Uniswap V4 Virtual Pool

This API endpoint returns the latest slippage basis points, price of currencies (in terms of other and USD) along with **MaxAmountIn** and **MaxAMountOut** for both the currecies of the virtual pool filtered out by `PoolId` for the latest transaction/swap.

[Run in IDE](https://ide.bitquery.io/latest-transaction-slippage-for-virtual-uniswap-v4-pool)

```graphql
query MyQuery {
  EVM {
    DEXPoolEvents(
      where: {PoolEvent: {Dex: {ProtocolName: {is: "uniswap_v4"}}, Pool: {PoolId: {is: "0x2a5bf4f7f9f6044f854ae1170113504a023dbcb347f25a1809bab471f07a7dba"}}}}
      orderBy: {descending: Block_Time}
    ) {
      Transaction {
        Hash
      }
      joinDEXPoolSlippages(Transaction_Hash: Transaction_Hash) {
        Price {
          AtoB {
            MaxAmountIn
            MaxAmountInInUSD
            MinAmountOut
            MinAmountOutInUSD
            Price
            PriceInUSD
          }
          SlippageBasisPoints
          Pool {
            CurrencyA {
              Decimals
              SmartContract
              Name
              Symbol
            }
            CurrencyB {
              Name
              SmartContract
              Symbol
              Decimals
            }
          }
          BtoA {
            MaxAmountIn
            MaxAmountInInUSD
            MinAmountOut
            MinAmountOutInUSD
            Price
            PriceInUSD
          }
        }
      }
    }
  }
}
```

---

## Related documentation

- [Uniswap v4 DEX Trades API](https://docs.bitquery.io/docs/blockchain/Ethereum/dextrades/uniswap-v4-api/) — trades, `PoolId` filters, pair stats  
- [Ethereum Liquidity API](https://docs.bitquery.io/docs/blockchain/Ethereum/dextrades/pools-api/) — more `DEXPoolEvents` patterns, including Uniswap v4 subscription examples  
- [DEXPools cube](https://docs.bitquery.io/docs/cubes/evm-dexpool/) — field semantics and event types  
