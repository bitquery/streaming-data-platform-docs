---
title: "EVM Smart Contract Events & logs API"
---

<head>
<meta name="title" content="EVM Smart Contract Events & logs API"/>

<meta name="description" content="Get Ethereum Smart Contract Event data using Events API. Explore events in-depth using detailed information of events."/>

<meta name="keywords" content="Ethereum, Smart contract events, USDT contract, Ethereum event monitoring, Event signature, event timestamp, event tracking, Contract signature, Ethereum event"/>

<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />

<meta property="og:title" content="EVM Smart Contract Events & logs API" />

<meta property="og:description" content="Get Ethereum Smart Contract Event data using Events API. Explore events in-depth using detailed information of events."/>

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />

<meta property="twitter:title" content="EVM Smart Contract Events & logs API" />

<meta property="twitter:description" content="Get Ethereum Smart Contract Event data using Events API. Explore events in-depth using detailed information of events." />
</head>

Smart contract events and logs are an important feature of Ethereum smart contracts that allow developers to track and record specific actions or data on the blockchain.
You can retrieve data on blockchain calls and logs from the blockchain network. You can find more examples [here](/docs/examples/events/events_api)

```graphql
query MyQuery {
  EVM(dataset: combined, network: bsc) {
    Events(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: { Block: { Date: { is: "2023-03-06" } } }
    ) {
      Call {
        CallPath
        From
        GasUsed
        To
        Signature {
          Name
          Signature
        }
      }
      Log {
        EnterIndex
        ExitIndex
        Index
        LogAfterCallIndex
        SmartContract
        Signature {
          Name
          Signature
        }
      }
    }
  }
}
```

The query includes the Call and Log objects, which are parts of the events. The Call object contains information about the function calls made in the event, including the path, sender address, gas used, receiver address, and the name and signature of the function. The Log object contains information about the event logs, including the enter and exit indexes, log index, log after call index, the smart contract address, and the name and signature of the event.

Events contain the arguments as array, refer to [arguments](/docs/evm/arguments)
