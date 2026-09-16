---
title: "Arc Mainnet DEX Trades API & Streams"
description: "Query and stream Uniswap v2, v3, v4 and Curve trades on Circle's Arc mainnet with Bitquery GraphQL: live swaps, latest trades, OHLCV candles, top tokens, DEX breakdown and trader activity."
sidebar_position: 1
keywords:
  - Arc mainnet trades API
  - Arc mainnet DEX trades
  - Arc mainnet Uniswap v4 trades
  - Arc mainnet OHLCV
  - Arc mainnet token price
  - Arc mainnet swap stream
  - Circle Arc DEX API
  - Arc blockchain trades API
  - arc DEXTrades
  - arc DEXTradeByTokens
  - Bitquery Arc mainnet
---
# Arc Mainnet DEX Trades API & Streams

Query and stream **DEX trades on Arc mainnet** with Bitquery GraphQL. Arc is Circle's EVM Layer 1 for stablecoin finance, exposed as `EVM(network: arc)`. The `DEXTrades` and `DEXTradeByTokens` cubes return decoded Uniswap v4, v3 and v2 swaps with buy and sell sides, USD values, the DEX contract, the trader and the transaction.

Every query on this page was executed against the production endpoint before publishing. Change `query` to `subscription` on any of them to stream the same rows over WebSocket.

:::info Availability checked 16 September 2026
- `AmountInUSD` and `PriceInUSD` returned populated values.
- `Trading.Trades` included Arc under `Pair.Market.Network: "Arc"`, with token IDs beginning `bid:arc:`.
- Only the realtime EVM path answered. Leave the `dataset` argument out until `combined` and `archive` are enabled.
:::

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Arc Mainnet API overview](/docs/blockchain/arc-mainnet/) — network facts, every cube and stream in one place
- [Arc Mainnet Transfers API](/docs/blockchain/arc-mainnet/arc-mainnet-transfers-api/)
- [Arc Mainnet Events API](/docs/blockchain/arc-mainnet/arc-mainnet-events-api/) — Uniswap v4 `Initialize`, v3 `PoolCreated`, v2 `PairCreated`
- [Arc Mainnet Balances API](/docs/blockchain/arc-mainnet/arc-mainnet-balances-api/)
- [DEXTrades vs DEXTradeByTokens vs Trading.Trades](/docs/cubes/dextrades-dextradebytokens-trading-trades/)
- [EVM DEXTrades schema](/docs/schema/evm/dextrades/)
:::

**On this page:** [Identifiers](#network-and-example-addresses) · [Stream](#stream-real-time-trades) · [Latest](#latest-trades) · [By token](#trades-of-a-token) · [By DEX](#trades-on-one-dex) · [By pool](#trades-in-one-pool) · [By trader](#trades-of-a-wallet) · [OHLCV](#ohlcv-candles-for-a-token) · [Latest price](#latest-price-of-a-token) · [Top tokens](#most-traded-tokens) · [DEX breakdown](#trade-count-by-dex-protocol) · [Top traders](#most-active-traders) · [FAQ](#faq)

---

## Network and example addresses

| Item | Value |
| --- | --- |
| Network argument | `EVM(network: arc)` |
| Chain ID | `5042` |
| Native gas token | USDC. Appears as `SmartContract: "0x0000000000000000000000000000000000000000"` with symbol `USDC` and name `USD Coin` in `DEXTrades` and `DEXTradeByTokens`; as `"0x"` with `Currency.Native: true` in `Transfers` and `Balances` |
| USDC (ERC-20 interface, 6 decimals) | `0x3600000000000000000000000000000000000000` |
| EURC (6 decimals) | `0xbef5f6d51cb62b58e6a8f77868681825c6fe21c1` |
| MOCHI (live launch-day example) | `0x9f367725848793152175ff077e885a32430dfaa7` |
| Uniswap v4 PoolManager | `0x8366a39cc670b4001a1121b8f6a443a643e40951`, the `Dex.SmartContract` on every v4 trade |
| Uniswap v3 BUILDOG/USDC pool | `0x01be77f0a364bddafd34521892ea4745ebf9b5a2` |
| Uniswap v2 ARCAT/USDC pair | `0xcf924acee7eb1f169a922bf19b0a732810971985` |

These are live launch-day examples. Token and pool activity changes, so swap in the asset, pool or trader you care about.

:::info Uniswap v4 pools have no address
On v4 every pool lives inside the singleton PoolManager, so `Trade.Dex.SmartContract` is the PoolManager and `Trade.Dex.Pair.SmartContract` is the zero address. Identify a v4 pool by its two currencies, or by the `id` argument of the `Initialize` event on the [Events API](/docs/blockchain/arc-mainnet/arc-mainnet-events-api/#new-uniswap-v4-pools).
:::

---

## Stream real-time trades

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-stream-dex-trades)

One WebSocket delivers every swap on the network as blocks are indexed, with both sides, the protocol and the trader.

```graphql
subscription {
  EVM(network: arc) {
    DEXTrades {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        From
      }
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
          SmartContract
        }
        Buy {
          Amount
          Buyer
          Seller
          Price
          Currency {
            Name
            Symbol
            SmartContract
          }
        }
        Sell {
          Amount
          Buyer
          Seller
          Price
          Currency {
            Name
            Symbol
            SmartContract
          }
        }
      }
    }
  }
}
```

---

## Latest trades

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-latest-dex-trades)

