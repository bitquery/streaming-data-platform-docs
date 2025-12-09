---
sidebar_position: 2
---

# Real-Time Blockchain Indexer: Build Reliable Indexers with Kafka Streams Instead of Archive Nodes, gRPC, or Webhook Services

Building a real-time blockchain indexer is one of the most challenging infrastructure tasks in the process of tracking trades, monitoring token transfers, parsing internal calls, or building a comprehensive on-chain analytics platform. If you decide to run your own archive node, you need to plan for big SSD storage (multiple TBs), fast disks / high IOPS, and robust backup/monitoring. If not, you might be looking for need reliable, low-latency access to blockchain data at scale.

We know about popular approaches like running your own archive nodes, setting up gRPC indexers with Geyser plugins (for Solana), using webhook-based services like Helius, relying on third-party RPC providers, or using graph-based indexers.

**So why do we need another option?**

## The Challenge of Blockchain Indexing

Blockchain indexing requires processing massive volumes of data in real-time. Whether you're building a custom indexer for transaction traces, internal transactions, or on-chain data extraction, consider these requirements:

- **High Throughput**: Ethereum processes thousands of transactions per block, while Solana can handle hundreds of thousands per second
- **Zero Data Loss**: Missing a single transaction can break your indexer's consistency
- **Low Latency**: For trading bots, MEV applications, and real-time dashboards, every millisecond counts
- **Data Completeness**: You need both raw blockchain data and enriched, decoded information—including internal transactions that don't emit events
- **Reliability**: Your indexer must handle network issues, node failures, and data gaps gracefully
- **Historical Backfilling**: You need to process historical blocks while maintaining live subscription to new blocks

Traditional indexing approaches struggle with these requirements:

### The Archive Node Management Problem

**What is an Archive Node?**

An archive node requires enabling all historical state data:

- `--pruning=archive`: Maintains all states in the state-trie (not just recent blocks)
- `--fat-db=on`: Roughly doubles storage by storing additional information to enumerate all accounts and storage keys
- `--tracing=on`: Enables transaction tracing by default for EVM traces

This trades massive disk space for expensive computation—essentially a full node with a "super heavy cache" enabled.

**The Infrastructure Reality**

- Storage size growth is massive: Running an archive node often requires many terabytes (for Ethereum, often > 10 TB), which grows over time.
- Disk performance / IOPS bottlenecks: As chain history grows, read/write performance becomes critical; archive nodes tend to be much slower unless powerful SSDs or optimized storage are used.
- Synchronization time is huge / resource-intensive: Bootstrapping (full sync) can take days or weeks; replaying chain history is compute-heavy.
- Maintenance overhead & cost: Archive nodes often require dedicated hardware, monitoring, careful storage planning. This makes them costly and hard to manage for small teams or projects.
- Operational complexity / configuration risk: Proper config (e.g. pruning/“gcmode=archive”, snapshot management, backups, disk planning) is necessary — misconfig can lead to data loss or unusable node.

**The Bottom Line**

Running an archive node is not a matter of hours or days—it's a matter of **weeks** even with enterprise hardware. The infrastructure requirements are substantial:

- **Storage**: Nearly 2TB of fast SSD storage (and growing)
- **Time**: Weeks of continuous syncing
- **Performance**: Degrades significantly as the database grows
- **Maintenance**: Constant monitoring and intervention required

Bitquery Kafka streams eliminate all of these challenges by providing pre-synced, maintained archive node data through a managed streaming service.

### gRPC Indexers and Webhook-Based Services Limitations

