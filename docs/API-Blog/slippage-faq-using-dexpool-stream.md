---
title: "Slippage FAQ: Calculating Necessary Slippage for DEX Swaps Using Bitquery DEXPool Stream"
description: "FAQ answering developer questions about calculating necessary slippage before executing DEX swaps from smart contracts. Learn how to use Bitquery DEXPool stream data to programmatically determine slippage tolerance instead of guessing or trial-and-error."
keywords:
  - slippage calculation
  - DEX slippage
  - smart contract slippage
  - slippage tolerance
  - DEXPool stream
  - liquidity depth
  - Uniswap slippage
  - AMM slippage
  - swapExactTokensForTokens
  - removeLiquidity
---

# Slippage FAQ: Calculating Necessary Slippage for DEX Swaps Using Bitquery DEXPool Stream

This FAQ addresses common developer questions about calculating necessary slippage before executing swaps or withdrawing liquidity on DEXs from smart contracts. Instead of guessing or using trial-and-error, you can use Bitquery's DEXPool stream data to programmatically determine the appropriate slippage tolerance.

## What is the Best Way to Calculate Necessary Slippage Before Making a Swap from a Smart Contract?

Instead of hardcoding slippage tolerances or using trial-and-error, you can calculate necessary slippage programmatically using Bitquery's DEXPool stream data. The stream provides pre-calculated price tables showing exactly how much slippage to expect for different trade sizes.

**The Problem with Fixed Slippage:**

Many developers hardcode slippage tolerances (e.g., 1% or 5%) in their contracts, but this can lead to:

- Failed transactions if liquidity drops (slippage too low)
- Unnecessary losses if liquidity is high (slippage too high)
- Front-running vulnerabilities when slippage tolerance is set too high

**Solution Using Bitquery DEXPool Stream:**

The DEXPool stream's `PoolPriceTable` contains `AtoBPrices` and `BtoAPrices` arrays with pre-calculated slippage data at multiple levels (0.1%, 0.5%, 1%, 2%, 5%, 10%). By querying this data before executing a swap, you can:

1. Find the appropriate slippage level for your trade size
2. Get the guaranteed minimum output amount (`MinAmountOut`) for that slippage level
3. Pass this as the `amountOutMin` parameter to functions like `swapExactTokensForTokens` or `removeLiquidity`

**Example from DEXPool Stream Data:**

```json
{
  "PoolPriceTable": {
    "AtoBPrices": [
      {
        "SlippageBasisPoints": 10,
        "MaxAmountIn": 2557952147,
        "MinAmountOut": 860478002991619427,
        "Price": 0.0003364734002389014
      },
      {
        "SlippageBasisPoints": 100,
        "MaxAmountIn": 25456674083,
        "MinAmountOut": 8465959707294551328,
        "Price": 0.00033264263765886426
      }
    ]
  }
}
```

**Important:** All amounts (`MaxAmountIn`, `MinAmountOut`) are in raw units (smallest token units), NOT decimal-adjusted. For example, if CurrencyA is USDC (6 decimals), `MaxAmountIn: 2557952147` = 2,557.952147 USDC. If CurrencyB is WETH (18 decimals), `MinAmountOut: 860478002991619427` = 0.860478002991619427 WETH.

If you want to swap 25,456 USDC (25,456,000,000 in raw units with 6 decimals), check the `AtoBPrices` array:

- At 0.1% slippage (10 basis points): `MaxAmountIn: 2557952147` (2,557.95 USDC) - your trade is too large
- At 1% slippage (100 basis points): `MaxAmountIn: 25456674083` (25,456.67 USDC) - your trade fits! Use `MinAmountOut: 8465959707294551328` as your `amountOutMin`

**Note:** All `MaxAmountIn` and `MinAmountOut` values in the DEXPool stream are in raw units (smallest token units), not decimal-adjusted. `MaxAmountIn` is in CurrencyA's raw units (e.g., USDC with 6 decimals), and `MinAmountOut` is in CurrencyB's raw units (e.g., WETH with 18 decimals).

## How Do I Determine Slippage Tolerance Programmatically Instead of Guessing?

You can determine slippage tolerance programmatically by:

1. **Query DEXPool Stream**: Get the latest `PoolPriceTable` for your target pool
2. **Find Your Trade Size**: Check which `SlippageBasisPoints` level has a `MaxAmountIn` that accommodates your trade
3. **Extract MinAmountOut**: Use the `MinAmountOut` value from that slippage level
4. **Calculate Tolerance**: `slippageTolerance = SlippageBasisPoints / 10000` (e.g., 100 = 1%)

**Using the Data Structure:**

