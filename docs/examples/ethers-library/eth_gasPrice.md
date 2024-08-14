# eth_gasPrice

In this section, we will build a data stream that returns the gas fee of the latest transaction in WEI. Unlike any JSON RPC method like eht_gasPrice that returns the hexadecimal equivalent of an integer representing the current gas price in WEI, this returns the integer value itself.

[This](https://ide.bitquery.io/eth_gasPrice_1) is the stream that returns the current gas price in `WEI`.

``` graphql

subscription {
  EVM {
    Transactions {
      Transaction {
        Gas
      }
      ChainId
    }
  }
}

```

The above stream returns the following response.

``` json

{
    "EVM": {
        "Transactions": [
        {
            "ChainId": "1",
            "Transaction": {
                "Gas": "100000"
            }
        },
        ]
    }
}

```