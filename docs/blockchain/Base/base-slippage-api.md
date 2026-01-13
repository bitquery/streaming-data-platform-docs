---
sidebar_position: 3
---

# Base Slippage API

In this section we will see how to get Base DEX pool slippage information using our API. The slippage API helps you understand price impact and liquidity depth for token swaps on Base DEX pools.

<head>
<meta name="title" content="Base DEX Pool Slippage Data with Base Slippage API"/>
<meta name="description" content="Get slippage and price impact data for Base DEX pools through our Slippage API."/>
<meta name="keywords" content="Base slippage api, Base DEX pool api, Base liquidity api, Base price impact api, Base DEX api, Base web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to Get Base DEX Pool Slippage Data with Base Slippage API"
/>
<meta
  property="og:description"
  content="Get slippage and price impact data for Base DEX pools through our Slippage API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to Get Base DEX Pool Slippage Data with Base Slippage API" />
<meta property="twitter:description" content="Get slippage and price impact data for Base DEX pools through our Slippage API." />
</head>

## Understanding Slippage and Price Impact

Slippage refers to the difference between the expected price of a trade and the actual execution price. When swapping tokens in a DEX pool, larger trades can move the price due to limited liquidity, resulting in slippage.

The DEXPoolSlippages API provides detailed information about:
- Maximum input amounts that can be swapped at different slippage tolerances
- Minimum output amounts guaranteed at each slippage level
- Average execution prices for different trade sizes
- Price impact calculations for both swap directions (A to B and B to A)

