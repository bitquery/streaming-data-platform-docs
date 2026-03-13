---
title: "Solana DEX Orders - gRPC Stream (CoreCast)"
description: "Real-time DEX order book data via Solana gRPC. OpenBook, Serum. Filter by program, pool, token."
keywords: ["solana grpc", "grpc solana", "CoreCast", "Solana DEX orders", "order book"]
---

# Solana DEX Orders gRPC Stream

The `dex_orders` gRPC Stream provides real-time DEX order placement and execution data across supported Solana protocols.

---

## Overview

Subscribe to live DEX order book events (place, cancel, fill) from OpenBook, Serum, and other order-book DEXs. Each event includes order details, market info, and balance updates. Data is in **protobuf format** — use `bitquery-corecast-proto` to parse.

---

## Quick Example (Node.js)

Subscribe to OpenBook orders and log each event:

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
  program: { addresses: ['opnb2LAfJYbRMAHHvqjCwQxanZn7ReEHp1k81EohpZb'] }  // OpenBook v2
};

const stream = client.DexOrders(request, metadata);
stream.on('data', (msg) => {
  if (msg.Order) {
    const dex = msg.Order.Dex?.ProtocolName || '?';
    const side = msg.Order.Order?.BuySide ? 'BUY' : 'SELL';
    console.log(`[${dex}] Order: ${side}`);
  }
});
stream.on('error', (err) => console.error(err));
```

Run: `npm install @grpc/grpc-js bitquery-corecast-proto` then `BITQUERY_TOKEN=ory_at_xxx node index.js`

---

## Configuration

To subscribe to DEX orders, configure your stream as follows:

```yaml
stream:
  type: "dex_orders"
```

## Available Data

The DEX orders stream provides comprehensive order information including:

- **Transaction details**: Slot, signature, status, fees
- **Account information**: Signers, token accounts, program IDs
- **Token context**: Mint addresses, decimals, owners, metadata
- **Order specifics**: Order IDs, prices, amounts, order types, buy/sell sides
- **Market data**: Market addresses, base/quote currencies, order books
- **Balance updates**: Pre/post balances for accounts and token accounts

## Sample Data Structure

Here's an example of the data structure you'll receive:

```json
{
  "Block": {
    "Slot": 370028492
  },
  "Transaction": {
    "Index": 779,
    "Signature": "2eoFGRLxJFXhLGBXS4dPgSGYfjF9yGx3Tfc4EgJqrndiMqTX22SZwaH1E8E8p7333z2CWqofY8YvJgB7DN6hJv1L",
    ...
  },
  "Order": {
    "InstructionIndex": 7,
    "Type": 0,
    "Dex": {
      "ProgramAddress": "opnb2LAfJYbRMAHHvqjCwQxanZn7ReEHp1k81EohpZb",
      "ProtocolName": "openbook_v2",
      "ProtocolFamily": "OpenBook"
    },
    "Market": {
      "MarketAddress": "6NtxTCJuhNixA5Z2MBT4mrCuBk7qLQ69htcCNfySdu7J",
      "BaseCurrency": {
        ...
      },
      "QuoteCurrency": {
        ...
      }
    },
    "Order": {
      "OrderId": "11111111",
      "BuySide": true,
      "LimitPrice": 9223372036854775807,
      "LimitAmount": 92233720368547,
      "Account": "2qwiCSJJuDz3AX39LvgSGhPKoWeTSBAJvqzNwYNQAavj",
      "Owner": "2qwiCSJJuDz3AX39LvgSGhPKoWeTSBAJvqzNwYNQAavj",
      "Mint": "So11111111111111111111111111111111111111112"
    },
    "Instruction": {
      "Index": 7,
      "Program": {
        "Address": "opnb2LAfJYbRMAHHvqjCwQxanZn7ReEHp1k81EohpZb",
        "Name": "openbook_v2",
        "Method": "placeTakeOrder"
      },
      "Arguments": [
        {
          "Name": "args",
          "Type": "PlaceTakeOrderArgs",
          "Json": "{\"side\":0,\"priceLots\":9223372036854775807,\"maxBaseLots\":92233720368547,\"maxQuoteLotsIncludingFees\":443279519,\"orderType\":3,\"limit\":50}"
        }
      ],
      "AccountNames": [
        "signer",
        "penaltyPayer",
        "market",
        "marketAuthority",
        "bids",
        "asks",
        "marketBaseVault",
        "marketQuoteVault",
        "eventHeap",
        "userBaseAccount",
        "userQuoteAccount"
      ]
    },
    "BalanceUpdates": [
      {
        "PreBalance": 13595078208,
        "PostBalance": 13151798872,
        "AccountIndex": 2
      }
    ],
    "TokenBalanceUpdates": [
      {
        "PreBalance": 13593036926,
        "PostBalance": 13149757590,
        "AccountIndex": 2
      },
      {
        "PreBalance": 77176413,
        "PostBalance": 436576413,
        "AccountIndex": 3
      }
    ]
  }
}
```

## Key Points

- **Order tracking**: Monitor real-time order placement and execution on DEX order books
- **Order book data**: Access to bids, asks, and order book state changes
- **Token metadata**: Comprehensive token information including metadata and collection details
- **Instruction parsing**: Detailed instruction data with arguments and account mappings
- **Balance changes**: Track both native SOL and token balance updates
- **Multiple protocols**: Supports various DEX protocols including OpenBook, Serum, and other order book DEXs

## Filtering Options

The filter options are defined in the `request.proto` file. You can filter DEX orders using the following filters:

```protobuf
message SubscribeOrdersRequest {
  AddressFilter program = 1;
  AddressFilter pool = 2;
  AddressFilter token = 3;
  AddressFilter trader = 4;
}
```

Available filters:
- **program**: Filter by DEX program address
- **pool**: Filter by specific pool/market address
- **token**: Filter by token mint address (e.g., WSOL, USDC)
- **trader**: Filter by trader's wallet address


## Order Data Fields

- **OrderId**: Unique identifier for the order
- **BuySide**: Boolean indicating if it's a buy order (true) or sell order (false)
- **LimitPrice**: The price limit for the order
- **LimitAmount**: The maximum amount to be traded
- **Account**: The order account address
- **Owner**: The order owner address
- **Payer**: The account paying for the order
- **Mint**: The token mint address for the order

## Schema Reference

- **Protobuf Schema**: [dex_block_message.proto](https://github.com/bitquery/streaming_protobuf/blob/main/solana/dex_block_message.proto)
- **Sample Data**: [solana_dex_order.json](https://github.com/bitquery/grpc-code-samples/blob/main/data-sample/solana_dex_order.json)

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
- [DEX Trades gRPC](https://docs.bitquery.io/docs/grpc/solana/topics/dextrades/) — DEX swap stream
- [Copy Trading Bot](https://docs.bitquery.io/docs/grpc/solana/examples/grpc-copy-trading-bot/) — Uses dex_orders
- [Authorization](https://docs.bitquery.io/docs/grpc/solana/authorisation/) — Token setup

