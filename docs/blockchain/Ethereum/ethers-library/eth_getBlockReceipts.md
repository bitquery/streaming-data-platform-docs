# eth_getBlockReceipts

In this section we will build an API that serves as an alternative to the eth_getBlockReceipts JSON RPC method that takes `Block Number` as an input and returns all transaction receipts for the given block.

<head>
  <meta name="title" content="eth_getBlockReceipt API - Ethereum - Block Receipt Information"/>
  <meta name="description" content="Retrieve detailed receipt information for a specific block on the Ethereum blockchain using the eth_getBlockReceipt API."/>
  <meta name="keywords" content="eth_getBlockReceipt API,Ethereum block receipt API,Ethereum block details API,eth_getBlockReceipt documentation,block receipt,blockchain API,Ethereum web3 API,block data"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

  <meta property="og:type" content="website" />
  <meta
    property="og:title"
    content="How to Retrieve Ethereum Block Receipt Information with eth_getBlockReceipt API"
  />
  <meta
    property="og:description"
    content="Retrieve detailed receipt information for a specific block on the Ethereum blockchain using the eth_getBlockReceipt API."
  />

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="How to Retrieve Ethereum Block Receipt Information with eth_getBlockReceipt API"/>
  <meta property="twitter:description" content="Retrieve detailed receipt information for a specific block on the Ethereum blockchain using the eth_getBlockReceipt API."/>
</head>

## Get Block Receipts

[This](https://ide.bitquery.io/eth_getBlockReceipt) query serves as an alternative to the eth_getBlockReceipts method with `Block Number` as `20525804`.

``` graphql

query MyQuery {
  EVM {
    Transactions(where: {Block: {Number: {eq: "20525804"}}}) {
      Block {
        Hash
        Number
      }
      Transaction {
        From
        To
        Hash
        Index
      }
      Receipt {
        ContractAddress
        CumulativeGasUsed
        GasUsed
        Status
        Type
      }
    }
  }
}

```

The above API returns the following output.

``` json

{
  "EVM": {
    "Transactions": [
      {
        "Block": {
          "Hash": "0x399bf82bde7d84d36f9deb7e7ddb5f2b11b6d454960f3a6243ec51d50ccd4300",
          "Number": "20525804"
        },
        "Receipt": {
          "ContractAddress": "0x0000000000000000000000000000000000000000",
          "CumulativeGasUsed": "4227373",
          "GasUsed": "27329",
          "Status": "1",
          "Type": 2
        },
        "Transaction": {
          "From": "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
          "Gas": "27329",
          "Hash": "0xcc9ce436a02e8a4b44546affebe036fdd54b70c27ea3c2df18c0a1ed78ec9fbe",
          "Index": "23",
          "To": "0x1876207dbfd106372d289d06e89cb75a4ff40231"
        }
      },
      {
        "Block": {
          "Hash": "0x399bf82bde7d84d36f9deb7e7ddb5f2b11b6d454960f3a6243ec51d50ccd4300",
          "Number": "20525804"
        },
        "Receipt": {
          "ContractAddress": "0x0000000000000000000000000000000000000000",
          "CumulativeGasUsed": "4273342",
          "GasUsed": "45969",
          "Status": "0",
          "Type": 2
        },
        "Transaction": {
          "From": "0xffdfafbe24182f0cb5da28905aeb4109ef97d536",
          "Gas": "2000000",
          "Hash": "0xe255e765b5acec3f3c07d0294454e75f25f0c939d8a983f0832169aefaaf481f",
          "Index": "24",
          "To": "0xc7e9f886639beeba04c135abeb96365c01969552"
        }
      },
    ]
  }
}

```