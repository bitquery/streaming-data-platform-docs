export const heroQuickLinks = [
  {
    label: "Getting started — 5 min",
    to: "/docs/start/first-query/",
    primary: true,
  },
  { label: "Starter queries", to: "/docs/start/starter-queries/" },
  { label: "Live streams", to: "/docs/start/starter-subscriptions/" },
  { label: "Platform overview", to: "/docs/intro/" },
];

export const deliveryModes = [
  "GraphQL",
  "WebSocket",
  "Kafka",
  "MCP",
  "Solana gRPC",
  "Cloud / S3",
];

export const mentalModelFan = [
  { label: "GraphQL", hint: "archives" },
  { label: "WebSocket", hint: "live apps" },
  { label: "Kafka", hint: "pipelines" },
  { label: "MCP", hint: "agents" },
  { label: "gRPC", hint: "HFT" },
  { label: "Cloud", hint: "warehouses" },
];

export const startHereSteps = [
  {
    step: "Step 01",
    title: "Get your API key",
    body: "Sign in to the GraphQL IDE — your access token is generated automatically, no setup.",
    codeParts: [
      { text: "Authorization: " },
      { text: "Bearer", cls: "c1" },
      { text: " " },
      { text: "<your-token>", cls: "c2" },
    ],
    linkLabel: "Open the IDE",
    href: "https://ide.bitquery.io/",
    external: true,
  },
  {
    step: "Step 02",
    title: "Write a query",
    body: "Pick a chain and a dataset, shape the fields you want, and run it against live or historical data.",
    codeParts: [
      { text: "query", cls: "c1" },
      { text: " { Solana { DEXTrades { … } } }" },
    ],
    linkLabel: "First query guide",
    to: "/docs/start/first-query/",
  },
  {
    step: "Step 03",
    title: "Stream it live",
    bodyCode: true,
    linkLabel: "Live subscriptions",
    to: "/docs/start/starter-subscriptions/",
    codeParts: [
      { text: "subscription", cls: "c1" },
      { text: " { Solana { DEXTrades { … } } }" },
    ],
  },
];

export const dataTypes = [
  {
    label: "Token prices & OHLCV",
    hint: "Real-time & historical candles, price index methodology.",
    to: "/docs/trading/crypto-price-api/introduction/",
    icon: "chart",
  },
  {
    label: "DEX trades",
    hint: "Swaps, venues and USD notionals across 300+ DEXs.",
    to: "/docs/trading/crypto-trades-api/trades-api/",
    icon: "swap",
  },
  {
    label: "Transfers & wallet flows",
    hint: "Token movements and counterparties, decoded.",
    to: "/docs/start/mental-model-transfers-events-calls/",
    icon: "transfer",
  },
  {
    label: "Contract calls & traces",
    hint: "Decoded calls and internal transactions.",
    to: "/docs/API-Blog/what-are-internal-transactions-how-to-get-them/",
    icon: "code",
  },
  {
    label: "Smart-contract events",
    hint: "Logs, protocols and aggregations by signature.",
    to: "/docs/start/mental-model-transfers-events-calls/",
    icon: "bolt",
  },
  {
    label: "NFTs & metadata",
    hint: "Collections, transfers and marketplace activity.",
    to: "/docs/blockchain/Ethereum/nft/nft-api/",
    icon: "nft",
  },
  {
    label: "Balances & holders",
    hint: "EVM & Solana holder sets and snapshots.",
    to: "/docs/evm/balances/",
    icon: "holders",
  },
  {
    label: "Mempool & pending txs",
    hint: "Pre-confirmation activity, before the block lands.",
    to: "/docs/start/mempool/",
    icon: "mempool",
  },
];

export const interfaces = [
  {
    abbr: "GQL",
    name: "GraphQL (HTTP)",
    hint: "Queries & archives. Shape the fields, run ad-hoc or backfill.",
    linkLabel: "First query",
    to: "/docs/start/first-query/",
  },
  {
    abbr: "WS",
    name: "WebSocket",
    hint: "Live subscriptions in the browser, server-side filtered.",
    linkLabel: "Subscriptions",
    to: "/docs/start/starter-subscriptions/",
  },
  {
    abbr: "KF",
    name: "Kafka",
    hint: "Protobuf streams with replay for high-volume pipelines.",
    linkLabel: "Kafka concepts",
    to: "/docs/streams/kafka-streaming-concepts/",
  },
  {
    abbr: "MCP",
    name: "MCP server",
    hint: "Natural-language access for AI agents — ClickHouse-backed.",
    linkLabel: "MCP docs",
    to: "/docs/mcp/mcp-server/",
    isNew: true,
  },
  {
    abbr: "gRPC",
    name: "Solana gRPC · CoreCast",
    hint: "Ultra-low-latency binary streaming for MEV & HFT.",
    linkLabel: "CoreCast docs",
    to: "/docs/grpc/solana/introduction/",
  },
  {
    abbr: "S3",
    name: "Cloud datasets",
    hint: "Parquet exports into Snowflake, BigQuery & warehouses.",
    linkLabel: "Cloud docs",
    to: "/docs/cloud/",
  },
];

