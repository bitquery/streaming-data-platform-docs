# DEXPools Cube on EVM Chains

This section explains how the dexpool data is built and shared via APIs and [Kafka streams](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/). It also explains how to understand each entry of the response.

> **Note:** In GraphQL, DEXPools data is accessed through two schema cubes:
>
> - **`DEXPoolEvents`**: Provides pool event data (swaps, mints, burns, etc.)
> - **`DEXPoolSlippages`**: Provides slippage and price impact data for different trade sizes


import VideoPlayer from "../../src/components/videoplayer.js";

<VideoPlayer url="https://www.youtube.com/watch?v=BWR0EXGXBys" />

## Concept Explanation

Liquidity pools are fundamental components of decentralized exchanges that enable token swaps without traditional order books. Each pool contains two tokens (CurrencyA and CurrencyB), and the ratio of these tokens determines the exchange rate.

When a user wants to swap tokens, they interact with a liquidity pool. The pool calculates the output amount based on:

- Current liquidity reserves
- The amount being swapped
- Price impact and slippage tolerance

For example, if you want to sell ANKR tokens for WETH in a pool:

```
Pool: 0x13dc0a39dc00f394e030b97b0b569dedbe634c0d
DEX: uniswap_v3 (3)
Token0: ANKR (decimals: 18)
Token1: WETH (decimals: 18)
Liquidity: 604099.111169 ANKR, 1.074933 WETH
Direction: Sell ANKR → Buy WETH
  slippage: 0.1%, MaxIn: 205.504593 ANKR, MinOut: 0.000434 WETH, ratio: 473132.526201 ANKR/WETH
  slippage: 0.5%, MaxIn: 997.299766 ANKR, MinOut: 0.002097 WETH, ratio: 475456.664617 ANKR/WETH
  slippage: 1.0%, MaxIn: 2012.776732 ANKR, MinOut: 0.004205 WETH, ratio: 478581.192432 ANKR/WETH
  slippage: 2.0%, MaxIn: 4067.602247 ANKR, MinOut: 0.008289 WETH, ratio: 490722.489031 ANKR/WETH
  slippage: 5.0%, MaxIn: 10501.563247 ANKR, MinOut: 0.020650 WETH, ratio: 508535.330236 ANKR/WETH
  slippage: 10.0%, MaxIn: 22396.241185 ANKR, MinOut: 0.040771 WETH, ratio: 549306.392584 ANKR/WETH
```

If you are willing to accept a price impact and slippage of up to 10.0% against the current spot price, you can sell a maximum of 22396.241185 ANKR into the pool. In return, you are guaranteed to receive at least 0.040771 WETH. The average execution price for this trade would be approximately 549306.392584 ANKR per 1 WETH.

The calculation considers the price impact plus the worst-case scenario of slippage for different amounts, with limited losses for each, by simulating a swap by iterating through initialized ticks in the TickBitmap.

> Important note: The liquidity calculation differs by protocol version:
>
> - For Uniswap V2 and V3, liquidity reflects exactly the balance of the pool
> - For Uniswap V4, liquidity is the token balances in PoolManager

## Understanding Pool Structure

In DEXPools, each pool is represented with several key components:

- **`Pool`**: The pool smart contract address and token pair information
- **`Dex`**: The DEX protocol details (name, version, family)
- **`Liquidity`**: Current token reserves in the pool
- **`PoolPriceTable`**: Price calculations for different slippage tolerances in both directions

### Example Data Structure

