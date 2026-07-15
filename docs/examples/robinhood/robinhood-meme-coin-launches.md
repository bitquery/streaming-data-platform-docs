---
title: "Robinhood Meme Coin Launches API"
description: "Track meme coin token launches on Robinhood with Bitquery. Detect new token creations from Flap.sh, Klik Finance, Bankr, Ape.store, Bags.fm, and Clanker."
sidebar_position: 3
keywords:
  - Robinhood meme coin launches API
  - Robinhood token launch API
  - Robinhood new token created
  - Flap.sh Robinhood API
  - Flap.sh TokenCreated event
  - Klik Finance Robinhood launches
  - Bankr Bot Robinhood token creation
  - Ape.store Robinhood meme coins
  - Bags.fm Robinhood token launches
  - Clanker Robinhood launches API
  - Robinhood launchpad API
  - meme coin token creation Robinhood
  - Bitquery Robinhood Events API
  - Bitquery Robinhood Transfers API
---

# Robinhood Meme Coin Launches API

Track **meme coin token launches on Robinhood** with Bitquery GraphQL APIs. This guide shows how to detect newly created tokens from popular Robinhood launchpads and bots — **Flap.sh**, **Klik Finance**, **Bankr Bot**, **Ape.store**, **Bags.fm**, and **Clanker** — using `EVM(network: robinhood)` Events and Transfers cubes.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorisation/how-to-generate/)
:::

:::tip Related docs
- [Robinhood Trades API](/docs/examples/robinhood/robinhood-trades)
- [Robinhood Transfers](/docs/examples/robinhood/robinhood-transfers)
- [WebSocket subscriptions](/docs/subscriptions/websockets/)
:::

:::tip Stream the same query
For each launch query below, open the matching **WebSocket** IDE link to run it as a real-time GraphQL subscription over WebSocket. You can also convert a query to a stream in the IDE by changing the operation type to `subscription`.
:::

---

## How token launches are detected

Most Robinhood meme launch contracts mint tokens in a create transaction. You can detect those launches in two ways:

| Method | Cube | Pattern |
| --- | --- | --- |
| **Events** | `EVM.Events` | Filter `LogHeader.Address` to the launch contract; for Flap.sh, also filter `Log.Signature.Name: TokenCreated` |
| **Transfers** | `EVM.Transfers` | Mint from the zero address (`0x000…000`) to a receiver, with `Transaction.To` equal to the launch contract and a fixed launch mint `Amount` |

Zero-address sender (`0x0000000000000000000000000000000000000000`) marks a mint. Pairing that with the launchpad contract as `Transaction.To` scopes results to that protocol’s creations.

The fixed `Amount` in each transfer query is the **full initial token supply minted at launch** — `1000000000` (1 billion) for most launchpads and `100000000000` (100 billion) for Clanker. Filtering on this value isolates the launch mint from ordinary transfers, so adjust it if a protocol uses a different launch supply.

:::note Amounts are decimal-normalized
Bitquery's `Transfer.Amount` is already adjusted for the token's `Decimals`, so `1000000000` means 1 billion whole tokens — not the raw on-chain integer you'd see on a block explorer. Compare against the normalized value, not the raw one.
:::

Flap.sh emits a decoded `TokenCreated` event, so it can be tracked via **Events** (richer, with decoded arguments) as well as transfers. The other launchpads and bots on this page are tracked via the **mint-transfer** pattern.

---

## Launchpad and bot contract map

Every transfer query on this page is **identical except two values**: the launchpad address in `Transaction.To` and the launch-mint `Amount`. To track a different launchpad, copy any transfer query below and swap in the address (and, for Clanker, the amount) from this table.

