# Solana DEX Pools gRPC Stream

The `dex_pools` gRPC Stream provides real-time DEX pool liquidity and balance change data across supported Solana protocols.

## Configuration

To subscribe to DEX pool events, configure your stream as follows:

```yaml
stream:
  type: "dex_pools"
```

## Available Data

The DEX pools stream provides comprehensive pool information including:

- **Transaction details**: Slot, signature, status, fees
- **Account information**: Signers, token accounts, program IDs
- **Token context**: Mint addresses, decimals, owners, metadata
- **Pool specifics**: Market addresses, base/quote currencies, liquidity changes
- **Balance updates**: Pre/post balances showing pool liquidity changes and token account updates
- **Instruction details**: Parsed instruction data with arguments and account names

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
  "PoolEvent": {
    "InstructionIndex": 8,
    "Dex": {
      "ProgramAddress": "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA",
      "ProtocolName": "pump_amm",
      "ProtocolFamily": "Pumpswap"
    },
    "Market": {
      "MarketAddress": "DMoLXDc89o5cUUuvXiteSC3egpcKFwpcjevZrzqLU1o8",
      "BaseCurrency": {
        "Name": "Wrapped Solana",
        "Decimals": 9,
        "Symbol": "WSOL",
        "MintAddress": "So11111111111111111111111111111111111111112",
        "ProgramAddress": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
      },
      "QuoteCurrency": {
        "Name": "10/1",
        "Decimals": 6,
        "Symbol": "10/1",
        "MintAddress": "BvtbWHDU5sNwtNitWYmNBAEu6Dfu5TWDBnTBHR7w4HZt",
        "ProgramAddress": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
      }
    },
    "BaseCurrency": {
      "ChangeAmount": 38023549,
      "PostAmount": 166166127607
    },
    "QuoteCurrency": {
      "ChangeAmount": -76102597,
      "PostAmount": 333332214494
    },
    "Instruction": {
      "Index": 8,
      "Program": {
        "Address": "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA",
        "Name": "pump_amm",
        "Method": "sell"
      },
      "Arguments": [
        {
          "Name": "base_amount_in",
          "Type": "u64",
          "UInt": 38023549
        },
        {
          "Name": "min_quote_amount_out",
          "Type": "u64",
          "UInt": 38103732
        }
      ],
    ...
    },
    "BalanceUpdates": [
      {
        "PreBalance": 40062829,
        "PostBalance": 2039280,
        "AccountIndex": 1
      }
    ],
    "TokenBalanceUpdates": [
      {
        "PreBalance": 166128104058,
        "PostBalance": 166166127607,
        "AccountIndex": 3
      },
      {
        "PreBalance": 333408317091,
        "PostBalance": 333332214494,
        "AccountIndex": 4
      }
    ]
  }
}
```

## Filtering Options

You can filter DEX pool events by:

- **Addresses**: `program`,`account`
- **Tokens**: Specific mint addresses (e.g., WSOL, USDC)
- **Pool addresses**: Specific market/pool addresses
- **Protocols**: Specific DEX protocols or families
- **Value thresholds**: Minimum liquidity change amounts

## Pool Event Types

The DEX pools stream captures various pool-related events:

- **Liquidity additions**: When liquidity is added to pools
- **Liquidity removals**: When liquidity is withdrawn from pools
- **Swap events**: When trades occur that affect pool balances
- **Pool creation**: When new pools are created
- **Pool updates**: When pool parameters are modified

## Schema Reference

- **Protobuf Schema**: [dex_block_message.proto](https://github.com/bitquery/streaming_protobuf/blob/main/solana/dex_block_message.proto)
- **Sample Data**: [solana_pool_event.json](https://github.com/bitquery/grpc-code-samples/blob/main/data-sample/solana_dex_pool.json)

## Python Installation

For Python development, install the protobuf package:

```bash
pip install bitquery-corecast-proto
```

This package includes all necessary protobuf definitions without requiring manual downloads.
