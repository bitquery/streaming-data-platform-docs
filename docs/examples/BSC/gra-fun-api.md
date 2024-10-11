# GRA.fun API

In this section we'll have a look at some examples using the BSC Transfers API.

<head>
<meta name="title" content="GRA.fun API"/>
<meta name="description" content="Get Meme coins trade from GRA.fun on BSC blockchain. Get buy, sell, redeem trades both real time and historical"/>
<meta name="keywords" content="Gra.fun api, Gra fun api, gra fun memcoin generator api, memecoin"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Gra Fun API"
/>
<meta
  property="og:description"
  content="Get Meme coins trade from GRA.fun on BSC blockchain. Get buy, sell, redeem trades both real time and historical."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Gra Fun API" />
<meta property="twitter:description" content="Get Meme coins trade from GRA.fun on BSC blockchain. Get buy, sell, redeem trades both real time and historical." />
</head>

## 1. New Token Created

Retrieve newly created tokens on the gra.fun platform using [query below](https://ide.bitquery.io/grafun-new-token-created-api).


```graphql
{
  EVM(network: bsc) {
    Events(
      where: {Transaction: {To: {is: "0x8341b19a2a602eae0f22633b6da12e1b016e6451"}}, Call: {Signature: {Name: {is: "createPool"}}}}
      limit: {count: 10}
      orderBy: {descending: Block_Time}
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        To
        From
      }
      Log {
        Index
        Signature {
          Name
        }
      }
      Log {
        Signature {
          Name
        }
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
        }
      }
      Call {
        Signature {
          Name
        }
        From
        To
      }
    }
  }
}
```

## GRA fun All Transfers/Trades

Retrieve all transfer and trade events related to the GRA fun using [this query](https://ide.bitquery.io/gra-fun-all-transfers).

```graphql
{
  EVM(network: bsc) {
    Transfers(
      orderBy: {descending: Block_Time}
      limit: {count: 10}
      where: {Transaction: {To: {is: "0x8341b19a2a602eae0f22633b6da12e1b016e6451"}}}
    ) {
      Transaction {
        Hash
        From
        To
      }
      Call {
        Signature {
          Signature
          Name
          SignatureHash
        }
      }
      Transfer {
        Amount
        AmountInUSD
        Currency {
          Name
          Symbol
          SmartContract
        }
        Receiver
        Sender
      }
    }
  }
}

```


## GRA fun Redeem Transactions

Retrieve all redeemed transactions using [this query](https://ide.bitquery.io/Gra-fun-redeem-transactions).


```graphql
{
  EVM(network: bsc) {
    Events(
      orderBy: {descending: Block_Time}
      limit: {count: 100}
      where: {Transaction: {To: {is: "0x8341b19a2a602eae0f22633b6da12e1b016e6451"}}, Call: {Signature: {SignatureHash: {is: "1e9a6950"}}}}
    ) {
      Transaction {
        Hash
        From
        To
      }
      Call {
        CallPath
        CallerIndex
        Create
        Delegated
        Error
        From
        Gas
        GasUsed
        Index
        InternalCalls
        Reverted
        SelfDestruct
        Signature {
          Name
          SignatureHash
        }
        Success
        To
        Value
      }
      Log {
        Signature {
          Name
          Signature
          SignatureHash
        }
      }
      Arguments {
        Name
        Index
        Value {
          __typename
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}

```

## GRA fun Buy Transactions

Retrieve all buy transactions from GRA.fun using [this query](https://ide.bitquery.io/Gra-fun-buy-transactions).

```graphql
{
  EVM(network: bsc) {
    Events(
      orderBy: {descending: Block_Time}
      limit: {count: 100}
      where: {Transaction: {To: {is: "0x8341b19a2a602eae0f22633b6da12e1b016e6451"}},
        Call: {Signature: {SignatureHash: {is: "db61c76e"}}}}
    ) {
      Transaction {
        Hash
        From
        To
      }
      Call {
        CallPath
        CallerIndex
        Create
        Delegated
        Error
        From
        Gas
        GasUsed
        Index
        InternalCalls
        Reverted
        SelfDestruct
        Signature {
          Name
          SignatureHash
        }
        Success
        To
        Value
      }
      Log {
        Signature {
          Name
          Signature
          SignatureHash
        }
      }
      Arguments {
        Name
        Index
        Value {
          __typename
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}
```

## GRA fun Sell Transactions

Retrieve all sell transactions on GRA fun using [this query](https://ide.bitquery.io/Gra-fun-sell-transactions).


```graphql
{
  EVM(network: bsc) {
    Events(
      orderBy: {descending: Block_Time}
      limit: {count: 100}
      where: {Transaction: {To: {is: "0x8341b19a2a602eae0f22633b6da12e1b016e6451"}},
        Call: {Signature: {SignatureHash: {is: "2dc8f867"}}}}
    ) {
      Transaction {
        Hash
        From
        To
      }
      Call {
        CallPath
        CallerIndex
        Create
        Delegated
        Error
        From
        Gas
        GasUsed
        Index
        InternalCalls
        Reverted
        SelfDestruct
        Signature {
          Name
          SignatureHash
        }
        Success
        To
        Value
      }
      Log {
        Signature {
          Name
          Signature
          SignatureHash
        }
      }
      Arguments {
        Name
        Index
        Value {
          __typename
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}

```


## GRA fun Transaction Details

Retrieve detailed information about a specific transaction using [this query](https://ide.bitquery.io/gra-fun-detailed-transfer-of-a-transaction). You can check Sender and Receiver of Transfers to understand what bought and sold.

```graphql
{
  EVM(network: bsc, dataset: combined) {
    Transfers(
      orderBy: {descending: Block_Time}
      limit: {count: 10}
      where: {Transaction: {Hash: {is: "0xcf6b5a0789dacbf9fadffe0c00d208b5df39fadfef21302fe382cf6f6b433d3c"}}}
    ) {
      Transaction {
        Hash
        From
        To
      }
      Call {
        Signature {
          Signature
          Name
          SignatureHash
        }
      }
      Transfer {
        Amount
        AmountInUSD
        Currency {
          Name
          Symbol
          SmartContract
        }
        Receiver
        Sender
      }
    }
  }
}

```

To get all transfers of on GRA.fun, please check [this query](https://ide.bitquery.io/gra-fun-all-transfers).


## Trades of a token on pancake v3

Use this API to get Pancake V3 APIs using [this api](https://ide.bitquery.io/Trades-of-token-on-pancake-v3)


```
{
  EVM(dataset: archive, network: bsc) {
    DEXTrades(
      orderBy: {descending: Block_Time}
      limit: {count: 100}
      where: {Block: {Date: {since: "2024-08-01"}}, any: [{Trade: {Buy: {Currency: {SmartContract: {is: "0xcac007926755e2675e201223f7d4d68c74fd3439"}}}}}, {Trade: {Sell: {Currency: {SmartContract: {is: "0xcac007926755e2675e201223f7d4d68c74fd3439"}}}}}]}
    ) {
      Trade {
        Dex {
          SmartContract
          ProtocolName
          ProtocolVersion
        }
        Buy {
          Amount
          AmountInUSD
          Buyer
          Currency {
            Name
            Symbol
            SmartContract
          }
          Seller
          Price
          PriceInUSD
        }
        Sell {
          Amount
          AmountInUSD
          Buyer
          Currency {
            Name
            Symbol
            SmartContract
          }
          Seller
          Price
          PriceInUSD
        }
      }
    }
  }
}
```

## First trade of a token on pancake v3

Get 1st trade of token on Pancake v3 using [this api](https://ide.bitquery.io/Trades-of-token-on-pancake-v3_5).

```
{
  EVM(dataset: combined, network: bsc) {
    DEXTrades(
      orderBy: [{ascending: Block_Time}{ascending:Transaction_Index}]
      limit: {count: 1}
      where: {Block: {Date: {since: "2024-07-01"}},
        any: [{Trade: {Buy: {Currency: {SmartContract: {is: "0xcac007926755e2675e201223f7d4d68c74fd3439"}}}}}, {Trade: {Sell: {Currency: {SmartContract: {is: "0xcac007926755e2675e201223f7d4d68c74fd3439"}}}}}]}
    ) {
      Trade {
        Dex {
          SmartContract
          ProtocolName
          ProtocolVersion
        }
        Buy {
          Amount
          AmountInUSD
          Buyer
          Currency {
            Name
            Symbol
            SmartContract
          }
          Seller
          Price
          PriceInUSD
        }
        Sell {
          Amount
          AmountInUSD
          Buyer
          Currency {
            Name
            Symbol
            SmartContract
          }
          Seller
          Price
          PriceInUSD
        }
      }
    }
  }
}
```