---
title: "Arc Testnet DEX Trades API & Streams"
description: "Query and stream Uniswap v2, v3, v4 and Curve trades on Circle's Arc testnet with Bitquery GraphQL: live swaps, latest trades, OHLCV candles, top tokens, DEX breakdown and trader activity."
sidebar_position: 1
keywords:
  - Arc testnet trades API
  - Arc testnet DEX trades
  - Arc testnet Uniswap v4 trades
  - Arc testnet OHLCV
  - Arc testnet token price
  - Arc testnet swap stream
  - Circle Arc DEX API
  - Arc blockchain trades API
  - arc_testnet DEXTrades
  - arc_testnet DEXTradeByTokens
  - Bitquery Arc testnet
---
# Arc Testnet DEX Trades API & Streams

Query and stream **DEX trades on Arc testnet** with Bitquery GraphQL. Arc is Circle's EVM Layer 1 for stablecoin finance, and its testnet is exposed as `EVM(network: arc_testnet)`. The `DEXTrades` and `DEXTradeByTokens` cubes carry every swap on **Uniswap v4, v3 and v2, Curve and Aerodrome** with buy and sell sides, native-unit prices, the DEX contract, the trader and the transaction.

Every query on this page was executed against the production endpoint before publishing. Change `query` to `subscription` on any of them to stream the same rows over WebSocket.

:::warning Testnet: no USD values, no Trading cube, realtime only
- Every `...InUSD` field (`AmountInUSD`, `PriceInUSD`, `ValueInUSD`) returns **0** on Arc testnet. There is no token price index for a testnet. Prices in `Trade.Price` and `Trade.PriceInUSD` are ratios of the two sides and work normally.
- The multi-chain `Trading` cubes (`Trading.Trades`, `Tokens`, `Pairs`) do **not** include Arc testnet. Use the chain-level `DEXTrades` and `DEXTradeByTokens` cubes on this page.
- Only `dataset: realtime` (the default) is served. There is no archive for the testnet, so leave the `dataset` argument out.

USD pricing and an archive dataset are planned for Arc **mainnet** once it is indexed.
:::

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Arc Testnet API overview](/docs/blockchain/arc-testnet/) — network facts, every cube and stream in one place
- [Arc Testnet Transfers API](/docs/blockchain/arc-testnet/arc-testnet-transfers-api/)
- [Arc Testnet Events API](/docs/blockchain/arc-testnet/arc-testnet-events-api/) — Uniswap v4 `Initialize`, v3 `PoolCreated`, v2 `PairCreated`
- [Arc Testnet Balances API](/docs/blockchain/arc-testnet/arc-testnet-balances-api/)
- [DEXTrades vs DEXTradeByTokens vs Trading.Trades](/docs/cubes/dextrades-dextradebytokens-trading-trades/)
- [EVM DEXTrades schema](/docs/schema/evm/dextrades/)
:::

