---
title: "Flap.sh API on Robinhood"
description: "Track Flap.sh newly launched tokens and trades on Robinhood with Bitquery. Detect TokenCreated events, mint transfers, and stream Flap.sh market trades via EVM and Trading APIs."
sidebar_position: 4
keywords:
  - Flap.sh API
  - Flap.sh Robinhood API
  - Flap.sh newly launched tokens
  - Flap.sh TokenCreated event
  - Flap.sh trades API
  - Flap.sh token launch Robinhood
  - Robinhood launchpad API
  - Bitquery Flap.sh Events API
  - Bitquery Flap.sh Trading API
  - Flap.sh new token created
  - Flap.sh market trades
  - Flap.sh LaunchedToDEX graduation
  - Flap.sh bonding curve progress
  - Flap.sh FlapTokenProgressChanged
  - Flap.sh circulating supply API
  - Flap.sh tax paid event
  - Flap.sh VanityTokenCreated
  - Flap.sh MsgSent social event
---

# Flap.sh API on Robinhood

**Flap.sh** is a token launchpad on the **Robinhood** network. This guide shows how to track **newly launched Flap.sh tokens**, **Flap.sh trades**, and **lifecycle events** — token graduations, bonding-curve progress, supply changes, tax paid, vanity tokens, and social messages — with Bitquery GraphQL APIs, using the `EVM(network: robinhood)` and `Trading` cubes.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorisation/how-to-generate/)
:::

:::tip Related docs
- [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades)
- [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches)
- [Robinhood Transfers](/docs/blockchain/robinhood/robinhood-transfers)
- [WebSocket subscriptions](/docs/subscriptions/websockets/)
:::

---

## Flap.sh contract

| Field | Value |
| --- | --- |
| **Flap.sh contract** | `0x26605f322f7ff986f381bb9a6e3f5dab0beaeb09` |
| **Launch mint `Amount`** | `1000000000` (1 billion, decimal-normalized) |

The contract address is used as the `Log`/`LogHeader` address for events, as `Transaction.To` for mint transfers, and as the `Pair.Market.Program` for trades.

---

## Newly launched tokens

Flap.sh launches can be detected via decoded **`TokenCreated`** events or via **mint transfers** from the zero address.

### Flap.sh newly created tokens using logs (`TokenCreated`)

Filter Flap.sh `TokenCreated` events and decode argument values (token address, metadata fields, and related parameters).

