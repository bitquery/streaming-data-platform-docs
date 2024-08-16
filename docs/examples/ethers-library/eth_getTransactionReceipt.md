# eth_getTransactionReceipt

In this section, we will build an alternative to the eth_getTransactionReceipt JSON RPC method using the Bitquery APIs. The method is used to provide the receipt of a transaction given `transaction hash`. Note that the receipt is not available for pending transactions.

# Get Transaction Receipt
We can get the receipt of a transaction using the transaction hash, `0x4fe59dcf4f834f17acdcd0f244538c119523009ce47817ccd56423404ba34ffa` for this example, using [this](https://ide.bitquery.io/eth_getTransactionReceipt_1) API given below.

``` graphql

{
  EVM {
    Transactions(
      where: {
        Transaction: {
          Hash: {
            is: "0x4fe59dcf4f834f17acdcd0f244538c119523009ce47817ccd56423404ba34ffa"
          }
        }
      }
    ) {
      Block {
        Hash
        Number
      }
      Transaction {
        From
        GasPrice
        Hash
        Index
        To
      }
      Receipt {
        ContractAddress
        CumulativeGasUsed
        GasUsed
        Status
        Type
        Bloom
      }
    }
  }
}

```

## Response Received

The response of the above API is given below.

``` json

{
  "EVM": {
    "Transactions": [
      {
        "Block": {
          "Hash": "0x8b0d94963d1cb307ff0b83a60bb43bb53bf471a6644161eb882169c782ec5e5c",
          "Number": "20540273"
        },
        "Receipt": {
          "Bloom": "0x0000000000000000000000000000000000000000000000000000000000000000000002000000040000000000000000000000000000000000000000000000000000020000000000000000000a000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000010000000000000000000000040000000000000000000008001000000000000000000000000000000000000000000000000000000000000000000002000000000000000002000000002000000000004000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000",
          "ContractAddress": "0x0000000000000000000000000000000000000000",
          "CumulativeGasUsed": "4656412",
          "GasUsed": "99510",
          "Status": "1",
          "Type": 0
        },
        "Transaction": {
          "From": "0xd2241065700f763d0390725d00bfd3fbef0b525e",
          "GasPrice": "0.000000005000000000",
          "Hash": "0x4fe59dcf4f834f17acdcd0f244538c119523009ce47817ccd56423404ba34ffa",
          "Index": "24",
          "To": "0xbb3f21dd9b16741e9822392f753d07da4c6b6cd6"
        }
      }
    ]
  }
}
```

Now, you may note that unlike the JSON RPC method, this API does'nt return any `log` object. However, if that is something you might need then checkout the following page for [eth_getLogs](https://docs.bitquery.io/docs/examples/ethers-library/eth_getLogs/). 