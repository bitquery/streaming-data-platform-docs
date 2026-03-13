---
title: "Solana Balance Updates - gRPC Stream (CoreCast)"
description: "Real-time balance updates via Solana gRPC. Filter by address, token. Protobuf."
keywords: ["solana grpc", "grpc solana", "CoreCast", "Solana balance stream"]
---

# Solana Balance Updates gRPC Stream

The `balance` gRPC Stream provides real-time balance update data for Solana accounts and token accounts.

---

## Overview

Subscribe to live balance changes for accounts and token accounts. Each event includes pre/post balances, currency details, and account context. Data is in **protobuf format** — use `bitquery-corecast-proto` to parse.

---

## Quick Example (Node.js)

Subscribe to balance updates for WSOL and log each event:

```javascript
const grpc = require('@grpc/grpc-js');
const { loadPackageDefination } = require('bitquery-corecast-proto');

const packageDefinition = loadPackageDefination();
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const CoreCast = protoDescriptor.solana_corecast.CoreCast;

const client = new CoreCast('corecast.bitquery.io', grpc.credentials.createSsl());
const metadata = new grpc.Metadata();
metadata.add('authorization', process.env.BITQUERY_TOKEN || 'YOUR_API_TOKEN');

const request = {
  token: { addresses: ['So11111111111111111111111111111111111111112'] }  // WSOL
};

const stream = client.BalanceUpdates(request, metadata);
stream.on('data', (msg) => {
  if (msg.BalanceUpdate) {
    const pre = msg.BalanceUpdate.BalanceUpdate?.PreBalance?.toString() || '0';
    const post = msg.BalanceUpdate.BalanceUpdate?.PostBalance?.toString() || '0';
    console.log(`Balance: ${pre} -> ${post}`);
  }
});
stream.on('error', (err) => console.error(err));
```

Run: `npm install @grpc/grpc-js bitquery-corecast-proto` then `BITQUERY_TOKEN=ory_at_xxx node index.js`

---

## Configuration

To subscribe to balance updates, configure your stream as follows:

```yaml
stream:
  type: "balance"
```

## Available Data

The balance updates stream provides comprehensive balance change information including:

- **Transaction details**: Slot, signature, status, fees
- **Account information**: Signers, token accounts, program IDs
- **Token context**: Mint addresses, decimals, owners
- **Balance changes**: Pre/post balances for accounts and token accounts
- **Currency details**: Token metadata, symbols, mint addresses

## Sample Data Structure

Here's an example of the data structure you'll receive:

```json
{
  "Block": {
    "Slot": 370025845
  },
  "Transaction": {
    "Index": 664,
    "Signature": "MgetT2Zi7PtLP867x2xioiCmimwe1H4rtTiDuqwE8eqjGuK4CTs4CBiKCKyfJHh8mXmQcK4hY9aMVsngg9v1mw5",
    "Header": {
        ...
      "Accounts": [
    ...
      ]
    }
  },
  "BalanceUpdate": {
    "BalanceUpdate": {
      "PreBalance": 412870875328,
      "PostBalance": 412392356516,
      "AccountIndex": 4
    },
    "Currency": {
      "Name": "Wrapped Solana",
        ...
    }
  }
}
```

## Key Points

- **Balance tracking**: Monitor pre and post balances for any account changes
- **Token context**: Each balance update includes full token metadata and currency information
- **Account indexing**: Balance updates reference specific account indices within transactions
- **Comprehensive metadata**: Currency details include mint addresses, symbols, decimals, and program IDs

## Filtering Options

The filter options are defined in the `request.proto` file. You can filter balance updates using the following filters:

```protobuf
message SubscribeBalanceUpdateRequest {
  AddressFilter address = 1;
  AddressFilter token = 2;
}
```

Available filters:
- **address**: Filter by account address
- **token**: Filter by token mint address (e.g., WSOL, USDC)

## Schema Reference

- **Protobuf Schema**: [balance_block_message.proto](https://github.com/bitquery/streaming_protobuf/blob/main/solana/block_message.proto)
- **Sample Data**: [solana_balance.json](https://github.com/bitquery/grpc-code-samples/blob/main/data-sample/solana_balance.json)

## Python Installation

For Python development, install the protobuf package:

```bash
pip install bitquery-corecast-proto
```

## NPM Package

```bash
npm install bitquery-corecast-proto
```

This package includes all necessary protobuf definitions without requiring manual downloads.

---

## Related

- [CoreCast Introduction](https://docs.bitquery.io/docs/grpc/solana/introduction/) — Topics and concepts
- [Transfers gRPC](https://docs.bitquery.io/docs/grpc/solana/topics/transfer/) — Token transfers
- [Solana Balance Updates (GraphQL)](https://docs.bitquery.io/docs/blockchain/Solana/solana-balance-updates/) — WebSocket subscriptions
- [Authorization](https://docs.bitquery.io/docs/grpc/solana/authorisation/) — Token setup
