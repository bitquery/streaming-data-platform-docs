# eth_getBalance

Ethereum getBalance is an API endpoint that retrieves the balance for a particular address for any given currency on the Ethereum blockchain. In this section we will see how to create queries that serves as an alternative for the eth_getBalance JSON RPC method and
how to customize it to get data we need.

<head>
  <meta name="title" content="eth_getBalance API - Ethereum - Account Balances, Blockchain Data"/>
  <meta name="description" content="Retrieve the current balance of any Ethereum address using the eth_getBalance API."/>
  <meta name="keywords" content="eth_getBalance API,Ethereum balance API,eth_getBalance blockchain API,Ethereum account balance API,eth_getBalance documentation,Ethereum Web3 API,Ethereum blockchain data,crypto balance,blockchain API,crypto API"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

  <meta property="og:type" content="website" />
  <meta property="og:title" content="How to Get Ethereum Account Balance with eth_getBalance API"/>
  <meta property="og:description" content="Retrieve the current balance of any Ethereum address using the eth_getBalance API."/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="How to Get Ethereum Account Balance with eth_getBalance API"/>
  <meta property="twitter:description" content="Retrieve the current balance of any Ethereum address using the eth_getBalance API."/>
</head>


## eth_getBalance for One Address

### Get balance for all currencies

You can run [this](https://ide.bitquery.io/eth_getBalance-for-one-address_1#) query to get the current balance of a particular address. 

``` graphql
{
  EVM {
    BalanceUpdates(
      where: {
        BalanceUpdate: {
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
      sum(of: BalanceUpdate_AmountInUSD, selectWhere: {gt: "0"})
    }
  }
}

```

### Get balance for one currency

[This](https://ide.bitquery.io/eth_getBalance-for-one-address-for-eth) query returns the balance of the mentioned address for a selected currency. The currency in question is Ethereum with `SmartContract` as `0x`.

``` graphql
{
  EVM {
    BalanceUpdates(
      where: {
        BalanceUpdate: {
          Address: {
            is: "0x21a31ee1afc51d94c2efccaa2092ad1028285549"
          }
        },
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
      sum(of: BalanceUpdate_AmountInUSD, selectWhere: {gt: "0"})
    }
  }
}
```

## eth_getBalance for Multiple Addresses

To get the balance of multiple addresses, [this](https://ide.bitquery.io/eth_getBalance-for-multiple-address) query can be used. 

``` graphql
{
  EVM {
    BalanceUpdates(
      where: {
        BalanceUpdate: {
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
      sum(of: BalanceUpdate_AmountInUSD, selectWhere: {gt: "0"})
      BalanceUpdate {
        Address
      }
    }
  }
}

```
