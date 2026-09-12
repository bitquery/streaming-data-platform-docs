---
title: "Arc Testnet Balances & Token Supply API"
description: "Query wallet balances, balance history and token total supply on Circle's Arc testnet with Bitquery GraphQL: full portfolios, multi-wallet batches, per-token balance changes and TransactionBalances supply."
sidebar_position: 6
keywords:
  - Arc testnet balances API
  - Arc testnet wallet balance
  - Arc testnet USDC balance
  - Arc testnet portfolio API
  - Arc testnet balance history
  - Arc testnet token supply
  - Arc testnet eth_getBalance alternative
  - Circle Arc balances API
  - arc_testnet Balances
  - Bitquery Arc testnet
---
# Arc Testnet Balances & Token Supply API

Query **wallet balances and token supply on Arc testnet** with Bitquery GraphQL. Three cubes on `network: arc_testnet` cover it:

| Cube | What it returns |
| --- | --- |
| `Balances` | Computed current balance per address and currency, with first and last change time and update count |
| `BalanceUpdates` | Every individual balance change, with the transaction that caused it |
| `TransactionBalances` | Per-transaction post-balances and the token's `TotalSupply` |

Every query on this page was executed against the production endpoint before publishing.

:::warning Testnet limits
- `...InUSD` fields are **0**. Value holdings with the [latest price query](/docs/blockchain/arc-testnet/arc-testnet-trades-api/#latest-price-of-a-token) if you need a dollar figure.
- Only `dataset: realtime` exists; leave the `dataset` argument out.
- The token-centric **`Holders`** cube is not available on Arc testnet because it is served from the archive dataset. Sum `BalanceUpdates` per address, as in [top holders of a token](#top-holders-of-a-token), for holder rankings within the realtime window.
:::

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Arc Testnet API overview](/docs/blockchain/arc-testnet/) — network facts, every cube and stream in one place
- [Arc Testnet Transfers API](/docs/blockchain/arc-testnet/arc-testnet-transfers-api/)
- [Arc Testnet DEX Trades API](/docs/blockchain/arc-testnet/arc-testnet-trades-api/)
- [EVM Balances schema](/docs/schema/evm/balances/)
- [EVM Token Supply API](/docs/blockchain/Ethereum/token-supply/evm-token-supply/)
:::

**On this page:** [Portfolio](#portfolio-of-a-wallet) · [One token](#balance-of-one-token) · [Batch](#balances-of-several-wallets) · [Top holders](#top-holders-of-a-token) · [History](#balance-history-of-a-wallet) · [Stream](#stream-balance-changes) · [Supply](#total-supply-of-a-token) · [Supply stream](#stream-supply-changes) · [FAQ](#faq)

---

## Portfolio of a wallet

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-wallet-portfolio)

Every currency an address holds, with the computed balance and when it last changed. Native USDC has `Native: true`; the ERC-20 interface at `0x3600...` is listed separately.

```graphql
{
  EVM(network: arc_testnet) {
    Balances(
      where: {Balance: {Address: {is: "0x2de8906a641d65d490bc60a4179d961d59742bcb"}}}
      orderBy: {descending: Balance_Amount}
    ) {
      Currency {
        Name
        Symbol
        SmartContract
        Native
      }
      Balance {
        Amount
        FirstChangeTime
        LastChangeTime
        UpdateCount
      }
    }
  }
}
```

---

## Balance of one token

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-balance-of-one-token)

The `balanceOf` equivalent for ERC-20 USDC. For the gas token use `Currency: {Native: true}` instead of a contract filter.

```graphql
{
  EVM(network: arc_testnet) {
    Balances(
      where: {
        Balance: {Address: {is: "0x2de8906a641d65d490bc60a4179d961d59742bcb"}}
        Currency: {SmartContract: {is: "0x3600000000000000000000000000000000000000"}}
      }
    ) {
      Currency {
        Symbol
        Decimals
      }
      Balance {
        Amount
        LastChangeTime
      }
    }
  }
}
```

---

## Balances of several wallets

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-balances-of-several-wallets)

One call for a batch of addresses, grouped by address and currency.

```graphql
{
  EVM(network: arc_testnet) {
    Balances(
      where: {
        Balance: {
          Address: {
            in: [
              "0x2de8906a641d65d490bc60a4179d961d59742bcb"
              "0x73742278c31a76dbb0d2587d03ef92e6e2141023"
              "0x49f9636fe15883e16d5e356a4ea08c9fe6bc219b"
            ]
          }
        }
        Currency: {SmartContract: {is: "0x3600000000000000000000000000000000000000"}}
      }
      orderBy: {descending: Balance_Amount}
    ) {
      Balance {
        Address
        Amount
      }
      Currency {
        Symbol
      }
    }
  }
}
```