**On this page:** [Identifiers](#network-and-example-addresses) · [Stream](#stream-real-time-trades) · [Latest](#latest-trades) · [By token](#trades-of-a-token) · [By DEX](#trades-on-one-dex) · [By pool](#trades-in-one-pool) · [By trader](#trades-of-a-wallet) · [OHLCV](#ohlcv-candles-for-a-token) · [Latest price](#latest-price-of-a-token) · [Top tokens](#most-traded-tokens) · [DEX breakdown](#trade-count-by-dex-protocol) · [Top traders](#most-active-traders) · [FAQ](#faq)

---

## Network and example addresses

| Item | Value |
| --- | --- |
| Network argument | `EVM(network: arc_testnet)` |
| Chain ID | `5042002` |
| Native gas token | USDC. Appears as `SmartContract: "0x0000000000000000000000000000000000000000"` with symbol `USDC` and name `USD Coin` in `DEXTrades` and `DEXTradeByTokens`; as `"0x"` with `Currency.Native: true` in `Transfers` and `Balances` |
| USDC (ERC-20 interface, 6 decimals) | `0x3600000000000000000000000000000000000000` |
| EURC (6 decimals) | `0x89b50855aa3be2f677cd6303cec089b5f319d72a` |
| USDT (testnet mock, 18 decimals) | `0x175cdb1d338945f0d851a741ccf787d343e57952` |
| ARCFOMO (busiest meme token at the time of writing) | `0xe2cfd2893ad90e8a5b4f87c5cad22d150b1e12a0` |
| Uniswap v4 PoolManager | `0x1d70945634f618eefdf9edaadb59b9a183cef929`, the `Dex.SmartContract` on every v4 trade |
| Uniswap v3 USDC/USDT pool | `0x715f78de0cea7428a5ede4a0c491b05e7a8caff2` |
| Uniswap v3 EURC/USDT pool | `0x66a038f2f6000cf42d34c3ccd6c97ccfa16443bd` |

These are live examples. Testnet tokens come and go, so swap in any token, pool or trader you care about.

:::info Uniswap v4 pools have no address
On v4 every pool lives inside the singleton PoolManager, so `Trade.Dex.SmartContract` is the PoolManager and `Trade.Dex.Pair.SmartContract` is the zero address. Identify a v4 pool by its two currencies, or by the `id` argument of the `Initialize` event on the [Events API](/docs/blockchain/arc-testnet/arc-testnet-events-api/#new-uniswap-v4-pools).
:::

---

## Stream real-time trades

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-stream-dex-trades)

One WebSocket delivers every swap on the network as blocks are indexed, with both sides, the protocol and the trader.

```graphql
subscription {
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-latest-dex-trades)

The most recent swaps on the network. `Trade.Buy` is the currency the trader received and `Trade.Sell` is what they paid.

```graphql
{
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-trades-of-a-token)

`DEXTradeByTokens` returns one row per token side of every trade, so a token filter catches it whether it was bought or sold. `Side.Type` says which direction the trade was from the token's point of view.

```graphql
{
  EVM(network: arc_testnet) {
    DEXTradeByTokens(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Trade: {
          Currency: {SmartContract: {is: "0xe2cfd2893ad90e8a5b4f87c5cad22d150b1e12a0"}}
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-uniswap-v4-trades)

Filter by `Dex.ProtocolName`. Values seen on Arc testnet are `uniswap_v4`, `uniswap_v3`, `uniswap_v2`, `curve_v1` and `aerodrome_v1`.

```graphql
{
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-trades-in-a-pool)

For Uniswap v2 and v3 the pool has its own address in `Trade.Dex.SmartContract`. This example reads the v3 USDC/USDT pool.

```graphql
{
  EVM(network: arc_testnet) {
    DEXTrades(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Trade: {
          Dex: {SmartContract: {is: "0x715f78de0cea7428a5ede4a0c491b05e7a8caff2"}}
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-trades-of-a-wallet)

`Transaction.From` is the externally owned account that signed the swap. `Trade.Buy.Buyer` and `Trade.Sell.Seller` are the addresses that received and paid the tokens, which can be a router rather than the signer.

```graphql
{
  EVM(network: arc_testnet) {
    DEXTrades(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Transaction: {From: {is: "0x47262d76684b071ba33304e5aa8b424035f3e06c"}}
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-ohlcv-candles)

Hourly candles for ARCFOMO priced in native USDC. `Block.Time(interval: ...)` buckets the trades; `open` and `close` take the price at the lowest and highest block in the bucket. Change `count` and `in` for other intervals.

```graphql
{
  EVM(network: arc_testnet) {
    DEXTradeByTokens(
      limit: {count: 24}
      orderBy: {descendingByField: "Block_Time"}
      where: {
        Trade: {
          Currency: {SmartContract: {is: "0xe2cfd2893ad90e8a5b4f87c5cad22d150b1e12a0"}}
          Side: {
            Currency: {SmartContract: {is: "0x0000000000000000000000000000000000000000"}}
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-latest-token-price)

The price of the most recent trade against native USDC. Because the quote is a dollar stablecoin, `Trade.Price` here is effectively a USD price even though `PriceInUSD` is 0 on testnet.

```graphql
{
  EVM(network: arc_testnet) {
    DEXTradeByTokens(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {
        Trade: {
          Currency: {SmartContract: {is: "0xe2cfd2893ad90e8a5b4f87c5cad22d150b1e12a0"}}
          Side: {
            Currency: {SmartContract: {is: "0x0000000000000000000000000000000000000000"}}
          }
        }
      }
    ) {
      Block {
        Time
      }
      Trade {
        Price
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-most-traded-tokens)

Tokens ranked by trade count over the last 24 hours. Native USDC is the quote on most pools, so it tops the list; the rows under it are the tokens people actually trade.

```graphql
{
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-trades-by-dex)

Which DEXes carry the testnet's volume. Uniswap v4 dominates at the time of writing.

```graphql
{
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-most-active-traders)

Signers ranked by swap count. On a testnet the top rows are usually bots and routers; drop the first few addresses to find real wallets.

```graphql
{
  EVM(network: arc_testnet) {
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

**Why is every `AmountInUSD` and `PriceInUSD` zero?**
Arc testnet has no token price index, so USD fields are 0 by design. `Trade.Price` is the ratio between the two sides and is correct. When the quote is USDC or another dollar stablecoin, that ratio is a dollar price.

**Can I use `Trading.Trades` with `bid:arc_testnet`?**
No. The `Trading` cubes cover mainnet chains with USD pricing. Arc testnet is served only through `EVM(network: arc_testnet)`.

**How far back does the data go?**
Only the `realtime` dataset exists for the testnet, and it holds a rolling window of recent blocks. Measure it with `Block { Time(minimum: Block_Time) }` rather than assuming a depth. `dataset: archive` and `dataset: combined` return errors.

**Why does native USDC show two different contract addresses?**
The native gas token is USDC. The trade cubes report it as the zero address with name `USD Coin`; `Transfers` and `Balances` report it as `"0x"` with `Currency.Native: true`. The ERC-20 interface at `0x3600000000000000000000000000000000000000` is a separate currency with 6 decimals and name `USDC`.

**Do Solidity selectors and topic hashes work the same as on Ethereum?**
Yes. Arc is EVM-compatible, so ABIs, 4-byte selectors and topic0 hashes carry over unchanged.
