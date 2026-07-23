---
title: Tracing MCP - What You Can Do With It
description: Bitquery MCP use cases - AML compliance, law enforcement, forensic investigations, money laundering detection, sanctions screening, and regulatory reporting.
keywords:
  - Bitquery MCP use cases
  - blockchain forensics
  - AML compliance MCP
  - law enforcement investigations
  - fund flow tracing
  - crypto forensics
  - mcp.bitquery.io
sidebar_label: Overview
---
# Tracing MCP - What You Can Do With It

These are the patterns we see most often when teams plug the [Bitquery MCP server](https://mcp.bitquery.io) into Claude, Cursor, ChatGPT, or Claude Code. **You don't write SQL** - you ask in plain English, the agent does the rest. Each pattern below shows the kind of question that works and what comes back.

---

## 1. AML/KYC Risk Scoring

> _"Score wallet 0x742d35Cc6634C0532925a3b844Bc9e7595f42cfe for AML risk. Check wallet age, transaction frequency, mixing signals, and any compliance flags."_

Score an incoming deposit or withdrawal using wallet age, transaction patterns, mixing signals, and known-entity labels. The agent returns a risk score (0-100) and flags suspicious patterns automatically.

## 2. Payment Tracing (Source to Destination)

> _"Trace $500K USDT from Binance hot wallet 0x1234... to wallet 0x5678.... Show every hop, intermediate wallets, timing, and the final destination."_

Trace the full path of a single payment from source to final destination across one or more hops. The agent maps every intermediate wallet, any DEX swaps or bridge activity, and identifies if funds reached a CEX or high-risk address.

## 3. Phishing and Fraud Investigation

> _"A user was phished on March 15 and 2 ETH were stolen from wallet 0xvictim. The attacker transferred to 0xattacker. Trace where that 2 ETH went. Show all hops, DEX swaps, bridges, and final deposits."_

Map the spread of stolen funds from a phishing attack or scam across wallets, DEXs, and chains. Identify if funds were consolidated, swapped, or deposited to an exchange, and cluster related attacker wallets.

## 4. Wallet Clustering for Compliance

> _"Wallet 0x123... received funds from multiple sources. Identify all wallets that have sent to or received from this address, and cluster them by likely control."_

Identify related wallets using common-input-output heuristics, behavioral patterns, and timing analysis. The agent clusters wallets likely controlled by the same entity - useful for detecting account farming and money laundering rings.

## 5. Stablecoin Movement Monitoring

> _"Show me all USDT movements from Tron to Ethereum in the last 24 hours. Flag transactions over $5M, any bridge activity, and final destinations."_

Real-time or historical tracking of USDC, USDT, BUSD, and other stablecoins across chains and wallets. Useful for treasury monitoring, flow analysis, and detecting unusual liquidity movement patterns.

## 6. Money Laundering Pattern Detection

> _"Analyze wallet 0x... for layering patterns. Check for rapid mixing, frequent DEX swaps, cross-chain bridging, and rapid consolidation. Score likelihood of layering."_

Identify common money laundering stages (placement, layering, integration) in fund flow patterns. The agent scores layering likelihood based on rapid mixing, frequent swaps, bridge activity, and consolidation velocity.

## 7. Cross-Chain Bridge Activity

> _"Trace 1000 USDC from Ethereum through any bridge to Solana, then back to Ethereum. Show all bridges used, timing, and final destination."_

Track when and where assets move across chain bridges (Wormhole, Stargate, LayerZero, etc.). Identify bridge concentration risk and detect round-tripping patterns that may indicate arbitrage or evasion.

## 8. CEX Deposit Clustering

> _"Four wallets all deposited to Binance hot wallet within the same hour. Are these wallets related? Analyze creation dates, sources, and transaction patterns."_

Identify related wallets by finding addresses that all deposit to the same exchange hot wallets. The agent analyzes wallet age, common sources, interaction history, and synchronized deposits to score likelihood of same controller.

## 9. Sanctions and OFAC Compliance

> _"Screen wallet 0x... against OFAC SDN list, FATF guidance, and known DeFi hack wallets. Flag any matches, sanctioned entity references, or high-risk signals."_

Screen wallets and transactions against sanctions lists and known-risk entity databases. The agent flags direct matches, cluster associations, and previous sanctions history.

## 10. Regulatory Reporting and Forensic Documentation

> _"Generate a forensic report on wallet 0x... for SAR filing. Include creation date, transaction history, entity labels, risk flags, timeline of suspicious activity, and chain of custody."_

Generate comprehensive forensic reports with transaction chains, entity identification, and risk scoring for regulatory submission. Export with clickable block explorer links, exact timestamps, and audit trails.

## 11. Recovery and Law Enforcement Support

> _"Law enforcement is investigating theft of 100 USDC on Solana reported on March 10. Trace all movements, identify exchanges involved, cluster related wallets, and flag final destinations."_

Support law enforcement and recovery efforts by identifying where stolen or fraudulent assets ended up and who may control them. The agent preserves chain of custody for legal proceedings and coordinates with exchanges for account freeze requests.

---

## Best Practices for Prompting

You don't need to know SQL or the schema - but a few prompt habits make the agent's answers dramatically better.

### 1. Be explicit about the time window

The tracing dataset is comprehensive. Always tell the agent the window you care about: _"in the last 24 hours"_, _"yesterday vs the day before"_, _"since March 1"_. Without it, the agent may scan unnecessary data.

### 2. Name the chain (or "all chains")

Bitcoin, Ethereum, Solana, Tron, BSC, Base, Arbitrum, Optimism, Polygon, and 30+ more are all in the dataset. _"on Ethereum"_ or _"across all chains"_ keeps the agent's filter clean.

### 3. Include exact amounts and tokens

Specify the token and amount: _"$500K USDT"_, _"2 ETH"_, _"1000 USDC"_. This helps disambiguate on shared addresses and tracks value precisely.

### 4. Ask for entity identification

Request the agent identify counterparties: _"is this wallet an exchange, bridge, or risk entity?"_, _"compare against OFAC lists"_. The agent will enrich wallets with known-entity labels automatically.

### 5. Request risk scoring

For compliance work, ask for scoring: _"score for AML risk"_, _"flag suspicious patterns"_, _"highlight probable entity matches"_. The agent applies behavioral analysis automatically.

### 6. Include investigation context

Provide background: _"this is a phishing investigation"_, _"we're preparing a SAR filing"_, _"law enforcement requested this"_. Context helps the agent prioritize relevant data.

### 7. Ask for the data shape you want

_"Give me a markdown table I can paste"_, _"return JSON for my script"_, _"format for a regulatory report"_ - the agent will adapt. For forensic output: _"include block explorer links, exact timestamps, and transaction hashes"_.

### 8. Trust the read-only sandbox

The MCP only allows reads. The agent **cannot** delete, insert, drop, or modify anything - even if you ask it to. Explore freely.

---

## When MCP, When GraphQL, When Kafka?

| Need                                                                      | Best fit                                                                                                                                                    |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Conversational forensic analysis, ad-hoc investigations, agent loops      | **MCP** (this server)                                                                                                                                       |
| Compliance backend, subscription monitoring, mempool data                 | [**GraphQL API**](/docs/graphql/query/) and [WebSocket subscriptions](/docs/subscriptions/websockets/)                                                    |
| Lowest-latency, highest-throughput streaming for real-time investigations | [**Kafka streams**](/docs/streams/kafka-streaming-concepts/) and [**gRPC streams**](/docs/grpc/solana/introduction/)                                      |
| Transaction forensics, entity matching, AML risk scoring APIs             | [**Coinpath API**](/docs/blockchain/Bitcoin/bitcoin-coinpath-api/) (GraphQL-based)                                                                         |

The MCP and the GraphQL API read the **same dataset**, so anything you discover via MCP is reproducible in GraphQL or your production compliance stream.
