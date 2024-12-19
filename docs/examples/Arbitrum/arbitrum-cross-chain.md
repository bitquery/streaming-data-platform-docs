---
sidebar_position: 7
---

# Arbitrum Cross Chain API

## Overview

Explore the integration of the **Arbitrum Cross Chain API** to track bridge transfers, interact with smart contracts, and fetch detailed transaction data.  
For detailed reference, visit the [official Arbitrum documentation](https://docs.arbitrum.io/build-decentralized-apps/token-bridging/token-bridge-erc20).

Additional information about migrating to the latest version of Across Protocol is available [here](https://docs.across.to/developer-docs/developers/migration-from-v2-to-v3#events).

## Tracking Across Bridge Transfers Using SpokePool Events

SpokePool events in Across Protocol can be used to monitor the status of bridge transfers effectively. Below are queries that retrieve the latest deposits and transfers related to the Arbitrum SpokePool.

### Latest Deposits on Across Protocol Bridge SpokePool

Query the latest deposits made on the Across Protocol Bridge SpokePool. Fetch the most recent deposits and associated details using `V3FundsDeposited` events.

- **Query link**: [Run this query](https://ide.bitquery.io/Latest-deposits-on-Across-Bridge)

```graphql
{
  EVM(network: arbitrum) {
    Events(
      where: {
        Log: {
          SmartContract: { is: "0xe35e9842fceaca96570b734083f4a58e8f7c5f2a" }
          Signature: { Name: { is: "V3FundsDeposited" } }
        }
      }
      orderBy: { descending: Block_Time }
    ) {
      Log {
        SmartContract
        Signature {
          Name
        }
      }
      Transaction {
        From
        To
      }
      Block {
        Time
        ParentHash
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
    }
  }
}
```

---

### Latest Transfers to Arbitrum SpokePool

Retrieve the latest transfers directed to the Arbitrum SpokePool.Get information on transfers to the SpokePool, such as sender, receiver, currency, and block details.

- **Query link**: [Run this query](https://ide.bitquery.io/Across-Protocol-Arbitrum-Transfers)

```graphql
{
  EVM(dataset: combined, network: arbitrum) {
    Transfers(
      where: {
        Transaction: {
          To: { is: "0xe35e9842fceaca96570b734083f4a58e8f7c5f2a" }
        }
        Block: { Date: { is: "2024-12-12" } }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Number }
    ) {
      Transfer {
        Amount
        Currency {
          Name
          Symbol
          SmartContract
        }
        Sender
        Receiver
      }
      Call {
        Signature {
          Name
        }
        From
        To
        Value
        CallPath
      }
      Block {
        Number
        Time
      }
    }
  }
}
```
