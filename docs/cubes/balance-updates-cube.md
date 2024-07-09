# Balance Update Cube

Our `BalanceUpdates` cube is designed to provide historical and realtime balance updates. This cube provides multiple ways to query historical balance data.

## What is Balance Update?

Any update (Change) in the balance for any address by any means is a balance update.

`BalanceUpdates` covers various types of balance changes on the blockchain depending on the blockchain, including token transfers, miner/validator rewards, staking-related on-chain rewards, fees, etc.

Let’s see an example of BalanceUpdates API.

You can run following api [using tihs link](https://ide.bitquery.io/Balance-update-api).

```graphql
{
  EVM(dataset: combined, network: eth) {
    BalanceUpdates(
      limit: { count: 100 }
      where: {
        Block: { Time: { after: "2024-01-01T00:00:00Z" } }
        Currency: {
          SmartContract: {
            in: ["0x", "0xdac17f958d2ee523a2206206994597c13d831ec7"]
          }
        }
        BalanceUpdate: {
          Amount: { ge: "0.001" }
          AmountInUSD: { ge: "1" }
          Address: {
            in: [
              "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5"
              "0x384623f9dd6A71767CEf2F8d74DFA53D5840a1a6"
            ]
          }
        }
      }
    ) {
      BalanceUpdate {
        Address
        Amount
        AmountInUSD
        Id
        Type
        URI
      }
      Block {
        Number
        Time
      }
      Currency {
        Name
        SmartContract
        Symbol
      }
      Log {
        LogAfterCallIndex
        Index
      }
      Transaction {
        Hash
      }
    }
  }
}
```

Let’s understand the BalanceUpdate cube based on the above API example.

In this API, we get balance updates for the two addresses mentioned, where the currency is ETH(0x) and USDT, the date is after 1 January 2024, and the amount is greater than 0.001, and the USD amount of the balance update is greater than 1.

As a result, we get balance update amount, currency, block, transaction, and log data.

As you can see, we have used many filters in the `where` condition. Our filtering is very flexible to help you pull balance updates in a block, transaction, for an address, currency, NFT, etc.

It doesn't stop there; you can also check balance updates of specific amounts or time, and in addition, you can try getting balance updates of various types, for example, getting balance updates which are ` Block rewards`` or  `fee``or`transfers` .

## Does Balance Update include the Transaction Fees?

When querying balance updates for a specific address, it's important to understand whether the balance updates reflect the inclusion of transaction fees. This can be clarified through the following query and explanation:

### Query

```graphql
query MyQuery {
  EVM(dataset: archive, network: eth) {
    Transactions(
      where: {
        Transaction: {
          From: { is: "0x000338F2C046EE21C0a348481f3b21e251bf6dAA" }
        }
      }
    ) {
      Total_Fees: sum(of: Fee_SenderFee)
    }
  }
  EVM(dataset: archive, network: eth) {
    BalanceUpdates(
      where: {
        BalanceUpdate: {
          Address: { is: "0x000338F2C046EE21C0a348481f3b21e251bf6dAA" }
        }
        Block: { Time: { till: "2024-06-30T23:59:59Z" } }
      }
    ) {
      Currency {
        Name
        SmartContract
        Symbol
      }
      balance: sum(of: BalanceUpdate_Amount, selectWhere: { gt: "0" })
    }
  }
}
```

### Query Result

```json
{
  "EVM": {
    "BalanceUpdates": [
      {
        "Currency": {
          "Name": "Ethereum",
          "SmartContract": "0x",
          "Symbol": "ETH"
        },
        "balance": "0.010000000000000000"
      }
    ],
    "Transactions": [
      {
        "Total_Fees": "0.000466997357182825"
      }
    ]
  }
}
```

### Explanation

- **Transactions**: This part of the query calculates the total transaction fees paid by the specified address (`0x000338F2C046EE21C0a348481f3b21e251bf6dAA`). The total fees are returned as `0.000466997357182825 ETH`.

- **BalanceUpdates**: This part of the query calculates the total balance updates for the specified address up to the given time (`2024-06-30T23:59:59Z`). The balance is returned as `0.010000000000000000 ETH`.

### Calculation

To determine the final balance after accounting for transaction fees, you can subtract the total transaction fees from the balance updates:

```
Final Balance = BalanceUpdates - Total_Fees
               = 0.010000000000000000 ETH - 0.000466997357182825 ETH
               = 0.009533002642817175 ETH
```

The balance update does not inherently include transaction fees. Therefore, to get the actual balance after all transactions and fees, you need to subtract the total transaction fees from the balance updates. In this example, the final balance after accounting for transaction fees is `0.009533002642817175 ETH`.

## Aggregation in BalanceUpdates Cube

We usually perform aggregations in real time to maintain API flexibility. BalanceUpdate cube provides powerful aggregation, which can help aggregate data based on time, amount, address, currency, type, transaction, block, NFT, etc.

Using aggregation, you can balance an address at any given date, time, or block height. Let’s understand with an example.

You can run following query [using this link](https://ide.bitquery.io/Balance-of-an-address_4).

```graphql
query MyQuery {
  EVM(dataset: combined, network: eth) {
    BalanceUpdates(
      where: {
        BalanceUpdate: {
          Address: { is: "0xcf1DC766Fc2c62bef0b67A8De666c8e67aCf35f6" }
        }
      }
      orderBy: { descendingByField: "balance" }
    ) {
      Currency {
        Name
      }
      balance: sum(of: BalanceUpdate_Amount, selectWhere: { gt: "0" })
    }
  }
}
```

In the above query, we are summing the balance update amount to get the current address balance for all tokens.

Another variant is where we get balance, which is earned using a block reward till 1st Jan 2024.

You can run following query [using this link](https://ide.bitquery.io/Block-reward-balance).

```graphql
query MyQuery {
  EVM(dataset: combined, network: eth) {
    BalanceUpdates(
      where: {
        BalanceUpdate: {
          Address: { is: "0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326" }
        }
      }
    ) {
      Currency {
        Name
      }
      Block_reward_balance: sum(
        of: BalanceUpdate_Amount
        selectWhere: { gt: "0" }
        if: {
          BalanceUpdate: { Type: { is: block_reward } }
          Block: { Date: { till: "2024-01-01" } }
        }
      )
    }
  }
}
```

You can write the above query in the following manner, too.

You can run following query [using this link](https://ide.bitquery.io/Balance-of-address-based-on-block-reward---alternative-way).

```graphql
query MyQuery {
  EVM(dataset: combined, network: eth) {
    BalanceUpdates(
      where: {
        Block: { Date: { till: "2024-01-01" } }
        BalanceUpdate: {
          Type: { is: block_reward }
          Address: { is: "0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326" }
        }
      }
    ) {
      Currency {
        Name
      }
      Block_reward_balance: sum(of: BalanceUpdate_Amount)
    }
  }
}
```

Let’s show another example where we aggregate data based on currency to get common token holders of NFT tokens.

You can run following query [using this link](https://ide.bitquery.io/Common-token-holder_1).

```graphql
{
  EVM(dataset: combined) {
    BalanceUpdates(
      orderBy: { descendingByField: "token1" }
      limit: { count: 1000 }
      where: {
        Currency: {
          SmartContract: {
            in: [
              "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
              "0x60e4d786628fea6478f785a6d7e704777c86a7c6"
            ]
          }
        }
      }
    ) {
      BalanceUpdate {
        Address
      }
      token1: sum(
        of: BalanceUpdate_Amount
        if: {
          Currency: {
            SmartContract: { is: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d" }
          }
        }
        selectWhere: { gt: "0" }
      )
      token2: sum(
        of: BalanceUpdate_Amount
        if: {
          Currency: {
            SmartContract: { is: "0x60e4d786628fea6478f785a6d7e704777c86a7c6" }
          }
        }
        selectWhere: { gt: "0" }
      )
    }
  }
}
```
