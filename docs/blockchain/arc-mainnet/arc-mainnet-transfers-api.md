---
title: "Arc Mainnet Transfers API & Streams"
description: "Query and stream token transfers on Circle's Arc mainnet with Bitquery GraphQL: native USDC, ERC-20 USDC, EURC, wallet ledgers, large transfers, most-transferred tokens and daily volume."
sidebar_position: 2
keywords:
  - Arc mainnet transfers API
  - Arc mainnet USDC transfers
  - Arc mainnet EURC transfers
  - Arc mainnet token transfers
  - Arc mainnet wallet transfers
  - Circle Arc transfers API
  - arc Transfers
  - stream Arc mainnet transfers
  - Bitquery Arc mainnet
---
# Arc Mainnet Transfers API & Streams

Query and stream **token transfers on Arc mainnet** with Bitquery GraphQL. This is the shared **EVM `Transfers`** cube scoped to `network: arc`, so a query written for Ethereum or Base runs here by changing the network name.

Arc's native gas token is **USDC**, and the chain carries an ERC-20 USDC interface, EURC, USYC and user-issued assets. Every query on this page was executed against the production endpoint before publishing. Change `query` to `subscription` on any of them to stream the same rows over WebSocket.

:::info Availability checked 16 September 2026
`Transfer.AmountInUSD` returned populated values. Only the realtime path answered, so leave the `dataset` argument out until `archive` and `combined` are enabled.
:::

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Arc Mainnet API overview](/docs/blockchain/arc-mainnet/) — network facts, every cube and stream in one place
- [Arc Mainnet DEX Trades API](/docs/blockchain/arc-mainnet/arc-mainnet-trades-api/)
- [Arc Mainnet Balances API](/docs/blockchain/arc-mainnet/arc-mainnet-balances-api/)
- [Arc Mainnet Events API](/docs/blockchain/arc-mainnet/arc-mainnet-events-api/)
- [Transfers vs Events vs Calls](/docs/start/mental-model-transfers-events-calls/)
- [EVM Transfers schema](/docs/schema/evm/transfers/)
:::

**On this page:** [Currencies](#how-usdc-appears-in-transfers) · [Stream](#stream-real-time-transfers) · [Latest](#latest-transfers) · [Native USDC](#native-usdc-transfers) · [By token](#transfers-of-a-token) · [By address](#transfers-of-an-address) · [Between two addresses](#transfers-between-two-addresses) · [Large transfers](#large-transfers) · [Top tokens](#most-transferred-tokens) · [Hourly volume](#hourly-transfer-volume-of-a-token) · [FAQ](#faq)

---

## How USDC appears in Transfers

USDC exists in three forms on Arc mainnet. Check which one a row is before you sum or rank anything.

| Currency | `SmartContract` | `Native` | Decimals | What it is |
| --- | --- | --- | --- | --- |
| USDC (native) | `0x` | `true` | 18 | The gas token and native value-transfer form. Read transaction fee fields for gas fees. |
| USDC (ERC-20) | `0x3600000000000000000000000000000000000000` | `false` | 6 | The ERC-20 interface most contracts and wallets call. Symbol `USDC`, name `USDC`. |
| System ledger | `0xfffffffffffffffffffffffffffffffffffffffe` | `false` | 0 | A system address that emits a raw `Transfer` event mirroring native USDC movements as 18-decimal integers with no symbol. Exclude it from token rankings. |

Official tokens on Arc mainnet:

| Token | Address | Decimals |
| --- | --- | --- |
| EURC | `0xbef5f6d51cb62b58e6a8f77868681825c6fe21c1` | 6 |
| USYC | `0x8a5d989bbb96929f689b0200f435f53da42bf490` | 6 |

---

## Stream real-time transfers

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-stream-transfers)

Every transfer on the network as it is indexed. Filter inside `where` to narrow the socket to a token, an address or a size floor.

```graphql
subscription {
  EVM(network: arc) {
    Transfers {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        From
        To
      }
      Transfer {
        Amount
        Sender
        Receiver
        Type
        Currency {
          Name
          Symbol
          SmartContract
          Native
          Decimals
        }
      }
    }
  }
}
```

---

## Latest transfers

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-latest-transfers)

```graphql
{
  EVM(network: arc) {
    Transfers(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          Symbol
          SmartContract
          Native
        }
      }
    }
  }
}
```

---

## Native USDC transfers

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-native-usdc-transfers)

`Currency: {Native: true}` selects value transfers of the gas token. The floor of 100 USDC keeps dust and fee movements out.

```graphql
{
  EVM(network: arc) {
    Transfers(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Transfer: {
          Currency: {Native: true}
          Amount: {gt: "100"}
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          Symbol
          Native
        }
      }
    }
  }
}
```

---

## Transfers of a token

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-erc20-usdc-transfers)

Filter on the token contract. This example reads the ERC-20 USDC interface; swap in EURC or any test token.

```graphql
{
  EVM(network: arc) {
    Transfers(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Transfer: {
          Currency: {SmartContract: {is: "0x3600000000000000000000000000000000000000"}}
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          Symbol
          Decimals
        }
      }
    }
  }
}
```

---

## Transfers of an address

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-transfers-of-an-address)

Incoming and outgoing transfers in one list. Replace the address with any wallet or contract.

