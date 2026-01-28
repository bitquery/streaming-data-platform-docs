# Mental Model: Transfers, Events, Calls, and DexTrades

Understanding when to use **Transfers**, **Events**, **Calls**, or **DexTrades** is one of the decisions you'll make when querying blockchain data. This guide explains the conceptual differences and helps you choose the right primitive for your use case.

**Chain scope:** The primitives below are described for **EVM chains** (Ethereum, BSC, Base, Arbitrum, etc.). **Solana** and **Tron** share the same high-level ideas (Transfers, DexTrades) but use different cubes where the chain model differs. See [Applying this model across chains](#applying-this-model-across-chains) for Solana, Tron, and other non-EVM chains.

## The Core Question: What Are You Really Looking For?

Before writing a query, ask yourself:

1. **Do I need DEX swap/trade data or aggregated price/OHLC data?** → Use **DexTrades** / **DexTradesByTokens** for per-swap data, or the **[Trading (Crypto Price)](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction)** cube for pre-aggregated prices, OHLC, and moving averages.
2. **Do I need token movements?** → Consider `Transfers` or `Calls`
3. **Do I need smart contract state changes?** → Consider `Events`
4. **Do I need function execution details?** → Consider `Calls`

## Understanding Each Primitive

### Transfers

**What it represents:** Token movements between addresses (ERC-20, ERC-721, native tokens like ETH, BNB, SOL).

**Key characteristics:**
- Captures **all token movements** including native tokens
- Includes both direct transfers and transfers that happen as part of contract calls
- Can include "noise" from native token transfers (ETH, BNB, SOL) that you might not want

**When to use:**
- Tracking token balances and movements
- Wallet-to-wallet transfers
- Token distribution analysis
- Tax/accounting use cases

**When NOT to use:**
- Filtering for specific token contract addresses (you'll get native tokens mixed in)
- Tracking smart contract function calls
- Monitoring specific contract events

**Common pitfall:** 
```graphql
# This returns BNB transfers too, not just your token!
EVM {
  Transfers(where: {Currency: {SmartContract: {is: "0x..."}}}) {
    # You'll see native BNB transfers mixed with token transfers
  }
}
```

**Solution:** Filter by `Currency { Native: false }` or use `Calls` instead.

---

### Events

**What it represents:** Log entries emitted by smart contracts (e.g., `Transfer`, `Approval`, `Swap`, `Mint`).

**Key characteristics:**
- Only includes **logged events** from smart contracts
- Requires the contract to explicitly emit the event
- More precise than Transfers for contract-specific activities
- Can be empty if the event doesn't exist or wasn't emitted

**When to use:**
- Monitoring specific contract events (e.g., `Swap` events from a DEX)
- Tracking contract state changes (e.g., `Approval`, `Mint`)
- Real-time event monitoring via subscriptions
- When you know the exact event signature

**When NOT to use:**
- You don't know what events exist (use event discovery first)
- You need function call details, not just logs
- You need native token transfers (events don't capture these)

**Common pitfall:**
```graphql
# Returns empty if event doesn't exist or wasn't emitted
EVM {
  Events(where: {Log: {Signature: {Name: {is: "EVENTSIGNATURNAME"}}}}) {
    # Empty result - why?
  }
}
```

**Solution:** First discover what events exist, then query them.

---

### Calls

**What it represents:** Function calls to smart contracts, including internal calls and their execution details.

**Key characteristics:**
- Captures **all function executions** (external and internal)
- Includes function parameters and return values
- Can filter by specific contracts and functions
- Most precise for contract interactions
- **Best choice for token contract interactions** (avoids native token noise)

**When to use:**
- Tracking smart contract function calls
- Filtering token transfers by contract address (avoids native token noise)
- Monitoring specific contract interactions
- Getting function call parameters and return values
- Internal transaction tracking

**When NOT to use:**
- Simple wallet-to-wallet native token transfers
- When you only need event logs, not function details

**Why Calls is often the right choice:**
```graphql
# This gives you ONLY token transfers from the contract, no native tokens
EVM {
  Calls(
    where: {
      To: {is: "0xTokenContract"},
      Signature: {Name: {is: "transfer"}}
    }
  ) {
    # Clean token transfers, no BNB/ETH noise
  }
}
```

---

### DexTrades and DexTradesByTokens

**What they represent:** Pre-parsed, normalized DEX swap data—every swap on supported DEXs (Uniswap, PancakeSwap, etc.) with buy/sell sides, prices, pools, and protocols.

**Key characteristics:**
- **DexTrades**: One record per swap, from the **pool's perspective** (`Buy` = what the pool bought, `Sell` = what the pool sold). Best for protocol-level queries (trade count by DEX, gas on trades, dynamics over time).
- **DexTradesByTokens**: Same swaps but **token-centric**—each swap appears as **two records** (one per token). Uses `Trade` + `Side` instead of `Buy`/`Sell`. Best for token-level queries (price of a token, OHLC by token, every pair a token is in).

**When to use DexTrades:**
- Swap counts by protocol or smart contract
- Gas spending on trades
- DEX usage over time
- One record per swap, pool-centric

**When to use DexTradesByTokens:**
- Price of a token across DEXs
- OHLC (candles) for a token or pair
- "Every pair this token is involved in"
- Queries by token or pair of tokens

**When NOT to use DexTrades/DexTradesByTokens:**
- Raw event logs (use **Events**)
- Non-DEX token transfers (use **Transfers** or **Calls**)
- Orderbook / open orders (data is swap-level, not order-level)

**DexTrades vs Events for swaps:** For DEX swap monitoring, **DexTrades** is usually better than querying raw `Swap` events: you get normalized buy/sell amounts, prices, pool, and protocol without parsing logs. Use **Events** only when you need raw log data or a DEX that isn’t fully supported in DexTrades.

**Important:** DexTradesByTokens has **twice as many records** per swap (one per token). Always filter by token (or pair) to get correct counts and avoid double-counting.

---

### Trading (Crypto Price) cube

**What it represents:** Pre-aggregated price and volume data across chains—OHLC, moving averages (SMA, WMA, EMA), mean price, and volume, at configurable intervals (e.g. 1s, 1m). Uses the root `Trading { Tokens | Currencies | Pairs(...) }` and is **multi-chain** (EVM, Solana, Tron).

**Key characteristics:**
- **Pre-aggregated**: OHLC, SMA, WMA, EMA, mean price and volume are computed for you; no need to build OHLC from raw swaps.
- **Real-time streaming**: 1-second granularity via GraphQL subscriptions (and Kafka).
- **Three cubes**: **Tokens** (price per token per chain), **Currencies** (same asset across chains, e.g. BTC/WBTC/cbBTC), **Pairs** (price per pair per market, e.g. SOL/USDC on Raydium).
- **Clean feed**: Low-quality and outlier trades are filtered automatically.

**When to use the Trading cube:**
- Real-time or historical **price feeds** and **charting** (OHLC, candles).
- **Moving averages** and **mean price** over time.
- **Cross-chain** or **cross-DEX** aggregated price for a token or currency.
- Trading bots, DeFi oracles, and dashboards that need **price index** data, not per-swap detail.

**When NOT to use the Trading cube:**
- Per-swap detail (who traded, which pool, tx hash) → use **DexTrades** or **DexTradesByTokens**.
- Raw trade-level analytics (e.g. swap count by pool) → use **DexTrades**.
- Token movements or balance changes → use **Transfers**, **Calls**, or **BalanceUpdates** (Solana).

**Trading vs DexTrades:** Use **Trading** when you need **aggregated price/OHLC/volume** for charting or feeds. Use **DexTrades** when you need **individual swaps**, protocol/pool breakdown, or trade-level fields (buyer, seller, tx, block).

Docs: [Crypto Price API (Trading)](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction), [Tokens / Currencies / Pairs](https://docs.bitquery.io/docs/trading/crypto-price-api/tokens), [OHLC & candles](https://docs.bitquery.io/docs/trading/crypto-price-api/crypto-ohlc-candle-k-line-api).

---

## Applying this model across chains

The concepts above apply to **EVM** (Ethereum, BSC, Base, Arbitrum, Matic, Optimism, etc.). Other chains expose the same ideas under different cube names and with chain-specific primitives.

### EVM chains (Ethereum, BSC, Base, Arbitrum, etc.)

- **Transfers** – Token movements (including native ETH/BNB/etc.).
- **Events** – Smart contract log entries (e.g. `Swap`, `Transfer`, `Approval`).
- **Calls** – Function executions (external and internal).
- **DexTrades / DexTradesByTokens** – Normalized DEX swap data (Buy/Sell, Trade/Side).

Use the root `EVM(network: eth | bsc | base | ...)` in your query.

### Solana

- **Transfers** – SPL token and SOL movements. Same idea as EVM Transfers; use `Solana { Transfers(...) }`.
- **DexTrades / DEXTradeByTokens** – DEX swap data (Buy/Sell, Trade/Side). Same idea as EVM; use `Solana { DEXTrades(...) }` or `Solana { DEXTradeByTokens(...) }`.
- **Instructions** – Execution units (program calls). Closest to EVM **Calls** + execution context; use when you need “what program ran” and call paths, not raw logs.
- **BalanceUpdates** – Balance deltas per account. Use for balance history and “who gained/lost what” rather than full transfer history.
- **DEXOrders** – Order-level data (open/unfilled orders, orderbook-style). Use when you need orders, not only filled swaps.

Solana does **not** have EVM-style **Events** or **Calls**; use **Instructions** and **Logs** (inside Instructions) for program activity.

Docs: [Solana Builder Terms](https://docs.bitquery.io/docs/cubes/solana), [Solana DEX Trades](https://docs.bitquery.io/docs/blockchain/Solana/solana-dextrades), [Solana Transfers](https://docs.bitquery.io/docs/blockchain/Solana/solana-transfers), [Solana Instructions](https://docs.bitquery.io/docs/blockchain/Solana/solana-instructions), [Solana Balance Updates](https://docs.bitquery.io/docs/blockchain/Solana/solana-balance-updates).

### Tron

- **Transfers** – TRC-20 and native TRX movements. Same idea as EVM Transfers; use `Tron { Transfers(...) }`.
- **DEXTrades** – DEX swap data (e.g. SunSwap). Same idea as EVM; use `Tron { DEXTrades(...) }`.

Tron’s model is close to EVM (TVM); Transfers and DEXTrades map directly. For logs and contract calls, see the [Tron API docs](https://docs.bitquery.io/docs/blockchain/Tron/).

Docs: [Tron API](https://docs.bitquery.io/docs/blockchain/Tron/), [Tron DEX Trades](https://docs.bitquery.io/docs/blockchain/Tron/tron-dextrades), [Tron Transfers](https://docs.bitquery.io/docs/blockchain/Tron/tron-transfers).

### Quick mapping

| Concept            | EVM                      | Solana                         | Tron              |
|--------------------|--------------------------|--------------------------------|-------------------|
| Token movements    | Transfers, Calls         | Transfers                      | Transfers         |
| DEX swaps          | DexTrades, DexTradesByTokens | DEXTrades, DEXTradeByTokens | DEXTrades         |
| Execution / “calls”| Calls                    | Instructions                   | (see Tron docs)   |
| Contract “events” | Events                   | (Instructions + Logs)          | (see Tron docs)   |
| Balance deltas     | (from Transfers/Calls)   | BalanceUpdates                 | (see Tron docs)   |
| Orderbook / orders | (swap-level only)        | DEXOrders                      | (see Tron docs)   |

---

## Decision Tree

The tree below is **EVM-oriented**. For Solana, use **Instructions** where it says Events/Calls; for Tron, use **Transfers** and **DEXTrades** (see [chain mapping](#applying-this-model-across-chains)).

```
Start: What do you need?

├─ Price / OHLC / charting (aggregated)?
│  └─ Pre-aggregated OHLC, SMA, volume, 1s+ intervals? → Trading cube (Tokens / Currencies / Pairs)
│
├─ DEX swap/trade data (per-swap)?
│  ├─ By protocol, pool, or one record per swap? → DexTrades (EVM/Solana/Tron)
│  └─ By token, OHLC from swaps, or "pairs for this token"? → DexTradesByTokens (EVM/Solana; filter by token!)
│
├─ Token movements?
│  ├─ Need native tokens (ETH, BNB, SOL, TRX)? → Transfers
│  └─ EVM only: only specific token contracts? → Calls (better) or Transfers + filter
│
├─ EVM: Smart contract events/logs?
│  └─ Know the event name? → Events
│  └─ Don't know what exists? → Discover events first, then query
│
├─ Solana: Program execution / call path?
│  └─ Use Instructions (and Logs inside Instructions)
│
└─ EVM: Function execution details?
   └─ Need parameters/return values? → Calls
   └─ Need internal calls? → Calls
```

## Real-World Examples

### Example 1: Tracking Token Transfers

**Goal:** Get all USDT transfers on BSC, excluding native BNB.

**Wrong approach (Transfers):**
```graphql
EVM(network: bsc) {
  Transfers(
    where: {Currency: {SmartContract: {is: "0x55d398326f99059fF775485246999027B3197955"}}}
  ) {
    # Problem: Might include BNB transfers if not filtered
  }
}
```

**Better approach (Calls):**
```graphql
EVM(network: bsc) {
  Calls(
    where: {
      To: {is: "0x55d398326f99059fF775485246999027B3197955"},
      Signature: {Name: {is: "transfer"}}
    }
  ) {
    # Clean USDT transfers only, no BNB noise
  }
}
```

**Alternative (Transfers with filter):**
```graphql
EVM(network: bsc) {
  Transfers(
    where: {
      Currency: {
        SmartContract: {is: "0x55d398326f99059fF775485246999027B3197955"},
        Native: false  # Exclude native tokens
      }
    }
  ) {
    # USDT transfers only
  }
}
```

### Example 2: Monitoring DEX Swaps

**Goal:** Track all swaps on a DEX (prices, amounts, buyer/seller, pool).

**Best approach (DexTrades):**
```graphql
EVM(network: eth) {
  DEXTrades(
    where: {Trade: {Dex: {ProtocolName: {is: "uniswap_v2"}}}}}
    limit: {count: 10}
    orderBy: {descending: Block_Time}
  ) {
    Block { Time Number }
    Transaction { Hash From }
    Trade {
      Buy { Amount Price Currency { Symbol } Buyer Seller }
      Sell { Amount Price Currency { Symbol } Buyer Seller }
      Dex { ProtocolName Pair { SmartContract } }
    }
  }
}
```

**Why DexTrades?** You get normalized buy/sell amounts, prices, pool, and protocol without parsing raw logs. Use **DexTradesByTokens** when you need token-centric data (e.g. "all pairs for this token", OHLC by token)—and always filter by token to avoid double-counting.

**Alternative (Events):** Use **Events** when you need raw `Swap` log data or a DEX not fully supported in DexTrades.

### Example 3: Tracking Contract Function Calls

**Goal:** Monitor when users call `approve()` on a token contract.

**Best approach (Calls):**
```graphql
EVM(network: eth) {
  Calls(
    where: {
      To: {is: "0xTokenContract"},
      Signature: {Name: {is: "approve"}}
    }
  ) {
    Call {
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
        }
      }
    }
  }
}
```

**Why Calls?** You need the function parameters (who approved, how much), which Calls provides.

---

## Common Confusion Points

### "Why does my Transfers query return BNB instead of my token?"

**Answer:** Transfers includes native tokens. Use `Currency { Native: false }` filter or switch to `Calls`.

### "Why is my Events query returning empty?"

**Possible reasons:**
1. The event doesn't exist at that contract
2. The event wasn't emitted in your time range
3. Wrong event signature name
4. Wrong contract address

**Solution:** First discover what events exist:
```graphql
EVM {
  Events(where: {LogHeader: {Address: {is: "0xContract"}}}) {
    Log {
      Signature {
        Name
      }
    }
  }
}
```

### "Should I use Transfers or Calls for token transfers?"

**Answer:** 
- Use **Calls** if you want to filter by contract and avoid native token noise
- Use **Transfers** if you need all token movements including native tokens, or for simple wallet-to-wallet transfers

### "DexTrades or DexTradesByTokens?"

**Answer:**
- **DexTrades**: One record per swap, pool perspective (`Buy`/`Sell`). Use for protocol-level stats (trade count by DEX, gas, time series).
- **DexTradesByTokens**: Two records per swap (one per token), token perspective (`Trade`/`Side`). Use for token price, OHLC, "every pair this token is in". **Always filter by token** so counts and volumes are correct.

### "DEX swaps: DexTrades or Events?"

**Answer:** Prefer **DexTrades** (or **DexTradesByTokens**) for swap monitoring—you get normalized prices, amounts, and protocol. Use **Events** when you need raw log data or a DEX not covered by DexTrades.

---

## Quick Reference

| Use Case | Recommended Primitive | Why |
|----------|---------------------|-----|
| Aggregated price / OHLC / charting | **Trading** (Tokens/Currencies/Pairs) | Pre-aggregated OHLC, SMA, volume; multi-chain |
| DEX swaps (by protocol/pool) | **DexTrades** | One record per swap, normalized |
| DEX swaps (by token, OHLC from swaps, pairs) | **DexTradesByTokens** | Token-centric; filter by token |
| Token transfers (specific contract) | **Calls** | Avoids native token noise |
| All token movements (including native) | **Transfers** | Captures everything |
| Smart contract events | **Events** | Direct event logs |
| Function call details | **Calls** | Includes parameters |
| Internal transactions | **Calls** | Tracks call depth |
| Wallet balance tracking | **Transfers** | Complete transfer history |
| Contract interaction analytics | **Calls** | Full execution context |

---

## Next Steps

Now that you understand the mental model:

**Price / OHLC / charting (all chains):**
1. **[Crypto Price API (Trading)](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction)** - Pre-aggregated OHLC, SMA, volume; Tokens, Currencies, Pairs cubes

**EVM (Ethereum, BSC, Base, etc.):**
2. **[Explore Transfers API](../blockchain/Ethereum/transfers/erc20-token-transfer-api)** - Learn Transfers in detail
3. **[Explore Events API](../blockchain/Ethereum/events/events-api)** - Learn Events in detail  
4. **[Explore Calls API](../blockchain/Ethereum/calls/smartcontract)** - Learn Calls in detail
5. **[DEXTrades Cube](../cubes/dextrades)** - Pool perspective, one record per swap
6. **[DEXTradesByTokens Cube](../cubes/dextradesbyTokens)** - Token perspective, filter by token
7. **[Ethereum DEX API](../blockchain/Ethereum/dextrades/dex-api)** - DEX trading examples

**Solana:**
8. **[Solana Builder Terms](https://docs.bitquery.io/docs/cubes/solana)** - Transfers, DEXTrades, Instructions, BalanceUpdates, DEXOrders
9. **[Solana DEX Trades](https://docs.bitquery.io/docs/blockchain/Solana/solana-dextrades)** - DEX swap data
10. **[Solana Transfers](https://docs.bitquery.io/docs/blockchain/Solana/solana-transfers)** - Token movements
11. **[Solana Instructions](https://docs.bitquery.io/docs/blockchain/Solana/solana-instructions)** - Program execution (Calls-like)

**Tron:**
12. **[Tron API](https://docs.bitquery.io/docs/blockchain/Tron/)** - Overview
13. **[Tron DEX Trades](https://docs.bitquery.io/docs/blockchain/Tron/tron-dextrades)** - DEX swap data
14. **[Tron Transfers](https://docs.bitquery.io/docs/blockchain/Tron/tron-transfers)** - Token movements

**General:**
15. **[Try Starter Queries](./starter-queries)** - See real examples
16. **[Build Your First Query](./first-query)** - Put it into practice

---

## Summary

- **Transfers** = Token movements (includes native tokens). Available on EVM, Solana, Tron.
- **Events** = Contract log entries (EVM only; requires events to be emitted).
- **Calls** = Function executions (EVM only; most precise for contract interactions).
- **DexTrades** = DEX swaps, pool perspective, one record per swap. Available on EVM, Solana, Tron.
- **DexTradesByTokens** = DEX swaps, token perspective, two records per swap (EVM, Solana)—always filter by token.
- **Trading (Crypto Price)** = Pre-aggregated price/OHLC/volume (Tokens, Currencies, Pairs). Multi-chain; use for charting, feeds, moving averages—not per-swap detail.
- **Solana:** **Instructions** (execution units), **BalanceUpdates** (balance deltas), **DEXOrders** (orderbook). No Events/Calls; use Instructions + Logs for program activity.
- **Tron:** Transfers and DEXTrades map directly; see Tron docs for logs/calls.

