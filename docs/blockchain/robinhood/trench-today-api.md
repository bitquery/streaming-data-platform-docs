---
title: "trench.today API on Robinhood"
description: "trench.today API on Robinhood: track newly launched tokens, bonding-curve buys and sells, and live reserves on the trench.today launchpad with Bitquery GraphQL examples for developers."
sidebar_position: 4
keywords:
  - trench.today API
  - trench.today Robinhood API
  - trench.today newly launched tokens
  - trench.today TokenCreate event
  - trench.today trades API
  - trench.today token launch Robinhood
  - Robinhood launchpad API
  - Bitquery trench.today Events API
  - trench.today new token created
  - trench.today TokenPurchase event
  - trench.today TokenSale event
  - trench.today bonding curve reserves
  - trench.today Sync event
  - trench.today live trades stream
  - trench.today meme coin launchpad
---

# trench.today API on Robinhood

**trench.today** is a meme-coin launchpad on the **Robinhood** network, one of the most active token factories on the chain. This guide shows how to track **newly launched trench.today tokens**, **bonding-curve buys and sells**, and **live curve reserves** with Bitquery GraphQL APIs, using the `EVM(network: robinhood)` Events cube.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades)
- [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches)
- [Flap.sh API on Robinhood](/docs/blockchain/robinhood/flap-sh-api) — another Robinhood launchpad
- [Pons API on Robinhood](/docs/blockchain/robinhood/pons-api)
- [Robinhood Transfers](/docs/blockchain/robinhood/robinhood-transfers)
- [WebSocket subscriptions](/docs/subscriptions/websockets/)
:::

---

## trench.today contracts

All trench.today protocol events are emitted through a single factory proxy, which makes filtering simple: pin every query to one `LogHeader.Address`.

| Role | Address | Emits |
| --- | --- | --- |
| **Factory / curve engine** (EIP-1967 proxy) | `0x77dc6f6361b7b99456fc3761ce5b7dda80d83f9d` | `TokenCreate`, `TokenPurchase`, `TokenSale`, `Sync` |
| **Implementation** (behind the proxy) | `0x5d15bdd2a834c66149c38c5ae19c5f4b60cbc397` | Shown as `Log.SmartContract` in decoded events |

The four events cover the full bonding-curve lifecycle:

| Event | Meaning | Key arguments |
| --- | --- | --- |
| `TokenCreate` | New token launched | `creator`, `curve`, `token`, `quote`, `name`, `symbol`, `timestamp`, `tokenURI` |
| `TokenPurchase` | Buy on the curve | `token`, `buyer`, `amountOut`, `quoteAmountUsed`, `protocolFee`, `extraFee`, `extraFeeReceiver`, `extraFeeRate` |
| `TokenSale` | Sell on the curve | `token`, `seller`, `amountIn`, `netQuoteOut`, `protocolFee`, `extraFee`, `extraFeeReceiver` |
| `Sync` | Post-trade curve reserves | `token`, `realQuoteReserves`, `realTokenReserves`, `virtualQuote`, `virtualToken` |

:::note Amounts are raw on-chain integers
Event argument values (`amountOut`, `quoteAmountUsed`, reserves, fees) are the raw on-chain integers — divide by `1e18` for whole-token / native amounts. The `quote` argument of `TokenCreate` is the zero address, meaning the curve quotes in the chain's native token.
:::

---

## Newly launched tokens

Every launch emits a decoded **`TokenCreate`** event with the creator, the new token address, its bonding `curve` contract, and full metadata (`name`, `symbol`, `tokenURI`).

▶️ [Run in IDE](https://ide.bitquery.io/trench-today-newly-created-tokens) · [WebSocket stream](https://ide.bitquery.io/trench-today-newly-created-tokens-stream)

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x77dc6f6361b7b99456fc3761ce5b7dda80d83f9d"}}
        Log: {Signature: {Name: {is: "TokenCreate"}}}
      }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        From
      }
      Log {
        Signature {
          Name
        }
        SmartContract
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
        }
      }
    }
  }
}
```

:::tip Stream the same query
Change the operation type from a query to a `subscription` in the Bitquery IDE (and drop `limit`/`orderBy`) to receive every new trench.today launch in real time over WebSocket.
:::

---

## Token buys (`TokenPurchase`)

Each buy on the bonding curve emits `TokenPurchase` with the `buyer`, tokens received (`amountOut`), native spent (`quoteAmountUsed`), and the protocol fee.

▶️ [Run in IDE](https://ide.bitquery.io/trench-today-token-purchases)

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x77dc6f6361b7b99456fc3761ce5b7dda80d83f9d"}}
        Log: {Signature: {Name: {is: "TokenPurchase"}}}
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
        From
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
        }
      }
    }
  }
}
```

