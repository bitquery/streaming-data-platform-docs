---
title: "Filtering Kafka Streams: Keep Only the Programs, Tokens and DEXs You Need"
sidebar_label: "Filtering Kafka Streams"
description: "Bitquery Kafka topics carry every message for a chain, so filter in the consumer. Python patterns for a Solana program, a DEX, an EVM token and an EVM pool."
keywords:
  - filter Kafka streams
  - Bitquery Kafka filtering
  - Solana Kafka filter program
  - EVM Kafka token filter
  - protobuf consumer filter
---

import FAQ from "@site/src/components/FAQ";

# Filtering Kafka Streams: Keep Only the Programs, Tokens and DEXs You Need

A Bitquery Kafka topic carries every message of its kind for a chain: every Solana transaction on `solana.transactions.proto`, every EVM token transfer on `eth.tokens.proto`. There is no server-side filter. Your consumer decodes each protobuf message, walks the repeated fields inside it, and keeps what matches. This page shows that pattern for four common cases. The snippets assume a working consumer from the [Python](/docs/streams/protobuf/kafka-protobuf-python), [Go](/docs/streams/protobuf/kafka-protobuf-go) or [JavaScript](/docs/streams/protobuf/kafka-protobuf-js) tutorial and the generated `_pb2` modules from the [protobuf schemas](https://github.com/bitquery/streaming_protobuf). Message layouts per chain are on the [Solana](/docs/streams/protobuf/chains/Solana-protobuf/), [EVM](/docs/streams/protobuf/chains/EVM-protobuf/), [Bitcoin](/docs/streams/protobuf/chains/Bitcoin-protobuf/) and [Tron](/docs/streams/protobuf/chains/Tron-protobuf/) pages.

Two habits keep a filtering consumer fast. Compare addresses in one canonical form, base58 strings on Solana and lowercase hex on EVM chains, converted once per message rather than once per comparison. And stop walking a message as soon as it matches; `break` out of the inner loop and move on.

## One Solana program and its methods

Topic `solana.transactions.proto`, message `ParsedIdlBlockMessage`. Each transaction holds `ParsedIdlInstructions`; an instruction's `Program` carries the program address and the decoded method name.

```python
import base58
from solana import parsed_idl_block_message_pb2

TARGET_PROGRAM_ADDRESS = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"  # pump.fun
TARGET_METHODS = {"buy", "sell"}


def process_message(message):
    block = parsed_idl_block_message_pb2.ParsedIdlBlockMessage()
    block.ParseFromString(message.value())

    for tx in block.Transactions:
        for instruction in tx.ParsedIdlInstructions:
            if not instruction.HasField("Program"):
                continue
            program = instruction.Program
            if (
                base58.b58encode(program.Address).decode() == TARGET_PROGRAM_ADDRESS
                and program.Method in TARGET_METHODS
            ):
                print("match", base58.b58encode(tx.Signature).decode(), program.Method)
                break  # one match is enough; stop walking this transaction
```

## One DEX on Solana

Topic `solana.dextrades.proto`, message `DexParsedBlockMessage`. Each transaction holds `Trades`; a trade's `Dex` carries the program address of the exchange.

```python
import base58
from solana import dex_block_message_pb2

TARGET_DEX_PROGRAM = "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"  # PumpSwap


def process_message(message):
    block = dex_block_message_pb2.DexParsedBlockMessage()
    block.ParseFromString(message.value())

    for tx in block.Transactions:
        for trade in tx.Trades:
            if not trade.HasField("Dex"):
                continue
            if base58.b58encode(trade.Dex.ProgramAddress).decode() == TARGET_DEX_PROGRAM:
                print("trade on target DEX", base58.b58encode(tx.Signature).decode())
                break
```

To narrow to one market, compare the pool or market account on the trade as well; the [Solana stream page](/docs/streams/protobuf/chains/Solana-protobuf/) lists the fields under `DexTradeEvent`.

## One token contract on an EVM chain

Topic `eth.tokens.proto` (or `bsc.tokens.proto`, `base.tokens.proto`), message `TokenBlockMessage`. The message is a flat list of `Transfers`; each transfer carries `Sender`, `Receiver`, `Amount` and a `Currency` with the token's `SmartContract` and `Decimals`. Addresses are raw bytes, so convert them to lowercase hex once.

```python
from evm import token_block_message_pb2

TARGET_TOKEN = "0xdac17f958d2ee523a2206206994597c13d831ec7"  # USDT on Ethereum


def process_message(message):
    block = token_block_message_pb2.TokenBlockMessage()
    block.ParseFromString(message.value())

    for transfer in block.Transfers:
        token = "0x" + transfer.Currency.SmartContract.hex()
        if token != TARGET_TOKEN:
            continue
        amount = int.from_bytes(transfer.Amount, "big") / 10 ** transfer.Currency.Decimals
        print(
            "0x" + transfer.Sender.hex(),
            "->",
            "0x" + transfer.Receiver.hex(),
            amount,
            transfer.Currency.Symbol,
            "0x" + transfer.TransactionHeader.Hash.hex(),
        )
```

Swap the comparison for a set of wallet addresses to watch deposits and withdrawals; the [exchange wallet monitor](/docs/usecases/binance-exchange-wallet-monitoring) is a complete consumer built that way.

## One pool or protocol on an EVM chain

Topic `eth.dextrades.proto`, message `DexBlockMessage`. The message is a flat list of `Trades`; each trade's `Dex` carries the pool contract in `SmartContract` plus `ProtocolName` and `ProtocolFamily`, and `Buy` and `Sell` each hold the counterparties and the assets that moved.

```python
from evm import dex_block_message_pb2

TARGET_POOL = "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640"  # Uniswap v3 USDC/WETH 0.05%


def process_message(message):
    block = dex_block_message_pb2.DexBlockMessage()
    block.ParseFromString(message.value())

    for trade in block.Trades:
        if "0x" + trade.Dex.SmartContract.hex() != TARGET_POOL:
            continue
        bought = trade.Buy.Assets[0] if trade.Buy.Assets else None
        print(
            trade.Dex.ProtocolName,
            "buyer", "0x" + trade.Buy.Buyer.hex(),
            "usd", bought.AmountInUSD if bought else None,
            "0x" + trade.TransactionHeader.Hash.hex(),
        )
```

Filter on `trade.Dex.ProtocolFamily` instead of the pool to keep every trade of one protocol, or on `trade.Buy.Buyer` and `trade.Sell.Seller` to follow a trader.

<FAQ
  items={[
    { q: "Can I filter a Bitquery Kafka topic on the server?", a: "No. Each topic carries every message of its type for a chain. Decode the protobuf in your consumer, walk the repeated fields and keep what matches; the snippets on this page are that pattern." },
    { q: "Which field identifies a Solana program in the transactions stream?", a: "ParsedIdlInstructions on each transaction; the Program message inside an instruction carries Address (bytes, base58 when encoded) and Method, the decoded instruction name." },
    { q: "How do I compare EVM addresses from protobuf bytes?", a: "Call .hex() on the bytes field and prefix 0x; the result is lowercase, so compare against lowercase targets. Convert once per message, not once per comparison." },
    { q: "Where is the transaction hash on EVM token and DEX messages?", a: "Each TokenTransfer and DexTrade carries its own TransactionHeader with Hash, From and To, because these messages are flat lists of transfers or trades rather than nested per transaction." },
    { q: "Does filtering slow the consumer down?", a: "Decoding dominates the cost and happens whether you filter or not. Walking the fields is cheap; break out of loops on the first match and avoid re-encoding addresses inside loops." },
  ]}
/>

## Related pages

- [Kafka streams hub](/docs/category/kafka-streams)
- [Python Kafka tutorial](/docs/streams/protobuf/kafka-protobuf-python)
- [EVM protobuf streams](/docs/streams/protobuf/chains/EVM-protobuf/)
- [Solana protobuf streams](/docs/streams/protobuf/chains/Solana-protobuf/)
- [Sniper trade with Kafka](/docs/streams/sniper-trade-using-bitquery-kafka-stream)
