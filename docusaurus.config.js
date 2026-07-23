// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer").themes.github;
const darkCodeTheme = require("prism-react-renderer").themes.dracula;

/**
 * Analytics scripts are often blocked locally (ad blockers, privacy tools) and
 * the `.docusaurus/` cache can leak a production-built gtag module into a
 * subsequent `docusaurus start`. The gtag client module unconditionally calls
 * `window.gtag(...)` on every route change, which then throws
 * `TypeError: window.gtag is not a function`.
 *
 * Two guards below:
 *   1. `enableAnalytics` — only include the gtag/GTM preset options in
 *      production builds, so dev never ships the plugin.
 *   2. `gtagNoopStub` — injected before any other script, stubs
 *      `window.gtag` and `window.dataLayer` to no-ops. Real gtag.js (when it
 *      loads) overrides the stub, so analytics still work in production; when
 *      gtag.js is blocked or missing, the stub prevents the runtime error.
 */
const enableAnalytics = process.env.NODE_ENV === "production";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Bitquery Docs",
  titleDelimiter: "|",
  tagline:
    "How to query data and build applications on Bitquery blockchain data platform",
  favicon: "img/favicon.ico",
  // ...
  trailingSlash: true,
  // ...
  // Set the production url of your site here
  url: "https://docs.bitquery.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "bitquery", // Usually your GitHub org/user name.
  projectName: "streaming-data-platform-docs", // Usually your repo name.

  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  headTags: [
    {
      tagName: "link",
      attributes: {
        rel: "preload",
        href: "/fonts/dm-sans-latin-400-normal.woff2",
        as: "font",
        type: "font/woff2",
        crossorigin: "anonymous",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preload",
        href: "/fonts/dm-sans-latin-500-normal.woff2",
        as: "font",
        type: "font/woff2",
        crossorigin: "anonymous",
      },
    },
  ],

  scripts: [
    // Must load before any script that calls `window.gtag` (see gtag-stub.js).
    { src: "/js/gtag-stub.js" },
    // Chat widget only in production builds (same gate as gtag/GTM).
    ...(enableAnalytics
      ? [
          {
            src: "https://www.chatbase.co/embed.min.js",
            async: true,
            id: "Vz0cwoEYRJW6n5B2JeSeu",
            domain: "www.chatbase.co",
          },
        ]
      : []),
  ],

  plugins: [
    // Copy MD button is now in swizzled DocItem/Content (src/theme/DocItem/Content)
    // require.resolve("./plugins/copy-md-plugin"),
    // [
    //   "@graphql-markdown/docusaurus",
    //   {
    //     schema: "https://streaming.bitquery.io/graphql",
    //     rootPath: "./docs/graphql-reference/", // docs will be generated under './docs/graphql-reference'
    //     baseURL: ".",
    //     linkRoot: "/docs/graphql-reference/",
    //     homepage: "./docs/graphql-reference/intro.md",
    //     loaders: {
    //       UrlLoader: "@graphql-tools/url-loader",
    //     },
    //   },
    // ],
    // Temporarily disabled due to Node 18 compatibility issue
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        // minimal configuration
      },
    ],
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          // /docs/oldDoc -> /docs/newDoc
          {
            to: "/docs/blockchain/Solana/Pumpfun/Pump-Fun-API/",
            from: "/docs/blockchain/Solana/Pump-Fun-API/",
          },
          {
            to: "/docs/blockchain/Solana/Pumpfun/Pump-Fun-Marketcap-Bonding-Curve-API/",
            from: "/docs/blockchain/Solana/Pump-Fun-Marketcap-Bonding-Curve-API/",
          },
          {
            to: "/docs/blockchain/Solana/Pumpfun/pump-fun-to-pump-swap/",
            from: "/docs/blockchain/Solana/pump-fun-to-pump-swap/",
          },
          {
            to: "/docs/blockchain/Solana/Pumpfun/pump-swap-api/",
            from: "/docs/blockchain/Solana/pump-swap-api/",
          },
          {
            to: "/docs/blockchain/Ethereum/token-holders/token-holder-api/",
            from: "/docs/examples/balances/tokenHolders-api/",
          },
          {
            to: "/docs/contribution-guidelines/",
            from: "/docs/contribution_guidelines/",
          },
          {
            to: "/docs/blockchain/Ethereum/calls/contract-creation/",
            from: "/docs/examples/calls/Contract%20_creation/",
          },
          {
            to: "/docs/blockchain/Ethereum/calls/smartcontract-filterby/",
            from: "/docs/examples/calls/smartcontract_filterby/",
          },
          {
            to: "/docs/blockchain/Ethereum/events/events-api/",
            from: "/docs/examples/events/events_api/",
          },
          {
            to: "/docs/schema/evm/token-holders/",
            from: "/docs/evm/token_holders/",
          },
          {
            to: "/docs/schema/evm/top/",
            from: "/docs/evm/",
          },
          {
            to: "/docs/trading/crypto-price-api/currency/",
            from: "/docs/trading/crypto-price-api/cube-examples.md/currency-examples/",
          },
          {
            to: "/docs/trading/crypto-price-api/pairs/",
            from: "/docs/trading/crypto-price-api/cube-examples.md/pair-examples/",
          },
          {
            to: "/docs/trading/crypto-price-api/tokens/",
            from: "/docs/trading/crypto-price-api/cube-examples.md/token-examples/",
          },
          {
            to: "/docs/blockchain/Ethereum/nft/nft-trades-api/",
            from: "/docs/blockchain/Ethereum/nft/nft-trades-apI/",
          },
          {
            to: "/docs/blockchain/Ethereum/nft/nft-calls-api/",
            from: "/docs/blockchain/Ethereum/nft/nft-calls-apI/",
          },
          {
            to: "/docs/usecases/sandwich-detection/",
            from: "/docs/usecases/sandwitch-detection/",
          },
          {
            // Category root had no index page; send British spelling URL to the guide.
            to: "/docs/authorization/how-to-generate/",
            from: "/docs/authorisation/",
          },
          {
            to: "/docs/blockchain/Arbitrum/",
            from: "/docs/blockchain/Arbitrum/Overview/",
          },
          {
            to: "/docs/category/capabilities/",
            from: "/docs/graphql/capabilities/patterns/",
          },
          {
            to: "/docs/graphql/dataset/select-blocks/",
            from: "/docs/graphql/dataset/select_blocks/",
          },
          {
            to: "/docs/cubes/dextrades-dextradebytokens-trading-trades/",
            from: "/docs/graphql/capabilities/dextrades-dextradebytokens-trading-trades/",
          },
          {
            to: "/docs/usecases/nft-analytics/",
            from: "/docs/usecases/nft_Analytics/",
          },
          // {
          //   to: "/docs/usecases/crypto-dashboard/",
          //   from: "/docs/usecases/crypto_dashboard/",
          // }, // that page does not get traffic anymore, so no need to redirect
          {
            to: "/docs/usecases/telegram-bot/",
            from: "/docs/usecases/Telegram_bot/",
          },
          // MCP moved from Use Cases to docs/mcp/ (2026).
          {
            to: "/docs/mcp/mcp-server/",
            from: "/docs/usecases/MCP/",
          },
          {
            to: "/docs/mcp/claude-desktop/",
            from: "/docs/usecases/MCP/claude-desktop/",
          },
          {
            to: "/docs/mcp/cursor/",
            from: "/docs/usecases/MCP/cursor/",
          },
          {
            to: "/docs/mcp/windsurf/",
            from: "/docs/usecases/MCP/windsurf/",
          },
          {
            to: "/docs/mcp/build-a-trading-agent/",
            from: "/docs/usecases/MCP/build-a-trading-agent/",
          },
          {
            to: "/docs/authorization/how-to-generate",
            from: "/docs/ide/authorisation/",
          },
          {
            to: "/docs/authorization/how-to-generate",
            from: "/docs/category/authorization/",
          },
          {
            to: "/docs/blockchain/robinhood/",
            from: "/docs/category/robinhood/",
          },
          {
            to: "/docs/blockchain/robinhood/robinhood-trades/",
            from: "/docs/examples/robinhood/robinhood-trades/",
          },
          {
            to: "/docs/blockchain/robinhood/robinhood-transfers/",
            from: "/docs/examples/robinhood/robinhood-transfers/",
          },
          {
            to: "/docs/blockchain/robinhood/robinhood-meme-coin-launches/",
            from: "/docs/examples/robinhood/robinhood-meme-coin-launches/",
          },
          {
            to: "/docs/blockchain/robinhood/flap-sh-api/",
            from: "/docs/examples/robinhood/flap-sh-api/",
          },
          {
            to: "/docs/blockchain/robinhood/robinhood-token-supply/",
            from: "/docs/examples/robinhood/robinhood-token-supply/",
          },

          {
            to: "/docs/authorization/how-to-generate",
            from: "/docs/ide/authorisation/simple",
          },

          {
            to: "/docs/authorization/how-to-generate",
            from: "/docs/start/authorisation/secure/",
          },

          {
            to: "/docs/authorization/how-to-generate",
            from: "/docs/start/authorisation/",
          },
          {
            to: "/docs/authorization/how-to-generate",
            from: "/docs/start/authorisation/how-to-generate",
          },
          {
            to: "/docs/subscriptions/subscription",
            from: "/docs/graphql/subscription/",
          },
          {
            to: "/docs/start/first-query/",
            from: "/docs/ide/login/",
          },
          {
            to: "/docs/subscriptions/websockets/",
            from: "/docs/start/websocket/",
          },

          {
            to: "/docs/authorization/how-to-generate",
            from: "/docs/start/authorisation/simple/",
          },

          {
            to: "/docs/blockchain/Solana/Pumpfun/Pump-Fun-API/",
            from: "/docs/examples/dextrades/Pump-Fun-API/",
          },
          {
            to: "/docs/blockchain/Ethereum/dextrades/dex-api/",
            from: "/docs/examples/dextrades/dex-api/",
          },
          {
            to: "/docs/blockchain/Ethereum/dextrades/token-trades-apis/",
            from: "/docs/examples/dextrades/token-trades-apis/",
          },
          {
            to: "/docs/blockchain/Ethereum/dextrades/DEXScreener/evm_dexscreener/",
            from: "/docs/examples/dextrades/DEXScreener/evm_dexscreener/",
          },
          {
            to: "/docs/blockchain/Solana/DEXScreener/solana_dexscreener/",
            from: "/docs/examples/dextrades/DEXScreener/solana_dexscreener/",
          },
          {
            to: "/docs/category/how-to-guides/",
            from: "/docs/examples/",
          },

          {
            to: "/docs/blockchain/Ethereum/ethers-library/eth_subscribe",
            from: "/docs/category/ethsubscribe-alternatives/",
          },
          {
            to: "/docs/blockchain/Ethereum/ethers-library/eth_subscribe/",
            from: "/docs/examples/Ethereum-subscriptions/eth-subscribe/",
          },
          {
            to: "/docs/category/how-to-guides/",
            from: "/docs/category/use-cases/",
          },
          {
            to: "/docs/blockchain/Ethereum/nft/nft-api/",
            from: "/docs/category/nft/",
          },
          {
            to: "/docs/blockchain/Ethereum/dextrades/uniswap-api/",
            from: "/docs/examples/realtimetrades/",
          },
          {
            to: "/docs/blockchain/Ethereum/dextrades/ethereum-liquidity-api/",
            from: "/docs/blockchain/Ethereum/dextrades/pools-api/",
          },
          {
            to: "/docs/blockchain/Ethereum/dextrades/ethereum-liquidity-api/",
            from: "/docs/examples/dextrades/pools-api/",
          },
          {
            to: "/docs/blockchain/Ethereum/dextrades/uniswap-v4-liquidity-api/",
            from: "/docs/blockchain/Ethereum/liquidity/uniswap-v4-liquidity-api/",
          },
          {
            to: "/docs/blockchain/Solana/", // new target
            from: "/docs/category/solana/", // old category URL
          },
          {
            to: "/docs/blockchain/Ethereum/",
            from: "/docs/category/ethereum/",
          },
          {
            to: "/docs/blockchain/Ethereum/",
            from: "/docs/examples/Ethereum/",
          },

          // Ethereum examples redirects from old examples/ path to new blockchain/Ethereum/ path
          {
            to: "/docs/blockchain/Ethereum/blocks/blocks-api/",
            from: "/docs/examples/blocks/blocks-api/",
          },
          {
            to: "/docs/blockchain/Ethereum/balances/balance-api/",
            from: "/docs/examples/balances/balance-api/",
          },
          {
            to: "/docs/blockchain/Ethereum/token-holders/token-holder-api/",
            from: "/docs/examples/token-holders/token-holder-api/",
          },
          {
            to: "/docs/blockchain/Ethereum/calls/smartcontract/",
            from: "/docs/examples/calls/smartcontract/",
          },
          {
            to: "/docs/blockchain/Ethereum/calls/smartcontract-filterby/",
            from: "/docs/examples/calls/smartcontract-filterby/",
          },
          {
            to: "/docs/blockchain/Ethereum/events/events-api/",
            from: "/docs/examples/events/events-api/",
          },
          {
            to: "/docs/blockchain/Ethereum/fees/fees-api/",
            from: "/docs/examples/fees/fees-api/",
          },
          {
            to: "/docs/blockchain/Ethereum/mempool/mempool-api/",
            from: "/docs/examples/mempool/mempool-api/",
          },
          {
            to: "/docs/blockchain/Ethereum/transfers/total-supply/",
            from: "/docs/examples/transfers/total-supply/",
          },
          {
            to: "/docs/blockchain/Ethereum/transactions/transaction-api/",
            from: "/docs/examples/transactions/transaction-api/",
          },
          {
            to: "/docs/blockchain/Ethereum/calls/contract-creation/",
            from: "/docs/examples/calls/contract-creation/",
          },
          {
            to: "/docs/blockchain/Ethereum/transfers/erc20-token-transfer-api/",
            from: "/docs/examples/transfers/erc20-token-transfer-api/",
          },
          {
            to: "/docs/blockchain/Ethereum/transfers/rwa-api/",
            from: "/docs/examples/transfers/rwa-api/",
          },
          {
            to: "/docs/blockchain/Solana/letsbonk-api/",
            from: "/docs/examples/Solana/Bonk-Fun-API/",
          },
          {
            to: "/docs/blockchain/Solana/DEXScreener/solana_dexscreener/",
            from: "/docs/blockchain/Ethereum/dextrades/DEXScreener/solana_dexscreener/",
          },

          // Solana page redirects from old path to new blockchain path
          {
            to: "/docs/blockchain/Solana/ai-agent-solana-data/",
            from: "/docs/examples/Solana/ai-agent-solana-data/",
          },
          {
            to: "/docs/blockchain/Solana/bags-fm-api/",
            from: "/docs/examples/Solana/bags-fm-api/",
          },
          {
            to: "/docs/blockchain/Solana/Believe-API/",
            from: "/docs/examples/Solana/Believe-API/",
          },
          {
            to: "/docs/blockchain/Solana/BonkSwap-API/",
            from: "/docs/examples/Solana/BonkSwap-API/",
          },
          {
            to: "/docs/blockchain/Solana/Boop-Fun-API/",
            from: "/docs/examples/Solana/Boop-Fun-API/",
          },
          {
            to: "/docs/blockchain/Solana/heaven-dex-api/",
            from: "/docs/examples/Solana/heaven-dex-api/",
          },
          {
            to: "/docs/blockchain/Solana/historical-aggregate-data/",
            from: "/docs/examples/Solana/historical-aggregate-data/",
          },
          {
            to: "/docs/blockchain/Solana/jupiter-studio-api/",
            from: "/docs/examples/Solana/jupiter-studio-api/",
          },
          {
            to: "/docs/blockchain/Solana/launchpad-raydium/",
            from: "/docs/examples/Solana/launchpad-raydium/",
          },
          {
            to: "/docs/blockchain/Solana/letsbonk-api/",
            from: "/docs/examples/Solana/letsbonk-api/",
          },
          {
            to: "/docs/blockchain/Solana/Meteora-DAMM-v2-API/",
            from: "/docs/examples/Solana/Meteora-DAMM-v2-API/",
          },
          {
            to: "/docs/blockchain/Solana/Meteora-DLMM-API/",
            from: "/docs/examples/Solana/Meteora-DLMM-API/",
          },
          {
            to: "/docs/blockchain/Solana/Meteora-DYN-API/",
            from: "/docs/examples/Solana/Meteora-DYN-API/",
          },
          {
            to: "/docs/blockchain/Solana/meteora-dynamic-bonding-curve-api/",
            from: "/docs/examples/Solana/meteora-dynamic-bonding-curve-api/",
          },
          {
            to: "/docs/blockchain/Solana/Moonshot-API/",
            from: "/docs/examples/Solana/Moonshot-API/",
          },
          {
            to: "/docs/blockchain/Solana/Orbic-API/",
            from: "/docs/examples/Solana/Orbic-API/",
          },
          {
            to: "/docs/blockchain/Solana/Pumpfun/Pump-Fun-API/",
            from: "/docs/examples/Solana/Pump-Fun-API/",
          },
          {
            to: "/docs/blockchain/Solana/Pumpfun/Pump-Fun-Marketcap-Bonding-Curve-API/",
            from: "/docs/examples/Solana/Pump-Fun-Marketcap-Bonding-Curve-API/",
          },
          {
            to: "/docs/blockchain/Solana/Pumpfun/pump-fun-to-pump-swap/",
            from: "/docs/examples/Solana/pump-fun-to-pump-swap/",
          },
          {
            to: "/docs/blockchain/Solana/Pumpfun/pump-swap-api/",
            from: "/docs/examples/Solana/pump-swap-api/",
          },
          {
            to: "/docs/blockchain/Solana/raydium-clmm-API/",
            from: "/docs/examples/Solana/raydium-clmm-API/",
          },
          {
            to: "/docs/blockchain/Solana/raydium-cpmm-API/",
            from: "/docs/examples/Solana/raydium-cpmm-API/",
          },
          {
            to: "/docs/blockchain/Solana/solana_fees_api/",
            from: "/docs/examples/Solana/solana_fees_api/",
          },
          {
            to: "/docs/blockchain/Solana/Solana-AldrinAmm-api/",
            from: "/docs/examples/Solana/Solana-AldrinAmm-api/",
          },
          {
            to: "/docs/blockchain/Solana/solana-balance-updates/",
            from: "/docs/examples/Solana/solana-balance-updates/",
          },
          {
            to: "/docs/blockchain/Solana/solana-bullx-api/",
            from: "/docs/examples/Solana/solana-bullx-api/",
          },
          {
            to: "/docs/blockchain/Solana/Solana-DEX-Orders-API/",
            from: "/docs/examples/Solana/Solana-DEX-Orders-API/",
          },
          {
            to: "/docs/blockchain/Solana/Solana-DexPools-API/",
            from: "/docs/examples/Solana/Solana-DexPools-API/",
          },
          {
            to: "/docs/blockchain/Solana/solana-dextrades/",
            from: "/docs/examples/Solana/solana-dextrades/",
          },
          {
            to: "/docs/blockchain/Solana/solana-gmgn-api/",
            from: "/docs/examples/Solana/solana-gmgn-api/",
          },
          {
            to: "/docs/blockchain/Solana/solana-instruction-balance-updates/",
            from: "/docs/examples/Solana/solana-instruction-balance-updates/",
          },
          {
            to: "/docs/blockchain/Solana/solana-instructions/",
            from: "/docs/examples/Solana/solana-instructions/",
          },
          {
            to: "/docs/blockchain/Solana/Solana-Jito-Bundle-api/",
            from: "/docs/examples/Solana/Solana-Jito-Bundle-api/",
          },
          {
            to: "/docs/blockchain/Solana/solana-jupiter-api/",
            from: "/docs/examples/Solana/solana-jupiter-api/",
          },
          {
            to: "/docs/blockchain/Solana/Solana-Lifinity-dex-api/",
            from: "/docs/examples/Solana/Solana-Lifinity-dex-api/",
          },
          {
            to: "/docs/blockchain/Solana/solana-logs/",
            from: "/docs/examples/Solana/solana-logs/",
          },
          {
            to: "/docs/blockchain/Solana/solana-nft/",
            from: "/docs/examples/Solana/solana-nft/",
          },
          {
            to: "/docs/blockchain/Solana/Solana-OpenBook-api/",
            from: "/docs/examples/Solana/Solana-OpenBook-api/",
          },
          {
            to: "/docs/blockchain/Solana/solana-orca-dex-api/",
            from: "/docs/examples/Solana/solana-orca-dex-api/",
          },
          {
            to: "/docs/blockchain/Solana/Solana-Phoenix-api/",
            from: "/docs/examples/Solana/Solana-Phoenix-api/",
          },
          {
            to: "/docs/blockchain/Solana/solana-photon-api/",
            from: "/docs/examples/Solana/solana-photon-api/",
          },
          {
            to: "/docs/blockchain/Solana/Solana-Raydium-DEX-API/",
            from: "/docs/examples/Solana/Solana-Raydium-DEX-API/",
          },
          {
            to: "/docs/blockchain/Solana/solana-rewards/",
            from: "/docs/examples/Solana/solana-rewards/",
          },
          {
            to: "/docs/blockchain/Solana/solana-search-tokens/",
            from: "/docs/examples/Solana/solana-search-tokens/",
          },
          {
            to: "/docs/blockchain/Solana/solana-trader-API/",
            from: "/docs/examples/Solana/solana-trader-API/",
          },
          {
            to: "/docs/blockchain/Solana/solana-transactions/",
            from: "/docs/examples/Solana/solana-transactions/",
          },
          {
            to: "/docs/blockchain/Solana/solana-transfers/",
            from: "/docs/examples/Solana/solana-transfers/",
          },
          {
            to: "/docs/blockchain/Solana/solana-zeta/",
            from: "/docs/examples/Solana/solana-zeta/",
          },
          {
            to: "/docs/blockchain/Solana/SolFi-api/",
            from: "/docs/examples/Solana/SolFi-api/",
          },
          {
            to: "/docs/blockchain/Solana/token-supply-cube/",
            from: "/docs/examples/Solana/token-supply-cube/",
          },
          {
            to: "/docs/blockchain/Solana/xstocks-api/",
            from: "/docs/examples/Solana/xstocks-api/",
          },

          // tradingview redirects
          {
            from: "/docs/usecases/tradingview-advanced-charts/getting-started",
            to: "/docs/usecases/tradingview-subscription-realtime/getting-started",
          },
          {
            from: "/docs/usecases/tradingview-advanced-charts/component",
            to: "/docs/usecases/tradingview-subscription-realtime/widget",
          },
          {
            from: "/docs/usecases/tradingview-advanced-charts/datafeed",
            to: "/docs/usecases/tradingview-subscription-realtime/custom_datafeed",
          },
          {
            from: "/docs/usecases/tradingview-advanced-charts/getBars",
            to: "/docs/usecases/tradingview-subscription-realtime/historical_OHLC",
          },
          {
            from: "/docs/usecases/tradingview-advanced-charts/advancedChart",
            to: "/docs/usecases/tradingview-subscription-realtime/final-step",
          },
          {
            from: "/docs/streams/kafka-streams-js",
            to: "/docs/streams/protobuf/kafka-protobuf-js",
          },
          {
            from: "/docs/streams/protobuf/kafka-protobuf-javascript",
            to: "/docs/streams/protobuf/kafka-protobuf-js",
          },

          // Stale / renamed doc paths
          {
            from: "/docs/how-to-guides-index/",
            to: "/docs/category/how-to-guides/",
          },
          {
            from: "/docs/mcp/tracing/examples/",
            to: "/docs/mcp/Tracing/overview/",
          },
          {
            from: "/docs/graphql/introduction/",
            to: "/docs/graphql/query/",
          },
          {
            from: "/docs/graphql/performance/",
            to: "/docs/graphql/optimizing-graphql-queries/",
          },
          {
            from: "/docs/graphql/aggregation/",
            to: "/docs/graphql/capabilities/aggregated_metrics/",
          },
          {
            from: "/docs/graphql/coinpath/",
            to: "/docs/blockchain/Bitcoin/bitcoin-coinpath-api/",
          },
          {
            from: "/docs/blockchain/TON/",
            to: "/docs/blockchain/supported-chains/",
          },
          {
            from: "/docs/blockchain/opBNB/",
            to: "/docs/blockchain/supported-chains/",
          },
          {
            from: "/docs/subscriptions/",
            to: "/docs/category/graphql-subscriptions/",
          },
          {
            from: "/docs/subscriptions/websocket/",
            to: "/docs/subscriptions/websockets/",
          },
          {
            from: "/docs/usecases/tradingview-advanced-charts/getting-started/",
            to: "/docs/usecases/tradingview-subscription-realtime/getting-started/",
          },
          {
            from: "/docs/graphql/joins/",
            to: "/docs/graphql/capabilities/joins/",
          },
          {
            from: "/docs/blockchain/Solana/raydium-api/",
            to: "/docs/blockchain/Solana/Solana-Raydium-DEX-API/",
          },
          {
            from: "/docs/blockchain/Solana/orca-api/",
            to: "/docs/blockchain/Solana/solana-orca-dex-api/",
          },
          {
            from: "/docs/blockchain/Solana/serum-api/",
            to: "/docs/blockchain/Solana/Solana-OpenBook-api/",
          },
          {
            from: "/docs/blockchain/Solana/meteora-api/",
            to: "/docs/blockchain/Solana/meteora-dynamic-bonding-curve-api/",
          },
          {
            from: "/docs/blockchain/Ethereum/dextrades/DEXScreener/solana_dexscreener/",
            to: "/docs/blockchain/Solana/DEXScreener/solana_dexscreener/",
          },
          {
            from: "/docs/blockchain/Ethereum/BSC/bsc-uniswap-api/",
            to: "/docs/blockchain/BSC/bsc-uniswap-api/",
          },
          {
            from: "/docs/blockchain/Ethereum/Base/base-uniswap-api/",
            to: "/docs/blockchain/Base/base-uniswap-api/",
          },
          {
            from: "/docs/blockchain/Ethereum/Matic/matic-uniswap-api/",
            to: "/docs/blockchain/Matic/matic-uniswap-api/",
          },
          {
            from: "/docs/grpc/solana/filters/",
            to: "/docs/grpc/solana/topics/dextrades/",
          },
          {
            from: "/docs/blockchain/Solana/dextrades/",
            to: "/docs/blockchain/Solana/solana-dextrades/",
          },
          {
            from: "/docs/blockchain/Solana/token-holders/",
            to: "/docs/blockchain/Solana/solana-token-holders/",
          },
          {
            from: "/docs/graphql-reference/",
            to: "/docs/schema/schema-intro/",
          },

          //crypto price api redirects
          {
            from: "/docs/trading/price-index/introduction",
            to: "/docs/trading/crypto-price-api/introduction",
          },
          {
            from: "/docs/trading/price-index/in-depth",
            to: "/docs/trading/crypto-price-api/in-depth",
          },
          {
            from: "/docs/trading/price-index/examples",
            to: "/docs/trading/crypto-price-api/examples",
          },
          {
            from: "/docs/trading/price-index/tokens",
            to: "/docs/trading/crypto-price-api/tokens",
          },
          {
            from: "/docs/trading/price-index/currency",
            to: "/docs/trading/crypto-price-api/currency",
          },
          {
            from: "/docs/trading/price-index/pairs",
            to: "/docs/trading/crypto-price-api/pairs",
          },
          {
            from: "/docs/trading/crypto-price-api/crypto-market-data-api",
            to: "/docs/trading/crypto-price-api/crypto-marketcap-api",
          },
          {
            from: "/docs/trading/crypto-price-api/trades-api",
            to: "/docs/trading/crypto-trades-api/trades-api",
          },

          // BSC redirects from old examples/BSC/ path to new blockchain/BSC/ path
          {
            to: "/docs/blockchain/BSC/",
            from: "/docs/category/bsc/",
          },
          {
            to: "/docs/blockchain/BSC/",
            from: "/docs/examples/BSC/",
          },
          {
            to: "/docs/blockchain/BSC/bsc-balance-updates/",
            from: "/docs/examples/BSC/bsc-balance-updates/",
          },
          {
            to: "/docs/blockchain/BSC/bsc-calls-api/",
            from: "/docs/examples/BSC/bsc-calls-api/",
          },
          {
            to: "/docs/blockchain/BSC/bsc-dextrades/",
            from: "/docs/examples/BSC/bsc-dextrades/",
          },
          {
            to: "/docs/blockchain/BSC/bsc-uniswap-api/",
            from: "/docs/examples/BSC/bsc-uniswap-api/",
          },
          {
            to: "/docs/blockchain/BSC/bsc-events-api/",
            from: "/docs/examples/BSC/bsc-events-api/",
          },
          {
            to: "/docs/blockchain/BSC/bsc-nft/",
            from: "/docs/examples/BSC/bsc-nft/",
          },
          {
            to: "/docs/blockchain/BSC/bsc-transfers/",
            from: "/docs/examples/BSC/bsc-transfers/",
          },
          {
            to: "/docs/blockchain/BSC/gra-fun-api/",
            from: "/docs/examples/BSC/gra-fun-api/",
          },
          {
            to: "/docs/blockchain/BSC/four-meme-api/",
            from: "/docs/examples/BSC/four-meme-api/",
          },
          {
            to: "/docs/blockchain/BSC/pancake-swap-api/",
            from: "/docs/examples/BSC/pancake-swap-api/",
          },
          {
            to: "/docs/blockchain/BSC/bsc-mempool-stream/",
            from: "/docs/examples/BSC/bsc-mempool-stream/",
          },

          // Tron redirects from old examples/Tron/ path to new blockchain/Tron/ path
          {
            to: "/docs/blockchain/Tron/",
            from: "/docs/category/Tron/",
          },
          {
            to: "/docs/blockchain/Tron/",
            from: "/docs/examples/Tron/",
          },
          {
            to: "/docs/blockchain/Tron/sunswap-api/",
            from: "/docs/examples/Tron/sunswap-api/",
          },
          {
            to: "/docs/blockchain/Tron/tron-balance-updates/",
            from: "/docs/examples/Tron/tron-balance-updates/",
          },
          {
            to: "/docs/blockchain/Tron/tron-dextrades/",
            from: "/docs/examples/Tron/tron-dextrades/",
          },
          {
            to: "/docs/blockchain/Tron/tron-mempool/",
            from: "/docs/examples/Tron/tron-mempool/",
          },
          {
            to: "/docs/blockchain/Tron/tron-nft/",
            from: "/docs/examples/Tron/tron-nft/",
          },
          {
            to: "/docs/blockchain/Tron/tron-sunpump/",
            from: "/docs/examples/Tron/tron-sunpump/",
          },
          {
            to: "/docs/blockchain/Tron/tron-transactions-api/",
            from: "/docs/examples/Tron/tron-transactions-api/",
          },
          {
            to: "/docs/blockchain/Tron/tron-fees-api/",
            from: "/docs/examples/Tron/tron-fees-api/",
          },
          {
            to: "/docs/blockchain/Tron/tron-transfers/",
            from: "/docs/examples/Tron/tron-transfers/",
          },
          {
            to: "/docs/blockchain/Tron/usdt-trc20-api/",
            from: "/docs/examples/Tron/usdt-trc20-api/",
          },

          // TON redirects removed after API removed - BIT-12892
          // {
          //   to: "/docs/blockchain/TON/ton-dex-trades/",
          //   from: "/docs/examples/ton/ton-dex-trades/",
          // },

          // Arbitrum redirects from old examples/Arbitrum/ path to new blockchain/Arbitrum/ path
          {
            to: "/docs/blockchain/Arbitrum/",
            from: "/docs/category/arbitrum/",
          },
          {
            to: "/docs/blockchain/Arbitrum/",
            from: "/docs/examples/Arbitrum/",
          },
          {
            to: "/docs/blockchain/Arbitrum/arbitrum-cross-chain/",
            from: "/docs/examples/Arbitrum/arbitrum-cross-chain/",
          },

          {
            to: "/docs/blockchain/Arbitrum/Blocks_Transactions/",
            from: "/docs/examples/Arbitrum/Blocks_Transactions/",
          },
          {
            to: "/docs/blockchain/Arbitrum/DexTrades/",
            from: "/docs/examples/Arbitrum/DexTrades/",
          },
          {
            to: "/docs/blockchain/Arbitrum/esgmx-api/",
            from: "/docs/examples/Arbitrum/esgmx-api/",
          },
          {
            to: "/docs/blockchain/Arbitrum/gmx-api/",
            from: "/docs/examples/Arbitrum/gmx-api/",
          },
          {
            to: "/docs/blockchain/Arbitrum/Smart_Contract_Calls/",
            from: "/docs/examples/Arbitrum/Smart_Contract_Calls/",
          },
          {
            to: "/docs/blockchain/Arbitrum/Smart_Contract_Events/",
            from: "/docs/examples/Arbitrum/Smart_Contract_Events/",
          },
          {
            to: "/docs/blockchain/Arbitrum/Overview",
            from: "/docs/examples/Arbitrum/Overview",
          },

          // Base redirects from old examples/Base/ path to new blockchain/Base/ path
          {
            to: "/docs/blockchain/Base/",
            from: "/docs/category/base/",
          },
          {
            to: "/docs/blockchain/Base/",
            from: "/docs/examples/Base/",
          },
          {
            to: "/docs/blockchain/Base/aerodrome-base-api/",
            from: "/docs/examples/Base/aerodrome-base-api/",
          },
          {
            to: "/docs/blockchain/Base/base-uniswap-api/",
            from: "/docs/examples/Base/base-uniswap-api/",
          },
          {
            to: "/docs/blockchain/Base/base-clanker-api/",
            from: "/docs/examples/Base/base-clanker-api/",
          },
          {
            to: "/docs/blockchain/Base/apestore-base-api/",
            from: "/docs/examples/Base/apestore-base-api/",
          },
          {
            to: "/docs/blockchain/Base/base-jump-base-api/",
            from: "/docs/examples/Base/base-jump-base-api/",
          },
          {
            to: "/docs/blockchain/Base/base-zora-api/",
            from: "/docs/examples/Base/base-zora-api/",
          },
          {
            to: "/docs/blockchain/Base/base-balance-updates/",
            from: "/docs/examples/Base/base-balance-updates/",
          },
          {
            to: "/docs/blockchain/Base/base-coins-api/",
            from: "/docs/examples/Base/base-coins-api/",
          },
          {
            to: "/docs/blockchain/Base/base-dextrades/",
            from: "/docs/examples/Base/base-dextrades/",
          },
          {
            to: "/docs/blockchain/Base/base-nft/",
            from: "/docs/examples/Base/base-nft/",
          },
          {
            to: "/docs/blockchain/Base/base-transfers/",
            from: "/docs/examples/Base/base-transfers/",
          },
          {
            to: "/docs/blockchain/Base/ai-agent-base-data/",
            from: "/docs/examples/Base/ai-agent-base-data/",
          },

          // Matic redirects from old examples/Matic/ path to new blockchain/Matic/ path
          {
            to: "/docs/blockchain/Matic/",
            from: "/docs/category/matic/",
          },
          {
            to: "/docs/blockchain/Matic/",
            from: "/docs/examples/Matic/",
          },
          {
            to: "/docs/blockchain/Matic/matic-balance-api/",
            from: "/docs/examples/Matic/matic-balance-updates/",
          },
          {
            to: "/docs/blockchain/Matic/matic-balance-api/",
            from: "/docs/blockchain/Matic/matic-balance-updates/",
          },
          {
            to: "/docs/blockchain/Matic/matic-dextrades/",
            from: "/docs/examples/Matic/matic-dextrades/",
          },
          {
            to: "/docs/blockchain/Matic/matic-uniswap-api/",
            from: "/docs/examples/Matic/matic-uniswap-api/",
          },
          {
            to: "/docs/blockchain/Matic/matic-nft/",
            from: "/docs/examples/Matic/matic-nft/",
          },
          {
            to: "/docs/blockchain/Matic/matic-transfers/",
            from: "/docs/examples/Matic/matic-transfers/",
          },

          // Optimism redirects from old examples/Optimism/ path to new blockchain/Optimism/ path
          {
            to: "/docs/blockchain/Optimism/",
            from: "/docs/category/Optimism/",
          },
          {
            to: "/docs/blockchain/Optimism/",
            from: "/docs/examples/Optimism/",
          },

          {
            to: "/docs/blockchain/Optimism/optimism-dextrades/",
            from: "/docs/examples/Optimism/optimism-dextrades/",
          },
          {
            to: "/docs/blockchain/Optimism/optimism-nft/",
            from: "/docs/examples/Optimism/optimism-nft/",
          },
          {
            to: "/docs/blockchain/Optimism/optimism-transfers/",
            from: "/docs/examples/Optimism/optimism-transfers/",
          },

          // Polymarket redirects from old examples/polymarket-api/ path to new examples/polymarket-api/ path
          {
            to: "/docs/examples/polymarket-api/polymarket-markets-api/",
            from: "/docs/examples/polymarket-api/main-polymarket-contract/",
          },
          {
            to: "/docs/examples/polymarket-api/polymarket-markets-api/",
            from: "/docs/examples/polymarket-api/uma-adapter-contract/",
          },
          {
            to: "/docs/examples/polymarket-api/polymarket-markets-api/",
            from: "/docs/examples/polymarket-api/polymarket-ctf-exchange/",
          },
        ],
        createRedirects(existingPath) {
          const froms = [];
          if (existingPath.startsWith("/docs/schema/evm/")) {
            froms.push(
              existingPath.replace("/docs/schema/evm/", "/docs/evm/"),
            );
          }
          if (existingPath.startsWith("/docs/authorization/")) {
            froms.push(
              existingPath.replace(
                "/docs/authorization/",
                "/docs/authorisation/",
              ),
            );
          }
          if (existingPath === "/docs/grpc/solana/authorization/") {
            froms.push("/docs/grpc/solana/authorisation/");
          }
          return froms.length ? froms : undefined;
        },
      },
    ],
    require.resolve("./plugins/llms-txt.js"),
    require.resolve("./plugins/tech-article-jsonld.js"),
  ],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          editUrl:
            "https://github.com/bitquery/streaming-data-platform-docs/tree/main",
        },
        blog: false,
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: [
            "/docs/graphql-reference/**",
            "/markdown-page/**",
            "/search/**",
          ],
          filename: "sitemap.xml",
          createSitemapItems: async ({
            siteConfig,
            routes,
            defaultCreateSitemapItems,
          }) => {
            const defaultItems = await defaultCreateSitemapItems({
              siteConfig,
              routes,
            });

            const filtered = defaultItems.filter((item) => {
              try {
                const path = new URL(item.url).pathname;
                return (
                  path !== "/markdown-page/" &&
                  path !== "/search/" &&
                  !path.includes("/cube-examples.md/")
                );
              } catch {
                return true;
              }
            });

            const customItems = [
              {
                url: "https://docs.bitquery.io/crypto-reward-tax-calculator/",
                changefreq: "monthly",
                priority: 0.6,
              },
            ];

            return [...filtered, ...customItems];
          },
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        ...(enableAnalytics
          ? {
              gtag: {
                trackingID: "G-ZWB80TDH9J",
                anonymizeIP: true,
              },
              googleTagManager: {
                containerId: "GTM-5GC69JH6",
              },
            }
          : {}),
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },

      announcementBar: {
        id: "new_pricing_2026",
        content:
          '<span class="announcementBar__inner"><span class="announcementBar__badge">New</span><span class="announcementBar__text">Pricing plans starting at <strong>$49/mo</strong></span><a class="announcementBar__cta" href="https://bitquery.io/pricing#plans-anchor" target="_blank" rel="noopener noreferrer">Explore plans →</a></span>',
        backgroundColor: "#93254b",
        textColor: "#ffffff",
        isCloseable: true,
      },

      // metadata: [
      //   {
      //     name: 'baidu-site-verification',
      //     content: 'codeva-3D7wc6GZVP' // Replace with your actual content value
      //   },
      //   // ... other meta tags ...
      // ],
      // Replace with your project's social card
      image: "img/heroImage4.png",
      navbar: {
        logo: {
          alt: "Bitquery.io",
          src: "img/logoBitqueryDark.png",
          srcDark: "img/logoBitqueryWhite.png",
        },
        items: [
          {
            to: "https://docs.bitquery.io/v1/",
            label: "V1 Docs",
            position: "left",
          },
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "V2 Docs",
            className: "v2-highlight",
          },
          {
            type: "doc",
            docId: "mcp/mcp-server",
            position: "left",
            label: "MCP Server",
          },
          {
            to: "https://bitquery.io/forms/api",
            label: "Book Demo",
            position: "left",
          },
          {
            to: "https://ide.bitquery.io/",
            label: "Access API",
            position: "right",
            className: "button button--primary bright-white-text",
          },
          {
            to: "https://docs.bitquery.io/docs/graphql/indexed-fields-reference/",
            label: "Indexed Fields",
            position: "left",
          },
          {
            to: "https://bitquery.substack.com/",
            label: "Newsletter",
            position: "left",
          },
          {
            to: "https://docs.bitquery.io/docs/tools-directory/",
            label: "Free Tools",
            position: "left",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Start here",
            items: [
              { label: "Platform overview", to: "/docs/intro/" },
              {
                label: "Getting started — first query",
                to: "/docs/start/first-query/",
              },
              { label: "Starter queries", to: "/docs/start/starter-queries/" },
              {
                label: "Starter subscriptions (WebSocket)",
                to: "/docs/start/starter-subscriptions/",
              },
              {
                label: "Supported chains (V1, V2, Kafka…)",
                to: "/docs/blockchain/supported-chains/",
              },
              {
                label: "Blockchain APIs overview",
                to: "/docs/blockchain/introduction/",
              },
              {
                label: "V1 documentation",
                href: "https://docs.bitquery.io/v1/",
              },
              {
                label: "V1 vs V2 APIs (IDE & schema)",
                href: "https://docs.bitquery.io/v1/docs/graphql-ide/v1-and-v2",
              },
            ],
          },
          {
            title: "Data & metrics",
            items: [
              {
                label: "Token prices & OHLCV",
                to: "/docs/trading/crypto-price-api/introduction/",
              },
              {
                label: "DEX trades",
                to: "/docs/trading/crypto-trades-api/trades-api/",
              },
              {
                label: "Transfers & wallet flows",
                to: "/docs/start/mental-model-transfers-events-calls/",
              },
              {
                label: "Contract calls & traces",
                to: "/docs/API-Blog/what-are-internal-transactions-how-to-get-them/",
              },
              {
                label: "Smart-contract events",
                to: "/docs/start/mental-model-transfers-events-calls/",
              },
              {
                label: "NFTs & metadata",
                to: "/docs/blockchain/Ethereum/nft/nft-api/",
              },
              { label: "Balances & holders", to: "/docs/schema/evm/balances/" },
              { label: "Mempool & pending txs", to: "/docs/start/mempool/" },
            ],
          },
          {
            title: "Interfaces & streaming",
            items: [
              { label: "GraphQL (HTTP)", to: "/docs/start/first-query/" },
              {
                label: "WebSocket subscriptions",
                to: "/docs/start/starter-subscriptions/",
              },
              {
                label: "Kafka streaming concepts",
                to: "/docs/streams/kafka-streaming-concepts/",
              },
              { label: "Streams overview", to: "/docs/streams/" },
              { label: "MCP server", to: "/docs/mcp/mcp-server/" },
              { label: "MCP in Cursor", to: "/docs/mcp/cursor/" },
              { label: "Cloud datasets (Parquet)", to: "/docs/cloud/" },
              {
                label: "Solana gRPC (CoreCast)",
                to: "/docs/grpc/solana/introduction/",
              },
            ],
          },
          {
            title: "Tools & explorers",
            items: [
              { label: "DEXrabbit", href: "https://dexrabbit.com/" },
              { label: "Explorer", href: "https://explorer.bitquery.io/" },
              { label: "GraphQL IDE", href: "https://ide.bitquery.io/" },
              { label: "Tools & SDKs directory", to: "/docs/tools-directory/" },
              {
                label: "Blockchain ClickHouse warehouse",
                href: "https://bitquery.io/products/data-warehouse",
              },
              { label: "Visit bitquery.io", href: "https://bitquery.io/" },
              {
                label: "Enterprise & sales",
                href: "https://bitquery.io/contact",
              },
            ],
          },
          {
            title: "Blockchains",
            items: [
              { label: "Ethereum", to: "/docs/blockchain/Ethereum/" },
              { label: "Solana", to: "/docs/blockchain/Solana/" },
              { label: "BNB Chain (BSC)", to: "/docs/blockchain/BSC/" },
              { label: "Base", to: "/docs/blockchain/Base/" },
              { label: "Polygon", to: "/docs/blockchain/Matic/" },
              { label: "Arbitrum", to: "/docs/blockchain/Arbitrum/" },
              { label: "Optimism", to: "/docs/blockchain/Optimism/" },
              { label: "Tron", to: "/docs/blockchain/Tron/" },
              { label: "Robinhood", to: "/docs/blockchain/robinhood/" },
              { label: "More networks…", to: "/docs/blockchain/introduction/" },
            ],
          },
          {
            title: "Guides & use cases",
            items: [
              {
                label: "Traders & desks →",
                to: "/docs/trading/crypto-price-api/introduction/",
              },
              {
                label: "Analysts & quants →",
                to: "/docs/graphql/dataset/archive/",
              },
              { label: "Auditors & finance →", to: "/docs/schema/evm/balances/" },
              {
                label: "Investigators & compliance →",
                href: "https://docs.bitquery.io/v1/docs/Examples/coinpath/money-flow-api",
              },
              {
                label: "How-to guides & recipes",
                to: "/docs/category/how-to-guides/",
              },
            ],
          },
          {
            title: "Community",
            items: [
              { label: "Telegram", href: "https://t.me/Bloxy_info" },
              { label: "Twitter / X", href: "https://twitter.com/Bitquery_io" },
              { label: "Forum", href: "https://community.bitquery.io/" },
              { label: "GitHub", href: "https://github.com/bitquery" },
              { label: "Blog", href: "https://bitquery.io/blog" },
              { label: "Newsletter", href: "https://bitquery.substack.com/" },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Bitquery, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
