---
title: "Arc Balances & Token Supply API"
description: "Query Arc wallet balances, balance history, token holders and total supply with Bitquery GraphQL APIs, including multi-wallet portfolio queries."
sidebar_position: 6
keywords:
  - Arc balances API
  - Arc wallet balance
  - Arc USDC balance
  - Arc portfolio API
  - Arc balance history
  - Arc token supply
  - Arc eth_getBalance alternative
  - Circle Arc balances API
  - arc Balances
  - Bitquery Arc
---
# Arc Balances & Token Supply API

Query **wallet balances, holders and token supply on Arc** with Bitquery GraphQL. Four cubes on `network: arc` cover it:

| Cube | What it returns |
| --- | --- |
| `Balances` | Computed current balance per address and currency, with first and last change time and update count |
| `Holders` | Current holder and token pairs, ranked by token balance |
| `BalanceUpdates` | Every individual balance change, with the transaction that caused it |
| `TransactionBalances` | Per-transaction post-balances and the token's `TotalSupply` |

Every query on this page was executed against the production endpoint before publishing.

:::info Availability checked 16 September 2026
`Balances`, `Holders`, `BalanceUpdates` and `TransactionBalances` all returned Arc data. Only the realtime path answered, so leave the `dataset` argument out until `archive` and `combined` are enabled. Join balances to the [latest price query](/docs/blockchain/arc-mainnet/arc-mainnet-trades-api/#latest-price-of-a-token) when you need a USD value.
:::

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Arc Blockchain API overview](/docs/blockchain/arc-mainnet/) — network facts, every cube and stream in one place
- [Arc Transfers API](/docs/blockchain/arc-mainnet/arc-mainnet-transfers-api/)
- [Arc DEX Trades API](/docs/blockchain/arc-mainnet/arc-mainnet-trades-api/)
- [EVM Balances schema](/docs/schema/evm/balances/)
- [EVM Token Supply API](/docs/blockchain/Ethereum/token-supply/evm-token-supply/)
:::

**On this page:** [Portfolio](#portfolio-of-a-wallet) · [One token](#balance-of-one-token) · [Batch](#balances-of-several-wallets) · [Top holders](#top-holders-of-a-token) · [History](#balance-history-of-a-wallet) · [Stream](#stream-balance-changes) · [Supply](#total-supply-of-a-token) · [Supply stream](#stream-supply-changes) · [FAQ](#faq)

---

## Portfolio of a wallet

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-docs-balances-portfolio-of-a-wallet)

Every currency an address holds, with the computed balance and when it last changed. Native USDC has `Native: true`; the ERC-20 interface at `0x3600...` is listed separately.

```graphql
{
  EVM(network: arc) {
    Balances(
      where: {Balance: {Address: {is: "0xada5bb90d0de0bd1b6f3938708f49295a8d1f7cb"}}}
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-docs-balances-balance-of-one-token)

The `balanceOf` equivalent for ERC-20 USDC. For the gas token use `Currency: {Native: true}` instead of a contract filter.

```graphql
{
  EVM(network: arc) {
    Balances(
      where: {
        Balance: {Address: {is: "0xada5bb90d0de0bd1b6f3938708f49295a8d1f7cb"}}
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-docs-balances-balances-of-several-wallets)

One call for a batch of addresses, grouped by address and currency.

```graphql
{
  EVM(network: arc) {
    Balances(
      where: {
        Balance: {
          Address: {
            in: [
              "0xada5bb90d0de0bd1b6f3938708f49295a8d1f7cb"
              "0xb40bd0f6b1332daf9e987a0ca33efe6e90d0b938"
              "0x2bf981e99011ae4050aaa6f33af4bfc26b89f224"
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-docs-balances-top-holders-of-a-token)

Current EURC holders ranked by token balance. Add `Balance: {Amount: {gt: "0"}}` so wallets that once held the token but now hold zero do not appear.

```graphql
{
  EVM(network: arc) {
    Holders(
      where: {
        Currency: {SmartContract: {is: "0xbef5f6d51cb62b58e6a8f77868681825c6fe21c1"}}
        Balance: {Amount: {gt: "0"}}
      }
      orderBy: {descending: Balance_Amount}
      limit: {count: 20}
    ) {
      Holder {
        Address
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

## Balance history of a wallet

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-docs-balances-balance-history-of-a-wallet)

Each change to a wallet's ERC-20 USDC balance, newest first, with the transaction behind it. Positive amounts are inflows.

```graphql
{
  EVM(network: arc) {
    BalanceUpdates(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        BalanceUpdate: {Address: {is: "0xada5bb90d0de0bd1b6f3938708f49295a8d1f7cb"}}
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-docs-balances-net-change-per-currency-over-a-window)

Sum the updates per currency to see what a wallet gained or lost over the last 24 hours.

```graphql
{
  EVM(network: arc) {
    BalanceUpdates(
      where: {
        BalanceUpdate: {Address: {is: "0xada5bb90d0de0bd1b6f3938708f49295a8d1f7cb"}}
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-docs-balances-stream-balance-changes)

Every balance change of a wallet as it happens. Widen the filter to a list of addresses or a single token to build alerts.

```graphql
subscription {
  EVM(network: arc) {
    BalanceUpdates(
      where: {
        BalanceUpdate: {Address: {is: "0xada5bb90d0de0bd1b6f3938708f49295a8d1f7cb"}}
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-docs-balances-total-supply-of-a-token)

`TransactionBalances` records the token's total supply after each transaction that touched it. The latest row is the current supply, already adjusted for decimals.

```graphql
{
  EVM(network: arc) {
    TransactionBalances(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {
        TokenBalance: {
          Currency: {SmartContract: {is: "0xbef5f6d51cb62b58e6a8f77868681825c6fe21c1"}}
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-docs-balances-stream-supply-changes)

A new row arrives whenever a mint or burn changes the supply of the token.

```graphql
subscription {
  EVM(network: arc) {
    TransactionBalances(
      where: {
        TokenBalance: {
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

**Does the `Holders` cube work?**
Yes. It returned Arc holder rows in the production check on 16 September 2026. Filter `Balance.Amount` above zero for current holders.

**Why does the same wallet show USDC twice?**
Native USDC (`Native: true`, 18 decimals) and the ERC-20 USDC interface (`0x3600...`, 6 decimals) appear as separate Bitquery currencies. Arc's ERC-20 interface acts on the native balance, so do not add the rows without checking the flow you are measuring. A third row with contract `0xfff...fffe` and no symbol is a system ledger mirror and can be ignored.

**Are USD values available?**
The balance cubes return token amounts. Fetch current prices from `Trading.Pairs` with `Market.Network: "Arc"`, or use `Trading.Tokens` for prices across pools, then match tokens in your app. Check the price timestamp before valuing a balance. For a historical price more than 30 days old, derive it from `EVM.DEXTrades` or `EVM.DEXTradeByTokens` only after confirming Arc archive data is available.

**Is `TotalSupply` raw or decimal-adjusted?**
Decimal-adjusted. A token with a billion supply reads `1000000000.000000000000000000`.
