---
sidebar_position: 7
---

# Base Clanker API

This section provides you with a set of queries that provides an insight about the Clank fun.
Clank.fun is a platform on the Base blockchain that allows users to launch and trade meme coins. Each coin is deployed as an ERC-20 token on Uniswap V3 with permanently locked single-sided liquidity of 1,000,000,000 coin. To launch a token, users must hold at least 1,000,000 $CLANKFUN tokens. Token creators earn 0.4% of the trading volume in liquidity provider (LP) fees, which can be claimed anytime on clanker.world.

You can see [Uniswap guide](https://docs.bitquery.io/docs/examples/Base/base-uniswap-api/) to get latest trades of these tokens, top traders, OHLCV, get token metadata, top bought tokens, top sold tokens, etc.

## Latest Tokens created using Clanker

Below query will get you latest tokens created using Clank.fun. The query respose will contain `name`, `symbol`, `tokenAddress`, `deployer`, `supply`, `fid` and `positionId` of the created token. Try out the API in the Bitquery IDE playground [here](https://ide.bitquery.io/Latest-token-created-on-Clanker-on-Base).

```graphql
{
  EVM(network: base) {
    Events(
      limit: { count: 10 }
      orderBy: [{ descending: Block_Time }, { descending: Transaction_Index }]
      where: {
        Log: { Signature: { Name: { is: "TokenCreated" } } }
        LogHeader: {
          Address: { is: "0x375C15db32D28cEcdcAB5C03Ab889bf15cbD2c5E" }
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        From
        Hash
      }
      Arguments {
        Name
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
      Log {
        Signature {
          Name
        }
      }
    }
  }
}
```

## Latest Token created by specific user using Clanker

Below query will get you latest tokens created by a particular address using Clank.fun. The query respose will contain `name`, `symbol`, `tokenAddress`, `deployer`, `supply`, `fid` and `positionId` of the created token. Try out the API in the Bitquery IDE playground [here](https://ide.bitquery.io/Latest-token-created-on-Clanker-on-Base-by-specific-user).

```graphql
{
  EVM(network: base) {
    Events(
      limit: { count: 10 }
      orderBy: [{ descending: Block_Time }, { descending: Transaction_Index }]
      where: {
        Transaction: {
          From: { is: "0x002f07b0d63e8ac14f8ef6b73ccd8caf1fef074c" }
        }
        Log: { Signature: { Name: { is: "TokenCreated" } } }
        LogHeader: {
          Address: { is: "0x375C15db32D28cEcdcAB5C03Ab889bf15cbD2c5E" }
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        From
        Hash
      }
      Arguments {
        Name
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
      Log {
        Signature {
          Name
        }
      }
    }
  }
}
```
