---
title: "Stablecoin Balance API"
description: "Bitquery stablecoin API docs: Stablecoin Balance API."
---
# Stablecoin Balance API

The Stablecoin API by Bitquery provides you the comprehensive set of APIs which can provide you realtime transfers, realtime trades, realtime price, holder distribution of stablecoins across chains with a single API call.

We are going to particularly deep-dive into how to get Stablecoin Balance data in this section.

## Stablecoin Balance of an Address

### Solana

Below stream will give you balance of `9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM` for `FDUSD` on Solana. Test the query [here](https://ide.bitquery.io/FDUSD-balance-of-an-address).

```
query MyQuery {
  Solana {
    BalanceUpdates(
      where: {BalanceUpdate: {Account: {Owner: {is: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"}}, Currency: {MintAddress: {is: "9zNQRsGLjNKwCUU5Gq5LR8beUCPzQMVMqKAi3SSZh54u"}}}}
      orderBy: {descendingByField: "BalanceUpdate_Balance_maximum"}
    ) {
      BalanceUpdate {
        Balance: PostBalance(maximum: Block_Slot)
        Currency {
          Name
          Symbol
        }
      }
    }
  }
}

```

### Ethereum

[Run Query](https://ide.bitquery.io/ethereum-stablecoin-balances-address)

```graphql
query {
  EVM(network: eth, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: {
            is: "0xcf1DC766Fc2c62bef0b67A8De666c8e67aCf35f6"
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
      }
    }
  }
}
```

### Tron

Below query will give you **USDT** balance for address `TUTQj7VJ1QjR3t2GJByvrP25yZNFcj38VJ` on Tron. Test the query [here](https://ide.bitquery.io/Stablecoin-Balance-of-an-Address).

```
query MyQuery {
  Tron(dataset: combined) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "TUTQj7VJ1QjR3t2GJByvrP25yZNFcj38VJ"}}, Currency: {SmartContract: {is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"}}}
      orderBy: {descendingByField: "balance"}
    ) {
      Currency {
        Name
      }
      balance: sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})
      BalanceUpdate {
        Address
      }
    }
  }
}

```

More examples on balance and balance updates on EVM chains can be found [here](/docs/blockchain/Ethereum/balances/balance-api/)

Token holder API examples can be found [here](/docs/blockchain/Ethereum/token-holders/token-holder-api/)

## Get Top 100 Holders of a Particular Stablecoin

[This query](https://ide.bitquery.io/top-100-holders-of-USDC-token-on-Solana) returns the top 100 holders of a particular Stablecoin.

```
query MyQuery {
  Solana {
    BalanceUpdates(
      orderBy: {descendingByField: "BalanceUpdate_Holding_maximum"}
      where: {BalanceUpdate: {Currency: {MintAddress:
        {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}},
        }, Transaction: {Result: {Success: true}}}
    ) {
      BalanceUpdate {
        Currency {
          Name
          MintAddress
          Symbol
        }
        Account {
          Address
        }
        Holding: PostBalance(maximum: Block_Slot selectWhere:{gt:"0"})
      }
    }
  }
}
```
