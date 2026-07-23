---
title: "AsterDEX API Documentation"
description: "AsterDEX API Documentation: Bitquery documentation with GraphQL examples, real-time streams, and integration guidance. See examples in the Bitquery IDE."
keywords:
  - AsterDEX API documentation
  - BNB Smart Chain perpetual futures
  - BSC futures trading API
  - decentralized futures exchange
  - perpetual DEX API guide
  - AsterDEX order lifecycle
  - smart contract events tracking
  - real-time liquidation data
  - margin trading API
  - funding rates API
  - GraphQL blockchain API
  - DeFi derivatives trading
  - cryptocurrency futures API
  - blockchain trading data
  - perpetual swap API
  - AsterDEX integration guide
  - BSC derivatives API
  - decentralized exchange analytics
  - crypto trading automation
  - blockchain data streaming
  - AsterDEX smart contracts
  - perpetual futures data
  - DEX trading API
  - crypto market data API
  - blockchain event monitoring
slug: asterdex-api
canonical: "/docs/examples/futures-dexs/asterdex-api"
image: "/img/asterdex-api-guide.png"
---
import FAQ from "@site/src/components/FAQ";

# AsterDEX API Documentation - Complete Guide to BNB Smart Chain Perpetual Futures Trading

## Quick Start Guide

### Prerequisites for AsterDEX API Integration

Before integrating AsterDEX APIs, ensure you have:

