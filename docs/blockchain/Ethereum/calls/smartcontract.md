---
sidebar_position: 2
title: "SmartContract Calls API"
description: "SmartContract Calls API: query and stream Ethereum on-chain data with Bitquery GraphQL examples for developers. Scale further with Kafka or gRPC streams."
---
import FAQ from "@site/src/components/FAQ";

# SmartContract Calls API

<FAQ
  items={[
    { q: "What is the Smart Contract Calls API?", a: "Query which functions were called on Ethereum contracts, with decoded inputs, gas usage, internal calls, and transaction context." },
    { q: "When should I use Calls vs Events vs Transfers?", a: "Use Calls for function execution traces. Use Events for emitted logs. Use Transfers for token movements. See the Mental Model guide linked on this page." },
    { q: "Can I track new contract deployments?", a: "Yes. Filter EVM.Calls with Call.Create true to list recent contract creation calls." },
    { q: "Can I stream contract calls in real time?", a: "Yes. Convert your query to a GraphQL subscription or use Kafka ethereum.transactions.proto for high-volume monitoring." },
  ]}
/>

## Smart Contract Calls API Guide

> **Before you start**: Not sure when to use Calls vs Transfers vs Events vs DexTrades? Read our [Mental Model guide](/docs/start/mental-model-transfers-events-calls) to understand which primitive to use for your use case.

This API helps retrieve information about smart contract transactions, including details about the contract function that was called, the input and output parameters, and more. With this data, you can build applications that interact with smart contracts, perform analytics on contract activity, and more.

## Recent Smart Contract Calls

This query retrieves the most recent smart contract calls on the Ethereum network, focusing on contract creation calls. It provides comprehensive information about the call details, transaction data, and block information.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  EVM(dataset: realtime, network: eth) {
    Calls(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
    ) {
      Call {
        LogCount
        InternalCalls
        Create
        EnterIndex
        ExitIndex
      }
      Transaction {
        Gas
        Hash
        From
        To
        Type
        Index
      }
      Block {
        Date
      }
    }
  }
}
```

</details>

## Recent Smart Contract Creation Calls

This GraphQL query fetches data from the "eth" network about the 10 most recent calls made in Ethereum that were contract creation calls.

You can run the query [here](https://ide.bitquery.io/smart-contract-creation-on-EVM-chains)

```
query MyQuery {
  EVM(dataset: realtime, network: eth) {
    Calls(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Call: {Create: true}}
    ) {
      Call {
        LogCount
        InternalCalls
        Create
        EnterIndex
        ExitIndex
      }
      Transaction {
        Gas
        Hash
        From
        To
        Type
        Index
      }
      Block {
        Date
      }
    }
  }
}

```

