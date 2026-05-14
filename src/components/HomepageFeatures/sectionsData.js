export const dataTypes = [
  {
    label: "Token prices & OHLCV",
    hint: "Real-time & historical candles",
    to: "/docs/trading/crypto-price-api/introduction/",
  },
  {
    label: "DEX trades",
    hint: "Swaps, venues, USD notionals",
    to: "/docs/trading/crypto-trades-api/trades-api/",
  },
  {
    label: "Transfers & wallet flows",
    hint: "Token movements, counterparties",
    to: "/docs/start/mental-model-transfers-events-calls/",
  },
  {
    label: "Contract calls & traces",
    hint: "Decoded calls, internals",
    to: "/docs/API-Blog/what-are-internal-transactions-how-to-get-them/",
  },
  {
    label: "Smart-contract events",
    hint: "Logs, protocols, aggregations",
    to: "/docs/start/mental-model-transfers-events-calls/",
  },
  {
    label: "NFTs & metadata",
    hint: "Collections, transfers, marketplaces",
    to: "/docs/blockchain/Ethereum/nft/nft-api/",
  },
  {
    label: "Balances & holders",
    hint: "EVM & Solana holder sets",
    to: "/docs/evm/balances/",
  },
  {
    label: "Mempool & pending txs",
    hint: "Pre-confirmation activity",
    to: "/docs/start/mempool/",
  },
];

export const interfaces = [
  {
    abbr: "GQL",
    name: "GraphQL (HTTP)",
    hint: "Queries & archives",
    to: "/docs/start/first-query/",
  },
  {
    abbr: "WS",
    name: "WebSocket",
    hint: "Live subscriptions",
    to: "/docs/start/starter-subscriptions/",
  },
  {
    abbr: "KF",
    name: "Kafka",
    hint: "Protobuf streams",
    to: "/docs/streams/kafka-streaming-concepts/",
  },
  {
    abbr: "MCP",
    name: "MCP server",
    hint: "AI agents · ClickHouse-backed",
    to: "/docs/mcp/mcp-server/",
  },
  {
    abbr: "S3",
    name: "Cloud datasets",
    hint: "Parquet · warehouses",
    to: "/docs/cloud/",
  },
  {
    abbr: "CH",
    name: "ClickHouse",
    hint: "Via MCP & exports",
    to: "/docs/mcp/mcp-server/",
  },
  {
    abbr: "gRPC",
    name: "gRPC streaming",
    hint: "Solana CoreCast",
    to: "/docs/grpc/solana/introduction/",
  },
];

/** Product UIs & tooling — external apps plus in-site tools directory. */
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
    href: "/docs/tools-directory/",
    external: false,
  },
];

export const chains = [
  { label: "Ethereum", to: "/docs/blockchain/Ethereum/", },
  { label: "Solana", to: "/docs/blockchain/Solana/", },
  { label: "BSC", to: "/docs/blockchain/BSC/", },
  { label: "Base", to: "/docs/blockchain/Base/", },
  { label: "Polygon", to: "/docs/blockchain/Matic/", },
  { label: "Arbitrum", to: "/docs/blockchain/Arbitrum/", },
  { label: "Optimism", to: "/docs/blockchain/Optimism/", },
  { label: "Tron", to: "/docs/blockchain/Tron/", },
  { label: "More networks", to: "/docs/blockchain/introduction/", },
];

export const personas = [
  {
    title: "Traders & desks",
    body: "Low-latency prices, OHLC, DEX flow, Pump.fun and Solana tape.",
    to: "/docs/trading/crypto-price-api/introduction/",
  },
  {
    title: "Analysts & quants",
    body: "Cross-chain aggregates, historical archives, and repeatable GraphQL patterns.",
    to: "/docs/graphql/dataset/archive/",
  },
  {
    title: "Auditors & finance",
    body: "Balances, transfers, and settlement trails for proof and reconciliation.",
    to: "/docs/evm/balances/",
  },
  {
    title: "Investigators & compliance",
    body: "Wallet timelines, money-flow tracing, entity helpers, and exportable datasets.",
    to: "https://docs.bitquery.io/v1/docs/Examples/coinpath/money-flow-api",
    external: true,
  },
];

export const trendingPages = [
  {
    title: "Pump.fun API",
    body: "Live memecoin trades, OHLCV, bonding curve, PumpSwap migration.",
    to: "/docs/blockchain/Solana/Pumpfun/Pump-Fun-API/",
  },
  {
    title: "Token prices & OHLCV",
    body: "Multi-chain candles, 1s bars, and price index methodology.",
    to: "/docs/trading/crypto-price-api/crypto-ohlc-candle-k-line-api/",
  },
  {
    title: "Polymarket on-chain",
    body: "Prediction markets, wallets, PnL, and streaming fills.",
    to: "/docs/examples/polymarket-api/polymarket-markets-api/",
  },
  {
    title: "Token holders",
    body: "Top holders, concentration, and balance snapshots.",
    to: "/docs/blockchain/Solana/solana-token-holders/",
  },
  {
    title: "MCP for trading data",
    body: "Natural language over ClickHouse — IDE & agent ready.",
    to: "/docs/mcp/mcp-server/",
  },
  {
    title: "Kafka streaming",
    body: "Scale-out consumers across trading and EVM topics.",
    to: "/docs/streams/",
  },
];

export const useCases = [
  { label: "Telegram trading bot", to: "/docs/usecases/telegram-bot/", },
  { label: "Polymarket alerts", to: "/docs/usecases/polymarket-tg-alerts-bot/", },
  {
    label: "Real-time balance tracker",
    to: "/docs/usecases/real-time-balance-tracker/overview/",
  },
  { label: "Mempool fee analysis", to: "/docs/usecases/mempool-transaction-fee/", },
  { label: "NFT analytics", to: "/docs/usecases/nft-analytics/", },
  { label: "Copy trading bot", to: "/docs/usecases/copy-trading-bot/", },
  {
    label: "TradingView OHLC feed",
    to: "/docs/usecases/tradingview-subscription-realtime/realtime_OHLC/",
  },
  { label: "How-to guides (all)", to: "/docs/category/how-to-guides/", },
];

export const chainListFullUrl = "/docs/blockchain/supported-chains/";
export const platformOverviewUrl = "/docs/intro/";
export const introVideoUrl = "/img/intro_video.mp4";
/** V1 docs live under /v1/ on docs.bitquery.io (not part of this V2 Docusaurus tree). */
export const v1V2ApiGuideUrl =
  "https://docs.bitquery.io/v1/docs/graphql-ide/v1-and-v2";
