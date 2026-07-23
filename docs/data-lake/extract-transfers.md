---
title: Extract Transfers from a Block
description: "Extract Transfers from a Block: Bitquery documentation with GraphQL examples, real-time streams, and integration guidance."
keywords:
  - blockchain transfers
  - ERC-20 transfer parsing
  - extract transfers from block
  - protobuf block parsing
  - token transfer decoder
sidebar_position: 2
---
# Extract Transfers from a Block

This page shows how to pull transfers out of a streamed block. It builds on the streaming and decoding steps from the [overview](./), so it assumes you already have a decoded `BlockMessage`.

## Where transfers live in a block

A block does not carry a ready-made "transfers" list. Transfers are derived from two places:

1. **Native transfers.** The value moved by a transaction itself sits in `TransactionHeader.Value`, moving from `From` to `To`. Value moved by internal calls sits inside `Trace`.
2. **Token transfers.** ERC-20 and ERC-721 transfers are emitted as `Transfer` events in each transaction's receipt logs. You recognize them by the event signature in the first topic.

The token case is the common one, so we focus on it and cover native transfers at the end.

## How a token Transfer event is shaped

Every ERC-20 and ERC-721 `Transfer(address,address,uint256)` event has the same log layout:

- `Topics[0]` is the event signature hash, always `0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef`.
- `Topics[1]` is the sender, and `Topics[2]` is the recipient. An indexed address is right-aligned in a 32-byte topic, so the address is the last 20 bytes.
- For **ERC-20**, the amount is the 32-byte `LogHeader.Data`. There are exactly 3 topics.
- For **ERC-721**, there is a 4th topic, `Topics[3]`, holding the token id, and `Data` is empty.
- `LogHeader.Address` is the token contract that emitted the event.

A note on bytes: in the decoded protobuf object these fields are raw bytes. The base64 you see in JSON output is only how JSON renders bytes.

## The parser

```python
from evm.block_message_pb2 import BlockMessage

# Transfer(address,address,uint256) event signature
TRANSFER = bytes.fromhex(
    "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
)

def topic_address(topic):
    # an indexed address is the last 20 bytes of a 32-byte topic
    return "0x" + topic[-20:].hex()

def transfers_from_block(block):
    out = []
    for tx in block.Transactions:
        th = tx.TransactionHeader
        tx_hash = "0x" + th.Hash.hex()

        # 1. native transfer carried by the transaction itself
        value = int.from_bytes(th.Value, "big")
        if value > 0:
            out.append({
                "type": "native", "tx": tx_hash, "token": None,
                "from": "0x" + th.From.hex(), "to": "0x" + th.To.hex(),
                "amount": value,
            })

        # 2. token transfers emitted as Transfer events in the logs
        if not tx.HasField("Receipt"):
            continue
        for log in tx.Receipt.Logs:
            t = log.Topics
            if len(t) < 3 or t[0].Hash != TRANSFER:
                continue
            token = "0x" + log.LogHeader.Address.hex()
            frm, to = topic_address(t[1].Hash), topic_address(t[2].Hash)
            if len(t) == 3:                       # ERC-20: amount is in data
                out.append({
                    "type": "erc20", "tx": tx_hash, "token": token,
                    "from": frm, "to": to,
                    "amount": int.from_bytes(log.LogHeader.Data, "big"),
                })
            elif len(t) == 4:                     # ERC-721: token id is topic 3
                out.append({
                    "type": "erc721", "tx": tx_hash, "token": token,
                    "from": frm, "to": to,
                    "token_id": int.from_bytes(t[3].Hash, "big"),
                })
    return out
```

## Run it

In the [sample repo](https://github.com/bitquery/blockchain-data-lake-sample) this parser lives in `transfers.py`, and `stream.py` calls it behind a `--transfers` flag, so you can run it directly against a streamed block:

```bash
# extract transfers, print a breakdown and the first 10
python stream.py --bucket archive --key "$KEY" --transfers

# only a given token, print the first 5
python stream.py --bucket archive --key "$KEY" --transfers 5 --token 0x4200000000000000000000000000000000000006
```

Against the sample Base block this is what comes back:

```
  469 transfers  {'erc20': 422, 'native': 28, 'erc721': 19}

  [erc20] 0x4200000000000000000000000000000000000006  0x498581ff718922c3f8e6a244956af099b2652b2b -> 0xbf4195ab0b03e1eb3345dd1e83bed7650b1ed123  amount 3390958905493657
  [erc20] 0x4200000000000000000000000000000000000006  0xbf4195ab0b03e1eb3345dd1e83bed7650b1ed123 -> 0xf60633d02690e2a15a54ab919925f3d038df163e  amount 3221410960218975
```

The block holds 469 transfers in total: 422 ERC-20, 28 native, and 19 ERC-721. The token `0x4200000000000000000000000000000000000006` is WETH on Base.

To call the function yourself on a decoded block:

```python
from transfers import transfers_from_block

transfers = transfers_from_block(block)   # block is a decoded BlockMessage
```

## Turning raw amounts into human values

`amount` is the raw integer in the token's smallest unit. To get a human-readable value, divide by `10 ** decimals`, where `decimals` is a property of the token contract. WETH has 18 decimals, so `3390958905493657 / 10**18` is about `0.00339` WETH. The block does not carry token decimals, so you keep a small lookup of token metadata, or read `decimals()` from the contract once and cache it.

## Extending the parser

- **Native internal transfers.** Value moved by internal calls is in `tx.Trace`. Walk the calls and read the value on each `CALL` that carries one. The execution detail in the trace lets you attribute these precisely.
- **Wrapped-native deposits and withdrawals.** WETH-style contracts emit `Deposit` and `Withdrawal` events rather than `Transfer`, so add those signatures if you want to capture wrapping.
- **Other chains.** The same shape applies with the matching schema module: `solana`, `tron`, or `utxo` from `bitquery-pb2-kafka-package`. The log and event model differs per chain, so the topic filtering above is EVM-specific.

The point is that the lake gives you the full block, and the protobuf schema describes every field, so a transfer extractor is a short, self-contained pass over the decoded message.