▶️ [Run in IDE](https://ide.bitquery.io/Flapsh-Newly-created-tokens-using-logs-TokenCreated) · [WebSocket stream](https://ide.bitquery.io/Flap-sh-Newly-created-tokens-using-logs-TokenCreated---Websocket)

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 10}
      where: {
        Log: {Signature: {Name: {is: "TokenCreated"}}}
        LogHeader: {Address: {is: "0x26605f322f7ff986f381bb9a6e3f5dab0beaeb09"}}
      }
    ) {
      Transaction {
        Hash
        From
        To
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
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}
```

### Flap.sh newly created tokens using transfer data

Track Flap.sh mints as transfers from the zero address with amount `1000000000` in transactions sent to the Flap.sh contract.

▶️ [Run in IDE](https://ide.bitquery.io/Flapsh-Newly-created-tokens-using-transfer-data) · [WebSocket stream](https://ide.bitquery.io/Flap-Sh-Newly-created-tokens-using-transfer-data---Websocket)

```graphql
{
  EVM(network: robinhood) {
    Transfers(
      orderBy: {descending: Block_Time}
      limit: {count: 50}
      where: {
        Transaction: {To: {is: "0x26605f322f7ff986f381bb9a6e3f5dab0beaeb09"}}
        Transfer: {
          Amount: {eq: "1000000000"}
          Sender: {is: "0x0000000000000000000000000000000000000000"}
        }
      }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        From
        To
      }
      TransactionStatus {
        Success
      }
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
          Decimals
          Fungible
          Native
          ProtocolName
        }
      }
    }
  }
}
```

:::note Amounts are decimal-normalized
Bitquery's `Transfer.Amount` is already adjusted for the token's `Decimals`, so `1000000000` means 1 billion whole tokens — not the raw on-chain integer. Compare against the normalized value, not the raw one.
:::

---

## Flap.sh trades

Query trades on Flap.sh markets using the `Trading.Trades` cube, scoped by the Flap.sh contract as `Pair.Market.Program`. This example returns trades from the last hour.

```graphql
{
  Trading {
    Trades(
      limit: {count: 10}
      where: {Pair: {Market: {Program: {is: "0x26605f322f7ff986f381bb9a6e3f5dab0beaeb09"}}}, Block: {Time: {since_relative: {hours_ago: 1}}}}
    ) {
      Side
      Supply {
        CirculatingSupply
        MarketCap
      }
      Trader {
        Address
      }
      TransactionHeader {
        Fee
        FeePayer
        Sender
        To
      }
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
        Quote
      }
      Block {
        Date
        Time
        Timestamp
      }
      Pair {
        Market {
          Protocol
          ProtocolFamily
          Address
          Program
          Network
        }
        Token {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
        QuoteToken {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
      }
    }
  }
}
```

:::tip Stream the same query
Change the operation type from a query to a `subscription` in the Bitquery IDE to receive Flap.sh trades in real time over WebSocket.
:::

---

## Event-specific APIs

Beyond buy/sell trades, Flap.sh emits lifecycle events across several contracts (bonding-curve engine, factories, and the router). Because a given event is emitted by more than one contract, filter these queries by `Log.Signature.Name` rather than a single address. Each event includes a `token` argument identifying the affected token, so you can add `Arguments: {includes: {Name: {is: "token"}, Value: {Address: {is: "0x..."}}}}` to scope any query to one token.

:::tip Stream any event
Every query below can be run as a real-time stream — change the operation type to `subscription` in the Bitquery IDE.
:::

### Token graduations (`LaunchedToDEX`)

The most important lifecycle signal: a token completed its bonding curve and was **launched to a DEX**. The event returns the new `pool` address (use it with the [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades) to follow post-graduation trading), the migrated token `amount`, and the `eth` seeded into the pool.

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {Log: {Signature: {Name: {is: "LaunchedToDEX"}}}}
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
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

Arguments: `token` (graduated token), `pool` (new DEX pool address), `amount` (tokens moved to the pool), `eth` (native seeded into the pool).

### Bonding-curve progress (`FlapTokenProgressChanged`)

Track how close a token is to graduation. `newProgress` is scaled to `1e18`, so `562290208719467141` ≈ **56.2%**. Great for progress bars and "about to graduate" alerts.

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {Log: {Signature: {Name: {is: "FlapTokenProgressChanged"}}}}
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

Arguments: `token`, `newProgress` (fraction of the curve completed, scaled by `1e18` → divide by `1e18` for a `0–1` ratio, or `×100` for a percentage).

### Circulating supply changes (`FlapTokenCirculatingSupplyChanged`)

Live circulating-supply updates for a token — useful for accurate off-chain market-cap math. `newSupply` is the raw on-chain integer (divide by the token's `1e18` decimals).

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {Log: {Signature: {Name: {is: "FlapTokenCirculatingSupplyChanged"}}}}
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

Arguments: `token`, `newSupply` (new circulating supply, raw integer).

### Bonding-curve tax paid (`TaxV2OnBondingCurvePaid`)

Tax/fee revenue paid on the bonding curve, per token. Aggregate `amount` over time (or per token) for fee analytics.

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {Log: {Signature: {Name: {is: "TaxV2OnBondingCurvePaid"}}}}
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

Arguments: `token`, `amount` (tax paid in native units, raw integer).

### Vanity tokens created (`VanityTokenCreated`)

A separate creation channel for **vanity tokens** — those with custom address suffixes (`8888`, `7777`). Complements the standard `TokenCreated` event on the [launches page](/docs/blockchain/robinhood/robinhood-meme-coin-launches).

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {Log: {Signature: {Name: {is: "VanityTokenCreated"}}}}
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
      }
    }
  }
}
```

Arguments: `token` (new vanity token), `creator`, `beneficiary`.

### Social messages (`MsgSent`)

Flap.sh links social content to tokens through `MsgSent`. The `message` string carries structured commands such as `ADD_TWEET::<tweet_id>`, tying a token to a tweet or other social metadata.

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {Log: {Signature: {Name: {is: "MsgSent"}}}}
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
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
        }
      }
    }
  }
}
```

Arguments: `sender`, `token`, `message` (e.g. `ADD_TWEET::2077406373457871178`).

---

## FAQ

### How do I detect a newly launched Flap.sh token?

Use the **`TokenCreated`** event on the Flap.sh contract (`0x26605f322f7ff986f381bb9a6e3f5dab0beaeb09`) for decoded arguments, or the **mint-transfer** pattern — a transfer from the zero address with `Amount` `1000000000` where `Transaction.To` is the Flap.sh contract.

### How do I get Flap.sh trades?

Query `Trading.Trades` filtered by `Pair.Market.Program: "0x26605f322f7ff986f381bb9a6e3f5dab0beaeb09"`. Add a `Block.Time` filter to scope to a time window, or switch the operation to `subscription` to stream trades live.

### How do I know when a Flap.sh token graduates to a DEX?

Filter events by `Log.Signature.Name: "LaunchedToDEX"`. Each event gives the graduated `token`, the new `pool` address, and the token/native `amount` seeded into the pool. Run it as a `subscription` for real-time graduation alerts.

### How do I track a token's bonding-curve progress?

Use the `FlapTokenProgressChanged` event. `newProgress` is scaled by `1e18`, so divide by `1e18` for a `0–1` ratio (or `×100` for a percentage). Scope to a single token by matching the `token` argument.

### Why do the event queries filter by `Log.Signature.Name` instead of a contract address?

Flap.sh emits the same event from several contracts (the bonding-curve engine, factories, and router). Filtering by the signature name captures the event across all of them. Add an `Arguments.includes` filter on the `token` argument to scope to one token.

---

## Next steps

- Stream **`LaunchedToDEX`** for real-time graduation alerts, then follow the new pool with the [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades).
- Track other Robinhood launchpads and bots with the [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches).
- Explore prices, OHLCV, whale trades, and top traders in the [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades).
- Inspect holder and wallet flows with [Robinhood Transfers](/docs/blockchain/robinhood/robinhood-transfers).
