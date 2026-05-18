---
title: "EVM Balance API"
---

# EVM Balance API

The **Balances** API returns current and historical token balances for addresses on EVM chains. To return only non-zero balances, add `Amount(selectWhere: { gt: "0" })` on the `Balance` field (not in `where`). Use `dataset: combined` or `dataset: archive` as follows:

| Dataset | When to use |
|---------|-------------|
| **`combined`** | Latest balances. Queries **realtime and archive** databases and merges results. |
| **`archive`** | Historical snapshots with `Block.Date`, and balances for **addresses not recently active**. |

Full Ethereum examples: [Address Balance API](/docs/blockchain/Ethereum/balances/balance-api/).

## Balance of an address

```graphql
query {
  EVM(network: eth, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: {
            is: "0x76147fd7891731e01f35cc18f87ae8e95bf06869"
          }
        }
      }
    ) {
      Currency {
        Symbol
        SmartContract
      }
      Balance {
        Amount(selectWhere: { gt: "0" })
        AmountInUSD
        Address
      }
    }
  }
}
```

### Examples on Ethereum

- [Balance of an address](/docs/blockchain/Ethereum/balances/balance-api/#balance-of-an-address)
- [Balance on a specific date](/docs/blockchain/Ethereum/balances/balance-api/#balance-on-a-specific-date)
- [Balance for a specific token](/docs/blockchain/Ethereum/balances/balance-api/#balance-for-a-specific-token)
- [Balance history by date](/docs/blockchain/Ethereum/balances/balance-api/#balance-history-by-date)
- [Wallet balance for a specific token on a date](/docs/blockchain/Ethereum/balances/balance-api/#wallet-balance-for-a-specific-token-on-a-date)