The most recent swaps on the network. `Trade.Buy` is the currency the trader received and `Trade.Sell` is what they paid.

```graphql
{
  EVM(network: arc) {
    DEXTrades(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        From
      }
      Trade {
        Dex {
          ProtocolName
          SmartContract
        }
        Buy {
          Amount
          Currency {
            Symbol
            SmartContract
          }
          Price
        }
        Sell {
          Amount
          Currency {
            Symbol
            SmartContract
          }
        }
      }
    }
  }
}
```

---

## Trades of a token

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-trades-of-a-token)

`DEXTradeByTokens` returns one row per token side of every trade, so a token filter catches it whether it was bought or sold. `Side.Type` says which direction the trade was from the token's point of view.

```graphql
{
  EVM(network: arc) {
    DEXTradeByTokens(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Trade: {
          Currency: {SmartContract: {is: "0xbef5f6d51cb62b58e6a8f77868681825c6fe21c1"}}
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Trade {
        Amount
        Price
        Currency {
          Symbol
        }
        Side {
          Type
          Amount
          Currency {
            Symbol
            SmartContract
          }
        }
        Dex {
          ProtocolName
        }
      }
    }
  }
}
```

---

## Trades on one DEX

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-uniswap-v4-trades)

Filter by `Dex.ProtocolName`. Values seen on Arc mainnet are `uniswap_v4`, `uniswap_v3`, `uniswap_v2`, `curve_v1` and `aerodrome_v1`.

```graphql
{
  EVM(network: arc) {
    DEXTrades(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {Trade: {Dex: {ProtocolName: {is: "uniswap_v4"}}}}
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Trade {
        Dex {
          ProtocolName
          SmartContract
        }
        Buy {
          Amount
          Currency {
            Symbol
            SmartContract
          }
        }
        Sell {
          Amount
          Currency {
            Symbol
            SmartContract
          }
        }
      }
    }
  }
}
```

---

## Trades in one pool

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-trades-in-a-pool)

For Uniswap v2 and v3 the pool has its own address in `Trade.Dex.SmartContract`. This example reads a live v3 BUILDOG/USDC pool.

```graphql
{
  EVM(network: arc) {
    DEXTrades(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Trade: {
          Dex: {SmartContract: {is: "0x01be77f0a364bddafd34521892ea4745ebf9b5a2"}}
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
        From
      }
      Trade {
        Buy {
          Amount
          Currency {
            Symbol
          }
          Price
        }
        Sell {
          Amount
          Currency {
            Symbol
          }
        }
      }
    }
  }
}
```

---

## Trades of a wallet

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-trades-of-a-wallet)

`Transaction.From` is the externally owned account that signed the swap. `Trade.Buy.Buyer` and `Trade.Sell.Seller` are the addresses that received and paid the tokens, which can be a router rather than the signer.

```graphql
{
  EVM(network: arc) {
    DEXTrades(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Transaction: {From: {is: "0xada5bb90d0de0bd1b6f3938708f49295a8d1f7cb"}}
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Trade {
        Dex {
          ProtocolName
        }
        Buy {
          Amount
          Currency {
            Symbol
          }
          Buyer
        }
        Sell {
          Amount
          Currency {
            Symbol
          }
          Seller
        }
      }
    }
  }
}
```

---

## OHLCV candles for a token

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-ohlcv-candles)

Hourly candles for EURC priced in ERC-20 USDC. `Block.Time(interval: ...)` buckets the trades; `open` and `close` take the price at the lowest and highest block in the bucket. Change `count` and `in` for other intervals.

