---
title: "BSC Mempool Stream - Real-Time Transaction Monitoring"
description: "Monitor BSC mempool in real-time. Track pending transactions, DEX trades, token creations, and more with ultra-low latency using Bitquery Mempool APIs and Kafka Streams."
---

# BSC Mempool Stream - Real-Time Transaction Monitoring

Monitor BSC (BNB Smart Chain) mempool transactions in real-time before they are confirmed on-chain. Track pending DEX trades, token creations, transfers, and detect opportunities early with Bitquery's Mempool APIs and Streams.

Any Bitquery GraphQL stream can be converted to a mempool monitoring stream by setting `mempool: true`.

We also provide low-latency Kafka streams to monitor broadcasted data, which are much faster than GraphQL mempool streams.
Read more about Kafka streams [here](https://docs.bitquery.io/docs/streams/protobuf/chains/EVM-protobuf/).

:::note
To query or stream data via GraphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
:::

<head>
<title>BSC Mempool Stream - Real-Time Transaction Monitoring | Bitquery</title>
<meta
  name="title"
  content="BSC Mempool Stream - Real-Time Transaction Monitoring"
/>
<meta
  name="description"
  content="Monitor BSC mempool in real-time. Track pending transactions, DEX trades, token creations, and more with ultra-low latency using Bitquery Mempool APIs and Kafka Streams."
/>
<meta
  name="keywords"
  content="BSC mempool,BNB chain mempool,BSC pending transactions,BSC mempool API,BSC mempool stream,Four Meme mempool,BSC DEX trades mempool,real-time BSC,BSC transaction monitoring,BNB chain API,blockchain mempool,crypto mempool,mempool monitoring,BSC websocket"
/>
<meta name="robots" content="index, follow" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="language" content="English" />

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="BSC Mempool Stream - Real-Time Transaction Monitoring"
/>
<meta
  property="og:description"
  content="Monitor BSC mempool in real-time. Track pending transactions, DEX trades, token creations before confirmation."
/>

<meta property="twitter:card" content="summary_large_image"/>
<meta property="twitter:title" content="BSC Mempool Stream - Real-Time Transaction Monitoring"/>
<meta property="twitter:description" content="Monitor BSC mempool in real-time. Track pending transactions, DEX trades, token creations before confirmation."/>
</head>

---

## Table of Contents

### 1. [How Mempool Simulation Works](#how-do-we-simulate-txs-for-bitquery-mempool-apis--streams)

### 2. Mempool Streaming Examples

- [Stream Four Meme Trades in Mempool ➤](#stream-four-meme-trades-in-mempool---detect-them-early)
- [Stream Four Meme Token Creation in Mempool ➤](#stream-four-meme-token-creation-in-mempool---detect-them-first)
- [Stream All Transactions in Mempool ➤](#streaming-transactions-in-mempool-on-bsc)
- [Stream DEX Trades in Mempool ➤](#streaming-trades-in-mempool-on-bsc)

---

## How do we simulate txs for Bitquery Mempool APIs & Streams?

When a transaction is received by the node but not yet included in a block, Bitquery uses the following context to send mempool data:

- The transaction is executed in the EVM (using the current pending block context).

- The system captures the simulated receipt and trace.

For each batch of simulated transactions, Bitquery records the block header used as the execution context.

```
message BroadcastedTransactionsMessage {
  Chain Chain = 1;
  BlockHeader Header = 2;
  repeated Transaction Transactions = 3;
}
```

## Mempool Streaming Examples

### Stream Four Meme Trades in Mempool - Detect Them Early

Monitor Four Meme DEX trades in real-time as they appear in the mempool, before they are confirmed on-chain. This allows you to detect trading opportunities early and front-run or back-run trades.

[Run Stream ➤](https://ide.bitquery.io/Four-Meme-mempool-trades)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  EVM(network: bsc, mempool: true) {
    DEXTrades(where: {Trade: {Dex: {ProtocolName: {is: "fourmeme_v1"}}}}) {
      Trade {
        Buy {
          Buyer
          Currency {
            Name
            Symbol
            SmartContract
          }
          Amount
        }
        Sell {
          Seller
          Currency {
            Name
            Symbol
            SmartContract
          }
          Amount
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

</details>


### Stream Four Meme Token Creation in Mempool - Detect Them First

Track new Four Meme token creations in the mempool instantly. Be the first to know when a new token is being created, before it's confirmed on-chain.

[Run Stream ➤](https://ide.bitquery.io/track-Four-meme-token-creation-in-mempool)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  EVM(network: bsc, mempool: true) {
    Events(
      where: {Transaction: {To: {is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b"}}, Log: {Signature: {Name: {is: "TokenCreate"}}}}
    ) {
      Log {
        Signature {
          Name
          Signature
        }
      }
      Arguments {
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
        }
        Name
        Type
      }
      Transaction {
        Hash
        To
        From
      }
    }
  }
}
```

</details>

### Streaming Transactions in Mempool on BSC

Monitor all pending transactions and transfers on BSC in real-time. Track transaction details including sender, receiver, gas, amounts, and token information before blocks are mined.

[Run Stream ➤](https://ide.bitquery.io/bsc-mempool-txs)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  EVM(mempool: true, network: bsc) {
    Transfers {
      Log {
        Index
      }
      Transaction {
        Time
        Type
        To
        Gas
        From
        Cost
        Hash
      }
      Transfer {
        Amount
        Currency {
          Name
        }
        Type
      }
      TransactionStatus {
        Success
        FaultError
        EndError
      }
      Block {
        Time
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

</details>

### Streaming Trades in Mempool on BSC

Stream all DEX trades happening in the BSC mempool in real-time. Monitor buy/sell activity, prices, volumes, and trading pairs across all DEXs before transactions are confirmed.

[Run Stream ➤](https://ide.bitquery.io/monitor-mempool-trades-bsc)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  EVM(mempool: true, network: bsc) {
    DEXTradeByTokens {
      Block {
        Number
      }
      Transaction {
        Hash
      }
      Trade {
        Price
        PriceInUSD
        Currency {
          Name
        }
        Amount
        Buyer
        Dex {
          ProtocolName
        }
        Side {
          Seller
          Buyer
          AmountInUSD
          Amount
          Currency {
            Name
            Symbol
          }
        }
      }
    }
  }
}
```

</details>

---

## Related Resources

You may also be interested in:

- [Four Meme API Documentation ➤](https://docs.bitquery.io/docs/blockchain/BSC/four-meme-api/)
- [BSC DEX Trades API ➤](https://docs.bitquery.io/docs/evm/dextrades/)
- [Kafka Protobuf Streams for EVM ➤](https://docs.bitquery.io/docs/streams/protobuf/chains/EVM-protobuf/)
- [WebSocket Subscriptions ➤](https://docs.bitquery.io/docs/authorisation/websocket/)

## Need Help?

If you have any questions or need assistance with BSC mempool streams, reach out to our [Telegram support](https://t.me/Bloxy_info).
