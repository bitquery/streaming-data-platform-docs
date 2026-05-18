---
title: "EVM Token Holders Cube"
---

<head>
<meta name="title" content="EVM Token Holders API"/>

<meta name="description" content="Explore token holder information including holders of a token, holder counts, top holders, and holder activity on Ethereum."/>

<meta name="keywords" content="Token Balance, ERC20, Token Holders, ETH Balance, Ethereum, Ethereum Address, Holders API"/>

<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<meta property="og:type" content="website" />

<meta property="og:title" content="EVM Token Holders API" />

<meta property="og:description" content="Explore token holder information including holders of a token, holder counts, top holders, and holder activity on Ethereum." />

<meta property="twitter:card" content="summary_large_image" />

<meta property="twitter:title" content="EVM Token Holders API" />

<meta property="twitter:description" content="Explore token holder information including holders of a token, holder counts, top holders, and holder activity on Ethereum." />
</head>

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

- [Token holder count](/docs/blockchain/Ethereum/token-holders/token-holder-api#how-do-i-get-token-holder-count-for-an-erc-20-token)
- [Historical top holders](/docs/blockchain/Ethereum/token-holders/token-holder-api#how-do-i-get-historical-top-holders-of-an-erc-20-token-by-date)
- [Wallet token balance at a date](/docs/blockchain/Ethereum/token-holders/token-holder-api#how-do-i-get-the-balance-of-a-wallet-for-a-specific-token-point-in-time) (via [Balances API](/docs/blockchain/Ethereum/balances/balance-api/#wallet-balance-for-a-specific-token-on-a-date))
- [Top holders (current)](/docs/blockchain/Ethereum/token-holders/token-holder-api#top-holders-of-a-currency-current)
- [Holder count above a threshold](/docs/blockchain/Ethereum/token-holders/token-holder-api#holder-count-with-balance-above-a-threshold)
- [Holder activity](/docs/blockchain/Ethereum/token-holders/token-holder-api#token-holder-activity) — `UpdateCount`, `FirstChangeTime`, `LastChangeTime`