| Protocol | Contract → `Transaction.To` | Mint `Amount` | Queries |
| --- | --- | --- | --- |
| **Flap.sh** | `0x26605f322f7ff986f381bb9a6e3f5dab0beaeb09` | `1000000000` | [Events](https://ide.bitquery.io/All-events-from-Flapsh) · [TokenCreated](https://ide.bitquery.io/Flap-sh-Newly-created-tokens-using-logs-TokenCreated) ([WS](https://ide.bitquery.io/Flap-sh-Newly-created-tokens-using-logs-TokenCreated---Websocket)) · [Transfers](https://ide.bitquery.io/Flap-Sh-Newly-created-tokens-using-transfer-data) ([WS](https://ide.bitquery.io/Flap-Sh-Newly-created-tokens-using-transfer-data---Websocket)) |
| **Klik Finance** | `0x16cf6788b762ee8969744586ed16fc5705140dd7` | `1000000000` | [Transfers](https://ide.bitquery.io/Klik-Finance-Newly-created-tokens-using-transfers) ([WS](https://ide.bitquery.io/Klik-Finance-Newly-created-tokens-using-transfers---Websocket)) |
| **Bankr Bot** | `0xeb7c034704ef8dcd2d32324c1545f62fb4ad0862` | `1000000000` | [Transfers](https://ide.bitquery.io/Bankr-Bot-Newly-created-tokens) ([WS](https://ide.bitquery.io/Bankr-Bot-Newly-created-tokens---Websocket)) |
| **Ape.store** | `0x6e4910ea5a04376032f6564da9a9e4e88b7a87c1` | `1000000000` | [Transfers](https://ide.bitquery.io/Apestore-Newly-created-tokens) ([WS](https://ide.bitquery.io/Apestore-Newly-created-tokens---Websocket)) |
| **Bags.fm** | `0xe8cc4431adf8b5a847c113ef0c6af9043219cb37` | `1000000000` | [Transfers](https://ide.bitquery.io/Bagsfm-Newly-created-tokens) ([WS](https://ide.bitquery.io/Bagsfm-Newly-created-tokens---Websocket)) |
| **Clanker** | `0xd3f2cc1731b7fd17f28798835c2e02f0a1839a94` | `100000000000` | [Transfers](https://ide.bitquery.io/Clanker-Newly-created-tokens) ([WS](https://ide.bitquery.io/Clanker-Newly-created-tokens---Websocket)) |

_WS = WebSocket subscription (real-time stream of the same query)._

---

## Flap.sh

Flap.sh launches on Robinhood can be monitored via contract events and mint transfers.

### All events from Flap.sh

List event signatures emitted by the Flap.sh contract to discover which logs are available for indexing.

▶️ [Run in IDE](https://ide.bitquery.io/All-events-from-Flapsh)

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 100}
      where: {LogHeader: {Address: {is: "0x26605f322f7ff986f381bb9a6e3f5dab0beaeb09"}}}
    ) {
      count
      Log {
        Signature {
          Name
        }
        SmartContract
      }
    }
  }
}
```

### Flap.sh Newly created tokens using logs (`TokenCreated`)

Filter Flap.sh `TokenCreated` events and decode argument values (token address, metadata fields, and related parameters).

▶️ [Run in IDE](https://ide.bitquery.io/Flap-sh-Newly-created-tokens-using-logs-TokenCreated) · [WebSocket stream](https://ide.bitquery.io/Flap-sh-Newly-created-tokens-using-logs-TokenCreated---Websocket)

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 10}
      where: {
        Log: {Signature: {Name: {is: "TokenCreated"}}}
        LogHeader: {Address: {is: "0x26605f322f7ff986f381bb9a6e3f5dab0beaeb09"}}
      }
    ) {
      Transaction {
        Hash
        From
        To
      }
      Log {
        Signature {
          Name
        }
        SmartContract
      }
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
    }
  }
}
```

### Flap.sh Newly created tokens using transfer data

Track Flap.sh mints as transfers from the zero address with amount `1000000000` in transactions sent to the Flap.sh contract.

▶️ [Run in IDE](https://ide.bitquery.io/Flap-Sh-Newly-created-tokens-using-transfer-data) · [WebSocket stream](https://ide.bitquery.io/Flap-Sh-Newly-created-tokens-using-transfer-data---Websocket)

```graphql
{
  EVM(network: robinhood) {
    Transfers(
      orderBy: {descending: Block_Time}
      limit: {count: 50}
      where: {
        Transaction: {To: {is: "0x26605f322f7ff986f381bb9a6e3f5dab0beaeb09"}}
        Transfer: {
          Amount: {eq: "1000000000"}
          Sender: {is: "0x0000000000000000000000000000000000000000"}
        }
      }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        From
        To
      }
      TransactionStatus {
        Success
      }
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
          Decimals
          Fungible
          Native
          ProtocolName
        }
      }
    }
  }
}
```

<details>
<summary>Sample response</summary>

Each row is one newly launched token. `Transfer.Sender` is the zero address (the mint), `Transfer.Receiver` is the deployer/first holder, and `Currency.SmartContract` is the new token address.

```json
{
  "EVM": {
    "Transfers": [
      {
        "Block": { "Number": "12873456", "Time": "2026-07-15T11:42:08Z" },
        "Transaction": {
          "Hash": "0x9f2c...a41b",
          "From": "0x39d83c23dbf34fa574b9afbb0c0e364bdfd97099",
          "To": "0x26605f322f7ff986f381bb9a6e3f5dab0beaeb09"
        },
        "TransactionStatus": { "Success": true },
        "Transfer": {
          "Amount": "1000000000",
          "AmountInUSD": "0",
          "Sender": "0x0000000000000000000000000000000000000000",
          "Receiver": "0x39d83c23dbf34fa574b9afbb0c0e364bdfd97099",
          "Currency": {
            "Name": "Example Meme",
            "Symbol": "MEME",
            "SmartContract": "0x9077841e155faaf4e4e89470822c2187eeef7777",
            "Decimals": 18,
            "Fungible": true,
            "Native": false,
            "ProtocolName": ""
          }
        }
      }
    ]
  }
}
```

</details>

---

## Klik Finance

Detect **[Klik Finance](https://klik.finance/)** token launches on Robinhood by filtering mint transfers where `Transaction.To` is the Klik Finance contract.

### Klik Finance Newly created tokens using transfers

▶️ [Run in IDE](https://ide.bitquery.io/Klik-Finance-Newly-created-tokens-using-transfers) · [WebSocket stream](https://ide.bitquery.io/Klik-Finance-Newly-created-tokens-using-transfers---Websocket)

```graphql
{
  EVM(network: robinhood) {
    Transfers(
      orderBy: {descending: Block_Time}
      limit: {count: 50}
      where: {
        Transaction: {To: {is: "0x16cf6788b762ee8969744586ed16fc5705140dd7"}}
        Transfer: {
          Amount: {eq: "1000000000"}
          Sender: {is: "0x0000000000000000000000000000000000000000"}
        }
      }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        From
        To
      }
      TransactionStatus {
        Success
      }
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
          Decimals
          Fungible
          Native
          ProtocolName
        }
      }
    }
  }
}
```

---

## Bankr Bot

Track tokens launched via **[Bankr](https://bankr.bot/)** on Robinhood using mint transfers to the Bankr bot contract.

### Bankr Bot Newly created tokens

▶️ [Run in IDE](https://ide.bitquery.io/Bankr-Bot-Newly-created-tokens) · [WebSocket stream](https://ide.bitquery.io/Bankr-Bot-Newly-created-tokens---Websocket)

```graphql
{
  EVM(network: robinhood) {
    Transfers(
      orderBy: {descending: Block_Time}
      limit: {count: 50}
      where: {
        Transaction: {To: {is: "0xeb7c034704ef8dcd2d32324c1545f62fb4ad0862"}}
        Transfer: {
          Amount: {eq: "1000000000"}
          Sender: {is: "0x0000000000000000000000000000000000000000"}
        }
      }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        From
        To
      }
      TransactionStatus {
        Success
      }
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
          Decimals
          Fungible
          Native
          ProtocolName
        }
      }
    }
  }
}
```

---

## Ape.store

Monitor **[Ape.store](https://ape.store/)** meme coin launches on Robinhood with the same mint-transfer pattern.

### Ape.store Newly created tokens

▶️ [Run in IDE](https://ide.bitquery.io/Apestore-Newly-created-tokens) · [WebSocket stream](https://ide.bitquery.io/Apestore-Newly-created-tokens---Websocket)

```graphql
{
  EVM(network: robinhood) {
    Transfers(
      orderBy: {descending: Block_Time}
      limit: {count: 50}
      where: {
        Transaction: {To: {is: "0x6e4910ea5a04376032f6564da9a9e4e88b7a87c1"}}
        Transfer: {
          Amount: {eq: "1000000000"}
          Sender: {is: "0x0000000000000000000000000000000000000000"}
        }
      }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        From
        To
      }
      TransactionStatus {
        Success
      }
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
          Decimals
          Fungible
          Native
          ProtocolName
        }
      }
    }
  }
}
```

---

## Bags.fm

Query **[Bags.fm](https://bags.fm/)** newly created tokens on Robinhood by mint amount and Bags.fm contract address.

### Bags.fm Newly created tokens

▶️ [Run in IDE](https://ide.bitquery.io/Bagsfm-Newly-created-tokens) · [WebSocket stream](https://ide.bitquery.io/Bagsfm-Newly-created-tokens---Websocket)

```graphql
{
  EVM(network: robinhood) {
    Transfers(
      orderBy: {descending: Block_Time}
      limit: {count: 50}
      where: {
        Transaction: {To: {is: "0xe8cc4431adf8b5a847c113ef0c6af9043219cb37"}}
        Transfer: {
          Amount: {eq: "1000000000"}
          Sender: {is: "0x0000000000000000000000000000000000000000"}
        }
      }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        From
        To
      }
      TransactionStatus {
        Success
      }
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
          Decimals
          Fungible
          Native
          ProtocolName
        }
      }
    }
  }
}
```

---

## Clanker

Track **[Clanker](https://clanker.world/)** token launches on Robinhood. Clanker mints use amount `100000000000` (different from the `1000000000` used by the other launchpads above).

### Clanker Newly created tokens

▶️ [Run in IDE](https://ide.bitquery.io/Clanker-Newly-created-tokens) · [WebSocket stream](https://ide.bitquery.io/Clanker-Newly-created-tokens---Websocket)

```graphql
{
  EVM(network: robinhood) {
    Transfers(
      orderBy: {descending: Block_Time}
      limit: {count: 50}
      where: {
        Transaction: {To: {is: "0xd3f2cc1731b7fd17f28798835c2e02f0a1839a94"}}
        Transfer: {
          Amount: {eq: "100000000000"}
          Sender: {is: "0x0000000000000000000000000000000000000000"}
        }
      }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        From
        To
      }
      TransactionStatus {
        Success
      }
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
          Decimals
          Fungible
          Native
          ProtocolName
        }
      }
    }
  }
}
```

---

## FAQ

### How do I track new Robinhood meme coin launches in real time?

Open any **WebSocket** link in the [contract map](#launchpad-and-bot-contract-map) above, or take a launch query on this page and change its operation type from a query to a `subscription` in the Bitquery IDE. Each new launch is then pushed to your client as it is mined.

### Which launchpads and bots does this page cover?

Flap.sh, Klik Finance, Bankr Bot, Ape.store, Bags.fm, and Clanker on the Robinhood network. Each has its own contract address and mint amount listed in the contract map.

### How do I track a launchpad that isn't listed here?

Copy any transfer query on this page and replace the address in `Transaction.To` with the launchpad's contract. Keep the `Transfer.Sender` zero-address filter (it isolates mints) and set `Transfer.Amount` to that launchpad's initial mint supply.

### Why do the queries filter transfers by a fixed `Amount`?

The `Amount` is the full initial token supply minted at launch (`1000000000` for most launchpads, `100000000000` for Clanker). Combined with the zero-address sender, it isolates the launch mint from ordinary transfers. `Transfer.Amount` is already decimal-normalized, so compare against the whole-token value, not the raw on-chain integer.

### Should I use the Events or Transfers method?

Use **Events** when a launchpad emits a decoded creation event (like Flap.sh's `TokenCreated`) and you want the decoded arguments. Use **Transfers** — the mint-transfer pattern — for launchpads that don't expose a convenient event, which covers every protocol on this page.

---

## Next steps

- Use the **WebSocket stream** links above (or switch the query to `subscription` in the IDE) for real-time launch alerts.
- Track a launchpad not listed here by swapping `Transaction.To` and `Amount` per the [contract map](#launchpad-and-bot-contract-map).
- Follow new tokens into markets with the [Robinhood Trades API](/docs/examples/robinhood/robinhood-trades).
- Inspect holder and wallet flows with [Robinhood Transfers](/docs/examples/robinhood/robinhood-transfers).