```graphql
{
  EVM(network: arc) {
    DEXTradeByTokens(
      limit: {count: 24}
      orderBy: {descendingByField: "Block_Time"}
      where: {
        Trade: {
          Currency: {SmartContract: {is: "0xbef5f6d51cb62b58e6a8f77868681825c6fe21c1"}}
          Side: {
            Currency: {SmartContract: {is: "0x3600000000000000000000000000000000000000"}}
          }
        }
      }
    ) {
      Block {
        Time(interval: {in: hours, count: 1})
      }
      volume: sum(of: Trade_Amount)
      Trade {
        high: Price(maximum: Trade_Price)
        low: Price(minimum: Trade_Price)
        open: Price(minimum: Block_Number)
        close: Price(maximum: Block_Number)
      }
      count
    }
  }
}
```

---

## Latest price of a token

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-latest-token-price)

The price of the most recent EURC trade against ERC-20 USDC. `Trade.PriceInUSD` is populated on Arc mainnet.

```graphql
{
  EVM(network: arc) {
    DEXTradeByTokens(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {
        Trade: {
          Currency: {SmartContract: {is: "0xbef5f6d51cb62b58e6a8f77868681825c6fe21c1"}}
          Side: {
            Currency: {SmartContract: {is: "0x3600000000000000000000000000000000000000"}}
          }
        }
      }
    ) {
      Block {
        Time
      }
      Trade {
        Price
        PriceInUSD
        Currency {
          Symbol
        }
        Side {
          Currency {
            Symbol
          }
        }
        Dex {
          ProtocolName
        }
      }
    }
  }
}
```

---

## Most traded tokens

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-most-traded-tokens)

Tokens ranked by trade count over the last 24 hours. Native USDC is the quote on most pools, so it tops the list; the rows under it are the tokens people actually trade.

```graphql
{
  EVM(network: arc) {
    DEXTradeByTokens(
      limit: {count: 20}
      orderBy: {descendingByField: "count"}
      where: {Block: {Time: {since_relative: {hours_ago: 24}}}}
    ) {
      Trade {
        Currency {
          Symbol
          Name
          SmartContract
        }
      }
      count
      volume: sum(of: Trade_Amount)
      traders: uniq(of: Transaction_From)
    }
  }
}
```

---

## Trade count by DEX protocol

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-trades-by-dex)

Which DEXes carry mainnet volume. Uniswap v4 led the launch-day check.

```graphql
{
  EVM(network: arc) {
    DEXTrades(
      limit: {count: 10}
      orderBy: {descendingByField: "count"}
      where: {Block: {Time: {since_relative: {hours_ago: 24}}}}
    ) {
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
        }
      }
      count
      pools: uniq(of: Trade_Dex_SmartContract)
      traders: uniq(of: Transaction_From)
    }
  }
}
```

---

## Most active traders

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-most-active-traders)

Signers ranked by swap count. The top rows often include bots and routers, so inspect the address before treating it as a person.

```graphql
{
  EVM(network: arc) {
    DEXTrades(
      limit: {count: 20}
      orderBy: {descendingByField: "count"}
      where: {Block: {Time: {since_relative: {hours_ago: 24}}}}
    ) {
      Transaction {
        From
      }
      count
      tokens: uniq(of: Trade_Buy_Currency_SmartContract)
    }
  }
}
```

---

## FAQ

**Are `AmountInUSD` and `PriceInUSD` available?**
Yes. Both returned populated values in the production check on 16 September 2026. `Trade.Price` remains the direct ratio between the two sides.

**Can I use `Trading.Trades` with `bid:arc`?**
Yes. Filter `Pair.Market.Network` by `Arc`. Use the chain-level cubes when you also need EVM calls, logs or transfers.

**How far back does the data go?**
Only the realtime path answered on 16 September 2026. Measure it with `Block { Time(minimum: Block_Time) }` rather than assuming a depth. Retry `archive` and `combined` before using them.

**Why does native USDC show two different contract addresses?**
The native gas token is USDC. The trade cubes report it as the zero address with name `USD Coin`; `Transfers` and `Balances` report it as `"0x"` with `Currency.Native: true`. The ERC-20 interface at `0x3600000000000000000000000000000000000000` is a separate currency with 6 decimals and name `USDC`.

**Do Solidity selectors and topic hashes work the same as on Ethereum?**
Yes. Arc is EVM-compatible, so ABIs, 4-byte selectors and topic0 hashes carry over unchanged.
