# eth_getBalance

Ethereum getBalance is an API that retrieves the balance for a particular address for any given currency on the Ethereum blockchain. In this section we will see how to create subscription for the eth_getB.alance JSON RPC method and how to customize it to get data we need.

## eth_getBalance for One Address

### Get balance for all currencies

You can run [this](https://ide.bitquery.io/eth_getBalance-for-one-address_1#) query to get the current balance of a particular address. 

```
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

```
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

## eth_getBalance for Multiple Address

To get the balance of multiple addresses, [this](https://ide.bitquery.io/eth_getBalance-for-multiple-address) query can be used. 

```
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