## Token sells (`TokenSale`)

Sells mirror buys: `amountIn` is the tokens sold, `netQuoteOut` the native returned to the `seller` after fees.

▶️ [Run in IDE](https://ide.bitquery.io/trench-today-token-sales)

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x77dc6f6361b7b99456fc3761ce5b7dda80d83f9d"}}
        Log: {Signature: {Name: {is: "TokenSale"}}}
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
        From
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
        }
      }
    }
  }
}
```

## Live trades stream (buys + sells)

Subscribe to both trade events in one WebSocket stream — the backbone of a trench.today trading bot or live feed.

▶️ [Run in IDE](https://ide.bitquery.io/trench-today-live-trades-stream)

```graphql
subscription {
  EVM(network: robinhood) {
    Events(
      where: {
        LogHeader: {Address: {is: "0x77dc6f6361b7b99456fc3761ce5b7dda80d83f9d"}}
        Log: {Signature: {Name: {in: ["TokenPurchase", "TokenSale"]}}}
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
        From
      }
      Log {
        Signature {
          Name
        }
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
        }
      }
    }
  }
}
```

`Log.Signature.Name` tells you whether each message is a buy (`TokenPurchase`) or a sell (`TokenSale`).

---

## Bonding-curve reserves (`Sync`)

After every trade the curve emits `Sync` with its current state: `realQuoteReserves` / `realTokenReserves` (actual balances) and `virtualQuote` / `virtualToken` (the constant-product virtual reserves). The instantaneous curve price is `virtualQuote / virtualToken`, and real reserves show how far a token has progressed along its curve.

▶️ [Run in IDE](https://ide.bitquery.io/trench-today-bonding-curve-sync)

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x77dc6f6361b7b99456fc3761ce5b7dda80d83f9d"}}
        Log: {Signature: {Name: {is: "Sync"}}}
      }
    ) {
      Block {
        Time
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
        }
      }
    }
  }
}
```

---

## All events for a single token

Every trench.today event carries a `token` argument, so one `Arguments.includes` filter follows a token through its whole lifecycle — creation, every buy and sell, and each reserve update. Replace the address with the token you're tracking.

▶️ [Run in IDE](https://ide.bitquery.io/trench-today-all-events-for-a-token)

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 50}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x77dc6f6361b7b99456fc3761ce5b7dda80d83f9d"}}
        Arguments: {
          includes: {
            Name: {is: "token"}
            Value: {Address: {is: "0xe6052a3eb17590ceac6652bc751065224749cccc"}}
          }
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
      Log {
        Signature {
          Name
        }
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
        }
      }
    }
  }
}
```

---

## FAQ

### How do I detect a newly launched trench.today token?

Filter events by `Log.Signature.Name: "TokenCreate"` on the factory address `0x77dc6f6361b7b99456fc3761ce5b7dda80d83f9d`. The decoded arguments include the `token` address, its `creator`, the bonding `curve` contract, and metadata (`name`, `symbol`, `tokenURI`). Run it as a `subscription` for real-time launch alerts.

### How do I get trench.today trades?

Query the same factory address for `TokenPurchase` (buys) and `TokenSale` (sells), or subscribe to both at once with `Name: {in: ["TokenPurchase", "TokenSale"]}`. Amounts are raw integers — divide by `1e18`.

### How do I compute a token's bonding-curve price?

Use the `Sync` event: the curve price in native terms is `virtualQuote / virtualToken`. `Sync` fires after every trade, so streaming it gives you a live price and reserve feed per token.

### Why is there one contract address instead of separate factory and curve contracts?

trench.today runs everything through a single EIP-1967 proxy (`0x77dc…f9d`). Each token still gets its own `curve` contract (reported in `TokenCreate`), but events are emitted by the proxy, so a single `LogHeader.Address` filter captures the entire protocol. Decoded events report the implementation `0x5d15…397` as `Log.SmartContract`.

### Can I use the Trading cube for trench.today trades?

Bonding-curve trades live in the `EVM` Events cube queries shown on this page. Once a token migrates to a DEX pool, its trading appears under Uniswap markets on Robinhood — follow it with the [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades).

---

## Next steps

- Stream **`TokenCreate`** for real-time launch alerts, then follow each token with the [all-events-for-a-token query](#all-events-for-a-single-token).
- Track other Robinhood launchpads with the [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches).
- Explore prices, OHLCV, whale trades, and top traders in the [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades).
- Inspect holder and wallet flows with [Robinhood Transfers](/docs/blockchain/robinhood/robinhood-transfers).
