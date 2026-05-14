import { prodDocsPath } from "@site/src/utils/productionUrl";

const u = prodDocsPath;

export const dataTypes = [
  {
    label: "Token prices & OHLCV",
    hint: "Real-time & historical candles",
    to: u("/docs/trading/crypto-price-api/introduction/"),
  },
  {
    label: "DEX trades",
    hint: "Swaps, venues, USD notionals",
    to: u("/docs/trading/crypto-trades-api/trades-api/"),
  },
  {
    label: "Transfers & wallet flows",
    hint: "Token movements, counterparties",
    to: u("/docs/start/mental-model-transfers-events-calls/"),
  },
  {
    label: "Contract calls & traces",
    hint: "Decoded calls, internals",
    to: u("/docs/API-Blog/what-are-internal-transactions-how-to-get-them/"),
  },
  {
    label: "Smart-contract events",
    hint: "Logs, protocols, aggregations",
    to: u("/docs/start/mental-model-transfers-events-calls/"),
  },
  {
    label: "NFTs & metadata",
    hint: "Collections, transfers, marketplaces",
    to: u("/docs/blockchain/Ethereum/nft/nft-api/"),
  },
  {
    label: "Balances & holders",
    hint: "EVM & Solana holder sets",
    to: u("/docs/evm/balances/"),
  },
  {
    label: "Mempool & pending txs",
    hint: "Pre-confirmation activity",
    to: u("/docs/start/mempool/"),
  },
];

export const interfaces = [
  {
    abbr: "GQL",
    name: "GraphQL (HTTP)",
    hint: "Queries & archives",
    to: u("/docs/start/first-query/"),
  },
  {
    abbr: "WS",
    name: "WebSocket",
    hint: "Live subscriptions",
    to: u("/docs/start/starter-subscriptions/"),
  },
  {
    abbr: "KF",
    name: "Kafka",
    hint: "Protobuf streams",
    to: u("/docs/streams/kafka-streaming-concepts/"),
  },
  {
    abbr: "MCP",
    name: "MCP server",
    hint: "AI agents · ClickHouse-backed",
    to: u("/docs/mcp/mcp-server/"),
  },
  {
    abbr: "S3",
    name: "Cloud datasets",
    hint: "Parquet · warehouses",
    to: u("/docs/cloud/"),
  },
  {
    abbr: "CH",
    name: "ClickHouse",
    hint: "Via MCP & exports",
    to: u("/docs/mcp/mcp-server/"),
  },
  {
    abbr: "gRPC",
    name: "gRPC streaming",
    hint: "Solana CoreCast",
    to: u("/docs/grpc/solana/introduction/"),
  },
];

/** Product UIs & tooling — production URLs only (see productionUrl.js for docs). */
export const bitqueryTools = [
  {
    title: "DEXrabbit",
    hint: "Real-time DEX analytics, tokens, pairs & market heatmaps",
    href: "https://dexrabbit.com/",
    external: true,
  },
  {
    title: "Explorer",
    hint: "Search transactions, tokens & activity across chains",
    href: "https://explorer.bitquery.io/",
    external: true,
  },
  {
    title: "GraphQL IDE",
    hint: "Author, test & share queries against the Bitquery API",
    href: "https://ide.bitquery.io/",
    external: true,
  },
  {
    title: "Other tools",
    hint: "Apps, dashboards, SDKs & agent skills built on Bitquery",
    href: u("/docs/tools-directory/"),
    external: false,
  },
];

export const chains = [
  { label: "Ethereum", to: u("/docs/blockchain/Ethereum/") },
  { label: "Solana", to: u("/docs/blockchain/Solana/") },
  { label: "BSC", to: u("/docs/blockchain/BSC/") },
  { label: "Base", to: u("/docs/blockchain/Base/") },
  { label: "Polygon", to: u("/docs/blockchain/Matic/") },
  { label: "Arbitrum", to: u("/docs/blockchain/Arbitrum/") },
  { label: "Optimism", to: u("/docs/blockchain/Optimism/") },
  { label: "Tron", to: u("/docs/blockchain/Tron/") },
  { label: "More networks", to: u("/docs/blockchain/introduction/") },
];

export const personas = [
  {
    title: "Traders & desks",
    body: "Low-latency prices, OHLC, DEX flow, Pump.fun and Solana tape.",
    to: u("/docs/trading/crypto-price-api/introduction/"),
  },
  {
    title: "Analysts & quants",
    body: "Cross-chain aggregates, historical archives, and repeatable GraphQL patterns.",
    to: u("/docs/graphql/dataset/archive/"),
  },
  {
    title: "Auditors & finance",
    body: "Balances, transfers, and settlement trails for proof and reconciliation.",
    to: u("/docs/evm/balances/"),
  },
  {
    title: "Investigators & compliance",
    body: "Wallet timelines, money-flow tracing, entity helpers, and exportable datasets.",
    to: u("/v1/docs/Examples/coinpath/money-flow-api"),
  },
];

export const trendingPages = [
  {
    title: "Pump.fun API",
    body: "Live memecoin trades, OHLCV, bonding curve, PumpSwap migration.",
    to: u("/docs/blockchain/Solana/Pumpfun/Pump-Fun-API/"),
  },
  {
    title: "Token prices & OHLCV",
    body: "Multi-chain candles, 1s bars, and price index methodology.",
    to: u("/docs/trading/crypto-price-api/crypto-ohlc-candle-k-line-api/"),
  },
  {
    title: "Polymarket on-chain",
    body: "Prediction markets, wallets, PnL, and streaming fills.",
    to: u("/docs/examples/polymarket-api/polymarket-markets-api/"),
  },
  {
    title: "Token holders",
    body: "Top holders, concentration, and balance snapshots.",
    to: u("/docs/blockchain/Solana/solana-token-holders/"),
  },
  {
    title: "MCP for trading data",
    body: "Natural language over ClickHouse — IDE & agent ready.",
    to: u("/docs/mcp/mcp-server/"),
  },
  {
    title: "Kafka streaming",
    body: "Scale-out consumers across trading and EVM topics.",
    to: u("/docs/streams/"),
  },
];

export const useCases = [
  { label: "Telegram trading bot", to: u("/docs/usecases/telegram-bot/") },
  { label: "Polymarket alerts", to: u("/docs/usecases/polymarket-tg-alerts-bot/") },
  {
    label: "Real-time balance tracker",
    to: u("/docs/usecases/real-time-balance-tracker/overview/"),
  },
  { label: "Mempool fee analysis", to: u("/docs/usecases/mempool-transaction-fee/") },
  { label: "NFT analytics", to: u("/docs/usecases/nft-analytics/") },
  { label: "Copy trading bot", to: u("/docs/usecases/copy-trading-bot/") },
  {
    label: "TradingView OHLC feed",
    to: u("/docs/usecases/tradingview-subscription-realtime/realtime_OHLC/"),
  },
  { label: "How-to guides (all)", to: u("/docs/category/how-to-guides/") },
];

export const chainListFullUrl = u("/docs/blockchain/supported-chains/");
export const platformOverviewUrl = u("/docs/intro/");
export const introVideoUrl = u("/img/intro_video.mp4");
/** V1 docs: how V1 GraphQL differs from V2 (same domain, /v1/docs/…). */
export const v1V2ApiGuideUrl = u("/v1/docs/graphql-ide/v1-and-v2");