export const bitqueryTools = [
  {
    title: "DEXrabbit ↗",
    hint: "Real-time DEX analytics — tokens, pairs & market heatmaps.",
    href: "https://dexrabbit.com/",
    external: true,
    icon: "chart",
  },
  {
    title: "Explorer ↗",
    hint: "Search transactions, tokens & activity across chains.",
    href: "https://explorer.bitquery.io/",
    external: true,
    icon: "search",
  },
  {
    title: "GraphQL IDE ↗",
    hint: "Author, test & share queries against the API.",
    href: "https://ide.bitquery.io/",
    external: true,
    icon: "code",
  },
  {
    title: "Other tools",
    hint: "Apps, dashboards, SDKs & agent skills built on Bitquery.",
    href: "/docs/tools-directory/",
    external: false,
    icon: "grid",
  },
];

export const chains = [
  { label: "Ethereum", to: "/docs/blockchain/Ethereum/", id: "eth" },
  { label: "Solana", to: "/docs/blockchain/Solana/", id: "sol" },
  { label: "BNB Chain", to: "/docs/blockchain/BSC/", id: "bsc" },
  { label: "Base", to: "/docs/blockchain/Base/", id: "base" },
  { label: "Polygon", to: "/docs/blockchain/Matic/", id: "matic" },
  { label: "Arbitrum", to: "/docs/blockchain/Arbitrum/", id: "arb" },
  { label: "Optimism", to: "/docs/blockchain/Optimism/", id: "op" },
  { label: "Tron", to: "/docs/blockchain/Tron/", id: "tron" },
  { label: "Bitcoin", to: "/docs/blockchain/Bitcoin/", id: "btc" },
  { label: "Robinhood", to: "/docs/blockchain/robinhood/", id: "rh" },
];

export const personas = [
  {
    title: "Traders & desks",
    body: "Low-latency prices, OHLC, DEX flow, Pump.fun and the Solana tape.",
    to: "/docs/trading/crypto-price-api/introduction/",
  },
  {
    title: "Analysts & quants",
    body: "Cross-chain aggregates, historical archives, repeatable GraphQL patterns.",
    to: "/docs/graphql/dataset/archive/",
  },
  {
    title: "Auditors & finance",
    body: "Balances, transfers and settlement trails for proof and reconciliation.",
    to: "/docs/evm/balances/",
  },
  {
    title: "Investigators & compliance",
    body: "Wallet timelines, money-flow tracing, entity helpers, exportable datasets.",
    to: "https://docs.bitquery.io/v1/docs/Examples/coinpath/money-flow-api",
    external: true,
  },
];

export const trendingPages = [
  {
    title: "Pump.fun API",
    body: "Live memecoin trades, OHLCV, bonding curve and PumpSwap migration.",
    to: "/docs/blockchain/Solana/Pumpfun/Pump-Fun-API/",
    featured: true,
  },
  {
    title: "Token prices & OHLCV",
    body: "Multi-chain candles, 1s bars and price-index methodology.",
    to: "/docs/trading/crypto-price-api/crypto-ohlc-candle-k-line-api/",
  },
  {
    title: "Polymarket on-chain",
    body: "Prediction markets, wallets, PnL and streaming fills.",
    to: "/docs/examples/polymarket-api/polymarket-markets-api/",
  },
  {
    title: "Token holders",
    body: "Top holders, concentration and balance snapshots.",
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
  { label: "Telegram trading bot", to: "/docs/usecases/telegram-bot/", icon: "send" },
  {
    label: "Polymarket alerts",
    to: "/docs/usecases/polymarket-tg-alerts-bot/",
    icon: "bell",
  },
  {
    label: "Balance tracker",
    to: "/docs/usecases/real-time-balance-tracker/overview/",
    icon: "wallet",
  },
  {
    label: "Mempool fee analysis",
    to: "/docs/usecases/mempool-transaction-fee/",
    icon: "chart",
  },
  { label: "NFT analytics", to: "/docs/usecases/nft-analytics/", icon: "nft" },
  { label: "Copy trading bot", to: "/docs/usecases/copy-trading-bot/", icon: "copy" },
  {
    label: "TradingView OHLC feed",
    to: "/docs/usecases/tradingview-subscription-realtime/realtime_OHLC/",
    icon: "tv",
  },
];

export const chainListFullUrl = "/docs/blockchain/supported-chains/";
export const platformOverviewUrl = "/docs/intro/";
export const introVideoUrl = "/img/intro_video.mp4";
export const v1V2ApiGuideUrl =
  "https://docs.bitquery.io/v1/docs/graphql-ide/v1-and-v2";
export const enterpriseSalesUrl = "https://bitquery.io/forms/api";
export const howToGuidesUrl = "/docs/category/how-to-guides/";