The DEXPool stream data structure is:

```
PoolEvents[].PoolPriceTable.AtoBPrices[] (or BtoAPrices[])
  - SlippageBasisPoints: 10, 50, 100, 200, 500, 1000 (0.1%, 0.5%, 1%, 2%, 5%, 10%)
  - MaxAmountIn: Maximum input amount at this slippage level
  - MinAmountOut: Guaranteed minimum output (use as amountOutMin)
  - Price: Average execution price at this slippage level
```

**Implementation Approach:**

```javascript
// Pseudo-code example
function calculateSlippageTolerance(tradeAmount, poolPriceTable) {
  const atoBPrices = poolPriceTable.AtoBPrices;

  // Find the lowest slippage level that can handle your trade
  for (const priceData of atoBPrices) {
    if (tradeAmount <= priceData.MaxAmountIn) {
      return {
        slippageBasisPoints: priceData.SlippageBasisPoints,
        slippageTolerance: priceData.SlippageBasisPoints / 10000, // Decimal format (0.01 for 1%)
        minAmountOut: priceData.MinAmountOut,
        price: priceData.Price,
      };
    }
  }

  // Trade too large for even 10% slippage
  return null;
}
```

## How is Slippage Calculated in AMMs Like Uniswap?

Slippage in Automated Market Makers (AMMs) is calculated based on the constant product formula (x \* y = k) and the liquidity available in the pool. However, manually calculating this is complex, especially for concentrated liquidity pools (Uniswap V3/V4).

**Traditional Calculation:**

The constant product formula means that when you swap tokens:

- Removing tokens from one side increases the price
- The larger your trade relative to pool liquidity, the higher the slippage
- Formula: `(x + Δx) * (y - Δy) = k` where k is constant

**Why Manual Calculation is Difficult:**

- **Uniswap V2**: Requires current reserves and applying the constant product formula
- **Uniswap V3/V4**: Much more complex due to concentrated liquidity, ticks, and price ranges
- **Real-time updates**: Pool state changes with every trade, making calculations stale quickly

**How Bitquery DEXPool Stream Solves This:**

The DEXPool stream provides pre-calculated slippage data by simulating swaps through the pool's initialized ticks. This gives you:

- **Accurate calculations**: Done by simulating actual swaps through pool ticks
- **Real-time data**: Updates whenever liquidity changes (Mint, Burn, Swap events)
- **Multiple slippage levels**: Six different slippage scenarios (0.1%, 0.5%, 1%, 2%, 5%, 10%)
- **No manual math**: Just query and use the `MinAmountOut` value directly

## How Can I Use DEXPool Stream Data to Set amountOutMin for swapExactTokensForTokens?

The `swapExactTokensForTokens` function requires an `amountOutMin` parameter, which is the minimum amount of output tokens you're willing to accept. You can get this value directly from the DEXPool stream's `PoolPriceTable`.

**Step-by-Step Process:**

1. **Query DEXPool Stream** for your target pool address
2. **Access PoolPriceTable**: Get `PoolPriceTable.AtoBPrices` (swapping CurrencyA → CurrencyB) or `BtoAPrices` (swapping CurrencyB → CurrencyA)
3. **Find Matching Slippage Level**: Locate the entry where `MaxAmountIn >= yourTradeAmount`
4. **Use MinAmountOut**: The `MinAmountOut` field is your `amountOutMin` parameter

**Example from Real Data:**

For a USDC/WETH pool (Uniswap V4), if you want to swap 25,000 USDC (with 6 decimals = 25000000000 in raw units):

```json
{
  "PoolPriceTable": {
    "AtoBPrices": [
      {
        "SlippageBasisPoints": 100,
        "MaxAmountIn": 25456674083,
        "MinAmountOut": 8465959707294551328,
        "Price": 0.00033264263765886426
      }
    ]
  }
}
```

Since 25000000000 < 25456674083 (your trade amount is less than MaxAmountIn), this slippage level (1%) works.

**Important Note:** The `MinAmountOut: 8465959707294551328` in the price table is the minimum output for a trade at `MaxAmountIn` (25,456.67 USDC). For a smaller trade like 25,000 USDC, the actual minimum output would be proportionally less. Using the table's `MinAmountOut` is conservative (safer) but may cause transactions to fail if the price moves. For precise calculations, you'd need to calculate the proportional minimum based on your actual trade size, but using the table value provides a safe upper bound.

`MaxAmountIn: 25456674083` = 25,456.67 USDC in human-readable format (raw units ÷ 10^6). Your trade of 25,000 USDC fits within this limit.

**In Your Smart Contract:**

