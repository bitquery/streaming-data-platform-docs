---
title: "EVM Smart Contract Calls API"
---

<head>
<meta name="title" content="EVM Smart Contract Calls API"/>

<meta name="description" content="Explore Ethereum smart contract call data. Analyze smart contract calls with detailed information."/>

<meta name="keywords" content="Ethereum, smart contract, Ethereum smart contracts, blockchain transactions, blockchain analysis, smart contract calls, DApps, cryptocurrency, token transfers, crypto transactions, Ethereum transactions, blockchain analytics, Ethereum data"/>

<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />

<meta property="og:title" content="EVM Smart Contract Calls API" />

<meta property="og:description" content="Explore Ethereum smart contract call data. Analyze smart contract calls with detailed information."/>

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />

<meta property="twitter:title" content="EVM Smart Contract Calls API" />

<meta property="twitter:description" content="Explore Ethereum smart contract call data. Analyze smart contract calls with detailed information." />
</head>

Calls API provides details about smart contract calls, arguments, callers, etc.

This api gives detailed information about the smart contract calls, including raw data, and supports [Opcodes](https://github.com/crytic/evm-opcodes).

The API allows different filters to query the Smart contract calls details from different dimensions.
You can find more examples [here](/docs/examples/calls/smartcontract)

Here's a sample query to get started.

```graphql
{
  EVM(dataset: combined, network: eth) {
    Calls(
      limit: { count: 1 }
      where: {
        Call: {
          Signature: { Name: { is: "swap" } }
          From: { is: "0x000000000000084e91743124a982076c59f10084" }
        }
      }
    ) {
      Call {
        From
        To
        CallPath
        CallerIndex
        Create
        Delegated
        Depth
        EnterIndex
        Error
        ExitIndex
        Gas
        GasUsed
        Index
        Input
        InternalCalls
        LogCount
        Opcode {
          Code
          Name
        }
        Output
        Reverted
        SelfDestruct
        Signature {
          Abi
          Name
          Parsed
          Signature
          SignatureHash
          SignatureType
        }
        Success
      }
      Arguments {
        Type {
          Name
          Type
        }
        Value {
          String
        }
      }
    }
  }
}
```

Calls contain the arguments and return values as arrays, refer to [arguments](/docs/evm/arguments) for data structure.


# New tokens created on EVM chain

To get new token created on EVM chains such as Etheruem or BSC, please use [this query](https://ide.bitquery.io/Newly-Created-Tokens-on-BSC-network_4).
Change the network according to your requirements.

```graphql
{
  EVM(network: bsc) {
    Calls(
      orderBy: {descending: Block_Time}
      limit: {count: 10}
      where: {Call: {Create: true}, Arguments: {length: {ne: 0}}, Receipt: {ContractAddress: {not: "0x0000000000000000000000000000000000000000"}}, TransactionStatus: {Success: true}}
    ) {
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
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
      }
      Transaction {
        Hash
      }
      Receipt {
        ContractAddress
      }
      Block {
        Time
      }
    }
  }
}
````

