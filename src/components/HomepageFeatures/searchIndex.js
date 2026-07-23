/** Command palette index — mirrors docs-home.js IA */
export const SEARCH_GROUP_ORDER = [
  "Start",
  "Data",
  "Interfaces",
  "Tools",
  "Chains",
  "Guides",
];

export const SEARCH_INDEX = [
  {
    t: "Getting started — first query",
    s: "Run your first GraphQL query in 5 minutes",
    g: "Start",
    u: "/docs/start/first-query/",
  },
  {
    t: "Platform overview",
    s: "How the Bitquery data platform fits together",
    g: "Start",
    u: "/docs/intro/",
  },
  {
    t: "Starter queries",
    s: "Copy-paste GraphQL queries to begin",
    g: "Start",
    u: "/docs/start/starter-queries/",
  },
  {
    t: "Starter subscriptions (WebSocket)",
    s: "Live streaming examples over WebSocket",
    g: "Start",
    u: "/docs/start/starter-subscriptions/",
  },
  {
    t: "V1 vs V2 APIs",
    s: "Schema and IDE differences when migrating",
    g: "Start",
    u: "https://docs.bitquery.io/v1/docs/graphql-ide/v1-and-v2",
    external: true,
  },
  {
    t: "Indexed fields reference",
    s: "Which fields are indexed and filterable",
    g: "Start",
    u: "/docs/graphql/indexed-fields-reference/",
  },
  {
    t: "Token prices & OHLCV",
    s: "Real-time & historical candles, price index",
    g: "Data",
    u: "/docs/trading/crypto-price-api/introduction/",
  },
  {
    t: "DEX trades",
    s: "Swaps, venues, USD notionals across 300+ DEXs",
    g: "Data",
    u: "/docs/trading/crypto-trades-api/trades-api/",
  },
  {
    t: "Transfers & wallet flows",
    s: "Token movements and counterparties",
    g: "Data",
    u: "/docs/start/mental-model-transfers-events-calls/",
  },
  {
    t: "Contract calls & traces",
    s: "Decoded calls and internal transactions",
    g: "Data",
    u: "/docs/API-Blog/what-are-internal-transactions-how-to-get-them/",
  },
  {
    t: "Smart-contract events",
    s: "Logs, protocols, aggregations",
    g: "Data",
    u: "/docs/start/mental-model-transfers-events-calls/",
  },
  {
    t: "NFTs & metadata",
    s: "Collections, transfers, marketplaces",
    g: "Data",
    u: "/docs/blockchain/Ethereum/nft/nft-api/",
  },
  {
    t: "Balances & holders",
    s: "EVM & Solana holder sets and snapshots",
    g: "Data",
    u: "/docs/schema/evm/balances/",
  },
  {
    t: "Mempool & pending txs",
    s: "Pre-confirmation activity stream",
    g: "Data",
    u: "/docs/start/mempool/",
  },
  {
    t: "GraphQL (HTTP)",
    s: "Queries & archives — design the shape",
    g: "Interfaces",
    u: "/docs/start/first-query/",
  },
  {
    t: "WebSocket subscriptions",
    s: "Live subscriptions in the browser",
    g: "Interfaces",
    u: "/docs/start/starter-subscriptions/",
  },
  {
    t: "Kafka streaming",
    s: "Protobuf streams, scale-out consumers",
    g: "Interfaces",
    u: "/docs/streams/kafka-streaming-concepts/",
  },
  {
    t: "MCP server",
    s: "AI agents · ClickHouse-backed natural language",
    g: "Interfaces",
    u: "/docs/mcp/mcp-server/",
  },
  {
    t: "Cloud datasets (Parquet)",
    s: "Warehouse exports — Snowflake, BigQuery",
    g: "Interfaces",
    u: "/docs/cloud/",
  },
  {
    t: "Solana gRPC (CoreCast)",
    s: "Ultra-low-latency Solana streaming",
    g: "Interfaces",
    u: "/docs/grpc/solana/introduction/",
  },
  {
    t: "Streams overview",
    s: "All real-time delivery options",
    g: "Interfaces",
    u: "/docs/streams/",
  },
  {
    t: "GraphQL IDE",
    s: "Author, test & share queries",
    g: "Tools",
    u: "https://ide.bitquery.io/",
    external: true,
  },
  {
    t: "DEXrabbit",
    s: "Real-time DEX analytics & heatmaps",
    g: "Tools",
    u: "https://dexrabbit.com/",
    external: true,
  },
  {
    t: "Explorer",
    s: "Search transactions, tokens & activity",
    g: "Tools",
    u: "https://explorer.bitquery.io/",
    external: true,
  },
  {
    t: "Tools & SDKs directory",
    s: "Apps, dashboards, agent skills",
    g: "Tools",
    u: "/docs/tools-directory/",
  },
  {
    t: "Ethereum",
    s: "EVM mainnet docs",
    g: "Chains",
    u: "/docs/blockchain/Ethereum/",
  },
  {
    t: "Solana",
    s: "Solana program & DEX docs",
    g: "Chains",
    u: "/docs/blockchain/Solana/",
  },
  {
    t: "BNB Chain (BSC)",
    s: "BSC docs",
    g: "Chains",
    u: "/docs/blockchain/BSC/",
  },
  {
    t: "Base",
    s: "Base L2 docs",
    g: "Chains",
    u: "/docs/blockchain/Base/",
  },
  {
    t: "Tron",
    s: "Tron & USDT docs",
    g: "Chains",
    u: "/docs/blockchain/Tron/",
  },
  {
    t: "Robinhood",
    s: "Robinhood trades, launches & transfers",
    g: "Chains",
    u: "/docs/blockchain/robinhood/",
  },
  {
    t: "Supported chains",
    s: "All 40+ networks across V1, V2 & Kafka",
    g: "Chains",
    u: "/docs/blockchain/supported-chains/",
  },
  {
    t: "Pump.fun API",
    s: "Memecoin trades, bonding curve, PumpSwap",
    g: "Guides",
    u: "/docs/blockchain/Solana/Pumpfun/Pump-Fun-API/",
  },
  {
    t: "Polymarket on-chain",
    s: "Prediction markets, PnL, streaming fills",
    g: "Guides",
    u: "/docs/examples/polymarket-api/polymarket-markets-api/",
  },
  {
    t: "Telegram trading bot",
    s: "End-to-end bot recipe",
    g: "Guides",
    u: "/docs/usecases/telegram-bot/",
  },
  {
    t: "Real-time balance tracker",
    s: "Track balances live",
    g: "Guides",
    u: "/docs/usecases/real-time-balance-tracker/overview/",
  },
  {
    t: "Copy trading bot",
    s: "Mirror smart-money trades",
    g: "Guides",
    u: "/docs/usecases/copy-trading-bot/",
  },
  {
    t: "TradingView OHLC feed",
    s: "Real-time candles into TradingView",
    g: "Guides",
    u: "/docs/usecases/tradingview-subscription-realtime/realtime_OHLC/",
  },
  {
    t: "How-to guides (all)",
    s: "Every recipe and walkthrough",
    g: "Guides",
    u: "/docs/category/how-to-guides/",
  },
];

export function groupIconPath(group) {
  const paths = {
    Start: "M5 12h14M13 6l6 6-6 6",
    Data: "M4 7h16M4 12h16M4 17h10",
    Interfaces:
      "M6 3v6M6 21v-6M6 9a3 3 0 0 0 0 6M18 21v-6M18 3v6M18 9a3 3 0 0 1 0 6",
    Tools:
      "M14 7l3 3M5 19l8.5-8.5a3.5 3.5 0 1 0-5-5L0 14M14.5 5.5 19 1l4 4-4.5 4.5",
    Chains:
      "M9 12a3 3 0 0 1 3-3h3a3 3 0 0 1 0 6h-1M15 12a3 3 0 0 1-3 3H9a3 3 0 0 1 0-6h1",
    Guides:
      "M4 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM14 3v6h6",
  };
  return paths[group] || paths.Data;
}
