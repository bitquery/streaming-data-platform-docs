# Solana Balance Updates gRPC Stream

The `balance` gRPC Stream provides real-time balance update data for Solana accounts and token accounts.

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

You can filter balance updates by:

- **Addresses**: `senders`, `receivers`, `program_ids`
- **Tokens**: Specific mint addresses (e.g., WSOL, USDC)
- **Value thresholds**: Minimum balance change amounts
- **Account types**: Native accounts vs token accounts

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
