# Solana Transactions gRPC Stream

The `transactions` gRPC Stream provides real-time transaction data across the Solana blockchain.

## Configuration

To subscribe to transactions, configure your stream as follows:

```yaml
stream:
  type: "transactions"
```

## Available Data

The transactions stream provides comprehensive transaction information including:

- **Transaction details**: Slot, signature, status, fees
- **Account information**: Signers, accounts, program IDs
- **Balance updates**: Pre/post balances for all accounts
- **Parsed instructions**: IDL-parsed program calls with arguments and logs
- **Program execution**: Success/failure status and error messages

## Sample Data Structure

Here's an example of the data structure you'll receive:

```json
{
  "Block": {
    "Slot": 370030401
  },
  "Transaction": {
    "Index": 455,
    "Signature": "2gyW9NtqCRwsGGWoeJkGGQNPrQfcDT2dBQxUKXXVcC7QQbNBey9DtQLNkCRn7yU5N1H8YcFQESTC6KbQ7n1HyTwj",
    "Status": {
      "Success": true,
      "ErrorMessage": ""
    },
    "Header": {
        ...
      ],
      "Accounts": [
            ...
      ]
    },
    "TotalBalanceUpdates": [
      {
        "PreBalance": 82844277367,
        "PostBalance": 82844272367,
        "AccountIndex": 0
      },
        ...
    ],
    "ParsedIdlInstructions": [
      {
        "Index": 0,
        "Depth": 0,
        "CallerIndex": -1,
        "ExternalSeqNumber": 1,
        "InternalSeqNumber": 0,
        "Program": {
          "Address": "Vote111111111111111111111111111111111111111",
          "Parsed": true,
          "Name": "vote",
          "Method": "TowerSync",
          ...
        },
        "Accounts": [
          {
            "Address": "C616NHpqpaiYpqVAv619QL73vEqKJs1mjsJLtAuCzMX6",
            "IsSigner": false,
            "IsWritable": true
          },
          {
            "Address": "ETcW7iuVraMKLMJayNCCsr9bLvKrJPDczy1CMVMPmXTc",
            "IsSigner": true,
            "IsWritable": true
          }
        ],
        "Logs": [
          "Program Vote111111111111111111111111111111111111111 invoke [1]",
          "Program Vote111111111111111111111111111111111111111 success"
        ],
        "Data": ...
      }
    ]
  }
}
```

## Key Points

- **Parsed instructions**: IDL-parsed program calls with structured arguments and account names
- **Balance tracking**: Complete pre/post balance changes for all accounts
- **Program logs**: Execution logs showing program invocation and success/failure
- **All programs**: Captures transactions from all Solana programs, not just DEX

## Filtering Options

The filter options are defined in the `request.proto` file. You can filter transactions using the following filters:

```protobuf
message SubscribeTransactionsRequest {
  AddressFilter program = 1;
  AddressFilter signer = 2;
}
```

Available filters:
- **program**: Filter by program address (e.g., Vote, Token, System)
- **signer**: Filter by signer's address

## Schema Reference

- **Protobuf Schema**: [transaction_block_message.proto](https://github.com/bitquery/streaming_protobuf/blob/main/solana/parsed_idl_block_message.proto)
- **Sample Data**: [solana_transaction.json](https://github.com/bitquery/grpc-code-samples/blob/main/data-sample/solana_tx.json)

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
