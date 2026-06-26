---
title: Blockchain Data Lake - Full Archive Streaming, Faster Than a Node
description: Bitquery's Blockchain Data Lake stores the complete chain archive, every block from genesis to tip, as structured protobuf files in SeaweedFS. Stream the full history over an S3 interface at 1–10 Gbps network bandwidth (depending on server), far faster than syncing or querying your own archive node.
keywords:
  - Blockchain data lake
  - Full archive blockchain data
  - Genesis to tip blockchain data
  - Archive node alternative
  - SeaweedFS blockchain
  - Stream blockchain data
  - Protobuf blockchain data
  - High bandwidth blockchain data
  - Historical blockchain data
  - Multi-chain data lake
  - Base blockchain data
  - EVM archive data
  - Blockchain ETL pipeline
  - Web3 data lake
sidebar_position: 1
---

# Blockchain Data Lake

The Bitquery **Blockchain Data Lake** gives you the complete archive of a blockchain. It holds every block from **genesis to the current tip** as structured data that you can stream directly into your own systems. You get the full node dataset without running a node, so there is no syncing, no RPC rate limits, and no indexing infrastructure to operate.

Each block is parsed and normalized by Bitquery and stored as a **Protobuf** message. We publish the [**schema**](https://github.com/bitquery/streaming_protobuf) so you decode it on your side with a single documented definition, which is the same schema used for our Kafka streams. The archive lives as individual block files in **[SeaweedFS](https://github.com/seaweedfs/seaweedfs)**, a highly scalable distributed object store, and it is served over a standard **S3 interface**. Because reads fan out across many storage servers, you can pull the full history at **1–10 Gbps network bandwidth (depending on server)**, limited by your network rather than by a node's export speed.

## Why not just run an archive node?

An archive node is built for consensus and for serving recent state over JSON-RPC. It is not built for handing you the entire chain. Extracting full history from a node means millions of rate-limited RPC calls, days or weeks of wall-clock time, and the cost of running and storing the node yourself. The data also comes back raw and undecoded, so you still have to build the decoding layer.

The data lake works the other way around. The archive is already parsed into a structured Protobuf format and stored as objects, so reading it becomes a bulk, parallel, network-bound operation instead of a slow, serial, CPU- and disk-bound one. You bring our schema and we bring the data.

|                        | Archive node (RPC)          | Bitquery Data Lake (SeaweedFS)                            |
| ---------------------- | --------------------------- | --------------------------------------------------------- |
| Access pattern         | Per-call JSON-RPC           | Bulk S3 object streaming                                  |
| Full-history export    | Days to weeks               | Network-bound (hours)                                     |
| Throughput             | Rate-limited                | 1–10 Gbps (depending on server)                           |
| Infrastructure you run | Full archive node + storage | None, read directly                                       |
| Data format            | Raw, undecoded              | Structured Protobuf (schema provided), one file per block |
| Concurrency            | Limited                     | Highly parallel (volume-server fan-out)                   |

## What's in the lake

The lake holds the complete, structured history of each supported chain. It covers the full archive from block zero forward rather than samples or recent windows. The structure of every field is defined in the published schema.

**Supported chains:**

- **All EVM / Ethereum chains** (e.g. Ethereum, Base, BNB Chain, Polygon, Arbitrum, Optimism)
- **Solana**
- **Tron**
- **Bitcoin**

**Data points available per chain:**

- **Transactions**
- **Transfers**
- **Balances**
- **DEX Trades**

Each block file also carries the block header and the lower-level data each chain exposes, such as receipts, logs, traces, instructions, and inputs/outputs. This gives you full-fidelity data rather than a summarized subset.

## Data format

Each block is stored as a single file in Bitquery's native streaming format. It is a **Protobuf** message, **LZ4-compressed**, and named by block number and hash:

```
<block_number>_<block_hash>_<...>.block.lz4
```

This is the same schema Bitquery uses for its Kafka streams, so one schema works for both the data lake and live streaming. Decoding is a cheap local step of decompress and then parse, which keeps end-to-end speed bounded by your network instead of by parsing.

- **Schema:** [github.com/bitquery/streaming_protobuf](https://github.com/bitquery/streaming_protobuf)
- **Python package (pb2):** [`bitquery-pb2-kafka-package`](https://pypi.org/project/bitquery-pb2-kafka-package/) — generated Python protobuf bindings from the schema (`pip install bitquery-pb2-kafka-package`; modules: `evm`, `solana`, `tron`, `utxo`, `market`)

For scale reference, a single Base block in the tutorial below is about 3.4 MB compressed and 12.1 MB decoded. The lake is hundreds of millions of such files per chain.

## How streaming works

There is no special protocol. Streaming from the lake is reading object bytes over the S3/HTTP API, and three properties of SeaweedFS make it fast:

- **One lookup, then a direct read.** A small, cacheable map points the client at the volume server holding the object. The client then reads bytes straight from that server, so no central node sits in the data path.
- **Range reads.** Objects support HTTP range requests, so a client can pull data in chunks and begin processing before a file fully arrives.
- **Parallel fan-out.** Blocks are spread across many volume servers. Reading many blocks (or many ranges) at once hits many servers at once, so aggregate bandwidth scales horizontally within the **1–10 Gbps** range.

Because the interface is S3, standard clients work unchanged, including `aws s3`, boto3, and s3fs. Streaming the full archive is bounded by your network rather than by the lake: you get **1–10 Gbps network bandwidth**, depending on the server handling your reads.

## Try it: hands-on tutorial

The fastest way to understand the lake is the [blockchain-data-lake-sample](https://github.com/bitquery/blockchain-data-lake-sample) repo. It is a complete walkthrough, not just a sample file. You get:

- **`stream.py`** — a Python client that streams blocks over S3, decompresses LZ4, and decodes Protobuf
- **A real Base block** — the object key used in every command below
- **A local demo lake** — a Docker image with that block already loaded

All of the commands on this page run from that repo after you clone it.

### 1. Clone the repo and install dependencies

This is where `stream.py` comes from. Run the rest of the steps from this directory.

```bash
git clone https://github.com/bitquery/blockchain-data-lake-sample
cd blockchain-data-lake-sample
pip install -r requirements.txt

KEY="base/blocks/000046600927_0x0133403c4fe53c434b1d2a1686d339eebd4e8e7f50ab52ab84cd68029e82e955_49e9339dd61bdb91320044378bff935efd925d868ca257ef8c3bc42177f9fd44.block.lz4"
```

### 2. Start the demo lake

We publish a [Docker image](https://hub.docker.com/r/marketingbitquery/datalake-demo) with the block already loaded:

```bash
docker run -p 8333:8333 marketingbitquery/datalake-demo
```

This serves a lake at `http://localhost:8333`. Point `stream.py` at it:

```bash
export DATA_LAKE_ENDPOINT=http://localhost:8333
export DATA_LAKE_ACCESS_KEY=admin
export DATA_LAKE_SECRET_KEY=secret
```

### 3. Stream and decode a block

```bash
python stream.py --bucket archive --key "$KEY" --decode
```

```
  streamed     3.24 MB  in   0.0s  ->    203.3 MB/s (1.63 Gbps)
  reads: 1, object size: 3.24 MB

  decoded 11.55 MB (evm):
  number     : 46,600,927
  hash       : 0x0133403c4fe53c434b1d2a1686d339eebd4e8e7f50ab52ab84cd68029e82e955
  timestamp  : 1779991201
  gas used   : 50,521,537
  transactions: 169
  logs        : 1,180
```

### 4. Scale up with parallel readers

Run several concurrent readers to see aggregate throughput rise:

```bash
python stream.py --bucket archive --key "$KEY" --duration 15 --concurrency 16
```

The demo runs a single SeaweedFS node, so it only illustrates the streaming and decoding path and how concurrency adds up. The actual Bitquery Blockchain Data Lake runs on a distributed SeaweedFS cluster with many volume servers, where you get **1 to 10 Gbps network bandwidth depending on the server**. The same `stream.py` client works unchanged against the live lake once you have its endpoint and credentials.

## From a block to transactions, transfers, and trades

A decoded block is the full structured record. It holds the header, every transaction, each transaction's receipt and logs, and the complete opcode-level execution trace. Nothing is summarized away, so any entity you care about can be derived from it.

Back in the tutorial repo, `stream.py` can also print individual transactions straight from the schema (same `$KEY` and env vars as above):

```bash
python stream.py --bucket archive --key "$KEY" --tx 1
```

The detail goes all the way down to the EVM execution itself. Each transaction's `Trace` records every internal call and, inside each call, every opcode that ran, with its program counter, gas, gas cost, and stack depth. Storage writes are captured as both the raw `SSTORE` and a `StorageChange` with the pre and post values. So you can reconstruct exactly what the transaction did at the bytecode level, not just its inputs and outputs.

A single transaction comes back like this (trimmed; byte fields are base64-encoded because JSON has no byte type):

```json
{
  "TransactionHeader": {
    "Hash": "w9VR+y41FcMsk8LvKHYlRRHgdCfg3kkd/lWd1K8HvS4=",
    "Gas": "1000000",
    "Type": 126,
    "From": "3q3erd6t3q3erd6t3q3erd6tAAE=",
    "To": "QgAAAAAAAAAAAAAAAAAAAAAAABU=",
    "Data": "Pba+KwAACN0AEBwSAAAAAAAAAAQAAAAAahiCYwAAAAAB..."
  },
  "Receipt": {
    "ReceiptHeader": {
      "GasUsed": "46218",
      "CumulativeGasUsed": "46218",
      "Status": "1"
    }
  },
  "Trace": {
    "Calls": [
      {
        "Depth": 1,
        "CaptureEnter": {
          "Opcode": { "Code": 244, "Name": "DELEGATECALL" },
          "From": "QgAAAAAAAAAAAAAAAAAAAAAAABU=",
          "To": "O6QAf1ySL7szxFS0Hqeh8R6D3yw=",
          "Gas": "957211"
        },
        "CaptureExit": { "GasUsed": "18587" },
        "CaptureStates": [
          {
            "CaptureStateHeader": {
              "Pc": "5", "Opcode": { "Code": 52, "Name": "CALLVALUE" },
              "Gas": "957193", "Cost": "2", "Depth": "2"
            }
          },
          {
            "CaptureStateHeader": {
              "Pc": "1506", "Opcode": { "Code": 85, "Name": "SSTORE" },
              "Gas": "956931", "Cost": "5000", "Depth": "2"
            },
            "Store": {
              "Address": "QgAAAAAAAAAAAAAAAAAAAAAAABU=",
              "Location": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM=",
              "Value": "AAAAAAAAAAAAAAAAAAAAAAAACN0AEBwSAAAAAAAAAAQ="
            },
            "StorageChange": {
              "Address": "QgAAAAAAAAAAAAAAAAAAAAAAABU=",
              "Slot": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM=",
              "Pre": "AAAAAAAAAAAAAAAAAAAAAAAACN0AEBwSAAAAAAAAAAM=",
              "Post": "AAAAAAAAAAAAAAAAAAAAAAAACN0AEBwSAAAAAAAAAAQ="
            }
          }
        ]
      }
    ]
  }
}
```

That is two of the opcode steps from a single internal call. The real trace for this transaction has the full sequence (`CALLVALUE`, `CALLDATASIZE`, `CALLDATALOAD`, `CALLER`, `SSTORE`, and the rest), each with its gas accounting, and every storage slot it touched. The block in the tutorial carries this for all 169 transactions.

Once you have a decoded block, you can either build your own parser or use Bitquery's published protobuf definitions. The tutorial's `stream.py` shows the second approach; below is how to do both yourself.

### Write your own parser

The block is plain protobuf, so you walk the message and pull out what you need. The transactions, receipts, logs, and traces are all addressable fields. A minimal pass over the transactions looks like this:

```python
for tx in block.Transactions:
    th = tx.TransactionHeader
    status = tx.Receipt.ReceiptHeader.Status if tx.HasField("Receipt") else None
    logs = tx.Receipt.Logs if tx.HasField("Receipt") else []
    print("0x" + th.Hash.hex(), "status", status, "logs", len(logs))
    for log in logs:
        # log.Address and log.Topics identify the event;
        # decode against the contract ABI to get transfers, swaps, etc.
        ...
```

This gives you full control. You decide how to turn raw logs and traces into transfers, swaps, or anything else, by decoding them against the relevant contract ABIs.

### Use Bitquery's protobuf files

You do not have to define the message structure yourself. Bitquery publishes the [protobuf schema](https://github.com/bitquery/streaming_protobuf) and the [`bitquery-pb2-kafka-package`](https://pypi.org/project/bitquery-pb2-kafka-package/) Python bindings listed above, so you parse blocks with the same definitions Bitquery uses internally. Every field, for transactions, receipts, logs, and traces, is already described.

With these you load a block in a few lines and read its fields directly. This is the core of what `stream.py` in the tutorial repo does:

```python
import lz4.frame
from evm.block_message_pb2 import BlockMessage

block = BlockMessage()
block.ParseFromString(lz4.frame.decompress(raw))   # raw = the .block.lz4 bytes

for tx in block.Transactions:
    th = tx.TransactionHeader
    # th.Hash, th.From, th.To, tx.Receipt, tx.Receipt.Logs, tx.Trace ...
```

So you bring the block, our protobuf files describe it, and you parse out transactions, transfers, and trades using definitions that already match the data.

## Related documentation

- [Data in Cloud](https://docs.bitquery.io/docs/cloud/) covers curated, ready-to-use Parquet data dumps for analytics and warehousing.
- [Kafka Streaming Concepts](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/) covers real-time blockchain data streams that use the same protobuf schema.
- [streaming_protobuf](https://github.com/bitquery/streaming_protobuf) is the block schema.
