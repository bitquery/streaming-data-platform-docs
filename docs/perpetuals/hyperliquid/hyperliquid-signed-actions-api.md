---
title: "Hyperliquid Signed Actions API"
description: "Query and stream raw signed L1 actions on Hyperliquid with Bitquery: order, cancel, modify, batchModify, updateLeverage and more, with signer, broadcaster, bundle hash and status."
sidebar_position: 9
keywords:
  - Hyperliquid signed actions
  - Hyperliquid L1 actions
  - Hyperliquid action hash
  - Hyperliquid agent wallet
  - Hyperliquid API wallet actions
  - Hyperliquid batchModify
  - Hyperliquid updateLeverage
  - Bitquery Hyperliquid actions
---

# Hyperliquid Signed Actions API

`SignedActions` is the lowest-level Hyperliquid cube: every **signed user action** submitted to the L1 — order placements, cancels, modifies, leverage updates, transfers and the rest — before they materialize as orders, trades or position changes.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

## Latest signed actions

Run it in the IDE: [Hyperliquid Signed Actions ➤](https://ide.bitquery.io/hyperliquid-signed-actions)

```graphql
query {
  Hyperliquid {
    SignedActions(limit: {count: 50}, orderBy: {descending: Block_Time}) {
      Block { Number Time }
      ActionType Status User Signer Nonce VaultAddress
      Bundle { Hash Broadcaster ActionIndex }
      Leverage { Asset Value IsCross }
    }
  }
}
```

Field notes:

- `ActionType` — the action name as submitted: `order`, `cancel`, `cancelByCloid`, `modify`, `batchModify`, `updateLeverage`, `twapOrder`, and other Hyperliquid exchange actions.
- `User` vs `Signer` — `User` is the account the action applies to; `Signer` is the key that signed it, which differs when an **agent / API wallet** acts for the account. `VaultAddress` is set for vault-scoped actions.
- `Bundle` — actions arrive in broadcast bundles; `Hash` is the bundle hash (matches `Trade.Execution.Hash` on resulting fills), `Broadcaster` the node that broadcast it, `ActionIndex` the action's position in the bundle.
- `Status` — `ok` for accepted actions, or an error status for rejected ones; `Response` (raw string field) carries the node response.
- `Action` — the raw action payload as a JSON string, when you need parameters beyond the typed fields.
- `Leverage { Asset Value IsCross }` is populated for `updateLeverage` actions.

Filter examples:

- One account's activity: `where: {User: {is: "0x..."}}`
- Only leverage updates: `where: {ActionType: {is: "updateLeverage"}}`
- Failed actions: `where: {Status: {not: "ok"}}`

As with every Hyperliquid cube, changing `query` to `subscription` (and dropping `limit`/`orderBy`) turns this into a real-time WebSocket stream — useful for monitoring an account's or broadcaster's full action flow live.
