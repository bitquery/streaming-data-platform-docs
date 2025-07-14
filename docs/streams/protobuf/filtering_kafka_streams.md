# Filtering Kafka Streams for Specific Usecases

In this section, we will see code examples and patterns for filtering Kafka stream messages based on specific criteria — such as smart contract methods, token addresses, DEX interactions, and more.

These examples assume you’ve already set up a working Kafka consumer and are subscribed to a compatible Bitquery Kafka topic.

Refer to specific pages for topic and message related explanation.

- [Solana](https://docs.bitquery.io/docs/streams/protobuf/chains/Solana-protobuf/)
- [EVM including ETH, BSC, Base etc](https://docs.bitquery.io/docs/streams/protobuf/chains/EVM-protobuf/)
- [Bitcoin](https://docs.bitquery.io/docs/streams/protobuf/chains/Bitcoin-protobuf/)
- [Tron](https://docs.bitquery.io/docs/streams/protobuf/chains/Tron-protobuf/)

## Filtering for a specific program and method in Solana

We will use the `solana.transactions.proto` topic for this usecase.

```python
def process_message(message):
    try:
        buffer = message.value()
        tx_block = parsed_idl_block_message_pb2.ParsedIdlBlockMessage()
        tx_block.ParseFromString(buffer)

        # print("\nNew Message Received")

        for tx in tx_block.Transactions:
            include_transaction = False

    # Check if any instruction in this transaction matches the target program address AND method
            for instruction in tx.ParsedIdlInstructions:
                if instruction.HasField("Program"):
                     program = instruction.Program
                     program_address = base58.b58encode(program.Address).decode()
                     method_name = program.Method

                     if (
                        program_address == TARGET_PROGRAM_ADDRESS
                        and method_name in TARGET_METHODS
                    ):
                        include_transaction = True
                        break  # Found matching instruction, no need to check further

            if include_transaction:
                print("\nMatching Transaction Details:")
                print(f"Transaction Signature: {base58.b58encode(tx.Signature).decode()}")
                print(f"Transaction Index: {tx.Index}")

```

## Filtering for a Specific Token Trade on Solana

We will use the `solana.dextrades.proto` topic for this usecase.

```python
def process_message(message):
    try:
        buffer = message.value()
        tx_block = dex_block_message_pb2.DexParsedBlockMessage()
        tx_block.ParseFromString(buffer)

        for tx in tx_block.Transactions:
            include_transaction = False
            for trade in tx.Trades:

                if trade.HasField("Dex"):
                    dexinfo_field = trade.Dex
                    program_address = base58.b58encode(dexinfo_field.ProgramAddress).decode()
                    if program_address == TARGET_PROGRAM_ADDRESS: # This is your DEX Address, e.g. Raydium, PumpSwap
                        include_transaction = True
                        break

            if include_transaction:
                print("\n Matching Transaction Found!\n")
                print(f"Transaction Signature: {base58.b58encode(tx.Signature).decode()}")
                print(f"Transaction Index: {tx.Index}")
                print("Full Transaction Data:\n")
```

## Filtering Mempool Streams on EVM Chains


