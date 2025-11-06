---
title: "Aerodrome Gauge Vaults API — Base (Deposits, Withdraws, Rewards)"
description: "Track Aerodrome gauge vaults on Base: new gauges, deposits, withdraws, and reward claims. Query governance-directed emissions activity and LP staking flows via Bitquery GraphQL and Streams."
sidebar_position: 7
---

# Aerodrome Gauge Vaults API — Base (Deposits, Withdraws, Rewards)

Aerodrome Finance gauge vaults are staking contracts for LP tokens that let liquidity providers earn AERO emissions. veAERO holders (who lock AERO for up to four years) vote every week to direct emissions across pool gauges. LPs staking in the most‑voted gauges earn more AERO, while veAERO voters receive trading fees from the pools they support and may be incentivized by external bribes. Users can also auto‑compound earned AERO into veAERO to build long‑term voting power.

This page covers, on Base:

- New gauge creation events (where emissions can flow next)
- Deposits and withdraws into gauge vaults (LP staking flows)
- Reward claims from gauges (realized emissions)

You may also be interested in:

- [Base Network DEX APIs ➤](https://docs.bitquery.io/docs/examples/dextrades/dex-api/)
- [Token Trades APIs ➤](https://docs.bitquery.io/docs/examples/dextrades/token-trades-apis/)
- [Liquidity Pool APIs ➤](https://docs.bitquery.io/docs/examples/dextrades/pools-api/)

Use the GraphQL queries below to monitor governance‑directed liquidity incentives across Aerodrome on Base. If you need other data points, reach out to [support](https://t.me/Bloxy_info).

:::note
To query or stream data via graphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
:::

<head>
<title>Aerodrome Gauge Vaults API — Base (Deposits, Withdraws, Rewards)</title>
<meta
  name="title"
  content="Aerodrome Gauge Vaults API — Base (Deposits, Withdraws, Rewards)"
/>
<meta
  name="description"
  content="Track Aerodrome gauge vaults on Base: new gauges, deposits, withdraws, and reward claims. Monitor veAERO-directed emissions and LP staking flows via Bitquery GraphQL and Streams."
/>
<meta
  name="keywords"
  content="Aerodrome Gauge Vaults API,Base Aerodrome gauges,veAERO emissions,Aerodrome deposits,withdraws,ClaimRewards,gauge creation,LP staking,Aerodrome rewards,Base DeFi analytics,GraphQL API"
/>
<meta name="robots" content="index, follow" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="language" content="English" />

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Aerodrome Gauge Vaults API — Base (Deposits, Withdraws, Rewards)"
/>
<meta
  property="og:description"
  content="Track Aerodrome gauge vault creation, deposits, withdraws and reward claims on Base."
/>

<meta property="twitter:card" content="summary_large_image"/>
<meta property="twitter:title" content="Aerodrome Gauge Vaults API — Base (Deposits, Withdraws, Rewards)"/>
<meta property="twitter:description" content="Monitor Aerodrome gauge vaults on Base: new gauges, deposits, withdraws, rewards."/>
</head>

import VideoPlayer from "../../../src/components/videoplayer.js";

---

### Table of Contents

- [Latest Created Aerodrome Gauge Vaults](#latest-created-aerodrome-gauge-vaults)
- [Latest Aerodrome Gauge Vaults Deposits](#latest-aerodrome-gauge-vaults-deposits)
- [Latest Aerodrome Gauge Vaults ClaimRewards](#latest-aerodrome-gauge-vaults-claimrewards)
- [Latest Aerodrome Gauge Vaults Withdraws](#latest-aerodrome-gauge-vaults-withdraws)
- [Get Latest Withdraws of a specific gauge pool](#get-latest-withdraws-of-a-specific-gauge-pool)
- [Get Latest Deposits of a specific gauge pool](#get-latest-deposits-of-a-specific-gauge-pool)
- [Get Latest ClaimRewards on a specific gauge pool](#get-latest-claimrewards-on-a-specific-gauge-pool)

## Latest Created Aerodrome Gauge Vaults

Discover newly created gauge vaults on Aerodrome (Base). Gauges are staking contracts that receive veAERO‑directed emissions. Use this to track where future AERO rewards may flow as new pools receive gauges. `0xf5601f95708256a118ef5971820327f362442d2d` is the `Aerodrome : Voter` contract.

[Latest Created Gauge Vaults — Query ➤](https://ide.bitquery.io/latest-created-gauges#)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  EVM(network: base) {
    Events(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Log: {
          Signature: { Name: { is: "GaugeCreated" } }
          SmartContract: { is: "0x16613524e02ad97eDfeF371bC883F2F5d6C480A5" }
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Arguments {
        Index
        Name
        Path {
          Index
          Name
          Type
        }
        Type
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
      Call {
        From
        To
      }
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

</details>

## Latest Aerodrome Gauge Vaults Deposits

Monitor LP staking into gauge vaults. This shows recent `Deposit` events to a gauge contract, helping you track which pools are attracting liquidity ahead of weekly emissions. `0xf5601f95708256a118ef5971820327f362442d2d` is the `Aerodrome : Gauge Implementation` contract.

[Latest Gauge Vaults Deposits — Query ➤](https://ide.bitquery.io/latest-gauge-vaults-deposits-transactions#)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  EVM(network: base) {
    Events(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Call: { To: { is: "0xf5601f95708256a118ef5971820327f362442d2d" } }
        Log: { Signature: { Name: { is: "Deposit" } } }
        TransactionStatus: { Success: true }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Arguments {
        Index
        Name
        Path {
          Index
          Name
          Type
        }
        Type
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
      Call {
        From
        To
      }
      Log {
        Signature {
          Name
          Signature
        }
        SmartContract
      }
    }
  }
}
```

</details>

## Latest Aerodrome Gauge Vaults ClaimRewards

Track when stakers claim accumulated AERO emissions from gauges. Use this to measure realized rewards and active participation across gauge vaults. `0xf5601f95708256a118ef5971820327f362442d2d` is the `Aerodrome : Gauge Implementation` contract.

[Latest Aerodrome Gauge Vaults ClaimRewards — Query ➤](https://ide.bitquery.io/latest-gauge-vaults-claimRewards-transactions#)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  EVM(network: base) {
    Events(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Call: { To: { is: "0xf5601f95708256a118ef5971820327f362442d2d" } }
        Log: { Signature: { Name: { is: "ClaimRewards" } } }
        TransactionStatus: { Success: true }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Arguments {
        Index
        Name
        Path {
          Index
          Name
          Type
        }
        Type
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
      Call {
        From
        To
      }
      Log {
        Signature {
          Name
          Signature
        }
        SmartContract
      }
    }
  }
}
```

</details>

## Latest Aerodrome Gauge Vaults Withdraws

Observe LP exits from gauge vaults via `Withdraw` events. This helps you detect liquidity outflows and shifts in staking positions across pools. `0xf5601f95708256a118ef5971820327f362442d2d` is the `Aerodrome : Gauge Implementation` contract.

[Latest Aerodrome Gauge Vaults Withdraws — Query ➤](https://ide.bitquery.io/latest-gauge-vaults-withdraw-transactions_1#)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  EVM(network: base) {
    Events(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Call: { To: { is: "0xf5601f95708256a118ef5971820327f362442d2d" } }
        Log: { Signature: { Name: { is: "Withdraw" } } }
        TransactionStatus: { Success: true }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Arguments {
        Index
        Name
        Path {
          Index
          Name
          Type
        }
        Type
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
      Call {
        From
        To
      }
      Log {
        Signature {
          Name
          Signature
        }
        SmartContract
      }
    }
  }
}
```

</details>

## Get Latest Withdraws of a specific gauge pool

Filter withdraw activity for a single gauge pool. Useful for monitoring liquidity changes and unstaking patterns of a targeted pool. `0x5d05ef25a5f933271e1f0fdc02dc3eab6a4ea687` is the `Aerodrome Finance CL100 WETHVVV Pool Gauge` contract.

[Get Latest Withdraws of a specific gauge pool — Query ➤](https://ide.bitquery.io/latest-Aerodrome-Finance-CL100-WETHVVV-Pool-Gauge-withdraw-transactions_1)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  EVM(network: base) {
    Events(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Call: { From: { is: "0x5d05ef25a5f933271e1f0fdc02dc3eab6a4ea687" } }
        Log: { Signature: { Name: { is: "Withdraw" } } }
        TransactionStatus: { Success: true }
      }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
      }
      Arguments {
        Index
        Name
        Path {
          Index
          Name
          Type
        }
        Type
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
      Call {
        From
        To
      }
      Log {
        Signature {
          Name
          Signature
        }
        SmartContract
      }
    }
  }
}
```

</details>

## Get Latest Deposits of a specific gauge pool

View deposit activity for a specific gauge pool to understand where LPs are allocating capital and how staking momentum evolves. `0x5d05ef25a5f933271e1f0fdc02dc3eab6a4ea687` is the `Aerodrome Finance CL100 WETHVVV Pool Gauge` contract.

[Get Latest Deposits of a specific gauge pool — Query ➤](https://ide.bitquery.io/latest-Aerodrome-Finance-CL100-WETHVVV-Pool-Gauge-deposits#)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  EVM(network: base) {
    Events(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Call: { From: { is: "0x5d05ef25a5f933271e1f0fdc02dc3eab6a4ea687" } }
        Log: { Signature: { Name: { is: "Deposit" } } }
        TransactionStatus: { Success: true }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Arguments {
        Index
        Name
        Path {
          Index
          Name
          Type
        }
        Type
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
      Call {
        From
        To
      }
      Log {
        Signature {
          Name
          Signature
        }
        SmartContract
      }
    }
  }
}
```

</details>

## Get Latest ClaimRewards on a specific gauge pool

See reward claims for a particular gauge pool to quantify realized emissions by its stakers over time. `0x5d05ef25a5f933271e1f0fdc02dc3eab6a4ea687` is the `Aerodrome Finance CL100 WETHVVV Pool Gauge` contract.

[Get Latest ClaimRewards on a specific gauge pool — Query ➤](https://ide.bitquery.io/latest-Aerodrome-Finance-CL100-WETHVVV-Pool-Gauge-claimRewards-Transactions#)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  EVM(network: base) {
    Events(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        Call: { From: { is: "0x5d05ef25a5f933271e1f0fdc02dc3eab6a4ea687" } }
        Log: { Signature: { Name: { is: "ClaimRewards" } } }
        TransactionStatus: { Success: true }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Arguments {
        Index
        Name
        Path {
          Index
          Name
          Type
        }
        Type
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
      Call {
        From
        To
      }
      Log {
        Signature {
          Name
          Signature
        }
        SmartContract
      }
    }
  }
}
```

</details>
