# Solana Transfers gRPC Stream

The `transfers` gRPC Stream provides real-time token and SOL transfer data across the Solana blockchain.

## Configuration

To subscribe to transfers, configure your stream as follows:

```yaml
stream:
  type: "transfers"
```

## Available Data

The transfers stream provides comprehensive transfer information including:

- **Transaction details**: Slot, signature, status, fees
- **Account information**: Signers, token accounts, program IDs
- **Token context**: Mint addresses, decimals, owners, metadata
- **Transfer specifics**: Amounts, sender/receiver addresses, authority information
- **Balance updates**: Pre/post balances for accounts and token accounts

## Sample Data Structure

Here's an example of the data structure you'll receive:

```json
{
  "Block": {
    "Slot": 370428239
  },
  "Transaction": {
    "Index": 776,
    "Signature": "2knhEScuNwtKYXw86X59iY1UDnETUGXpB4r54i26T9Th1k3zCZC9ZXeBfvXCfBHAxyG7PZg3GTdxQSzzXP8Rzyyo",
    ...
  },
  "Transfer": {
    "InstructionIndex": 10,
    "Amount": 45212952,
    "Sender": {
      "Address": "CjUfYX9UYiJAmvguVWXZusqQdPDSMPRfhmQRMnH6cYJC",
      "IsSigner": false,
      "IsWritable": true,
      "Token": {
        "Mint": "So11111111111111111111111111111111111111112",
        "Owner": "B4YMuvqf5o5uSxBXLZozC4BQKrpo2aHk5DXSquyHZ2fb",
        "Decimals": 9,
        "ProgramId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
      }
    },
    "Receiver": {
      "Address": "866SWVmbZDQjQFwe8RS1zRrwQKo2RBS7WZfxSGc18Guo",
      "IsSigner": false,
      "IsWritable": true,
      "Token": {
        "Mint": "So11111111111111111111111111111111111111112",
        "Owner": "CAVE3Fc6dH3zwEreMvXuBiEMjvPXeqkJfyT2VFHngxyQ",
        "Decimals": 9,
        "ProgramId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
      }
    },
    "Authority": {
      "Address": "B4YMuvqf5o5uSxBXLZozC4BQKrpo2aHk5DXSquyHZ2fb",
      "IsSigner": true,
      "IsWritable": true
    },
    "Currency": {
      "Name": "Wrapped Solana",
      "Decimals": 9,
      "Symbol": "WSOL",
      "MintAddress": "So11111111111111111111111111111111111111112"
    },
    "Instruction": {
      "Index": 10,
      "Program": {
        "Address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        "Name": "spl_token_2022",
        "Method": "transferChecked"
      },
      "Arguments": [
        {
          "Name": "amount",
          "Type": "u64",
          "UInt": 45212952
        },
        {
          "Name": "decimals",
          "Type": "u8",
          "UInt": 9
        }
      ],
      "AccountNames": [
        "source",
        "mint",
        "destination",
        "authority"
      ]
    },
    "BalanceUpdates": [
      {
        "PreBalance": 47252232,
        "PostBalance": 2039280,
        "AccountIndex": 1
      },
      {
        "PreBalance": 148077284154,
        "PostBalance": 148122497106,
        "AccountIndex": 3
      }
    ],
    "TokenBalanceUpdates": [
      {
        "PreBalance": 148075244874,
        "PostBalance": 148120457826,
        "AccountIndex": 3
      }
    ]
  }
}
```


## Filtering Options

The filter options are defined in the `request.proto` file. You can filter transfers using the following filters:

```protobuf
message SubscribeTransfersRequest {
  AddressFilter sender = 1;
  AddressFilter receiver = 2;
  AddressFilter token = 3;
}
```

Available filters:
- **sender**: Filter by sender's address
- **receiver**: Filter by receiver's address
- **token**: Filter by token mint address (e.g., WSOL, USDC)

## Transfer Types

The transfers stream captures various transfer-related events:

- **SPL Token transfers**: Standard token transfers using SPL Token program
- **SPL Token 2022 transfers**: Enhanced token transfers with additional features
- **SOL transfers**: Native Solana transfers
- **Authority transfers**: Transfers authorized by token authorities

## Transfer Data Fields

- **Amount**: The amount being transferred (in smallest unit)
- **Sender**: The source account/token account
- **Receiver**: The destination account/token account
- **Authority**: The account that authorized the transfer
- **Currency**: Token information including mint address and decimals
- **InstructionIndex**: The position of the transfer instruction in the transaction


## Schema Reference

- **Protobuf Schema**: [dex_block_message.proto](https://github.com/bitquery/streaming_protobuf/blob/main/solana/dex_block_message.proto)
- **Sample Data**: [solana_transfer.json](https://github.com/bitquery/grpc-code-samples/blob/main/data-sample/solana_transfer.json)

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

