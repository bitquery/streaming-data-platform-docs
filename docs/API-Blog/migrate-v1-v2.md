---
sidebar_position: 3
---

# Migrating from API v1 to v2

## Overview

V2 APIs are designed to provide  [real-time blockchain data without any delay](https://bitquery.io/blog/analysis-of-blockchain-availabilitybased-on-block-lag).

It combines both real-time and historical data. Below, you'll find key changes and instructions on how to adapt your existing v1 queries to the v2 format.


## Changes in Network Specification

### EVM Chains

- **v1:** Specified using a generic identifier within a function, e.g., `ethereum(network: ethereum)`.
- **v2:** Now requires a more specific `network` identifier and inclusion of a `dataset`. Example: `EVM(network: eth, dataset: combined)`.

**Example Conversion:**

- **v1 Query:**
  ```graphql
  query MyQuery {
    ethereum(network: ethereum) {
      blocks {
        count
      }
    }
  }
  ```

- **v2 Query:**
  ```graphql
  query {
    EVM(network: eth, dataset: combined) {
      Blocks {
        count
      }
    }
  }
  ```

## Schema and Data Access

The v2 API maintains a similar schema structure but integrates new data cubes such as `balanceUpdates`, `tokenHolders`, and `DexTradeByTokens`. The ability to click-select in the schema builder is still available in v2, facilitating easier transition and query building.

## Smart Contract Interactions

- **v1:** Accessed through `smartContractCalls` and `smartContractEvents`.
- **v2:** Simplified to `Calls` and `Events`.

## Handling Arguments and Values

One of the major differences in v2 is how arguments and their values are handled and accessed.

- **v1:** Arguments and values are accessed using filters based on the argument name.
  ```graphql
  token0: any(of: argument_value, argument: { is: "token0" })
  ```

- **v2:** Arguments are explicitly defined by data type, providing more structured access and clearer query definitions.
  ```graphql
  Arguments {
    Name
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
  ```

