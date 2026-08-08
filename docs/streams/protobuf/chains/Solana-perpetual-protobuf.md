---
title: "Solana Perpetuals Kafka Stream — solana.perpetual.proto"
sidebar_label: "Solana Perpetuals Stream"
description: "Consume Solana perpetual futures data over Kafka: orders, fills, positions, PnL, liquidations, prices and open interest as protobuf messages on solana.perpetual.proto."
keywords:
  - solana perpetuals kafka
  - solana.perpetual.proto
  - perpetual futures kafka stream
  - perp dex kafka
  - phoenix perpetuals stream
  - solana derivatives protobuf
  - kafka liquidations stream
  - low latency perps data
  - solana perp positions stream
  - bitquery kafka topics
---

# Solana Perpetuals Kafka Stream

The `solana.perpetual.proto` topic carries the same perpetual-futures data as the
[Perp DEX API](/docs/perpetuals/) — orders, fills, positions, prices and market
summaries — as **protobuf messages over Kafka**, one message per Solana block. Use it
when you want the lowest-latency delivery, replay from the consumer group's offset, and
you are comfortable running a Kafka consumer instead of a GraphQL WebSocket.

|            |                                                                                  |
| ---------- | -------------------------------------------------------------------------------- |
| **Topic**  | `solana.perpetual.proto`                                                          |
| **Message**| `PerpetualBlockMessage` — [schema on GitHub](https://github.com/bitquery/streaming_protobuf/blob/main/solana/perpetual_block_message.proto) |
| **Brokers**| `rpk0.bitquery.io:9092,rpk1.bitquery.io:9092,rpk2.bitquery.io:9092`               |
| **Auth**   | SASL_PLAINTEXT / SCRAM-SHA-512 (TLS optional on `9093`) — [connection guide](/docs/streams/kafka-streaming-concepts/) |
| **Access** | Kafka stream credentials from the [API request form](https://bitquery.io/forms/api) — not IDE API keys |
| **Venue**  | Phoenix Perpetuals (`phoenix_eternal`) — see the [Phoenix Perpetuals API](/docs/perpetuals/solana/phoenix-perpetuals-api) for market semantics |

## Message anatomy

Every block produces one `PerpetualBlockMessage`:

```
PerpetualBlockMessage
├── Header            BlockHeader — Slot, Timestamp, …
└── Transactions[]    ParsedPerpetualTransaction
    ├── Index, Signature, Status, Header
    ├── Orders[]          order lifecycle events
    ├── Fills[]           executions
    ├── Positions[]       PnL, funding, liquidations
    ├── Prices[]          best bid/ask, mark
    └── MarketSummaries[] open interest, spot index, fee totals
```

The five lists map one-to-one onto the GraphQL cubes, so everything documented on the
[Phoenix Perpetuals API](/docs/perpetuals/solana/phoenix-perpetuals-api) page — order
lifecycle enums, cancel reasons, the multi-row liquidation pattern, cumulative fee
counters — applies here unchanged:

| Kafka list        | GraphQL cube               |
| ----------------- | -------------------------- |
| `Orders`          | `PerpetualOrders`          |
| `Fills`           | `PerpetualFills`           |
| `Positions`       | `PerpetualPositions`       |
| `Prices`          | `PerpetualPrices`          |
| `MarketSummaries` | `PerpetualMarketSummaries` |

Blocks with no perpetual activity still produce a message with an empty
`Transactions` list — a convenient liveness signal for your consumer.

## Reading the schema correctly

These rules come from the schema itself and from consuming the live topic:

- **Everything is already in human units.** Sizes are in asset units, prices and
  amounts in the quote currency. The venue's internal lot/tick arithmetic is resolved
  before publishing, so no decimal scaling is needed on your side.
- **`bytes` fields are raw 32-byte Solana keys** (`Signer`, `Trader`, `Liquidator`,
  `Program`, `Oracle`, mint addresses). Base58-encode them for display. An **empty**
  `bytes` field means the chain named no account — it is never the all-zero address.
- **proto3 drops zero values from the wire — and SOL's asset id is literally `0`.**
  An absent `Asset.Id` means SOL, not "unknown". Join and group on `Asset.Symbol`,
  which is always present, and never treat `Id == 0` as a missing-value sentinel.
- **A perpetual asset has no mint.** GOLD, NVDA or WTIOIL perps have no token on
  Solana; `Id` + `Symbol` are the market's whole identity. The only real mint in the
  message is the quote currency's (`PhUsd` on Phoenix — the venue's canonical quote
  token, backed 1:1 by USDC).
- **`EventIndex` is one counter across all five lists** within a transaction. Use it to
  place a fill against the order that caused it and the mark of the same moment. There
  is no per-event timestamp — time and slot live on `BlockHeader`.
- **`MakerOrderId` XOR `SplineId`** — exactly one is ever set on a fill. A book fill
  names the maker's order (joins back to its placement and cancellation); an AMM fill
  (`CounterpartyIsAmm: true`) names the spline instead.
- **`Collateral` is the account's cross-margin collateral, not this position's
  margin.** One collateral balance covers every market the trader is in, so dividing
  one position's notional by it is not leverage. Real leverage is the sum of
  `|Size × MarkPrice|` across all the trader's markets divided by `Collateral`.
- **`Liquidation` is flagged on every event of the liquidated trader** in that
  transaction — the PnL row that realizes the loss, the forced order, the fill — not
  only on the row typed `"Liquidation"`. Without the flag a forced close is
  indistinguishable from a voluntary one.
- **`MarkPrice` is denormalized** from the same transaction's price events: always
  present on fills, present on roughly 60% of PnL events. When it is `0`, as-of join
  the `Prices` stream on `(Asset, Slot)`.
- **`Amount.Fee` can be negative — that is a maker rebate.**
- **`Prices` rows are a side effect of trading.** The oracle's timer-based
  republication is not part of this stream, so a market that does not trade produces no
  price rows; `SequenceNumber` is per-asset and sparse. Use it for ordering and dedup,
  not as a completeness check.
- **`Trader` vs `Signer`**: `Trader` is the position-owning account (a PDA on
  Phoenix), `Signer` is the wallet that signed. An expiry crank cancelling other
  people's orders carries neither — join those cancels to their placement by
  `Order.Id`.
- **Conditional orders** (stop-loss / take-profit) are addressed by
  `(Trader, Asset.Id, ConditionalId)`, not by book order id. Their `Order.Type` is
  empty on `Conditional*` end events — recover the kind by joining back to the
  placement.

## Quickstart consumer (Python)

Compile the schema (or use the published packages:
[`bitquery-pb2-kafka-package`](https://pypi.org/project/bitquery-pb2-kafka-package/) for Python,
[`bitquery-protobuf-schema`](https://www.npmjs.com/package/bitquery-protobuf-schema) for JS,
[`streaming_protobuf/v2`](https://pkg.go.dev/github.com/bitquery/streaming_protobuf/v2) for Go):

```bash
git clone https://github.com/bitquery/streaming_protobuf.git
pip install confluent-kafka protobuf grpcio-tools base58
python -m grpc_tools.protoc -I streaming_protobuf --python_out=. \
  streaming_protobuf/solana/perpetual_block_message.proto \
  streaming_protobuf/solana/block_message.proto
```

Then consume:

```python
import os, base58
from confluent_kafka import Consumer
from solana import perpetual_block_message_pb2 as perp

conf = {
    "bootstrap.servers": "rpk0.bitquery.io:9092,rpk1.bitquery.io:9092,rpk2.bitquery.io:9092",
    "security.protocol": "SASL_PLAINTEXT",
    "sasl.mechanism": "SCRAM-SHA-512",
    "sasl.username": os.environ["KAFKA_USERNAME"],
    "sasl.password": os.environ["KAFKA_PASSWORD"],
    "group.id": os.environ["KAFKA_USERNAME"] + "-perp-1",
    "auto.offset.reset": "latest",
    "enable.auto.commit": False,
}

consumer = Consumer(conf)
consumer.subscribe(["solana.perpetual.proto"])

while True:
    msg = consumer.poll(1.0)
    if msg is None or msg.error():
        continue
    block = perp.PerpetualBlockMessage()
    block.ParseFromString(msg.value())
    for tx in block.Transactions:
        for f in tx.Fills:
            print(
                block.Header.Slot,
                f.Asset.Symbol,
                f.Side,
                f.Amount.Size,
                "@", f.ExecutionPrice,
                "liq" if f.Liquidation else "",
                base58.b58encode(f.Trader).decode(),
            )
```

Prefix your `group.id` with your Kafka username. Full consumer patterns — TLS,
rebalancing, at-least-once processing — are in the
[examples repository](https://github.com/bitquery/kafka-streams-examples-usecases/blob/main/README.md)
and the language guides:
[Python](/docs/streams/protobuf/kafka-protobuf-python),
[JavaScript](/docs/streams/protobuf/kafka-protobuf-js),
[Go](/docs/streams/protobuf/kafka-protobuf-go).

## Kafka or GraphQL subscription?

| Need                                             | Use                                                                 |
| ------------------------------------------------ | ------------------------------------------------------------------- |
| Lowest latency, full firehose, offset replay     | This Kafka topic                                                    |
| Server-side filtering (one market, one trader)   | [GraphQL subscriptions](/docs/perpetuals/solana/phoenix-perpetuals-api) — filter in `where` |
| Historical queries and aggregations              | [GraphQL queries](/docs/perpetuals/) over the same cubes            |

Kafka delivers everything and you filter client-side; the GraphQL layer filters
server-side but adds the API layer's processing. The underlying events are identical.