A sample entry for a token pair shared via Bitquery Kafka streams is available [here](https://github.com/bitquery/kafka-data-sample/blob/main/evm/eth_dexpools.json)

### Understanding Price Tables

The `PoolPriceTable` provides price information for swaps in both directions:

- **`AtoBPrices`**: Array of price calculations for swapping CurrencyA to CurrencyB at different slippage tolerances
- **`BtoAPrices`**: Array of price calculations for swapping CurrencyB to CurrencyA at different slippage tolerances
- **`AtoBPrice`**: Current spot price for CurrencyA to CurrencyB
- **`BtoAPrice`**: Current spot price for CurrencyB to CurrencyA

Each price entry in the arrays contains:

- **`SlippageBasisPoints`**: Slippage tolerance in basis points (100 = 1%)
- **`MaxAmountIn`**: Maximum input amount that can be swapped at this slippage level
- **`MinAmountOut`**: Minimum output amount guaranteed at this slippage level
- **`Price`**: Average execution price for swaps at this slippage level

The following slippage levels are available in the data:
- 10 basis points (0.1%)
- 50 basis points (0.5%)
- 100 basis points (1.0%)
- 200 basis points (2.0%)
- 500 basis points (5.0%)
- 1000 basis points (10.0%)

For example, in the `AtoBPrices` array above, with a 10 basis point (0.1%) slippage tolerance, you can swap up to 2,557,952,147 units of CurrencyA (USDC) and receive at least 860,478,002,991,619,427 units of CurrencyB (WETH), at an average price of 0.0003364734002389014 USDC per WETH.

## When is a new DEXPool record emitted in the APIs & Streams?

A new DEXPool record is emitted in the APIs and Kafka streams when specific events occur that change the pool's liquidity or state. The events tracked vary by protocol version:

### Uniswap V2

The following events trigger a new DEXPool entry:

- `Swap(address,uint256,uint256,uint256,uint256,address)` - Emitted when tokens are swapped in the pool
- `Mint(address,uint256,uint256)` - Emitted when liquidity is added to the pool
- `Burn(address,uint256,uint256,address)` - Emitted when liquidity is removed from the pool

### Uniswap V3

The following events trigger a new DEXPool entry:

- `Mint(address,address,int24,int24,uint128,uint256,uint256)` - Emitted when liquidity is added to a position
- `Burn(address,int24,int24,uint128,uint256,uint256)` - Emitted when liquidity is removed from a position
- `Swap(address,address,int256,int256,uint160,uint128,int24)` - Emitted when tokens are swapped in the pool

### Uniswap V4

The following events trigger a new DEXPool entry:

- `ModifyLiquidity(bytes32,address,int24,int24,int256,bytes32)` - Emitted when liquidity is modified in the pool
- `Swap(bytes32,address,int128,int128,uint160,uint128,int24,uint24)` - Emitted when tokens are swapped in the pool

> Note: Forks of Uniswap can also be tracked with these APIs if the signature is exactly the same.

## Filtering in DEXPools Cube

Filtering helps to fetch the exact pool data you are looking for. DEXPools Cube can filter based on pool address, token addresses, DEX protocol, liquidity amounts, and more.

Everything inside the "where" clause filters; it follows the `AND` condition by default.

## API Examples
For blockchain-specific slippage API documentation, see:

- [Arbitrum Slippage API](https://docs.bitquery.io/docs/blockchain/Arbitrum/arbitrum-slippage-api/)
- [Base Slippage API](https://docs.bitquery.io/docs/blockchain/Base/base-slippage-api/)
- [BSC Slippage API](https://docs.bitquery.io/docs/blockchain/BSC/bsc-slippage-api/)
- [Matic Slippage API](https://docs.bitquery.io/docs/blockchain/Matic/matic-slippage-api/)

For blockchain-specific liquidity API documentation, see:

- [Arbitrum Liquidity API](https://docs.bitquery.io/docs/blockchain/Arbitrum/arbitrum-liquidity-api/)
- [Base Liquidity API](https://docs.bitquery.io/docs/blockchain/Base/base-liquidity-api/)
- [BSC Liquidity API](https://docs.bitquery.io/docs/blockchain/BSC/bsc-liquidity-api/)
- [Ethereum Liquidity API](https://docs.bitquery.io/docs/blockchain/Ethereum/dextrades/ethereum-liquidity-api/)
- [Matic Liquidity API](https://docs.bitquery.io/docs/blockchain/Matic/matic-liquidity-api/)

## Advanced Use Cases and Processing Patterns

### Liquidity Depth Analysis

DEXPools enables analysis of liquidity depth across different pools. By examining the `MaxAmountIn` values at various slippage levels, you can determine:

- Which pools can handle large trades without significant price impact
- Optimal slippage tolerance for your trade size
- Price impact estimation before executing trades

### Multi-Pool Price Comparison

The price table data allows comparison of execution prices across different slippage scenarios, helping traders:

- Identify the best pool for their trade size
- Understand price impact before executing swaps
- Optimize trade execution strategies based on available liquidity

### Protocol-Specific Analysis

Different DEX protocols (Uniswap V2, V3, V4) have different liquidity mechanisms. The DEXPools cube provides protocol-specific information:

- **Uniswap V2/V3**: Liquidity reflects the exact balance of the pool
- **Uniswap V4**: Liquidity represents token balances in PoolManager

This allows for accurate analysis across different protocol versions and their unique characteristics.
