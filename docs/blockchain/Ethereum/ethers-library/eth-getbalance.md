---
title: "eth_getBalance"
description: "Retrieve the current balance of any Ethereum address using the eth_getBalance API"
---
# eth_getBalance

Ethereum getBalance is an API endpoint that retrieves the balance for a particular address for any given currency on the Ethereum blockchain. In this section we will see how to create queries that serves as an alternative for the eth_getBalance JSON RPC method and
how to customize it to get data we need.

## eth_getBalance for One Address

### Get balance for all currencies

[Run in IDE](https://ide.bitquery.io/ethereum-balances-address)

```graphql
query {
  EVM(network: eth, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: {
            is: "0x21a31ee1afc51d94c2efccaa2092ad1028285549"
          }
        }
      }
    ) {
      Currency {
        Name
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

### Get balance for one currency

[Run in IDE](https://ide.bitquery.io/ethereum-balances-native-eth)

Returns the balance for native ETH (`SmartContract: "0x"`).

```graphql
query {
  EVM(network: eth, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: {
            is: "0x21a31ee1afc51d94c2efccaa2092ad1028285549"
          }
        }
        Currency: {
          SmartContract: {
            is: "0x"
          }
        }
      }
    ) {
      Currency {
        Name
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

## eth_getBalance for Multiple Addresses

Query each address in the `in` list. [Run in IDE](https://ide.bitquery.io/ethereum-balances-multiple-addresses)

```graphql
query {
  EVM(network: eth, dataset: combined) {
    Balances(
      where: {
        Balance: {
          Address: {
            in: [
              "0xD51a44d3FaE010294C616388b506AcdA1bfAAE46",
              "0x6d07d7bac25d9e836bbceb3ed5e2a910214de846",
              "0x354e9fa5c6ee7e6092158a8c1b203ccac932d66d"
            ]
          }
        }
      }
    ) {
      Currency {
        Name
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
