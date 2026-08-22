---
title: "Lighter Perp DEX on Robinhood Chain API"
description: "Track Lighter perpetual futures on Robinhood Chain with Bitquery — USDG margin deposits and withdrawals, the ZkLighter rollup contract, batch commits, and full flow history over GraphQL APIs and WebSocket streams."
sidebar_position: 10
keywords:
  - Lighter Robinhood API
  - Lighter perp DEX data
  - Robinhood perpetual futures onchain
  - ZkLighter contract Robinhood Chain
  - Lighter USDG deposits
  - Lighter margin withdrawals
  - Lighter deposit tracking
  - zkLighter rollup batches
  - Robinhood Chain perps
  - Bitquery Lighter API
---

# Lighter Perp DEX on Robinhood Chain API

[Lighter](https://lighter.xyz) is the perpetual-futures DEX integrated into Robinhood Wallet. When Robinhood Chain mainnet went live on July 1, 2026, Lighter launched alongside it as the venue behind in-app perps: eligible users post **USDG** margin from their wallet, and the funds are locked in Lighter's smart contract on Robinhood Chain while positions are managed by Lighter's zk engine.

What actually lives on Robinhood Chain is a full **ZkLighter rollup contract** — not just a token vault. It receives every margin deposit, queues and pays withdrawals, and records the rollup's batch lifecycle (`commit → verify → execute`) at roughly **one batch per minute**. This page shows how to query and stream all of it with Bitquery's `EVM` cubes on `network: robinhood`.

Scale as of late August 2026, measured with the queries on this page: about **$33.4M USDG deposited and $7.7M withdrawn** since launch (net ≈ the contract's current $25.7M balance), with August deposits running at ~3.7× July and 1,000–3,000 deposits per day.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Robinhood Events API](/docs/blockchain/robinhood/robinhood-events-api/)
- [Robinhood Transfers](/docs/blockchain/robinhood/robinhood-transfers/)
- [Robinhood Calls API](/docs/blockchain/robinhood/robinhood-calls-api/)
- [Robinhood Balances API](/docs/blockchain/robinhood/robinhood-balances-api/)
- [EVM Events schema](/docs/schema/evm/events/)
:::

**On this page:** [What is on-chain](#what-is-on-chain-and-what-is-not) · [Contracts](#contract-map) · [Event reference](#event-reference-topic0-map) · [Deposits](#track-margin-deposits) · [Withdrawals](#track-withdrawals) · [Margin flow & history](#usdg-margin-flow-full-history) · [Rollup heartbeat](#monitor-the-rollup-heartbeat) · [Deposit calls](#deposit-calls-by-selector) · [Decoding notes](#decoding-notes)

---

## What is on-chain (and what is not)

Lighter's matching engine, order book, positions, funding, and liquidations run inside its zk rollup — they are **not** individual Robinhood Chain transactions. What settles on Robinhood Chain, and what Bitquery therefore indexes, is:

| On Robinhood Chain (queryable here) | Inside the Lighter engine (not on-chain) |
| --- | --- |
| USDG margin **deposits** into the ZkLighter contract | Individual trades and fills |
| **Withdrawal** queue events and USDG payouts back to users | Open positions and PnL |
| Rollup **batch lifecycle**: commit, verification, execution, state roots | Funding payments (hourly, peer-to-peer) |
| Priority requests (forced operations, key changes, escape hatches) | Order placement and cancellation (except the on-chain `cancelAllOrders` escape hatch) |
| Market/asset registry events | Liquidation events themselves (only the margin effects appear) |

This makes the on-chain data ideal for **money-flow questions** — who is depositing margin, how much, net flows, contract TVL, whether the rollup operator is alive — rather than trade-level analytics.

---

## Contract map

| Role | Address |
| --- | --- |
| **ZkLighter proxy** — receives margin, pays withdrawals, emits every Lighter event | `0x94bab9693ba2f6358507effcbd372b0660afff9d` |
| Current verified implementation (`ZkLighter`) | `0x82DE5B1161C93afDFE21bA0D5343f01Cd7401d90` |
| USDG (Global Dollar, 6 decimals) — canonical currency address in Bitquery cubes | `0x5fc5360d0400a0fd4f2af552add042d716f1d168` |
| Robinhood deposit router (sweeps in-app deposits into `deposit()`) | `0x8062df5b3220ad1f528365650a3eb3e8c7b0dad1` |

:::info Filter by LogHeader.Address, not Log.SmartContract
The ZkLighter proxy delegates to implementation modules, so `Log.SmartContract` shows the **implementation** address — and implementations rotate on upgrades (the last rotation was August 21, 2026; older module addresses you may see in results include `0x1be72833…`, `0xe470e41c…`, and `0xda2b59ff…`). The stable anchor is `LogHeader.Address` = the proxy `0x94bab969…`, combined with the event's `SignatureHash` (topic0). Every query below follows that pattern.
:::

---

## Event reference (topic0 map)

All events are emitted with the proxy as `LogHeader.Address`. Hash fields in Bitquery are hex strings **without** a `0x` prefix.

| Event | topic0 (`Log.Signature.SignatureHash`) |
| --- | --- |
| `Deposit(uint48 toAccountIndex, address toAddress, uint16 assetIndex, uint8 routeType, uint128 baseAmount)` | `493c3b8240368e8343bcd42cac5f4b8b161c06d061710e542a72f06a40ddd9d1` |
| `WithdrawPending(address indexed owner, uint16 assetIndex, uint128 baseAmount)` | `ef80235b5f4cf1822ad6a8621af41ac64372ff672c402874f507fc63dbe5e06f` |
| `NewPriorityRequest(address sender, uint64 serialId, uint8 pubdataType, bytes pubData, uint64 expirationTimestamp)` | `efdd379e3e15772fcc7d2a67fa5bbb0790b932724153aded4648307094733b2f` |
| `BatchCommit(uint64 batchNumber, uint32 batchSize, uint64 endBlockNumber)` | `181b25ea9d4d730f30d779f3d2099c03b26b653c889d33eef253d54baaacbd0d` |
| `BatchVerification(uint64 batchNumber, uint32 batchSize, uint64 endBlockNumber)` | `5c836e1ff20ea85c52b6e3d2ef0124d3304bf3b37cc8fb0e2c84ae7d44c0593e` |
| `BatchesExecuted(uint64 batchNumber, uint64 endBlockNumber)` | `5d490d991d08230b7690c7511bb854b7b8a05fb7c87e2348e1909384cb325511` |
| `StateRootUpdate(uint64 batchNumber, bytes32 oldStateRoot, bytes32 newStateRoot)` | `645e0b8f839353842bdac87abd27fc8bdda536e0731cdb7cc75e4f0740b575ac` |
| `CreateMarket((uint16,uint8,bytes), uint8 sizeDecimals, uint8 priceDecimals, bytes32 symbol)` | `134f63a6bbe3b3ef885ce4067eb2753fe1c912c51c4b8e0cc7966f21773c047e` |
| `RegisterAssetConfig(uint16 assetIndex, address tokenAddress, …)` | `f1b24e81016b9f39e2290cf2a9303264a07534a569df7e6200a39573d7f26b0c` |

The remaining admin events (`UpdateMarket`, `UpdateAssetConfig`, `BatchesRevert`, `DesertMode`, `TreasuryUpdate`, `InsuranceFundOperatorUpdate`, `Initialized`) exist in the ABI but fire rarely; the full verified ABI is on the [Robinhood Chain explorer](https://robinhoodchain.blockscout.com/address/0x82DE5B1161C93afDFE21bA0D5343f01Cd7401d90?tab=contract).

---

## Track margin deposits

Every deposit into Lighter emits one `Deposit` event. This query returns the latest ones; turn it into a live stream by replacing `query` with `subscription` and dropping `dataset`/`limit`/`orderBy`.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Events(
      limit: { count: 10 }
      orderBy: { descending: Block_Number }
      where: {
        LogHeader: { Address: { is: "0x94bab9693ba2f6358507effcbd372b0660afff9d" } }
        Log: { Signature: { SignatureHash: { is: "493c3b8240368e8343bcd42cac5f4b8b161c06d061710e542a72f06a40ddd9d1" } } }
      }
    ) {
      Block { Number Time }
      Transaction { Hash From }
      Log { SmartContract Signature { SignatureHash } }
      LogHeader { Address Data }
    }
  }
}
```

`Deposit` has no indexed parameters, so all five fields sit in `LogHeader.Data` as 32-byte words, in ABI order:

| Word | Field | Notes |
| --- | --- | --- |
| 0 | `toAccountIndex` | The user's Lighter account index |
| 1 | `toAddress` | The wallet credited — for Robinhood-app deposits this is the user's deposit address, while the ERC-20 transfer arrives via the router `0x8062df5b…` |
| 2 | `assetIndex` | `3` = USDG on this deployment |
| 3 | `routeType` | `0` for ~98% of deposits |
| 4 | `baseAmount` | Raw token units — divide by 10⁶ for USDG (verified to match the ERC-20 transfer in the same transaction) |

---

## Track withdrawals

Withdrawals are two-step: the rollup queues the amount (`WithdrawPending`, with the receiving wallet **indexed** as `Topics[1]`), then operator transactions push the USDG payout to the user via `withdrawPendingBalance`. To watch the queue:

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Events(
      limit: { count: 10 }
      orderBy: { descending: Block_Number }
      where: {
        LogHeader: { Address: { is: "0x94bab9693ba2f6358507effcbd372b0660afff9d" } }
        Log: { Signature: { SignatureHash: { is: "ef80235b5f4cf1822ad6a8621af41ac64372ff672c402874f507fc63dbe5e06f" } } }
      }
    ) {
      Block { Number Time }
      Transaction { Hash }
      Topics { Hash }   # Topics[1] = padded owner address
      LogHeader { Data } # [assetIndex, baseAmount(6dp)]
    }
  }
}
```

The actual payout is a plain USDG transfer **from** the proxy, so the Transfers query below covers the money leg of withdrawals too.

---

## USDG margin flow (full history)

The simplest lens on Lighter needs no event decoding at all: USDG transfers to the proxy are margin in, transfers from it are margin out. The `combined` dataset holds Robinhood Chain history back to the chain's start, so this works from Lighter's first deposit (June 26, 2026 — a soft start a few days before the public July 1 launch).

Monthly deposit and withdrawal totals since launch:

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    deposits: Transfers(
      where: {
        Transfer: {
          Currency: { SmartContract: { is: "0x5fc5360d0400a0fd4f2af552add042d716f1d168" } }
          Receiver: { is: "0x94bab9693ba2f6358507effcbd372b0660afff9d" }
        }
      }
    ) {
      Block { Date(interval: { count: 1, in: months }) }
      count
      sum(of: Transfer_Amount)
    }
    withdrawals: Transfers(
      where: {
        Transfer: {
          Currency: { SmartContract: { is: "0x5fc5360d0400a0fd4f2af552add042d716f1d168" } }
          Sender: { is: "0x94bab9693ba2f6358507effcbd372b0660afff9d" }
        }
      }
    ) {
      Block { Date(interval: { count: 1, in: months }) }
      count
      sum(of: Transfer_Amount)
    }
  }
}
```

Swap the monthly interval for a `days` interval for daily flow charts, or drop the aggregation and add `limit`/`orderBy` to list individual transfers with sender and receiver. The difference between lifetime deposits and withdrawals is the contract's standing USDG balance — Lighter-on-Robinhood's margin TVL.

To size total activity, an aggregate probe over full history:

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Events(
      where: {
        LogHeader: { Address: { is: "0x94bab9693ba2f6358507effcbd372b0660afff9d" } }
        Log: { Signature: { SignatureHash: { is: "493c3b8240368e8343bcd42cac5f4b8b161c06d061710e542a72f06a40ddd9d1" } } }
      }
    ) {
      count
      earliest: Block { Time(minimum: Block_Time) }
      latest: Block { Time(maximum: Block_Time) }
    }
  }
}
```