```solidity
// After querying DEXPool stream off-chain
uint256 amountOutMin = 8465959707294551328; // From MinAmountOut field

IUniswapV2Router02(router).swapExactTokensForTokens(
    amountIn,
    amountOutMin, // Use MinAmountOut from DEXPool stream
    path,
    to,
    deadline
);
```

## How Do I Calculate Slippage for Removing Liquidity (removeLiquidity)?

Similar to swaps, you can use DEXPool stream data to calculate slippage when removing liquidity. The `PoolPriceTable` shows liquidity depth, which helps determine how removing liquidity will affect token amounts received.

**Understanding Liquidity Removal Slippage:**

When you remove liquidity, you receive both tokens in the pair. The ratio depends on:

- Current pool reserves (available in `Liquidity.AmountCurrencyA` and `AmountCurrencyB`)
- Your liquidity share (LP token balance)
- Current pool price

**Using DEXPool Stream Data:**

The DEXPool stream provides:

- `Liquidity.AmountCurrencyA`: Current reserves of CurrencyA in the pool
- `Liquidity.AmountCurrencyB`: Current reserves of CurrencyB in the pool
- `PoolPriceTable.AtoBPrice`: Current spot price (CurrencyA per CurrencyB)
- `PoolPriceTable.BtoAPrice`: Current spot price (CurrencyB per CurrencyA)

**Calculating Expected Output:**

1. Calculate your share: `yourShare = yourLPTokens / totalLPTokens`
2. Expected CurrencyA: `expectedA = Liquidity.AmountCurrencyA * yourShare`
3. Expected CurrencyB: `expectedB = Liquidity.AmountCurrencyB * yourShare`
4. Apply slippage tolerance: `minA = expectedA * (1 - slippageTolerance)`, `minB = expectedB * (1 - slippageTolerance)`

**Example:**

If the pool has:

- `AmountCurrencyA: 1000000000000` (1M USDC with 6 decimals)
- `AmountCurrencyB: 337656994815915800` (0.337 WETH with 18 decimals)
- Your LP tokens represent 1% of the pool

Expected output:

- CurrencyA: `1000000000000 * 0.01 = 10000000000` (10,000 USDC)
- CurrencyB: `337656994815915800 * 0.01 = 3376569948159158` (0.003376 WETH)

With 1% slippage tolerance:

- `minAmountA = 10000000000 * 0.99 = 9900000000`
- `minAmountB = 3376569948159158 * 0.99 = 3342804248677576`

## What's the Difference Between Price Impact and Slippage Tolerance?

**Price Impact** is the change in the pool's price caused by your trade. It's calculated based on the AMM formula and current liquidity.

**Slippage Tolerance** is the maximum price movement you're willing to accept - it's a parameter you set in your transaction.

**In Practice:**

