# eth_getTransactionByHash

In this section we will discuss how we can build eth_getTransactionByHash alternatives using Bitquery APIs.

## Get Transaction Hash

We will use [this](https://ide.bitquery.io/Get-Transaction-Hash) stream to get the latest transactions hash. We will use this transaction hash as an input for the eth_getTransactionByHash alternative API. 

``` graphql
subscription {
  EVM {
    Transactions {
      Transaction {
        Hash
      }
    }
  }
}
```

## Get Transaction Details by Hash

[This](https://ide.bitquery.io/eth_getTransactionByHash_1) API serves as an alternative to the eth_getTransactionByHash JSON RPC method with `Hash` as `0xcc9ce436a02e8a4b44546affebe036fdd54b70c27ea3c2df18c0a1ed78ec9fbe`.

``` graphql
query getTransactionByHash {
  EVM {
    Transactions(
      where: {Transaction: {Hash: {is: "0xcc9ce436a02e8a4b44546affebe036fdd54b70c27ea3c2df18c0a1ed78ec9fbe"}}}
    ) {
      Block {
        Time
        Number
      }
      ChainId
      Signature {
        R
        S
        V
      }
      Transaction {
        From
        Gas
        GasPrice
        Hash
        Index
        Nonce
        Cost
        Data
        To
        Value
        AccessList {
          Address
          StorageKeys
        }
        GasFeeCap
        Type
      }
      TransactionStatus {
        Success
      }
    }
  }
}
```

After running the above query this is the expected result.

``` json
{
  "EVM": {
    "Transactions": [
      {
        "Block": {
          "Number": "20525804",
          "Time": "2024-08-14T08:54:11Z"
        },
        "ChainId": "1",
        "Signature": {
          "R": "15733655909487727252053616094955044058698623526211212024614602844347766842611",
          "S": "31797148001645269693712272496207792779118835901043019296634774876795585651855",
          "V": "0"
        },
        "Transaction": {
          "AccessList": [],
          "Cost": "0.000603129239285980",
          "Data": "0x",
          "From": "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
          "Gas": "27329",
          "GasFeeCap": "3474089451",
          "GasPrice": "0.000000003474089451",
          "Hash": "0xcc9ce436a02e8a4b44546affebe036fdd54b70c27ea3c2df18c0a1ed78ec9fbe",
          "Index": "23",
          "Nonce": "1278621",
          "To": "0x1876207dbfd106372d289d06e89cb75a4ff40231",
          "Type": 2,
          "Value": "0.000508185848679601"
        },
        "TransactionStatus": {
          "Success": true
        }
      }
    ]
  }
}
```