---

## Top holders of a token

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-top-holders-of-a-token)

Addresses ranked by their net balance change of one token, summed from `BalanceUpdates`. On the testnet this reflects changes inside the realtime window rather than a full-chain snapshot, so treat it as a leaderboard of active holders. The top row is usually the Uniswap v4 PoolManager, which holds pool reserves.

```graphql
{
  EVM(network: arc_testnet) {
    BalanceUpdates(
      where: {
        Currency: {SmartContract: {is: "0xe2cfd2893ad90e8a5b4f87c5cad22d150b1e12a0"}}
      }
      orderBy: {descendingByField: "balance"}
      limit: {count: 20}
    ) {
      BalanceUpdate {
        Address
      }
      balance: sum(of: BalanceUpdate_Amount)
      updates: count
    }
  }
}
```

---

## Balance history of a wallet

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-balance-history)

Each change to a wallet's ERC-20 USDC balance, newest first, with the transaction behind it. Positive amounts are inflows.

```graphql
{
  EVM(network: arc_testnet) {
    BalanceUpdates(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        BalanceUpdate: {Address: {is: "0x2de8906a641d65d490bc60a4179d961d59742bcb"}}
        Currency: {SmartContract: {is: "0x3600000000000000000000000000000000000000"}}
      }
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
      }
      BalanceUpdate {
        Amount
        Type
      }
      Currency {
        Symbol
      }
    }
  }
}
```

### Net change per currency over a window

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-balance-net-change)

Sum the updates per currency to see what a wallet gained or lost over the last 24 hours.

```graphql
{
  EVM(network: arc_testnet) {
    BalanceUpdates(
      where: {
        BalanceUpdate: {Address: {is: "0x2de8906a641d65d490bc60a4179d961d59742bcb"}}
        Block: {Time: {since_relative: {hours_ago: 24}}}
      }
      orderBy: {descendingByField: "netChange"}
    ) {
      Currency {
        Symbol
        SmartContract
        Native
      }
      netChange: sum(of: BalanceUpdate_Amount)
      inflow: sum(of: BalanceUpdate_Amount, if: {BalanceUpdate: {Amount: {gt: "0"}}})
      outflow: sum(of: BalanceUpdate_Amount, if: {BalanceUpdate: {Amount: {lt: "0"}}})
      updates: count
    }
  }
}
```

---

## Stream balance changes

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-stream-balance-updates)

Every balance change of a wallet as it happens. Widen the filter to a list of addresses or a single token to build alerts.

```graphql
subscription {
  EVM(network: arc_testnet) {
    BalanceUpdates(
      where: {
        BalanceUpdate: {Address: {is: "0x2de8906a641d65d490bc60a4179d961d59742bcb"}}
      }
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
      }
      BalanceUpdate {
        Amount
        Type
      }
      Currency {
        Symbol
        SmartContract
        Native
      }
    }
  }
}
```

---

## Total supply of a token

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-token-total-supply)

`TransactionBalances` records the token's total supply after each transaction that touched it. The latest row is the current supply, already adjusted for decimals.

```graphql
{
  EVM(network: arc_testnet) {
    TransactionBalances(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {
        TokenBalance: {
          Currency: {SmartContract: {is: "0xe2cfd2893ad90e8a5b4f87c5cad22d150b1e12a0"}}
        }
      }
    ) {
      Block {
        Time
      }
      TokenBalance {
        Currency {
          Symbol
          SmartContract
        }
        TotalSupply
      }
    }
  }
}
```

---

## Stream supply changes

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-stream-token-supply)

A new row arrives whenever a mint or burn changes the supply of the token.

```graphql
subscription {
  EVM(network: arc_testnet) {
    TransactionBalances(
      where: {
        TokenBalance: {
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
      TokenBalance {
        Currency {
          Symbol
        }
        TotalSupply
      }
    }
  }
}
```

---

## FAQ

**Why is the `Holders` cube missing?**
`Holders` is built from the archive dataset, and the testnet has none. Rank holders by summing `BalanceUpdates` per address within the realtime window, as shown above. Arc mainnet will have the full cube.

**Why does the same wallet show USDC twice?**
Native USDC (`Native: true`, 18 decimals) and the ERC-20 USDC interface (`0x3600...`, 6 decimals) are tracked as two currencies. Sum them yourself if you want one USDC figure. A third row with contract `0xfff...fffe` and no symbol is a system ledger mirror and can be ignored.

**Are USD values available?**
No. Every `...InUSD` field is 0 on the testnet. Because most balances are dollar stablecoins, `Amount` is usually the figure you want anyway.

**Is `TotalSupply` raw or decimal-adjusted?**
Decimal-adjusted. A token with a billion supply reads `1000000000.000000000000000000`.
