---
title: "EVM Token Holders API"
description: "Bitquery schema reference for EVM Token Holders API: fields, types, and query patterns."
---
# EVM Token Holders API

The **Holders** API returns token holder data for ERC-20 tokens: top holders, holder counts, and balance thresholds. Non-zero balances use `Amount(selectWhere: { gt: "0" })` on the `Balance` field (not in `where`). Use `dataset: combined` or `dataset: archive` as follows:

| Dataset | When to use |
|---------|-------------|
| **`combined`** | Latest holder count, top holders, and balances. Queries **realtime and archive** databases and merges results. |
| **`archive`** | Addresses not recently active (not in the realtime window). |

Full Ethereum examples: [Token Holders API](/docs/blockchain/Ethereum/token-holders/token-holder-api).

## Token holder count

```graphql
query {
  EVM(network: eth, dataset: combined) {
    Holders(
      where: {
        Currency: {
          SmartContract: {
            is: "0x54D2252757e1672EEaD234D27B1270728fF90581"
          }
        }
      }
    ) {
      uniq(of: Holder_Address)
    }
  }
}
```

### Filter parameters

- `dataset: combined` — latest holder count, top holders, and activity
- `dataset: archive` — addresses not recently active
- `where.Currency.SmartContract` — token contract address (required)
- `where.Balance.LastChangeTime` — filter by last balance change (datetime, e.g. `till: "2026-05-01T00:00:00Z"`). The Holders cube does not support `Block.Date`.
- `where.Holder.Address` — filter to a specific wallet
- `Balance.Amount(selectWhere: { gt: "..." })` — non-zero balances when listing amounts
- `uniq(of: Holder_Address, if: { Balance: { Amount: { gt: "..." } } } })` — holder count above a threshold
- `limit`, `orderBy` — pagination and sorting (e.g. `descending: Balance_Amount`)

### Return fields

- `Holder.Address` — holder wallet address
- `Balance.Amount`, `Balance.AmountInUSD` — token balance (use `selectWhere` for non-zero)
- `Balance.UpdateCount`, `Balance.FirstChangeTime`, `Balance.LastChangeTime` — holder activity

### Examples on Ethereum

- [Top holders (current)](/docs/blockchain/Ethereum/token-holders/token-holder-api#top-holders-of-a-currency-current)
- [Token holder count](/docs/blockchain/Ethereum/token-holders/token-holder-api#token-holder-count-for-an-erc-20-token)
- [Holder count above a threshold](/docs/blockchain/Ethereum/token-holders/token-holder-api#holder-count-with-balance-above-a-threshold)
- [Track whale wallets](/docs/blockchain/Ethereum/token-holders/token-holder-api#track-whale-wallets-and-token-holdings)
- [Historical top holders](/docs/blockchain/Ethereum/token-holders/token-holder-api#historical-top-holders-by-date)
- [Holder count history](/docs/blockchain/Ethereum/token-holders/token-holder-api#token-holder-count-history-over-time)
- [Wallet token balance at a date](/docs/blockchain/Ethereum/token-holders/token-holder-api#wallet-balance-at-a-point-in-time) (via [Balances API](/docs/blockchain/Ethereum/balances/balance-api/#wallet-balance-for-a-specific-token-on-a-date))
- [Holder activity](/docs/blockchain/Ethereum/token-holders/token-holder-api#token-holder-activity) — `UpdateCount`, `FirstChangeTime`, `LastChangeTime`
