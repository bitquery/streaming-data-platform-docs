---
title: "Arc Testnet Transfers API & Streams"
description: "Query and stream token transfers on Circle's Arc testnet with Bitquery GraphQL: native USDC, ERC-20 USDC, EURC, wallet ledgers, large transfers, most-transferred tokens and daily volume."
sidebar_position: 2
keywords:
  - Arc testnet transfers API
  - Arc testnet USDC transfers
  - Arc testnet EURC transfers
  - Arc testnet token transfers
  - Arc testnet wallet transfers
  - Circle Arc transfers API
  - arc_testnet Transfers
  - stream Arc testnet transfers
  - Bitquery Arc testnet
---
# Arc Testnet Transfers API & Streams

Query and stream **token transfers on Arc testnet** with Bitquery GraphQL. This is the shared **EVM `Transfers`** cube scoped to `network: arc_testnet`, so a query written for Ethereum or Base runs here by changing the network name.

Arc's native gas token is **USDC**, and the chain carries an ERC-20 USDC interface, **EURC**, a testnet **USDT** and thousands of test tokens. Every query on this page was executed against the production endpoint before publishing. Change `query` to `subscription` on any of them to stream the same rows over WebSocket.

:::warning Testnet: USD fields are 0 and only the realtime dataset exists
`Transfer.AmountInUSD` is always **0** on Arc testnet. Filter and rank by `Transfer.Amount` instead. Leave the `dataset` argument out; `archive` and `combined` return errors on the testnet.
:::

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Arc Testnet API overview](/docs/blockchain/arc-testnet/) — network facts, every cube and stream in one place
- [Arc Testnet DEX Trades API](/docs/blockchain/arc-testnet/arc-testnet-trades-api/)
- [Arc Testnet Balances API](/docs/blockchain/arc-testnet/arc-testnet-balances-api/)
- [Arc Testnet Events API](/docs/blockchain/arc-testnet/arc-testnet-events-api/)
- [Transfers vs Events vs Calls](/docs/start/mental-model-transfers-events-calls/)
- [EVM Transfers schema](/docs/schema/evm/transfers/)
:::

**On this page:** [Currencies](#how-usdc-appears-in-transfers) · [Stream](#stream-real-time-transfers) · [Latest](#latest-transfers) · [Native USDC](#native-usdc-transfers) · [By token](#transfers-of-a-token) · [By address](#transfers-of-an-address) · [Between two addresses](#transfers-between-two-addresses) · [Large transfers](#large-transfers) · [Top tokens](#most-transferred-tokens) · [Hourly volume](#hourly-transfer-volume-of-a-token) · [FAQ](#faq)

---

## How USDC appears in Transfers

USDC exists in three forms on Arc testnet. Check which one a row is before you sum or rank anything.

| Currency | `SmartContract` | `Native` | Decimals | What it is |
| --- | --- | --- | --- | --- |
| USDC (native) | `0x` | `true` | 18 | The gas token. Value transfers and gas fees. |
| USDC (ERC-20) | `0x3600000000000000000000000000000000000000` | `false` | 6 | The ERC-20 interface most contracts and wallets call. Symbol `USDC`, name `USDC`. |
| System ledger | `0xfffffffffffffffffffffffffffffffffffffffe` | `false` | 0 | A system address that emits a raw `Transfer` event mirroring native USDC movements as 18-decimal integers with no symbol. Exclude it from token rankings. |

Other stablecoins seen on the testnet:

| Token | Address | Decimals |
| --- | --- | --- |
| EURC | `0x89b50855aa3be2f677cd6303cec089b5f319d72a` | 6 |
| USDT (testnet mock) | `0x175cdb1d338945f0d851a741ccf787d343e57952` | 18 |
| WUSDC (Wrapped USDC) | `0x911b4000d3422f482f4062a913885f7b035382df` | 18 |

---

## Stream real-time transfers

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-stream-transfers)

Every transfer on the network as it is indexed. Filter inside `where` to narrow the socket to a token, an address or a size floor.

```graphql
subscription {
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-latest-transfers)

```graphql
{
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-native-usdc-transfers)

`Currency: {Native: true}` selects value transfers of the gas token. The floor of 100 USDC keeps dust and fee movements out.

```graphql
{
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-erc20-usdc-transfers)

Filter on the token contract. This example reads the ERC-20 USDC interface; swap in EURC or any test token.

```graphql
{
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-transfers-of-an-address)

Incoming and outgoing transfers in one list. Replace the address with any wallet or contract.

```graphql
{
  EVM(network: arc_testnet) {
    Transfers(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        any: [
          {Transfer: {Sender: {is: "0x2de8906a641d65d490bc60a4179d961d59742bcb"}}}
          {Transfer: {Receiver: {is: "0x2de8906a641d65d490bc60a4179d961d59742bcb"}}}
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-address-sent-received)

Two aliased selections give the outbound and inbound sums per currency for a wallet.

```graphql
{
  EVM(network: arc_testnet) {
    sent: Transfers(
      where: {Transfer: {Sender: {is: "0x2de8906a641d65d490bc60a4179d961d59742bcb"}}}
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
      where: {Transfer: {Receiver: {is: "0x2de8906a641d65d490bc60a4179d961d59742bcb"}}}
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-transfers-between-addresses)

Flows from one address to another, in either direction. Useful for tracing a faucet, a bridge or a counterparty.

```graphql
{
  EVM(network: arc_testnet) {
    Transfers(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        any: [
          {
            Transfer: {
              Sender: {is: "0xe72f8175ab0991dbb778f6de62009c5bf97c17f7"}
              Receiver: {is: "0x1d70945634f618eefdf9edaadb59b9a183cef929"}
            }
          }
          {
            Transfer: {
              Sender: {is: "0x1d70945634f618eefdf9edaadb59b9a183cef929"}
              Receiver: {is: "0xe72f8175ab0991dbb778f6de62009c5bf97c17f7"}
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-large-usdc-transfers)

With USD values at 0 on testnet, size filters go on `Transfer.Amount` for one currency at a time. This catches ERC-20 USDC moves above 10,000.

```graphql
{
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-most-transferred-tokens)

Tokens ranked by transfer count over 24 hours, with distinct senders and receivers. The system ledger address is excluded.

```graphql
{
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-hourly-transfer-volume)

Transfer volume of ERC-20 USDC bucketed by hour, for charts and alerts.

```graphql
{
  EVM(network: arc_testnet) {
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

**Why does `AmountInUSD` return 0?**
Arc testnet has no token price index, so every USD field is 0. Rank and filter by `Transfer.Amount`, one currency at a time.

**Which USDC address should I filter on?**
For gas-token value transfers use `Currency: {Native: true}`. For the ERC-20 interface that wallets and contracts call, use `0x3600000000000000000000000000000000000000`. Do not filter on `0xfffffffffffffffffffffffffffffffffffffffe`; it is a system ledger that duplicates native movements as raw integers.

**Why are native amounts 18 decimals when USDC has 6?**
The EVM represents the gas token in wei-style 18-decimal units regardless of what the token is called. Bitquery applies those 18 decimals to native rows and the contract's own 6 decimals to ERC-20 rows, so `Amount` is a whole-token value in both cases.

**Can I read history older than the realtime window?**
Not on the testnet. Only `dataset: realtime` exists; `archive` and `combined` return errors. Check the window with `Block { Time(minimum: Block_Time) }`.

**How do I stream transfers for one wallet?**
Take the [transfers of an address](#transfers-of-an-address) query, change `query` to `subscription` and drop `limit` and `orderBy`.
