---
sidebar_position: 7
---

# APE Store API

In this section we will see how we can use the [Transaction](https://docs.bitquery.io/docs/cubes/transaction-cube/) 
and [Calls](https://docs.bitquery.io/docs/graphql-reference/enums/evm-call-compare-fields/) API from Bitquery to get info about trades on APE Store using one of the token address traded on the platform. For this section the token address is the following - `0xb2779752b8abe50e2a06bddd774bf0a40353f867`.

## Get APE Store Address

Firstly, we can find the smart contract address of the APE Store using [this](https://ide.bitquery.io/ape-store-token-event_1#) query.

``` graphql

query MyQuery {
  EVM(network: base) {
    Events(
      where: {Arguments: {includes: {Value: {Address: {is: "0xb2779752b8abe50e2a06bddd774bf0a40353f867"}}}}}
    ) {
      Arguments {
        Name
        Type
        Value {
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
      Transaction {
        From
        Hash
        To
      }
      count
    }
  }
}

```
The address labeled as `To` under the `Transaction` block is the smart contract address of APE Store. The APE Store address is - `0x0bf8edd756ff6caf3f583d67a9fd8b237e40f58a`.

## Get All the Methods for APE Store

We need to get all methods for the APE Store for better understanding of its functionality and get the `signatures` used for buying tokens.
[This](https://ide.bitquery.io/methods-for-ape-store#) query returns all the methods associated with the APE Store.

``` graphql

query MyQuery {
  EVM(network: base) {
    Calls(
      where: {Transaction: {To: {is: "0x0bf8edd756ff6caf3f583d67a9fd8b237e40f58a"}}}
      orderBy: {descendingByField: "count"}
    ) {
      Call {
        Signature {
          Name
          Signature
        }
      }
      count
    }
  }
}
```
From the results we get a signature named `buy` that will be analysed to get the trades on APE Store.

## Get Trades for APE Store

[This](https://ide.bitquery.io/ape-store-buys_1#) query returns the `buy` method Calls to the APE Store that are potentially the trades on the APE Store.

``` graphql

query MyQuery {
  EVM(network: base) {
    Calls(
      where: {Transaction: {To: {is: "0x0bf8edd756ff6caf3f583d67a9fd8b237e40f58a"}}, Call: {Signature: {Name: {is: "buy"}}}}
    ) {
      Arguments {
        Name
        Type
        Value {
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
      Transaction {
        Cost
        From
        Hash
        Time
        GasPrice
      }
    }
  }
}

```

## Get Trades of a Trader

[This](https://ide.bitquery.io/ape-store-buys-from-a-wallet) query returns the trades by a particular trader on APE Store. In this example the trader wallet address is - `0x2870cbffae4cf005dd1c3587e2f0db3cb00dbafd`.

``` graphql

query MyQuery {
  EVM(network: base) {
    Calls(
      where: {Transaction: {To: {is: "0x0bf8edd756ff6caf3f583d67a9fd8b237e40f58a"}, From: {is: "0x2870cbffae4cf005dd1c3587e2f0db3cb00dbafd"}}, Call: {Signature: {Name: {is: "buy"}}}}
    ) {
      Arguments {
        Name
        Type
        Value {
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
      Transaction {
        Cost
        From
        Hash
        Time
        GasPrice
      }
    }
  }
}
```

## Get Trades of a Token

[This](https://ide.bitquery.io/ape-store-token-trades) query returns the trades of a token on APE Store. In this example the token is - `0x442a62e390e16cec26998dd965c606efbd06b8ed`.

``` graphql

query MyQuery {
  EVM(network: base) {
    Calls(
      where: {Transaction: {To: {is: "0x0bf8edd756ff6caf3f583d67a9fd8b237e40f58a"}}, Call: {Signature: {Name: {is: "buy"}}}, Arguments: {includes: {Value: {Address: {is: "0x442a62e390e16cec26998dd965c606efbd06b8ed"}}}}}
    ) {
      Arguments {
        Name
        Type
        Value {
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
      Transaction {
        Cost
        From
        Hash
        Time
        GasPrice
      }
    }
  }
}
```
