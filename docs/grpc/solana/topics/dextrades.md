---
title: "Solana DEX Trades - gRPC Stream (CoreCast)"
description: "Real-time DEX trade data via Solana gRPC. Pump.fun, Raydium, Orca. Protobuf, filter by program, pool, token, trader."
keywords: ["solana grpc", "grpc solana", "CoreCast", "Solana DEX stream", "dex trades"]
---

# Solana DEX Trades gRPC Stream

The `dex_trades` gRPC Stream provides real-time DEX trade/swap data across supported Solana protocols (Pump.fun, Raydium, Orca, Jupiter, and more).

---

## Overview

Subscribe to live DEX swaps with context-aware filtering. Each event includes transaction details, token context, trade amounts, and market address. Data is in **protobuf format** — use `bitquery-corecast-proto` to parse.

:::note Filters required
At least one filter per subscription. See [Filtering Options](#filtering-options).
:::

---

## Quick Example (Node.js)

Subscribe to Pump.fun DEX trades and log each event:

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
  program: { addresses: ['6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'] }  // Pump.fun
};

const stream = client.DexTrades(request, metadata);
stream.on('data', (msg) => {
  if (msg.Trade) {
    const dex = msg.Trade.Dex?.ProtocolName || '?';
    const base = msg.Trade.Market?.BaseCurrency?.Symbol || '?';
    console.log(`[${dex}] Trade: ${base}`);
  }
});
stream.on('error', (err) => console.error(err));
```

Run: `npm install @grpc/grpc-js bitquery-corecast-proto` then `BITQUERY_TOKEN=ory_at_xxx node index.js`

---

## Configuration

To subscribe to DEX trades, configure your stream as follows:

```yaml
server:
  address: "corecast.bitquery.io"
  authorization: "<your_api_token>"
  insecure: false

stream:
  type: "dex_trades"

filters:
  programs:
    - "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"  # Pump.fun example
```

---

## Available Data

The DEX trades stream provides comprehensive trade information including:

- **Transaction details**: Slot, signature, status, fees
- **Account information**: Signers, token accounts, program IDs
- **Token context**: Mint addresses, decimals, owners
- **Trade specifics**: Amounts, protocols, pools
- **Balance updates**: Pre/post balances for accounts and token accounts, showing pool liquidity changes

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
    "Status": {
      "Success": true,
      "ErrorMessage": ""
    },
    "Header": {
      ...
      "Accounts": [...]
    }
  },
  "Trade": {
    "InstructionIndex": 9,
    "Dex": {
      "ProgramAddress": "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA",
      "ProtocolName": "pump_amm",
      "ProtocolFamily": "Pumpswap"
    },
    "Market": {
      "MarketAddress": "6pSvYm5Yff625pUPAWNDmhccHMqw1itAyjoV2DGpDTDJ",
      "BaseCurrency": {
        ...
      },
      "QuoteCurrency": {
        ...
      }
    },
    "Buy": {
      "Amount": 2797967683010,
      "Currency": {
        ...
      },
      "Account": {
        ...
      }
    },
    "Sell": {
      "Amount": 6645427517,
      "Currency": {
        ...
      },
      "Account": {
        ...
      }
    }
  }
}
```

## Key Points

- **No price data**: Prices are not included as they're not on-chain information. Calculate prices from token amounts and decimals.
- **Token context**: Each token account includes mint address, owner, decimals, and program ID.
- **Multiple protocols**: Supports various DEX protocols on Solana.

## Filtering Options

The filter options are defined in the `request.proto` file. You can filter DEX trades using the following filters:

```protobuf
message SubscribeTradesRequest {
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

## Schema Reference

- **Protobuf Schema**: [dex_block_message.proto](https://github.com/bitquery/streaming_protobuf/blob/main/solana/dex_block_message.proto)
- **Sample Data**: [solana_trade.json](https://github.com/bitquery/grpc-code-samples/blob/main/data-sample/solana_trade.json)

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
- [Pump.fun gRPC Example](https://docs.bitquery.io/docs/grpc/solana/examples/pump-fun-grpc-streams/) — Full Pump.fun app
- [Copy Trading Bot](https://docs.bitquery.io/docs/grpc/solana/examples/grpc-copy-trading-bot/) — Solana copy trading
- [Solana DEX Trades (GraphQL)](https://docs.bitquery.io/docs/blockchain/Solana/solana-dextrades) — WebSocket subscriptions
- [Authorization](https://docs.bitquery.io/docs/grpc/solana/authorisation/) — Token setup