```graphql
{
  EVM(network: arc) {
    Transfers(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        any: [
          {Transfer: {Sender: {is: "0xada5bb90d0de0bd1b6f3938708f49295a8d1f7cb"}}}
          {Transfer: {Receiver: {is: "0xada5bb90d0de0bd1b6f3938708f49295a8d1f7cb"}}}
        ]
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          Symbol
          SmartContract
          Native
        }
      }
    }
  }
}
```

### Sent and received totals per token

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-address-sent-received)

Two aliased selections give the outbound and inbound sums per currency for a wallet.

```graphql
{
  EVM(network: arc) {
    sent: Transfers(
      where: {Transfer: {Sender: {is: "0xada5bb90d0de0bd1b6f3938708f49295a8d1f7cb"}}}
      orderBy: {descendingByField: "amount"}
      limit: {count: 10}
    ) {
      Transfer {
        Currency {
          Symbol
          SmartContract
        }
      }
      amount: sum(of: Transfer_Amount)
      count
    }
    received: Transfers(
      where: {Transfer: {Receiver: {is: "0xada5bb90d0de0bd1b6f3938708f49295a8d1f7cb"}}}
      orderBy: {descendingByField: "amount"}
      limit: {count: 10}
    ) {
      Transfer {
        Currency {
          Symbol
          SmartContract
        }
      }
      amount: sum(of: Transfer_Amount)
      count
    }
  }
}
```

---

## Transfers between two addresses

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-transfers-between-addresses)

Flows from one address to another, in either direction. Useful for tracing a faucet, a bridge or a counterparty.

```graphql
{
  EVM(network: arc) {
    Transfers(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        any: [
          {
            Transfer: {
              Sender: {is: "0xada5bb90d0de0bd1b6f3938708f49295a8d1f7cb"}
              Receiver: {is: "0xb92fe925dc43a0ecde6c8b1a2709c170ec4fff4f"}
            }
          }
          {
            Transfer: {
              Sender: {is: "0xb92fe925dc43a0ecde6c8b1a2709c170ec4fff4f"}
              Receiver: {is: "0xada5bb90d0de0bd1b6f3938708f49295a8d1f7cb"}
            }
          }
        ]
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          Symbol
          Native
        }
      }
    }
  }
}
```

---

## Large transfers

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-large-usdc-transfers)

This catches ERC-20 USDC moves above 10,000 and returns both token and USD amounts.

```graphql
{
  EVM(network: arc) {
    Transfers(
      limit: {count: 20}
      orderBy: {descending: Transfer_Amount}
      where: {
        Block: {Time: {since_relative: {hours_ago: 24}}}
        Transfer: {
          Currency: {SmartContract: {is: "0x3600000000000000000000000000000000000000"}}
          Amount: {gt: "10000"}
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Symbol
        }
      }
    }
  }
}
```

---

## Most transferred tokens

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-most-transferred-tokens)

Tokens ranked by transfer count over 24 hours, with distinct senders and receivers. The system ledger address is excluded.

```graphql
{
  EVM(network: arc) {
    Transfers(
      limit: {count: 20}
      orderBy: {descendingByField: "count"}
      where: {
        Block: {Time: {since_relative: {hours_ago: 24}}}
        Transfer: {
          Currency: {SmartContract: {not: "0xfffffffffffffffffffffffffffffffffffffffe"}}
        }
      }
    ) {
      Transfer {
        Currency {
          Symbol
          Name
          SmartContract
          Native
        }
      }
      count
      amount: sum(of: Transfer_Amount)
      senders: uniq(of: Transfer_Sender)
      receivers: uniq(of: Transfer_Receiver)
    }
  }
}
```

---

## Hourly transfer volume of a token

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-hourly-transfer-volume)

Transfer volume of ERC-20 USDC bucketed by hour, for charts and alerts.

```graphql
{
  EVM(network: arc) {
    Transfers(
      orderBy: {descendingByField: "Block_Time"}
      limit: {count: 24}
      where: {
        Transfer: {
          Currency: {SmartContract: {is: "0x3600000000000000000000000000000000000000"}}
        }
      }
    ) {
      Block {
        Time(interval: {in: hours, count: 1})
      }
      amount: sum(of: Transfer_Amount)
      count
      senders: uniq(of: Transfer_Sender)
    }
  }
}
```

---

## FAQ

**Does `AmountInUSD` work?**
Yes. It returned populated values in the production check on 16 September 2026.

**Which USDC address should I filter on?**
For gas-token value transfers use `Currency: {Native: true}`. For the ERC-20 interface that wallets and contracts call, use `0x3600000000000000000000000000000000000000`. Do not filter on `0xfffffffffffffffffffffffffffffffffffffffe`; it is a system ledger that duplicates native movements as raw integers.

**Why are native amounts 18 decimals when USDC has 6?**
The EVM represents the gas token in wei-style 18-decimal units regardless of what the token is called. Bitquery applies those 18 decimals to native rows and the contract's own 6 decimals to ERC-20 rows, so `Amount` is a whole-token value in both cases.

**Should I add native and ERC-20 USDC transfers together?**
No. Arc's ERC-20 interface acts on the native USDC balance, so the two views can describe linked activity. Choose the form that matches the action you track and guard against double counting.

**Can I read history older than the realtime window?**
Not yet. Only the realtime path answered on 16 September 2026. Check the window with `Block { Time(minimum: Block_Time) }` and retry `archive` or `combined` before using them.

**How do I stream transfers for one wallet?**
Take the [transfers of an address](#transfers-of-an-address) query, change `query` to `subscription` and drop `limit` and `orderBy`.