---

## Monitor the rollup heartbeat

Lighter posts its zk batch lifecycle to Robinhood Chain about once a minute. Streaming the three lifecycle events is a ready-made **liveness monitor** for the venue — if commits stop, the engine or its operator has a problem:

```graphql
subscription {
  EVM(network: robinhood) {
    Events(
      where: {
        LogHeader: { Address: { is: "0x94bab9693ba2f6358507effcbd372b0660afff9d" } }
        Log: {
          Signature: {
            SignatureHash: {
              in: [
                "181b25ea9d4d730f30d779f3d2099c03b26b653c889d33eef253d54baaacbd0d"
                "5c836e1ff20ea85c52b6e3d2ef0124d3304bf3b37cc8fb0e2c84ae7d44c0593e"
                "5d490d991d08230b7690c7511bb854b7b8a05fb7c87e2348e1909384cb325511"
              ]
            }
          }
        }
      }
    ) {
      Block { Number Time }
      Transaction { Hash From }
      Log { Signature { SignatureHash } }
      LogHeader { Data } # batchNumber, batchSize, endBlockNumber
    }
  }
}
```

Each of `commitBatch`, `verifyBatch`, and `executeBatches` is sent by a single operator EOA, so `Transaction.From` also identifies the Lighter operator.

---

## deposit() calls by selector