For a comprehensive explanation of how DEX pools work, liquidity calculations, and price tables, refer to the [DEXPools Cube documentation](https://docs.bitquery.io/docs/cubes/evm-dexpool/).

## Realtime Slippage Monitoring

This subscription query returns real-time slippage data for all DEX pools on Base. You can monitor price impact and liquidity depth as trades occur.

You can find the query [here](https://ide.bitquery.io/realtime-slippage-on-base)

```graphql
subscription {
  EVM(network: base) {
    DEXPoolSlippages {
      Price {
        BtoA {
          Price
          MinAmountOut
          MaxAmountIn
        }
        AtoB {
          Price
          MinAmountOut
          MaxAmountIn
        }
        Pool {
          PoolId
          SmartContract
          Pair {
            Decimals
            SmartContract
            Name
          }
          CurrencyB {
            Symbol
            SmartContract
            Name
            Decimals
          }
          CurrencyA {
            Symbol
            SmartContract
            Name
            Decimals
          }
        }
        Dex {
          SmartContract
          ProtocolVersion
          ProtocolName
          ProtocolFamily
        }
        SlippageBasisPoints
      }
      Block {
        Time
        Number
      }
    }
  }
}
```

## Latest Slippage for a Specific Pool

This query retrieves the latest slippage data for a specific DEX pool on Base. Use this to check current liquidity depth and price impact for a particular token pair.

You can find the query [here](https://ide.bitquery.io/Latest-slippage-of-a-pool-on-Uniswap-v3)

```graphql
query {
  EVM(network: base) {
    DEXPoolSlippages(
      where: {Price: {Pool: {SmartContract: {is: "0x42161084d0672e1d3f26a9b53e653be2084ff19c"}}}}
      limit: {count: 10}
      orderBy: {descending: Block_Time}
    ) {
      Price {
        BtoA {
          Price
          MinAmountOut
          MaxAmountIn
        }
        AtoB {
          Price
          MinAmountOut
          MaxAmountIn
        }
        Pool {
          PoolId
          SmartContract
          Pair {
            Decimals
            SmartContract
            Name
          }
          CurrencyB {
            Symbol
            SmartContract
            Name
            Decimals
          }
          CurrencyA {
            Symbol
            SmartContract
            Name
            Decimals
          }
        }
        Dex {
          SmartContract
          ProtocolVersion
          ProtocolName
          ProtocolFamily
        }
        SlippageBasisPoints
      }
      Block {
        Time
        Number
      }
    }
  }
}
```

> **Note:** This query can be converted to a subscription to monitor in real-time. Simply replace `query` with `subscription` to receive live updates whenever the pool's liquidity changes.

## Realtime Slippage Data via Kafka Streams

Slippage data can also be obtained via Kafka streams for lower latency and better reliability. The Kafka topic for Base DEX pools is:

**`base.dexpools.proto`**

Kafka streams provide the same slippage data as GraphQL subscriptions but with several advantages:
- Lower latency due to shorter data pipeline
- Better reliability with persistent connections
- Ability to read from latest offset without gaps
- Better scalability with multiple consumers

For detailed information on how to connect to Kafka streams, subscribe to topics, and parse messages, refer to the [Kafka Streaming Concepts documentation](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/).

> **Note:** IDE credentials will not work with Kafka Streams. You need separate Kafka credentials. Please contact sales on our official telegram channel or fill out the [form on our website](https://bitquery.io/forms/api).

## Understanding the Response

The `DEXPoolSlippages` API response contains the following information:

- **`Price`**: Price information for swaps at a specific slippage tolerance
  - **`AtoB`**: Price data for swapping CurrencyA to CurrencyB
    - `Price`: Average execution price for swaps at this slippage level
    - `MinAmountOut`: Minimum output amount guaranteed at this slippage level
    - `MaxAmountIn`: Maximum input amount that can be swapped at this slippage level
  - **`BtoA`**: Price data for swapping CurrencyB to CurrencyA (same structure as AtoB)
  - **`SlippageBasisPoints`**: Slippage tolerance in basis points (100 = 1%)
  - **`Pool`**: Pool information including token pair details
  - **`Dex`**: DEX protocol information (Uniswap V2, V3, V4, etc.)

- **`Block`**: Block information when the slippage data was recorded
  - `Time`: Timestamp of the block
  - `Number`: Block number

For more details on how slippage is calculated and when new pool records are emitted, see the [DEXPools Cube documentation](https://docs.bitquery.io/docs/cubes/evm-dexpool/#when-is-a-new-dexpool-record-emitted-in-the-apis--streams).

## Use Cases

### Liquidity Depth Analysis

Use the slippage API to analyze which pools can handle large trades without significant price impact. By examining `MaxAmountIn` values at different slippage levels, you can:

- Identify pools with sufficient liquidity for your trade size
- Determine optimal slippage tolerance settings
- Estimate price impact before executing trades

### Multi-Pool Price Comparison

Compare execution prices across different pools and slippage scenarios to:

- Find the best pool for your specific trade size
- Understand price differences between DEX protocols
- Optimize trade execution strategies

### Trading Applications

#### Live Execution Testing

Use the slippage API to test and validate trade execution strategies in real-time:

- **Pre-trade validation**: Check if your intended trade size can be executed within acceptable slippage bounds before submitting
- **Execution simulation**: Calculate expected price impact and minimum output amounts for different trade sizes
- **Strategy backtesting**: Monitor historical slippage data to validate trading algorithms and optimize entry/exit points
- **Risk assessment**: Evaluate maximum position sizes that can be entered without exceeding your slippage tolerance

#### Detecting Liquidity Shocks and Toxic Order Flow

The slippage API helps identify temporary price dislocations and liquidity shocks that can be exploited or avoided:

- **Flow toxicity detection**: Monitor sudden changes in `MaxAmountIn` values to detect when pools experience large outflows or inflows
- **Price impact analysis**: Track how `MinAmountOut` changes relative to `MaxAmountIn` to identify when pools become less liquid
- **Mean reversion opportunities**: Identify pools where large swaps have created temporary price dislocations that may revert
- **Toxic order flow avoidance**: Use slippage data to avoid entering positions when liquidity is thin or when large trades are likely to move price against you

For a practical implementation example of using slippage data for automated trading strategies, including flow toxicity detection and mean-reversion trading, see the [AMM Flow Toxicity Alpha Engine](https://github.com/Divyn/amm-flow-toxicity-alpha-engine) repository. This system demonstrates how to:

- Detect large swaps that move price significantly (50-500 basis points)
- Verify isolation from trending markets
- Execute fade trades against temporary price impacts
- Manage positions with dynamic stop losses and take profits based on slippage data

For more advanced use cases, refer to the [DEXPools Cube documentation](https://docs.bitquery.io/docs/cubes/evm-dexpool/#advanced-use-cases-and-processing-patterns).
