---
title: Algorand Coinpath API - Trace ALGO & ASA Flows Across Addresses
sidebar_label: Algorand Coinpath API
description: Trace Algorand fund flows between addresses with Bitquery Coinpath. Track outbound and inbound paths, hop depth, amounts, and transaction counts for AML and forensics.
keywords:
  - Algorand coinpath API
  - Algorand fund tracing
  - ALGO flow analysis
  - ASA flow tracing
  - Algorand forensics API
  - Algorand compliance API
  - Algorand GraphQL
  - Bitquery Algorand
---
# Algorand Coinpath API

Coinpath walks ALGO and ASA flows between Algorand addresses — forward to see where funds went, backward to see where they came from. The API returns senders, receivers, hop depth, amounts, currency metadata, and transaction details at each level. Common use cases: AML screening, treasury audits, exchange deposit tracing, and source-of-funds verification.

:::info Endpoint
Algorand GraphQL queries are served at `https://graphql.bitquery.io`.
:::

## Trace outgoing fund flows from a sender

Returns the 10 most recent coinpath entries for transfers sent from a specific address after a given date. Swap `sender` for `receiver` to trace incoming flows instead.

```graphql
{
  algorand(network: algorand) {
    coinpath(
      date: {after: "2023-08-05"}
      options: {desc: "block.timestamp.iso8601", limit: 10}
      sender: {is: "SENDER_ADDRESS_HERE"}
    ) {
      amount
      block {
        timestamp {
          iso8601
        }
      }
      currency {
        address
        name
      }
      depth
      receiver {
        address
      }
      transaction {
        hash
        value
      }
    }
  }
}
```

## Count coinpath transactions received by an address

Counts total coinpath entries received by an address after a given date. Add a `sender` filter to narrow by source, or replace `count` with `amount(calculate: sum)` to get total value moved.

```graphql
{
  algorand(network: algorand) {
    coinpath(
      date: {after: "2023-08-01"}
      receiver: {is: "BWSNMG43TUYEOHE76J6KDWIY6MU4U6JFJYGAYCZA2RF5IS3XPO3P3G4FEI"}
    ) {
      count
    }
  }
}
```

## Related resources

- [Algorand Transfers API](/docs/blockchain/Algorand/algorand-transfers-api) — raw ALGO and ASA transfer history
- [Algorand Address API](/docs/blockchain/Algorand/algorand-address-api) — wallet balances and contract bytecode
