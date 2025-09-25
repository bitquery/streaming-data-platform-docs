---
sidebar_position: 2
---

# SmartContract Calls API

<head>
<meta name="title" content="Ethereum Smart Contract Calls API | Get Contract Function Data"/>
<meta name="description" content="Retrieve detailed information about smart contract transactions, function calls, input/output parameters, and contract interactions on Ethereum using our comprehensive API."/>
<meta name="keywords" content="ethereum smart contract api, smart contract calls api, ethereum contract function api, smart contract analytics api, ethereum transaction api, contract interaction api, ethereum web3 api, smart contract monitoring api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:title" content="Ethereum Smart Contract Calls API | Get Contract Function Data" />
<meta property="og:description" content="Retrieve detailed information about smart contract transactions, function calls, input/output parameters, and contract interactions on Ethereum using our comprehensive API." />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Ethereum Smart Contract Calls API | Get Contract Function Data" />
<meta property="twitter:description" content="Retrieve detailed information about smart contract transactions, function calls, input/output parameters, and contract interactions on Ethereum using our comprehensive API." />
</head>

## Frequently Asked Questions (FAQ)

### What is the Smart Contract Calls API?

The Smart Contract Calls API helps you retrieve comprehensive information about smart contract transactions on Ethereum, including details about the contract function that was called, input and output parameters, gas usage, and more. This data enables you to build applications that interact with smart contracts, perform analytics on contract activity, and monitor contract interactions in real-time.

### What data can I get from the Smart Contract Calls API?

The API provides data for:
- **Function Calls**: Details about which contract functions were called and their parameters
- **Transaction Information**: Gas usage, transaction hash, sender/receiver addresses, and transaction status
- **Contract Creation**: Track new contract deployments with creation details
- **Internal Calls**: Monitor internal function calls within smart contracts


### How do I use Bitquery's Ethereum APIs?

Bitquery provides GraphQL APIs for Ethereum data. You can test queries using the IDE at ide.bitquery.io or convert queries to subscriptions for real-time data via WebSocket connections. To access API outside the IDE, you need to use your OAuth token, generate one [here](https://account.bitquery.io/user/api_v2/access_tokens). For enterprise users, we also offer Kafka streams for high-throughput data processing.

### What Kafka streams are available for Ethereum?

Bitquery provides managed Kafka topics including `ethereum.tokens.proto`, `ethereum.transactions.proto`, and `ethereum.dextrades.proto` with pre-parsed, enriched Protocol-Buffers events. These streams offer sub-second latency and enterprise-grade reliability for high-volume data processing. Read more [here](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/).

## Smart Contract Calls API Guide

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

