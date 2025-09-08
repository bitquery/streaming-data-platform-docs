---
sidebar_position: 7
---

# Base Jump API

In this section we will see how we can use the [Transaction](https://docs.bitquery.io/docs/cubes/transaction-cube/) 
and [Calls](https://docs.bitquery.io/docs/graphql-reference/enums/evm-call-compare-fields/) API from Bitquery to get info about trades on Base Jump using one of the token address traded on the platform. For this section the token address is the following - `0xEfC79f30b56f36bc49Bf47e8Dccf969fFF214EeD`.

## Get Base Jump Address

Firstly, we can find the smart contract address of the Base Jump using [this](https://ide.bitquery.io/base-jump-token-event) query.

``` graphql

query MyQuery {
  EVM(network: base) {
    Events(
      where: {Arguments: {includes: {Value: {Address: {is: "0xEfC79f30b56f36bc49Bf47e8Dccf969fFF214EeD"}}}}}
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
        To
      }
      count
    }
  }
}

```
The address labeled as `To` under the `Transaction` block is the smart contract address of Base Jump. The Base Jump address is - `0x31C0282Fa6D0A82aD22ab63BbaCd87F62B2a9bfD`.

## Get All the Methods for Base Jump

We need to get all methods for the Base Jump for better understanding of its functionality and get the `signatures` used for buying tokens.
[This](https://ide.bitquery.io/methods-for-base-jump#) query returns all the methods associated with the Base Jump.

``` graphql

query MyQuery {
  EVM(network: base) {
    Calls(
      where: {Transaction: {To: {is: "0x31C0282Fa6D0A82aD22ab63BbaCd87F62B2a9bfD"}}}
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
From the results we get a signature named `swap` that will be analysed to get the trades on Base Jump.

## Get Trades for Base Jump

[This](https://ide.bitquery.io/base-jump-buys#) query returns the `swap` method Calls to the Base Jump that are potentially the trades on the Base Jump.

``` graphql

query MyQuery {
  EVM(network: base) {
    Calls(
      where: {Transaction: {To: {is: "0x31C0282Fa6D0A82aD22ab63BbaCd87F62B2a9bfD"}}, Call: {Signature: {Name: {is: "swap"}}}}
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
