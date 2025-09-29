# Solana DEX Trades gRPC Stream

The `dex_trades` gRPC Stream provides real-time DEX trade/swap data across supported Solana protocols. 

## Configuration

To subscribe to DEX trades, configure your stream as follows:

```yaml
stream:
  type: "dex_trades"
```

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

You can filter DEX trades by:

- **Addresses**: `senders`, `receivers`, `program_ids`
- **Tokens**: Specific mint addresses (e.g., WSOL, USDC)
- **Value thresholds**: Minimum trade amounts
- **Protocols**: Specific DEX protocols or pools

## Schema Reference

- **Protobuf Schema**: [dex_block_message.proto](https://github.com/bitquery/streaming_protobuf/blob/main/solana/dex_block_message.proto)
- **Sample Data**: [solana_trade.json](https://github.com/bitquery/grpc-code-samples/blob/main/data-sample/solana_trade.json)

## Python Installation

For Python development, install the protobuf package:

```bash
pip install bitquery-corecast-proto
```

This package includes all necessary protobuf definitions without requiring manual downloads.
