---
title: "Robinhood Token Supply API"
description: "Get the latest total supply of a token, stream real-time supply updates, and fetch supply for all active tokens on Robinhood with Bitquery's EVM TransactionBalances API."
sidebar_position: 5
keywords:
  - Robinhood token supply API
  - Robinhood total supply
  - Robinhood token supply stream
  - Robinhood TransactionBalances API
  - Robinhood real-time supply
  - Robinhood active tokens supply
  - token total supply Robinhood
  - Bitquery Robinhood supply API
  - Robinhood token circulating supply
---

# Robinhood Token Supply API

Get **token total supply** on the **Robinhood** network with Bitquery's `EVM.TransactionBalances` API. This guide covers the **latest supply of a token**, a **real-time supply stream**, and the **supply of all active tokens**.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades)
- [Robinhood Transfers](/docs/blockchain/robinhood/robinhood-transfers)
- [Flap.sh API on Robinhood](/docs/blockchain/robinhood/flap-sh-api)
- [WebSocket subscriptions](/docs/subscriptions/websockets/)
:::

:::note Supply is decimal-normalized
`TokenBalance.TotalSupply` is already adjusted for the token's decimals, so it returns whole-token values (e.g. `100000000.000000000000000000`) — not the raw on-chain integer.
:::

---

## Latest Supply of a Token

Get the most recent total supply for a single token by filtering on its contract address and taking the newest balance record.

```graphql
{
  EVM(network: robinhood) {
    TransactionBalances(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {TokenBalance: {Currency: {SmartContract: {is: "0x0bd7d308f8e1639fab988df18a8011f41eacad73"}}}}
    ) {
      TokenBalance {
        Currency {
          Symbol
          HasURI
          SmartContract
        }
        TotalSupply
      }
    }
  }
}
```

<details>
<summary>Sample response</summary>

```json
{
  "EVM": {
    "TransactionBalances": [
      {
        "TokenBalance": {
          "Currency": {
            "Symbol": "WETH",
            "HasURI": false,
            "SmartContract": "0x0bd7d308f8e1639fab988df18a8011f41eacad73"
          },
          "TotalSupply": "18584.722713864831985195"
        }
      }
    ]
  }
}
```

</details>

---

## Real-Time Supply Stream for Tokens on Robinhood

Subscribe to live total-supply updates across Robinhood tokens. The `SmartContract: {not: "0x"}` filter excludes the native coin so only token supply changes stream through.

```graphql
subscription {
  EVM(network: robinhood) {
    TransactionBalances(
      where: {
        TokenBalance: {
          Currency: {
            SmartContract: {not: "0x"}
          }
        }
      }
    ) {
      TokenBalance {
        Currency {
          Symbol
          HasURI
          SmartContract
        }
        TotalSupply
      }
    }
  }
}
```

---

## Supply of All Active Tokens

Fetch the latest total supply for every recently active token in a single query. `limitBy` collapses results to the newest record per token contract, so each token appears once with its current supply.

```graphql
{
  EVM(network: robinhood) {
    TransactionBalances(
      limitBy: {by: TokenBalance_Currency_SmartContract, count: 1}
      orderBy: {descending: Block_Time}
      where: {TokenBalance: {Currency: {SmartContract: {not: "0x"}}}}
    ) {
      TokenBalance {
        Currency {
          Symbol
          HasURI
          SmartContract
        }
        TotalSupply
      }
    }
  }
}
```

<details>
<summary>Sample response</summary>

```json
{
  "EVM": {
    "TransactionBalances": [
      {
        "TokenBalance": {
          "Currency": { "Symbol": "HEIST", "HasURI": false, "SmartContract": "0xfbb3171fc52fca9f8ff10b2494a6055a51f68717" },
          "TotalSupply": "100000000.000000000000000000"
        }
      },
      {
        "TokenBalance": {
          "Currency": { "Symbol": "ROBINHOOD", "HasURI": false, "SmartContract": "0x217b7013e00c13ce4f3bc968238e0b13ce297382" },
          "TotalSupply": "100000000000.000000000000000000"
        }
      },
      {
        "TokenBalance": {
          "Currency": { "Symbol": "BabyJugger", "HasURI": false, "SmartContract": "0xd8e25ced04f51efa18fa94b460f6e924c3aa23ae" },
          "TotalSupply": "1000000000.000000000000000000"
        }
      }
    ]
  }
}
```

</details>

---

## FAQ

### How do I get the current total supply of a Robinhood token?

Query `EVM.TransactionBalances` filtered by the token's `Currency.SmartContract`, ordered by `descending: Block_Time` with `limit: 1`. The newest record holds the latest `TotalSupply`.

### How do I stream supply changes in real time?

Run the `subscription` on `TransactionBalances` with `Currency.SmartContract: {not: "0x"}`. Each supply change on a token is pushed to your client as it is indexed.

### How do I list supply for all active tokens at once?

Use `limitBy: {by: TokenBalance_Currency_SmartContract, count: 1}` with `orderBy: {descending: Block_Time}`. This returns one row — the latest supply — per token contract.

### Is `TotalSupply` raw or decimal-adjusted?

It is decimal-normalized (whole tokens), already divided by the token's decimals. Use it directly for market-cap math without further scaling.

---

## Next steps

- Combine supply with price from the [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades) for market-cap and FDV calculations.
- Track newly launched tokens with the [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches) and [Flap.sh API](/docs/blockchain/robinhood/flap-sh-api).
- Inspect holder and wallet flows with [Robinhood Transfers](/docs/blockchain/robinhood/robinhood-transfers).