- **Price Impact**: `(Price After Trade - Price Before Trade) / Price Before Trade`
- **Slippage Tolerance**: The maximum price movement you allow (e.g., 1% means you'll accept up to 1% worse price)

**How DEXPool Stream Helps:**

The `PoolPriceTable` shows both:

- `Price`: Average execution price at different slippage levels (represents price impact)
- `SlippageBasisPoints`: The slippage tolerance level
- `MinAmountOut`: Guaranteed minimum output at that slippage tolerance

By comparing the `Price` field across different `SlippageBasisPoints` levels, you can see how price impact increases with larger trades.

**Example from Data:**

```json
{
  "AtoBPrices": [
    {
      "SlippageBasisPoints": 10,
      "Price": 0.0003364734002389014,
      "MaxAmountIn": 2557952147
    },
    {
      "SlippageBasisPoints": 1000,
      "Price": 0.00030166094074957073,
      "MaxAmountIn": 278317227427
    }
  ]
}
```

At 0.1% slippage: Price = 0.00033647 (better price, smaller max trade)
At 10% slippage: Price = 0.00030166 (worse price, larger max trade)

The price difference shows the price impact: `(0.00033647 - 0.00030166) / 0.00033647 ≈ 10.34%`

## How Can I Avoid Front-Running by Setting Appropriate Slippage?

Setting slippage tolerance too high can make you vulnerable to front-running bots that exploit the gap between your tolerance and actual price impact. Using DEXPool stream data helps you set precise slippage tolerances.

**The Front-Running Problem:**

If you set slippage tolerance to 10% but the actual price impact is only 1%, front-running bots can:

1. See your transaction with high slippage tolerance
2. Execute trades that push the price up by 9%
3. Your transaction still executes (within 10% tolerance)
4. You receive much less than expected

**Solution Using DEXPool Stream:**

1. **Query Current Pool State**: Get latest `PoolPriceTable` from DEXPool stream
2. **Find Exact Slippage Needed**: Check which `SlippageBasisPoints` level matches your trade size
3. **Add Small Buffer**: Add 0.1-0.2% buffer for execution delay
4. **Set Precise Tolerance**: Use the exact slippage level instead of guessing

**Example:**

For a trade of 25,456 USDC (25,456,000,000 in raw units with 6 decimals):

- DEXPool stream shows: At 1% slippage (100 basis points), `MaxAmountIn: 25456674083` (25,456.67 USDC) fits your trade
- Set slippage tolerance to 1.2% (add 0.2% buffer)
- This prevents front-runners from exploiting a large gap between tolerance and actual impact

## How Do I Interpret the PoolPriceTable Data Structure?

The `PoolPriceTable` in DEXPool stream contains pre-calculated price data for swaps in both directions:

**Structure:**

```json
{
  "PoolPriceTable": {
    "AtoBPrices": [
      {
        "SlippageBasisPoints": 10,
        "MaxAmountIn": 2557952147,
        "MinAmountOut": 860478002991619427,
        "Price": 0.0003364734002389014
      }
      // ... more levels
    ],
    "BtoAPrices": [
      {
        "SlippageBasisPoints": 10,
        "MaxAmountIn": 824929789949801466,
        "MinAmountOut": 2434012699,
        "Price": 2951.27197265625
      }
      // ... more levels
    ],
    "AtoBPrice": 2961.585205078125,
    "BtoAPrice": 0.0003376569948159158
  }
}
```

**Field Explanations:**

- **`AtoBPrices`**: Array for swapping CurrencyA → CurrencyB (e.g., USDC → WETH)
- **`BtoAPrices`**: Array for swapping CurrencyB → CurrencyA (e.g., WETH → USDC)
- **`SlippageBasisPoints`**: Slippage tolerance in basis points (10 = 0.1%, 100 = 1%, 1000 = 10%)
- **`MaxAmountIn`**: Maximum input amount you can swap at this slippage level (in CurrencyA's raw units/smallest units, NOT decimal-adjusted)
- **`MinAmountOut`**: Guaranteed minimum output amount (in CurrencyB's raw units/smallest units, NOT decimal-adjusted. Use directly as `amountOutMin` in your swap function)
- **`Price`**: Average execution price at this slippage level
- **`AtoBPrice`**: Current spot price (CurrencyA per CurrencyB)
- **`BtoAPrice`**: Current spot price (CurrencyB per CurrencyA)

**Real-World Example:**

For a USDC/WETH pool where CurrencyA = USDC (6 decimals) and CurrencyB = WETH (18 decimals):

```json
{
  "SlippageBasisPoints": 100,
  "MaxAmountIn": 25456674083,
  "MinAmountOut": 8465959707294551328,
  "Price": 0.00033264263765886426
}
```

This means:

- At 1% slippage tolerance, you can swap up to 25,456.674083 USDC
- You're guaranteed to receive at least 8.465959707294551328 WETH
- The average execution price is 0.00033264 USDC per WETH (or ~3005.6 USDC per WETH)

## How Often Does DEXPool Stream Update and How Fresh is the Data?

DEXPool stream updates in real-time whenever liquidity-changing events occur in the pool. The data is as fresh as the latest on-chain event.

**Update Triggers:**

**Uniswap V2:**

- `Swap` events (every trade)
- `Mint` events (liquidity added)
- `Burn` events (liquidity removed)

**Uniswap V3:**

- `Swap` events
- `Mint` events (liquidity positions added)
- `Burn` events (liquidity positions removed)

**Uniswap V4:**

- `Swap` events
- `ModifyLiquidity` events

**Data Freshness:**

Each event triggers a new DEXPool record with:

- Updated `Liquidity.AmountCurrencyA` and `AmountCurrencyB`
- Recalculated `PoolPriceTable` with new slippage data
- Latest `AtoBPrice` and `BtoAPrice` spot prices

This ensures the slippage calculations reflect the current pool state, not stale data from hours ago.

**Best Practice:**

For time-sensitive operations, query the DEXPool stream immediately before executing your transaction to get the most current slippage data.

## Can I Use DEXPool Stream to Compare Slippage Across Multiple Pools?

Yes! You can query multiple pools simultaneously and compare their `PoolPriceTable` data to find the pool with the best execution (lowest slippage) for your trade size.

**Comparison Strategy:**

1. **Query Multiple Pools**: Get DEXPool stream data for all pools trading your token pair
2. **Compare MaxAmountIn**: At your desired slippage level, see which pool can handle larger trades
3. **Compare Prices**: Look at the `Price` field to see which pool offers better execution price
4. **Check Liquidity**: Higher `Liquidity.AmountCurrencyA` and `AmountCurrencyB` usually means lower slippage

**Example Comparison:**

Pool A (Uniswap V3):

```json
{
  "AtoBPrices": [
    {
      "SlippageBasisPoints": 100,
      "MaxAmountIn": 25456674083,
      "MinAmountOut": 8465959707294551328,
      "Price": 0.00033264263765886426
    }
  ]
}
```

Pool B (Uniswap V2):

```json
{
  "AtoBPrices": [
    {
      "SlippageBasisPoints": 100,
      "MaxAmountIn": 15000000000,
      "MinAmountOut": 5000000000000000000,
      "Price": 0.0003333333333333333
    }
  ]
}
```

For a swap of 20,000 USDC (20,000,000,000 in raw units with 6 decimals):

- Pool A: Can handle it (MaxAmountIn: 25456674083 raw units = 25,456.67 USDC > 20,000 USDC), better price (0.00033264)
- Pool B: Cannot handle it (MaxAmountIn: 15000000000 raw units = 15,000 USDC < 20,000 USDC) at 1% slippage

Pool A is better for this trade size.

## How Do I Handle Different Token Decimals When Using MinAmountOut?

The `MinAmountOut` value in DEXPool stream is in the token's smallest unit (raw amount), so you need to account for token decimals when using it in your smart contract.

**Understanding Decimals:**

- USDC: 6 decimals (1 USDC = 1,000,000 raw units)
- WETH: 18 decimals (1 WETH = 1,000,000,000,000,000,000 raw units)

**Example from Data:**

```json
{
  "Pool": {
    "CurrencyA": {
      "Symbol": "USDC",
      "Decimals": 6
    },
    "CurrencyB": {
      "Symbol": "WETH",
      "Decimals": 18
    }
  },
  "PoolPriceTable": {
    "AtoBPrices": [
      {
        "MinAmountOut": 8465959707294551328
      }
    ]
  }
}
```

The `MinAmountOut: 8465959707294551328` is in WETH's raw units (18 decimals).

To convert to human-readable: `8465959707294551328 / 10^18 = 8.465959707294551328 WETH`

**In Your Smart Contract:**

The `amountOutMin` parameter expects the raw amount (smallest units), so you can use `MinAmountOut` directly:

```solidity
// MinAmountOut from DEXPool stream is already in correct format
uint256 amountOutMin = 8465959707294551328; // Direct use, no conversion needed

IUniswapV2Router02(router).swapExactTokensForTokens(
    amountIn,
    amountOutMin, // Use MinAmountOut value directly
    path,
    to,
    deadline
);
```

The DEXPool stream data includes `CurrencyA.Decimals` and `CurrencyB.Decimals` fields so you can verify the decimal places if needed.

## What If My Trade Size Exceeds All MaxAmountIn Values in the Price Table?

If your trade size is larger than the highest `MaxAmountIn` value (even at 10% slippage), you have several options:

**Option 1: Split the Trade**

Break your large trade into smaller chunks that fit within the `MaxAmountIn` limits. Execute multiple swaps sequentially.

**Option 2: Accept Higher Slippage (Not Recommended)**

You could set slippage tolerance higher than 10%, but this exposes you to significant price impact and front-running risks.

**Option 3: Wait for Better Liquidity**

Monitor the DEXPool stream - when liquidity increases (higher `Liquidity.AmountCurrencyA`/`AmountCurrencyB`), the `MaxAmountIn` values will increase, allowing larger trades.

**Option 4: Use Multiple Pools/Routes**

Route your trade through multiple pools or use aggregation protocols that split trades across pools automatically.

**Using DEXPool Stream to Monitor:**

Subscribe to DEXPool stream updates for your target pool. When you see `Liquidity.AmountCurrencyA` and `AmountCurrencyB` increase, check if the new `MaxAmountIn` values can accommodate your trade size.

## Additional Resources

- [DEXPools Cube Documentation](https://docs.bitquery.io/docs/cubes/evm-dexpool/) - Complete guide to DEXPool data structure and concepts
- [Bitquery IDE](https://ide.bitquery.io/) - Query DEXPool data in real-time
- [Kafka Data Samples](https://github.com/bitquery/kafka-data-sample/blob/main/evm/eth_dexpools.json) - Sample DEXPool stream data structure
- [EVM DEXPool Stream Documentation](https://docs.bitquery.io/docs/cubes/evm-dexpool/) - Understanding when DEXPool records are emitted