1. **Bitquery Account**: Sign up at [ide.bitquery.io](https://ide.bitquery.io/) for API access
2. **GraphQL Knowledge**: Basic understanding of GraphQL query syntax
3. **BNB Smart Chain Familiarity**: Knowledge of BSC addresses and transactions
4. **Development Environment**: Any programming language with HTTP request capabilities

### 5-Minute Setup

```javascript
// Example: Fetch latest AsterDEX trades
const query = `
{
  EVM(dataset: realtime, network: bsc) {
    Events(
      where: {LogHeader: {Address: {is: "0x1b6F2d3844C6ae7D56ceb3C3643b9060ba28FEb0"}}}
      orderBy: {descending: Block_Time}
      limit: {count: 10}
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Log {
        Signature {
          Name
        }
      }
    }
  }
}
`;

fetch("https://streaming.bitquery.io/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_API_KEY",
  },
  body: JSON.stringify({ query }),
});
```

## Smart Contract Information

| Contract Type              | Address                                                                               | Network               | Purpose                                |
| -------------------------- | ------------------------------------------------------------------------------------- | --------------------- | -------------------------------------- |
| **AsterDEX Main Contract** | `0x1b6F2d3844C6ae7D56ceb3C3643b9060ba28FEb0`                                          | BNB Smart Chain (BSC) | Core perpetual futures trading logic   |
| **Network ID**             | `56`                                                                                  | BNB Smart Chain       | Main BSC network identifier            |
| **Block Explorer**         | [bscscan.com](https://bscscan.com/address/0x1b6F2d3844C6ae7D56ceb3C3643b9060ba28FEb0) | BSC Explorer          | Contract verification and transactions |

---

## AsterDEX Order Lifecycle

The AsterDEX Order Lifecycle is defined by the sequence of smart contract events emitted during the creation, execution, modification, and closing of trades on the AsterDEX protocol deployed on BNB Smart Chain (BSC). Using the ABI, we can trace the major steps of a trade as follows:

### 1. Order Creation

A trader begins by opening a position using one of the following contract calls:

- `openMarketTrade` or `openMarketTradeBNB` — for immediate market orders
- `openLimitOrder` or `openLimitOrderBNB` — for pending limit orders

These functions emit events like:

- `OpenMarketTrade(user, tradeHash, trade)` — signals a new market trade
- `OpenLimitOrder(user, orderHash, data)` — logs the creation of a limit order

These events include key parameters:

- **Pair base** (trading pair symbol)
- **isLong flag** (direction)
- **tokenIn, amountIn** (input asset and margin)
- **qty** (position size)
- **price, stopLoss, takeProfit**
- **broker** (affiliate ID)

### 2. Trade Pending / Validation

After the trade is created, AsterDEX emits `MarketPendingTrade` or `PredictAndBetPending` events to indicate the trade or bet is awaiting price validation or oracle callback. For limit orders, this pending state continues until market conditions are met.

### 3. Trade Execution

When the trade conditions are satisfied (for market or limit execution), the contract emits:

- `ExecuteLimitOrderSuccessful(user, orderHash)` — for executed limit orders
- `ExecuteLimitOrderRejected(user, orderHash, refund)` — if conditions are invalid
- `MarketTradeCallback` — finalizes market trade once the external price feed confirms execution

Once executed, the trader's position is stored, and Bitquery indexes these on-chain records as open trades.

### 4. Margin Update (Optional)

Traders can adjust their position margin using the `addMargin` or `updateMargin` functions, which emit:

- `UpdateMargin(user, tradeHash, beforeMargin, margin)` — updates collateral

These events help Bitquery track capital movement within an active position.

### 5. Stop-Loss / Take-Profit / Liquidation

During the trade's lifecycle, risk management parameters can trigger automatically. The following events define these actions:

- `UpdateTradeSl` / `UpdateTradeTp` / `UpdateTradeTpAndSl` — manual stop-loss or take-profit updates
- `ExecuteTpSlOrLiq` — executed close due to stop-loss, take-profit, or liquidation condition
- `ExecuteCloseRejected` — if the closing execution fails or is invalid

These events are captured by Bitquery and can be used to determine close reason and realized PnL.

### 6. Trade Closing

A trade is closed manually or automatically, resulting in:

- `CloseTradeSuccessful(user, tradeHash, closeInfo)` — main closing event, includes closePrice, fundingFee, closeFee, pnl, holdingFee
- `CloseTradeReceived` — indicates funds have been distributed to the trader
- `CloseTradeAddLiquidity` / `CloseTradeRemoveLiquidity` — if closing affects liquidity pools

Bitquery records these closing events, linking them with the original tradeHash and calculating total realized profit or loss.

### 7. Settlement and Fee Distribution

When a trade closes, associated fees are emitted as separate events:

- `OpenFee` / `CloseFee` — show DAO, broker, and pool fee splits
- `FundingFeeAddLiquidity` — transfers funding fees into liquidity pools
- `WithdrawRevenue` — shows DAO or broker withdrawals of earned fees

These events help reconstruct the entire economic flow of a trade — from initiation to settlement.

### 8. Post-Trade State Updates

Finally, market-level updates are emitted periodically:

- `UpdatePairAccFundingFeePerShare` — funding rate updates
- `UpdatePairPositionInfo` — updates aggregate long/short positions for a pair

These allow Bitquery to display aggregate market metrics, such as open interest, funding rates, and average entry prices.

## Summary of Core Events

| Stage              | Key Events                                                  | Description                     |
| ------------------ | ----------------------------------------------------------- | ------------------------------- |
| **Order Open**     | `OpenMarketTrade`, `OpenLimitOrder`                         | Creation of new orders          |
| **Pending**        | `MarketPendingTrade`, `PredictAndBetPending`                | Waiting for oracle / validation |
| **Execution**      | `ExecuteLimitOrderSuccessful`, `MarketTradeCallback`        | Order filled                    |
| **Margin Update**  | `UpdateMargin`                                              | Margin increased or decreased   |
| **Risk Triggers**  | `ExecuteTpSlOrLiq`, `UpdateTradeSl`, `UpdateTradeTp`        | Stop-loss/TP triggered          |
| **Close**          | `CloseTradeSuccessful`, `CloseTradeReceived`                | Trade settled                   |
| **Fees**           | `OpenFee`, `CloseFee`, `FundingFeeAddLiquidity`             | Fee settlements                 |
| **Market Updates** | `UpdatePairPositionInfo`, `UpdatePairAccFundingFeePerShare` | Aggregate pair data refresh     |

Bitquery indexes all of these events in real-time, linking them to transactions, blocks, and traders—enabling complete lifecycle tracking of each AsterDEX trade via API or stream.

---

## AsterDEX API Examples

### 1. All Events of AsterDEX

Monitor all events emitted by the AsterDEX contract to track all platform activities.

**Query Link**: [All events of AsterDEX](https://ide.bitquery.io/All-events-of-AsterDEX)

```graphql
{
  EVM(dataset: realtime, network: bsc) {
    Events(
      limit: { count: 20 }
      where: {
        LogHeader: {
          Address: { is: "0x1b6F2d3844C6ae7D56ceb3C3643b9060ba28FEb0" }
        }
      }
    ) {
      count
      Log {
        Signature {
          Name
          Signature
        }
      }
    }
  }
}
```

### 2. OpenMarketTrade Events

`OpenMarketTrade` is when a user opens a market trade. The following API provides all newly opened market trades on AsterDEX.

**Query Link**: [AsterDEX - OpenMarketTrade](https://ide.bitquery.io/AsterDEX---OpenMarketTrade)

Similarly, we can get all newly created Limit Orders by following the `OpenLimitOrder` event.

#### Difference between OpenLimitOrder and OpenMarketTrade

| Feature                            | OpenLimitOrder                                                                                                                                       | OpenMarketTrade                                                                                                                       |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Purpose**                        | Creates a limit order — an instruction to open a trade only when price conditions are met.                                                           | Opens a market trade immediately at the current market price.                                                                         |
| **Function Call**                  | `openLimitOrder()` or `openLimitOrderBNB()`                                                                                                          | `openMarketTrade()` or `openMarketTradeBNB()`                                                                                         |
| **Emitted Event**                  | `OpenLimitOrder(address user, bytes32 orderHash, IBook.OpenDataInput data)`                                                                          | `OpenMarketTrade(address user, bytes32 tradeHash, IBook.OpenDataInput trade)`                                                         |
| **Execution Timing**               | Delayed – waits for trigger (price crossing limit, oracle validation).                                                                               | Immediate – executes as soon as transaction is confirmed.                                                                             |
| **Order State After Creation**     | Becomes pending — monitored by AsterDEX Keeper or Chainlink callback.                                                                                | Becomes active trade instantly.                                                                                                       |
| **Follow-up Events**               | • `ExecuteLimitOrderSuccessful` (when executed)<br />• `ExecuteLimitOrderRejected` (if canceled/invalid)<br />• `CancelLimitOrder` (if user cancels) | • `MarketPendingTrade` (waiting oracle)<br />• `MarketTradeCallback` (execution confirmation)<br />• `PendingTradeRefund` (if failed) |
| **Event Parameters (data struct)** | pairBase, isLong, tokenIn, amountIn, qty, price, stopLoss, takeProfit, broker                                                                        | Same struct, but price acts as execution price instead of limit trigger.                                                              |

### 3. All Recent Liquidations on AsterDEX

When there is a liquidation event on AsterDEX, it emits `ExecuteCloseSuccessful` event with `executionType` 2.

**Query Link**: [AsterDEX - All latest Liquidations](https://ide.bitquery.io/AsterDEX---All-latest-Liquidations)

#### ExecutionTypes Explained

There are 4 executionTypes:

- **0 – TakeProfit (TP)** → closed because TP hit (handled by `executeTpSlOrLiq`)
- **1 – StopLoss (SL)** → closed because SL hit (your sample shows `executionType = 1` with negative PnL, consistent with SL)
- **2 – Liquidation (LIQ)** → closed by liquidation (also through `executeTpSlOrLiq`)
- **3 – Manual/Market close** → user (or UI) explicitly requested a close via `closeTrade(...)`; still emits `ExecuteCloseSuccessful` with this code. (This path does not go through `executeTpSlOrLiq` but the event includes the same enum.)

### 4. Getting All the Details of a Trade

In AsterDEX every trade has an Order Hash, using which you can track the whole lifecycle of that trade.

For example, for this OrderHash `5d5a2a37ef2afff8ce95101930507af4a255e271f5201658ea2660bc3baf6605`

You can check all related events using the following query. This query takes time as we are querying arguments which are not indexed inside our database. You can use any latest trade to make it fast.

**Query Link**: [All details of trade - 5d5a2a37ef2afff8ce95101930507af4a255e271f5201658ea2660bc3baf6605](https://ide.bitquery.io/All-details-of-trade---5d5a2a37ef2afff8ce95101930507af4a255e271f5201658ea2660bc3baf6605_7)

#### Example Trade Lifecycle

Here are all the emitted events for this trade and related transactions:

1. **OpenLimitOrder** - `0x67b7fe335e05599ae6b316b348c23055e152282638bd4e9e6219283a46789613`
2. **UpdateOrderSl** - `0x1b22bb4787efb3c40aca9093aedd70a59a9767ad7c3f3b19a29048f6514ca5dc`
3. **OpenMarketTrade** - `0x0b318a469ebc6f648d0c3a7e95705aa72c807f9248b21b451963970936ee48a0`
4. **ExecuteLimitOrderSuccessful** - `0x0b318a469ebc6f648d0c3a7e95705aa72c807f9248b21b451963970936ee48a0`
5. **UpdateTradeSl** - `0x6cb3d98e95f78e3708665c35481c04a96080b0ce4a3afd2b53cf4a49c164209d`
6. **CloseTradeReceived** - `0x2e24c951abbfb2cdea92b4f7157f52727b21761bc26368614a40a3d86137ba2e`
7. **ExecuteCloseSuccessful** - `0x2e24c951abbfb2cdea92b4f7157f52727b21761bc26368614a40a3d86137ba2e`

Similarly, you can query any event using our events API. You can check this API to see the complete list of events: [All events of AsterDEX](https://ide.bitquery.io/All-events-of-AsterDEX)

### 5. Following a Specific AsterDEX Trader

Using Bitquery's APIs you can follow specific traders on AsterDEX to check all their latest activities.

**Query Link**: [Traders data - 0x2b7363708984aa25a90450cfca7bedaf6804115c](https://ide.bitquery.io/Traders-data---0x2b7363708984aa25a90450cfca7bedaf6804115c)

This is a very interesting address (`0x2b7363708984aa25a90450cfca7bedaf6804115c`), it looks like it's market making on AsterDEX.

You can look for `Transaction -> From` or in some cases the address might be in arguments, for example: [Traders specific event](https://ide.bitquery.io/Traders-specific-event)

You can actually merge these two queries. Here is an example: [Combined Traders data - 0x01554d63537d3c62715826a268d4eab645d64b92](https://ide.bitquery.io/Copy-of-Traders-data---0x01554d63537d3c62715826a268d4eab645d64b92)

---

## Complete List of AsterDEX Events

Here is the complete list of all events emitted by the AsterDEX smart contract with their signatures:

| Event Name                          | Signature                                                                                                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PendingPredictionRefund**         | `PendingPredictionRefund(address,uint256,uint8)`                                                                                                              |
| **MarketPendingTrade**              | `MarketPendingTrade(address,bytes32,(address,bool,address,uint96,uint80,uint64,uint64,uint64,uint24))`                                                        |
| **OpenFee**                         | `OpenFee(address,uint256,uint256,uint24,uint256,uint256)`                                                                                                     |
| **CloseTradeAddLiquidity**          | `CloseTradeAddLiquidity(address,uint256)`                                                                                                                     |
| **ExecuteLimitOrderSuccessful**     | `ExecuteLimitOrderSuccessful(address,bytes32)`                                                                                                                |
| **CloseTradeReceived**              | `CloseTradeReceived(address,bytes32,address,uint256)`                                                                                                         |
| **UnStake**                         | `UnStake(address,uint256)`                                                                                                                                    |
| **BurnFee**                         | `BurnFee(address,address,uint256,uint256,uint256,uint256)`                                                                                                    |
| **FundingFeeAddLiquidity**          | `FundingFeeAddLiquidity(address,uint256)`                                                                                                                     |
| **OpenLimitOrder**                  | `OpenLimitOrder(address,bytes32,(address,bool,address,uint96,uint80,uint64,uint64,uint64,uint24))`                                                            |
| **CloseTradeRemoveLiquidity**       | `CloseTradeRemoveLiquidity(address,uint256)`                                                                                                                  |
| **SettlePredictionSuccessful**      | `SettlePredictionSuccessful(uint256,bool,uint256,address,uint256,uint256)`                                                                                    |
| **MintAlp**                         | `MintAlp(address,address,uint256,uint256)`                                                                                                                    |
| **ExecuteCloseRejected**            | `ExecuteCloseRejected(address,bytes32,uint8,uint64,uint64)`                                                                                                   |
| **UpdatePairAccFundingFeePerShare** | `UpdatePairAccFundingFeePerShare(address,uint256,int256,uint256)`                                                                                             |
| **UpdateOrderSl**                   | `UpdateOrderSl(address,bytes32,uint256,uint256)`                                                                                                              |
| **CloseFee**                        | `CloseFee(address,uint256,uint256,uint24,uint256,uint256)`                                                                                                    |
| **CloseTradeSuccessful**            | `CloseTradeSuccessful(address,bytes32,(uint64,int96,uint96,int96,uint96))`                                                                                    |
| **UpdateMargin**                    | `UpdateMargin(address,bytes32,uint256,uint256)`                                                                                                               |
| **MintFee**                         | `MintFee(address,address,uint256,uint256,uint256,uint256)`                                                                                                    |
| **PredictAndBet**                   | `PredictAndBet(address,uint256,(address,uint96,address,uint96,address,uint96,uint32,uint64,uint40,uint24,bool,uint8))`                                        |
| **BurnRemoveLiquidity**             | `BurnRemoveLiquidity(address,address,uint256)`                                                                                                                |
| **UpdateSlippageConfig**            | `UpdateSlippageConfig(uint16,uint8,uint256,uint256,uint16,uint16,uint256,uint256)`                                                                            |
| **PendingTradeRefund**              | `PendingTradeRefund(address,bytes32,uint8)`                                                                                                                   |
| **PredictionCloseFee**              | `PredictionCloseFee(address,uint256,uint256,uint24,uint256,uint256)`                                                                                          |
| **PredictAndBetPending**            | `PredictAndBetPending(address,uint256,(address,uint96,address,uint96,address,uint64,uint24,bool,uint128,uint8))`                                              |
| **UpdatePairPositionInfo**          | `UpdatePairPositionInfo(address,uint256,uint256,uint256,int256,uint64,uint64)`                                                                                |
| **OpenMarketTrade**                 | `OpenMarketTrade(address,bytes32,(address,uint32,uint64,address,address,uint96,uint64,uint64,uint24,bool,uint96,int256,uint96,uint40,uint80,uint40,uint256))` |
| **ExecuteCloseSuccessful**          | `ExecuteCloseSuccessful(address,bytes32,uint8,(uint64,int96,uint96,int96,uint96))`                                                                            |
| **CancelLimitOrder**                | `CancelLimitOrder(address,bytes32)`                                                                                                                           |
| **UpdateTradeTp**                   | `UpdateTradeTp(address,bytes32,uint256,uint256)`                                                                                                              |
| **UpdateTradeSl**                   | `UpdateTradeSl(address,bytes32,uint256,uint256)`                                                                                                              |
| **MintAddLiquidity**                | `MintAddLiquidity(address,address,uint256)`                                                                                                                   |
| **BurnAlp**                         | `BurnAlp(address,address,address,uint256,uint256)`                                                                                                            |

---

## Developer Integration Guide

### Getting Started with AsterDEX APIs

1. **Access Bitquery GraphQL IDE**: All AsterDEX APIs are accessible through [Bitquery's GraphQL IDE](https://ide.bitquery.io/)

2. **Use the Contract Address**: The main AsterDEX contract address is `0x1b6F2d3844C6ae7D56ceb3C3643b9060ba28FEb0` on BNB Smart Chain

3. **Choose Your Network**: Always specify `network: bsc` for BNB Smart Chain queries

4. **Filter by Events**: Use the event signatures from the complete list above to track specific trading activities

### Common Use Cases

**Trading Dashboard**:

- Track `OpenMarketTrade` and `OpenLimitOrder` for new positions
- Monitor `CloseTradeSuccessful` for position closures
- Display `UpdateMargin` events for margin changes

**Risk Management**:

- Monitor `ExecuteCloseSuccessful` with `executionType: 2` for liquidations
- Track `UpdateTradeSl` and `UpdateTradeTp` for stop-loss and take-profit updates
- Alert on funding rate changes via `UpdatePairAccFundingFeePerShare`

**Analytics Platform**:

- Aggregate trading volumes from all position opening/closing events
- Analyze trader behavior using specific trader addresses
- Calculate platform fees from `OpenFee` and `CloseFee` events

**Arbitrage Monitoring**:

- Watch for price discrepancies in `MarketPendingTrade` events
- Monitor funding rates for cross-platform opportunities
- Track liquidation events for potential arbitrage

## Best Practices for AsterDEX API Integration

### Performance Optimization

**Efficient Query Design:**

- Use specific event names instead of querying all events
- Implement proper pagination for large datasets
- Cache frequently accessed data to reduce API calls
- Use GraphQL field selection to minimize response size

**Real-time Data Handling:**

```javascript
// Optimized query for high-frequency trading applications
const optimizedQuery = `{
  EVM(dataset: realtime, network: bsc) {
    Events(
      where: {
        Log: {Signature: {Name: {in: ["OpenMarketTrade", "ExecuteCloseSuccessful"]}}}
        LogHeader: {Address: {is: "0x1b6F2d3844C6ae7D56ceb3C3643b9060ba28FEb0"}}
      }
      orderBy: {descending: Block_Time}
      limit: {count: 50}
    ) {
      Block { Time Number }
      Arguments { Name Value }
    }
  }
}`;
```

### Security Considerations

**API Key Management:**

- Store API keys securely using environment variables
- Implement API key rotation for production applications
- Use read-only permissions when possible
- Monitor API usage and set up alerts for unusual activity

**Data Validation:**

- Always validate contract addresses and event signatures
- Implement checksum verification for address fields
- Cross-reference critical data with multiple sources
- Set up monitoring for data anomalies

### Error Handling and Reliability

**Robust Integration Pattern:**

```javascript
async function fetchAsterDEXData(retries = 3) {
  try {
    const response = await fetch(BITQUERY_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... ${retries} attempts remaining`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchAsterDEXData(retries - 1);
    }
    throw error;
  }
}
```

### Scaling Your Application

**Production Deployment:**

- Implement connection pooling for high-throughput applications
- Use caching layers (Redis/Memcached) for frequently accessed data
- Set up monitoring and alerting for API performance
- Plan for rate limit management and backoff strategies

**Data Processing Pipeline:**

- Process events in chronological order for accurate state tracking
- Implement event deduplication for reliability
- Use event sourcing patterns for complex trading logic
- Set up data backup and recovery procedures

### Additional Resources

- [Bitquery Documentation](https://docs.bitquery.io/)
- [GraphQL Query Guide](/docs/graphql/query/)
- [BNB Smart Chain Explorer](https://bscscan.com/)
- [Production Deployment Guide](/docs/start/getting-updates/)
- [API Rate Limits](/docs/graphql/limits/)

<FAQ
  items={[
    { q: "How do I access AsterDEX perpetual futures data?", a: "Query EVM on network bsc filtered to AsterDEX contract events and trades — no BSC node required. Examples on this page use the main contract 0x1b6F2d3844C6ae7D56ceb3C3643b9060ba28FEb0." },
    { q: "How do I track AsterDEX liquidations in real time?", a: "Monitor ExecuteCloseSuccessful events with executionType 2 via GraphQL subscription or polling." },
    { q: "Can I follow a specific trader on AsterDEX?", a: "Yes. Filter trade and position events by wallet address to build trader dashboards or alerts." },
    { q: "What execution types does AsterDEX use?", a: "0 TakeProfit, 1 StopLoss, 2 Liquidation, 3 Manual/Market close — filter events by executionType in your query." },
    { q: "How fresh is AsterDEX data?", a: "Typically 1–3 seconds after BSC block confirmation. Use subscriptions for live trading applications." },
    { q: "How do I differentiate limit orders from market orders?", a: "Monitor OpenLimitOrder events for limit orders and OpenMarketTrade events for market orders — each has different follow-up events." },
    { q: "How do I track a trade from open to close?", a: "Use the order hash to chain OpenLimitOrder or OpenMarketTrade through ExecuteLimitOrderSuccessful, margin updates, and CloseTradeSuccessful." },
    { q: "Can I get funding rate data for AsterDEX pairs?", a: "Yes. Monitor UpdatePairAccFundingFeePerShare for rate changes and FundingFeeAddLiquidity for funding payments." },
  ]}
/>

## What You Can Build with AsterDEX API Integration

With Bitquery's AsterDEX integration, developers can build:

- **Query all trades, swaps, and liquidity pool activity** on AsterDEX
- **Monitor trader, token pairs, and pool performance** in real-time
- **Stream real‑time on‑chain events** (swaps, stop loss & take profit updates, liquidations) as they occur

## Related Resources

### Bitquery Platform

- [Bitquery GraphQL IDE](https://ide.bitquery.io/)
- [Bitquery Documentation](https://docs.bitquery.io/)
- [BNB Smart Chain APIs](/docs/blockchain/BSC/)

### Support

For technical support and questions:

- **Bitquery Support**: [Telegram Community](https://t.me/bloxy_info)

---

_This comprehensive AsterDEX API documentation provides complete coverage of perpetual futures trading data on BNB Smart Chain. From order lifecycle tracking to liquidation monitoring, developers have access to all the tools needed to build sophisticated DeFi trading applications. All API examples include real contract addresses and working GraphQL queries for immediate implementation._