The Calls cube gives the function-call view of the same activity — useful for catching deposits, forced withdrawals (`withdraw`, selector `d20191bd`), key registrations (`changePubKey`, `17010c68`), and escape-hatch cancels (`cancelAllOrders`, `a4b6f756`):

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Calls(
      limit: { count: 10 }
      orderBy: { descending: Block_Number }
      where: {
        Call: {
          To: { is: "0x94bab9693ba2f6358507effcbd372b0660afff9d" }
          Signature: { SignatureHash: { is: "8a857083" } } # deposit(address,uint16,uint8,uint256)
        }
      }
    ) {
      Block { Number Time }
      Call { From Value Signature { SignatureHash } }
      Transaction { Hash From }
    }
  }
}
```

---

## Decoding notes

- **Signatures currently arrive unparsed** — `Log.Signature.Name` is empty for ZkLighter events until the ABI is registered in the decoding pipeline, so filter by `SignatureHash` (as every query on this page does) and decode `LogHeader.Data` client-side with the word layouts above. Once the ABI lands, the same queries also return decoded `Arguments`.
- `LogHeader.Address` is the address a node's `eth_getLogs` would report; `Log.SmartContract` is the implementation behind the proxy and changes on upgrades. Pin queries to `LogHeader.Address`.
- Amounts (`baseAmount` and USDG `Transfer.Amount`) are 6-decimal USDG units; `Transfer.Amount` in the API is already decimal-adjusted.
- Robinhood in-app deposits are swept from per-user deposit addresses through the router `0x8062df5b…`, so the ERC-20 `Transfer.Sender` into the proxy is often the router while the credited wallet is `Deposit.toAddress`. Count depositors from the `Deposit` event, not from transfer senders.
- For trade-level perps data (fills, positions, funding), use Lighter's own venue APIs — that activity never touches Robinhood Chain. On-chain data here answers flow, TVL, user-count, and liveness questions.

Every query on this page was executed against the production `streaming.bitquery.io/graphql` endpoint on August 22, 2026 before publishing.