Relying on gRPC indexers (like Solana's Geyser plugin approach), webhook-based services (like Helius), or third-party RPC providers introduces different problems that Bitquery Kafka streams solve:

- **gRPC Complexity**: Setting up gRPC indexers requires running validators with plugins (like Geyser for Solana), which is resource-intensive and complex—Bitquery Kafka eliminates this need
- **Webhook Reliability**: Webhook-based services can miss events during downtime, have delivery failures, and lack replay capabilities—Bitquery Kafka's retention solves this
- **Rate Limiting**: Most providers enforce strict rate limits that can throttle your indexing speed—Bitquery Kafka has no rate limits
- **Bandwidth Costs**: Many providers charge based on data transfer, making high-volume indexing expensive—Bitquery Kafka offers predictable pricing without bandwidth charges
- **Reliability Issues**: RPC endpoints, gRPC streams, and webhooks can go down, rate-limit you, or provide inconsistent data—Bitquery Kafka provides enterprise-grade reliability
- **Data Gaps**: If your indexer crashes or loses connection, you may miss transactions with no way to replay—Bitquery Kafka's 24-hour retention allows you to replay missed data
- **Transaction Trace Limitations**: Many services don't provide full transaction traces or internal transaction data—Bitquery Kafka includes comprehensive transaction data

## Why Bitquery Kafka Streams Excel for Blockchain Indexing

Bitquery's Kafka streams are designed as an alternative to running your own archive nodes, setting up gRPC indexers, using webhook-based services, or relying on RPC providers for blockchain indexing. Unlike traditional indexing approaches (self-hosted indexers, archive node-based indexing, gRPC indexers with Geyser plugins, or webhook services), Bitquery's Kafka streams provide several critical advantages:

### 1. Built-in Data Retention and Replay

**Bitquery Kafka streams' retention mechanism is a game-changer for blockchain indexing.**

Unlike RPC providers or WebSocket subscriptions that lose data on disconnect, Bitquery's Kafka streams retain messages for 24 hours. This means:

- **No Data Loss**: If your indexer crashes or needs to restart, you can resume from where you left off
- **Gap Recovery**: You can replay messages from any point within the retention window
- **Testing and Debugging**: You can reprocess historical data to test your indexing logic
- **Checkpoint Management**: Bitquery's Kafka consumer groups track your position, ensuring you never miss a message

This retention capability is especially valuable when:

- Your indexer needs maintenance or updates
- You discover a bug and need to reprocess data
- Network issues cause temporary disconnections
- You want to test new indexing logic against recent historical data

### 2. More Data Than Raw Nodes or Archive Nodes

**Bitquery's Kafka streams provide more enriched data than raw blockchain nodes or archive nodes.**

Raw nodes and archive nodes give you basic transaction data, but Bitquery's streams include:

- **Decoded Data**: Smart contract calls are already decoded using ABI information
- **Transaction Traces**: Full transaction traces and internal transaction data without needing debug_traceBlockByNumber
- **Enriched Metadata**: Token names, symbols, decimals, and USD values are included
- **Protocol-Specific Parsing**: DEX trades, real-time balances, liquidity pool changes, and protocol events are pre-parsed
- **Internal Transactions**: Native ETH transfers and internal calls that don't emit events are included
- **Cross-Chain Consistency**: Same data structure across all supported blockchains
- **Both Raw and Decoded**: Access to both raw blockchain data and enriched, structured formats

This means you spend less time on block parsing, transaction trace extraction, and data processing, and more time building features. Instead of:

1. Fetching raw transaction data from archive nodes
2. Decoding function calls and parsing calldata
3. Parsing event logs
4. Extracting internal transactions that don't emit events
5. Looking up token metadata
6. Calculating USD values
7. Building historical backfilling pipelines

You receive all of this pre-processed and ready to use in a unified data feed.

### 3. Zero Infrastructure Management

**You don't need to manage any nodes or infrastructure.**

With Bitquery's Kafka streams:

- **No Archive Node Setup**: No need to sync, maintain, or upgrade archive nodes (which require significantly more resources than full nodes)
- **No gRPC Indexer Configuration**: No need to set up Geyser plugins or validator-level indexing for Solana
- **No Webhook Infrastructure**: No need to build webhook endpoints or handle webhook delivery failures
- **No Bandwidth Management**: All data transfer happens through Bitquery Kafka, with no per-request bandwidth limits
- **No Scaling Headaches**: Bitquery Kafka handles the scaling automatically
- **No Maintenance Windows**: Bitquery manages uptime, redundancy, and failover

This is particularly important for indexing because:

- **Bandwidth Efficiency**: Traditional RPC-based indexing can consume massive bandwidth. With Bitquery Kafka, you consume data once and process it efficiently
- **Cost Predictability**: Direct Kafka access pricing means no surprise bandwidth bills
- **Focus on Logic**: Spend your time building indexing logic, not managing infrastructure

### 4. Enterprise-Grade Reliability

**Bitquery's Kafka infrastructure is built for mission-critical blockchain indexing.**

Unlike RPC providers that can go down or rate-limit you, Bitquery's Kafka streams provide:

- **At-Least-Once Delivery**: Guarantees that every message is delivered at least once
- **Automatic Failover**: If one broker fails, others take over seamlessly
- **Consumer Groups**: Multiple consumers can share the load, with automatic rebalancing
- **Partitioning**: Data is distributed across partitions for parallel processing

For blockchain indexing, this means:

- **No Lost Transactions**: Even if your consumer crashes, messages are retained and can be replayed
- **Horizontal Scaling**: Add more consumer instances to process data faster
- **Fault Tolerance**: Your indexing system can survive individual component failures

### 5. Direct Access, No Limitations

**Bitquery's Kafka pricing model is designed for high-volume indexing.**

- **No Bandwidth Limits**: Consume as much data as you need without worrying about rate limits
- **No Request Limits**: Unlike RPC providers, there are no per-second request caps
- **Predictable Pricing**: Direct Kafka access means predictable costs, not variable bandwidth charges
- **High Throughput**: Process millions of transactions per day without throttling

This is crucial for indexing because:

- **Full Chain Coverage**: Index every transaction, not just a sample
- **Real-Time Processing**: Keep up with blockchain transaction rates
- **No Throttling**: Process data at your own pace without artificial limits

### 6. Both Raw and Decoded Data

**Access to both raw blockchain data and enriched, decoded formats.**

Bitquery provides:

- **Raw Data Streams**: Access to raw blocks, transactions, and logs for custom processing
- **Decoded Data Streams**: Pre-parsed transactions with decoded function calls and events
- **Protocol-Specific Topics**: Separate topics for DEX trades, token transfers, and transactions
- **Flexible Consumption**: Choose the level of data processing that fits your needs

This flexibility allows you to:

- **Start Simple**: Use decoded data for quick prototyping
- **Go Deep**: Switch to raw data when you need custom parsing
- **Mix and Match**: Use different topics for different parts of your indexer

Build robust indexing pipelines that:

- Never lose data (thanks to retention)
- Can replay and reprocess (for data quality)
- Handle historical backfilling while maintaining live subscription
- Scale horizontally (with consumer groups)
- Extract on-chain data without running archive nodes

## Getting Started with Bitquery Kafka-Based Indexing

Building a real-time indexer with Bitquery's Kafka streams is straightforward:

1. **Get Kafka Access**: Contact Bitquery sales by filling the [form on the website](https://bitquery.io/forms/api) for Kafka credentials
2. **Choose Your Topics**: Select the topics that match your indexing needs. List is available [here](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/#complete-list-of-topics)
3. **Set Up Consumers**: Create Kafka consumers with proper offset management
4. **Process Messages**: Parse protobuf messages and update your index
5. **Handle Failures**: Use Bitquery Kafka's 24-hour retention to recover from crashes

## Tutorial Tidbits: Building Real-Time Indexers with Bitquery Kafka

### Why Bitquery Kafka is Ideal for Blockchain Indexing

Bitquery Kafka streams provide several advantages over archive node-based indexing, gRPC indexers, webhook-based services, or RPC-based indexing that make them perfect for building real-time blockchain indexers:

**1. Data Retention for Reliability**

- Bitquery Kafka streams retain messages for **24 hours**, allowing you to recover from crashes or restarts
- If your indexer goes down, you can resume from the last processed offset
- Unlike RPC providers, you don't need to worry about missing transactions during downtime

**2. More Data Than Raw Nodes or Archive Nodes**

- Bitquery's Kafka streams include **decoded smart contract calls** and **enriched metadata**
- **Transaction traces and internal transactions** included without needing debug_traceBlockByNumber
- Pre-parsed DEX trades, token transfers, and protocol events
- Both **raw and decoded data** available in separate topics
- USD values and token metadata included automatically
- Native ETH transfers and internal calls that don't emit events are captured

**3. Zero Infrastructure Management**

- **No archive node setup required**: Bitquery manages all blockchain nodes (including archive nodes)
- **No gRPC indexer configuration**: No need for Geyser plugins or validator-level indexing
- **No webhook infrastructure**: No webhook endpoints or delivery handling needed
- **No bandwidth limits**: Direct Kafka access means no per-request throttling
- **No scaling headaches**: Kafka handles horizontal scaling automatically
- Focus on your indexing logic and on-chain data extraction, not infrastructure maintenance

**4. Cost-Effective for High-Volume Indexing**

- **Predictable pricing**: Direct Kafka access, not variable bandwidth charges
- **No rate limits**: Process millions of transactions per day without throttling
- **Efficient consumption**: Consume data once and process it multiple times if needed

**5. Enterprise-Grade Reliability**

- **At-least-once delivery**: Guarantees no message loss
- **Automatic failover**: Seamless handling of broker failures
- **Consumer groups**: Share load across multiple indexer instances

### Quick Tips for Indexer Development

**Handling Duplicates:**

- Messages may have duplicates in Kafka topics
- Implement idempotent processing: track processed transaction hashes
- Use a fast lookup store to check if already processed

**Recovery After Crashes:**

- Bitquery Kafka's retention window (24 hours) allows you to replay recent data
- Store your processing state aka message offset and partition details.
- On restart, you can seek to a specific offset if needed
- This is a major advantage over RPC providers, gRPC indexers, and webhook-based services, which don't offer replay capabilities

**Choosing the Right Topic:**

- Use `*.transactions.proto` for comprehensive transaction indexing
- Use `*.dextrades.proto` for DEX-specific indexing (faster, less data)
- Use `*.tokens.proto` for token transfer indexing
- Use `*.broadcasted.*` topics for mempool-level data (lower latency)

