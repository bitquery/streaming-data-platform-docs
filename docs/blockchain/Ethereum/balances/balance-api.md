---
sidebar_position: 2
---

# Address Balance API

The **Balances** API returns current and historical token balances for an address on Ethereum. Balances are non-zero by default (`Amount(selectWhere: { gt: "0" })`). Use `dataset: combined` for the latest state and `Block.Date` filters for point-in-time snapshots.

## Balance of an address

Returns all token balances for a wallet address.

[Run in IDE](https://ide.bitquery.io/ethereum-balances-address)

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

**Parameters**

- `network: eth`: Ethereum mainnet.
- `dataset: combined`: Latest combined balance state.
- `Balance.Address`: Wallet address to query.

**Returned fields**

- `Currency.Symbol`, `Currency.SmartContract`: Token metadata.
- `Balance.Amount`, `Balance.AmountInUSD`: Token balance and USD value (non-zero only).

:::warning Important: Rebasing Token Limitations
**Rebasing tokens are not supported for accurate balance calculations.**

Rebasing tokens (like Mountain Protocol's USDM) automatically adjust their total supply and individual balances through mechanisms other than traditional transfer transactions. This means:

- **Balance calculations may be inaccurate** - Our balance tracking doesn't capture rebasing adjustments
- **Balance updates may be missing** - Individual holder balances change without visible transactions
- **Historical balance data will be incorrect** - Past balances don't reflect rebasing adjustments

**Before calculating balances for any token, verify it's not a rebasing token by:**

1. Checking the token's official documentation
2. Looking for rebasing mechanisms in the smart contract
3. Consulting token issuer resources

**Example of rebasing token:** Mountain Protocol USDM (`0x59d9356e565ab3a36dd77763fc0d87feaf85508c` on Arbitrum) - [Documentation](https://docs.mountainprotocol.com/legacy-docs/usdm-token)

**Supported chains:** This limitation applies to all EVM chains (Ethereum, Arbitrum, BSC, Base, etc.)
:::

## Balance on a specific date

Use `Block.Date.till` for a point-in-time snapshot.

[Run in IDE](https://ide.bitquery.io/ethereum-balances-by-date)

```graphql
query {
  EVM(network: eth, dataset: combined) {
    Balances(
      where: {
        Block: {
          Date: {
            till: "2026-04-30"
          }
        }
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

## Balance for a specific token

Add a `Currency.SmartContract` filter. Always use the contract address, not the token name.

[Run in IDE](https://ide.bitquery.io/ethereum-balances-specific-token)

```graphql
query {
  EVM(network: eth, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: {
            is: "0x3416cf6c708da44db2624d63ea0aaef7113527c6"
          }
        }
        Currency: {
          SmartContract: {
            is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
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

## Balance history by date

Returns balance snapshots over time for an address. Order by `Block_Date` descending and use `limit` to paginate. Add `Currency.SmartContract` under `Currency` to filter by a specific token.

[Run in IDE](https://ide.bitquery.io/ethereum-balances-history)

```graphql
query {
  EVM(network: eth, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: {
            is: "0x5646c5b4845e565706ef107f62887145a51a3127"
          }
        }
        Currency: {}
      }
      orderBy: {
        descending: Block_Date
      }
      limit: {
        count: 100
      }
    ) {
      Currency {
        Symbol
        SmartContract
      }
      Balance {
        Amount(selectWhere: { gt: "0" })
        AmountInUSD
      }
      Block {
        Date
      }
    }
  }
}
```

## How do I get the balance of a wallet for a specific token?

Use `EVM.Balances` with `Balance.Address` set to the wallet and `Currency.SmartContract` set to the ERC-20 contract. For a balance on a specific calendar date, add `Block.Date.till`. For holder distribution and top holders, see the [Token Holders API](https://docs.bitquery.io/docs/blockchain/Ethereum/token-holders/token-holder-api).
