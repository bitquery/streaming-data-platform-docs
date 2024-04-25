---
sidebar_position: 4
---

# Arbitrum Smart Contract Events

In this section we will see how to get Arbitrum Smart Contract Events information using our API.

This Arbitrum API is part of our Early Access Program (EAP), which is intended for evaluation purposes.

This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

<head>
<meta name="title" content="Arbitrum Smart Contract Events & logs API"/>

<meta name="description" content="Get Arbitrum Smart Contract Event data using Events API. Explore events in-depth using detailed information of events."/>

<meta name="keywords" content="Arbitrum, Smart contract events, USDT contract, Arbitrum event monitoring, Event signature, event timestamp, event tracking, Contract signature, Arbitrum event"/>

<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />

<meta property="og:title" content="Arbitrum Smart Contract Events & logs API" />

<meta property="og:description" content="Get Arbitrum Smart Contract Event data using Events API. Explore events in-depth using detailed information of events."/>

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />

<meta property="twitter:title" content="Arbitrum Smart Contract Events & logs API" />

<meta property="twitter:description" content="Get Arbitrum Smart Contract Event data using Events API. Explore events in-depth using detailed information of events." />
</head>

## Tracking Swap Events on Arbitrum

The query returns the 10 most recent `swap` events on the Arbitrum network. We get this by using the signature hash `c42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67` for the swap event.

You can find the query [here](https://ide.bitquery.io/Swap-Events-Arbitrum)

```

query ($network: evm_network, $limit: Int, $method: String) {
  EVM(dataset: archive, network: $network) {
    Events(
      where: {Log: {Signature: {SignatureHash: {is: $method}}}}
      limit: {count: $limit}
      orderBy: {descending: Block_Time}
    ) {
      ChainId
      Transaction {
        Hash
      }
      Log {
        Signature {
          Name
        }
      }
      Fee {
        SenderFee
      }
      Block {
        Time
        Number
      }
    }
  }
}
{
  "limit": 10,
  "network": "arbitrum",
  "method": "c42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67"
}
```

The `Log` field in each event contains the following information:

- `Signature`: The signature of the event.
- `Name`: The name of the event.

The `Transaction` field in each event contains the following information:

- `Hash`: The hash of the transaction that emitted the event.

The `Fee` field in each event contains the following information:

- `SenderFee`: The fee paid by the sender of the transaction.

The `Block` field in each event contains the following information:

- `Time`: The time at which the block was mined.
- `Number`: The block number.
