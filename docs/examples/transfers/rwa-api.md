# RWA (Real World Assets) API

In this section, we will explore some of the APIs that help us obtain information about Real World Assets (RWAs) on Ethereum, Arbitrum, and other EVM chains.

These APIs can be executed on any EVM chain simply by changing the `network: eth` parameter to the appropriate chain and using the correct address.

We have written about analysing RWA data in the blog [here](https://bitquery.io/blog/real-world-asset-tracking-arbitrum-bitquery-apis) and how it has influenced tokenized real-estate [here](https://bitquery.io/blog/tokenized-real-estate-transforming-property-investment).

## Top Holders of an RWA

You can view and execute the query for the top holders of an RWA using the following examples:

- [Top holder stats for Mountain's USDM](https://ide.bitquery.io/top-holder-stats-for-Mountains-USDM)
- [Top holder stats for Backed Finance’s blB01](https://ide.bitquery.io/top-holder-stats-for-Backed-Finances-blB01)

```graphql
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      date: "2025-04-22"
      tokenSmartContract: "0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C"
      limit: { count: 10 }
      orderBy: { descending: Balance_Amount }
    ) {
      BalanceUpdate {
        transactions: Count
      }
      Holder {
        Address
      }
      Balance {
        Amount
      }
    }
  }
}
```

This query retrieves the top 10 holders of the specified token contract, ranked by their balance amount.

## Real-time Transfers of RWAs on Arbitrum

You can monitor real-time transfers of RWAs using the stream link below:

[Real-time Transfers of Xend Real World Asset Token](https://ide.bitquery.io/Subscribe-to-Latest-Xend-Real-World-Asset-token-transfers)

```graphql
subscription {
  EVM(network: arbitrum) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0x3096e7BFd0878Cc65be71f8899Bc4CFB57187Ba3" }
          }
        }
      }
    ) {
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Currency {
          Name
          Symbol
        }
        Receiver
        Sender
        Type
      }
    }
  }
}
```

This subscription continuously monitors and provides real-time updates on token transfers for the specified token contract.

## Latest Issuance of an RWA

This query filters for recent `Issue` events on Ethereum and displays logs emitted by the fund’s smart contract (`0x7712c34205737192402172409a8F7ccef8aA2AEc`) and extracts structured event data.

You can use the same as a `subscription` to monitor issuances in real-time.
You can run the query [here](https://ide.bitquery.io/BlackRock-USD-Institutional-Digital-Liquidity-Fund-Latest-Issuance)

```
{
  EVM(dataset: realtime, network: eth) {
    Events(
      limit: {count: 20}
      where: {LogHeader:{Address:{is:"0x7712c34205737192402172409a8F7ccef8aA2AEc"}}, Log:{
        Signature:{Name:{is:"Issue"}}
      }}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Receipt {
        ContractAddress
      }
      Topics {
        Hash
      }
      TransactionStatus {
        Success
      }
      LogHeader {
        Address
        Index
        Data
      }
      Transaction {
        Hash
        From
        To
        Index
      }
      Log {
        EnterIndex
        ExitIndex
        Index
        LogAfterCallIndex
        Pc
        SmartContract
        Signature {
          Name
          Signature
        }
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
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
      Call {
        Signature {
          Name
        }
      }
    }
  }
}

```
