---
title: "EVM Token Holders Cube"
---

<head>
<meta name="title" content="EVM Token Holders API"/>

<meta name="description" content="Explore token holder information including holders of a token, balances, and holder activity. Discover balance, attributes, and more information effortlessly."/>

<meta name="keywords" content="Token Balance, ERC20, USDT Balance, USDC Balance, ETH Balance, Ethereum, Ethereum Address"/>

<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />

<meta property="og:title" content="EVM Token Holders API" />

<meta property="og:description" content="Explore token holder information including holders of a token, balances, and holder activity. Discover balance, attributes, and more information effortlessly." />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />

<meta property="twitter:title" content="EVM Token Holders API" />

<meta property="twitter:description" content="Explore token holder information including holders of a token, balances, and holder activity. Discover balance, attributes, and more information effortlessly." />
</head>

## Token Holders

Token holder of a token refers to any wallet which holds that particular token. On Ethereum, use the **Holders** API for top holders and holder counts. Use `dataset: combined` for latest rankings; use `dataset: archive` for historical snapshots and holders not recently active. See the [Token Holders API](/docs/blockchain/Ethereum/token-holders/token-holder-api/) for full examples.

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
      orderBy: {
        descending: Balance_Amount
      }
      limit: {
        count: 10
      }
    ) {
      Holder {
        Address
      }
      Balance {
        Amount(selectWhere: { gt: "0" })
      }
    }
  }
}
```

### Filter Parameters

The Holders API allows you to narrow down results using these parameters:

- `dataset: combined`: Latest data (realtime + archive merged).
- `dataset: archive`: Historical snapshots and addresses not recently active.
- `where.Currency.SmartContract`: Token contract address (required).
- `where.Balance.LastChangeTime`: Filter by last balance change using datetime format (for example `till: "2026-05-01T00:00:00Z"`). The Holders cube does not support `Block.Date`.
- `Balance.Amount(selectWhere: { gt: "..." })`: Filter by balance thresholds (not in `where`).
- `limit`: Limit the number of holders returned.
- `orderBy`: Order results (for example `descending: Balance_Amount`).

### Return Fields

The Token Holder API provides access to the following fields:

- `Balance`: Shows the token balance.
- `BalanceUpdate`: Offers a range of aggregated data related to balance updates, including:
  - `FirstDate`: The date of the holder’s first interaction with the token.
  - `LastDate`: The date of the holder’s most recent interaction with the token.
  - `InAmount`: The total amount of the token the holder received.
  - `OutAmount`: The total amount of the token the holder sent.
  - `InCount`: The number of transactions in which the holder received the token.
  - `OutCount`: The number of transactions in which the holder sent out the token.
- `Currency`: Provides currency-specific details, such as the smart contract and address.
- `Holder`: Retrieves the holder’s address.
