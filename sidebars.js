// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    "intro",
    "api-comparison",
    {
      type: "category",
      label: "Start",
      link: {
        type: "generated-index",
        title: "Start",
        description: "Learn how to get started with the platform",
      },
      items: [
        "start/embed",
        "start/errors",
        "start/first-query",
        "start/getting-updates",
        "start/mempool",
        "start/starter-queries",
        "start/starter-subscriptions",
      ],
    },

    {
      type: "category",
      label: "Authorisation",
      link: {
        type: "generated-index",
        title: "Authorisation Documentation",
        description: "Learn about how to generate and use authorisation tokens",
      },
      items: [
        "authorisation/how-to-generate",
        "authorisation/how-to-use",
        "authorisation/websocket",
      ],
    },

    {
      type: "category",
      label: "Using the IDE",
      link: {
        type: "generated-index",
        title: "Using the IDE",
        description: "Explore all functionalities of the platform's IDE",
      },
      items: [
        "ide/account",
        "ide/code",
        "ide/paid",
        "ide/points",
        "ide/private",
        "ide/query",
        "ide/search",
        "ide/share",
        "ide/team",
        "ide/tradingview",
        "ide/variables",
      ],
    },

    {
      type: "category",
      label: "Building Queries",
      link: {
        type: "generated-index",
        title: "Building Queries Documentation",
        description: "Learn how to build powerful queries",
      },
      items: [
        {
          type: "category",
          label: "Capabilities",
          link: {
            type: "generated-index",
            title: "Capabilities",
            description: "Explore the platform's query capabilities",
          },
          items: [
            "graphql/datetime",
            "graphql/calculations",
            "graphql/combined",
            "graphql/filters",
            "graphql/limits",
            "graphql/capabilities/aggregated_metrics",
            "graphql/capabilities/array-intersect",
            "graphql/capabilities/patterns",
            "graphql/capabilities/query_fact_records",
            "graphql/capabilities/subscription_aggregates",
            "graphql/capabilities/subscription_facts",
            "graphql/optimizing-graphql-queries",
            "usecases/how-to-filter-anomaly-prices",
            "graphql/postman",
            "graphql/query",
            "graphql/sorting",
            "graphql/capabilities/joins",
            "graphql/capabilities/expression",
            "graphql/capabilities/relative-time",
          ],
        },
        {
          type: "category",
          label: "Dataset",
          link: {
            type: "generated-index",
            title: "Dataset Overview",
          },
          items: [
            "graphql/dataset/archive",
            "graphql/dataset/combined",
            "graphql/dataset/database",
            "graphql/dataset/EAP",
            "graphql/dataset/network",
            "graphql/dataset/options",
            "graphql/dataset/realtime",
            "graphql/dataset/select-blocks",
          ],
        },
        {
          type: "category",
          label: "Metrics",
          link: {
            type: "generated-index",
            title: "Metrics",
          },
          items: [
            "graphql/metrics/alias",
            "graphql/metrics/count",
            "graphql/metrics/distinct",
            "graphql/metrics/if",
            "graphql/metrics/metrics",
            "graphql/metrics/priceAsymmetry",
            "graphql/metrics/selectWhere",
            "graphql/metrics/statistics",
            "graphql/metrics/sum",
            "graphql/metrics/uniq",
            "graphql/metrics/quantile",
          ],
        },
      ],
    },

    {
      type: "category",
      label: "Streaming",
      link: {
        type: "generated-index",
        title: "Streaming Overview",
      },
      items: [
        {
          type: "category",
          label: "Streaming via Subscriptions",
          link: {
            type: "generated-index",
            title: "Streaming via Subscriptions",
          },
          items: [
            "subscriptions/subscription",
            "subscriptions/trigger",
            "subscriptions/websockets",
            "subscriptions/examples",
            "subscriptions/silent-disconnect-reconnect",
            "subscriptions/example-rust",
            "subscriptions/mempool-subscriptions",
            "subscriptions/backfilling-subscription",
            {
              type: "category",
              label: "Data Pipeline: Writing to Google BigQuery",
              link: {
                type: "generated-index",
                title: "Data Pipeline: Writing to Google BigQuery",
                description:
                  "Learn how to use Bitquery Subscription to Build a Data Pipeline",
              },
              items: [
                "subscriptions/google-bigquery/intro",

                "subscriptions/google-bigquery/pub-sub",
                "subscriptions/google-bigquery/bigquery",
              ],
            },
            "subscriptions/aws/s3_tutorial",
          ],
        },
        {
          type: "category",
          label: "Data Streams",
          link: {
            type: "generated-index",
            title: "Data Streams Overview",
          },
          items: [
            "streams/kafka-streaming-concepts",
            {
              type: "category",
              label: "Protobuf Data Streams",
              items: [
                {
                  type: "category",
                  label: "L1/L2 Chains - Protobuf Data Streams",
                  items: [
                    "streams/protobuf/chains/Bitcoin-protobuf",
                    "streams/protobuf/chains/EVM-protobuf",
                    "streams/protobuf/chains/Solana-protobuf",
                    "streams/protobuf/chains/Tron-protobuf",
                  ],
                },
                "streams/protobuf/kafka-protobuf-go",
                "streams/protobuf/kafka-protobuf-python",
                "streams/protobuf/kafka-protobuf-js",
                "streams/protobuf/filtering_kafka_streams",
              ],
            },
            "streams/compare-websocket-kafka",
            "streams/real-time-solana-data",
            "streams/sniper-trade-using-bitquery-kafka-stream",
          ],
        },
      ],
    },

    {
      type: "category",
      label: "Understanding Cubes",
      link: {
        type: "generated-index",
        title: "Understanding Cubes Overview",
      },
      items: [
        {
          type: "category",
          label: "EVM Cube",
          link: {
            type: "generated-index",
            title: "EVM Cube Overview",
          },
          items: [
            "cubes/EVM",
            "cubes/balance-updates-cube",
            "cubes/dextrades-dextradesbyTokens",
            "cubes/dextrades",
            "cubes/dextradesbyTokens",
            "cubes/transaction-cube",
            "cubes/transfers-cube",
            "evm/token-holders",
          ],
        },
        "cubes/solana",
      ],
    },

    {
      type: "category",
      label: "L1 Chains",
      link: {
        type: "generated-index",
        title: "L1 Chains Overview",
      },
      items: [
        {
          type: "category",
          label: "Ethereum",
          link: {
            type: "doc",
            id: "examples/Ethereum/index",
          },
          items: [
            "examples/blocks/blocks-api",
            {
              type: "category",
              label: "Balances",
              items: [
                "examples/balances/balance-api",
                "examples/token-holders/token-holder-api",
              ],
            },
            "examples/calls/smartcontract",
            "examples/calls/smartcontract-filterby",
            "examples/events/events-api",
            "examples/fees/fees-api",
            "examples/mempool/mempool-api",
            "examples/transfers/total-supply",
            "examples/transactions/transaction-api",
            "examples/calls/contract-creation",

            {
              type: "category",
              label: "Token Transfers",
              items: ["examples/transfers/erc20-token-transfer-api"],
            },
            {
              type: "category",
              label: "DEX Trades",
              link: {
                type: "generated-index",
                title: "DEX Trades",
              },
              items: [
                "examples/dextrades/dex-api",
                "examples/dextrades/token-trades-apis",
                "examples/dextrades/trades-of-an-address-api",
                "examples/dextrades/pair-creation-time",
                "examples/dextrades/crypto-coin-ticker",
                "examples/dextrades/uniswap-api",
                "examples/dextrades/pancakeswap-api",
                "examples/dextrades/DEXScreener/evm_dexscreener",
                "examples/dextrades/evm-bullx-api",
                "examples/dextrades/evm-gmgn-api",
                "examples/dextrades/evm-photon-api",
                "examples/dextrades/pools-api",
              ],
            },
            {
              type: "category",
              label: "NFT",
              items: [
                "examples/nft/nft-api",
                "examples/nft/nft-blur-marketplace-api",
                "examples/nft/nft-calls-apI",
                "examples/nft/nft-collection-api",
                "examples/nft/nft-metadata-api",
                "examples/nft/nft-ownership-api",
                "examples/nft/nft-trades-apI",
                "examples/nft/nft-transfer-api",
              ],
            },
            {
              type: "category",
              label: "Ethers Library",
              items: [
                "examples/ethers-library/debug_traceCall",
                "examples/ethers-library/debug_traceTransaction",
                "examples/ethers-library/eth-getbalance",
                "examples/ethers-library/eth_blockNumber",
                "examples/ethers-library/eth_gasPrice",
                "examples/ethers-library/eth_getBlockReceipts",
                "examples/ethers-library/eth_getCode",
                "examples/ethers-library/eth_getLogs",
                "examples/ethers-library/eth_getTransactionByHash",
                "examples/ethers-library/eth_getTransactionReceipt",
                "examples/ethers-library/eth_subscribe",
              ],
            },
            "examples/transfers/rwa-api",
          ],
        },

        {
          type: "category",
          label: "BSC",
          link: {
            type: "generated-index",
            title: "BSC API Documentation",
          },
          items: [
            "examples/BSC/bsc-balance-updates",
            "examples/BSC/bsc-calls-api",
            "examples/BSC/bsc-dextrades",
            "examples/BSC/bsc-uniswap-api",
            "examples/BSC/bsc-events-api",
            "examples/BSC/bsc-nft",
            "examples/BSC/bsc-transfers",
            "examples/BSC/gra-fun-api",
            "examples/BSC/four-meme-api",
            "examples/BSC/pancake-swap-api",
            "examples/BSC/bsc-mempool-stream",
          ],
        },
        {
          type: "category",
          label: "Solana",
          link: {
            type: "doc",
            id: "examples/Solana/index",
          },
          items: [
            {
              type: "category",
              label: "PumpFun",
              items: [
                "examples/Solana/Pump-Fun-API",
                "examples/Solana/pump-swap-api",
                "examples/Solana/Pump-Fun-Marketcap-Bonding-Curve-API",
                "examples/Solana/pump-fun-to-pump-swap",
              ],
            },
            {
              type: "category",
              label: "Raydium",
              items: [
                "examples/Solana/launchpad-raydium",
                "examples/Solana/Solana-Raydium-DEX-API",
                "examples/Solana/raydium-clmm-API",
                "examples/Solana/raydium-cpmm-API",
              ],
            },
            {
              type: "category",
              label: "Meteora",
              items: [
                "examples/Solana/Meteora-DAMM-v2-API",
                "examples/Solana/Meteora-DLMM-API",
                "examples/Solana/Meteora-DYN-API",
                "examples/Solana/meteora-dynamic-bonding-curve-api",
              ],
            },
            "examples/Solana/letsbonk-api",
            "examples/Solana/jupiter-studio-api",
            "examples/Solana/solana-balance-updates",
            "examples/Solana/solana-dextrades",
            "examples/Solana/solana-trader-API",
            "examples/Solana/historical-aggregate-data",
            "examples/Solana/token-supply-cube",
            "examples/Solana/solana-instructions",
            "examples/Solana/solana-transactions",
            "examples/Solana/solana-transfers",
            "examples/Solana/solana_fees_api",
            "examples/Solana/Boop-Fun-API",
            "examples/Solana/BonkSwap-API",
            "examples/Solana/solana-jupiter-api",
            "examples/Solana/solana-gmgn-api",
            "examples/Solana/solana-bullx-api",
            "examples/Solana/solana-photon-api",
            "examples/Solana/solana-logs",
            "examples/Solana/solana-nft",
            "examples/Solana/solana-orca-dex-api",
            "examples/Solana/solana-rewards",
            "examples/Solana/solana-search-tokens",
            "examples/Solana/solana-zeta",
            "examples/Solana/Moonshot-API",
            "examples/Solana/Solana-AldrinAmm-api",
            "examples/Solana/Solana-DEX-Orders-API",
            "examples/Solana/Solana-DexPools-API",
            "examples/Solana/Solana-Jito-Bundle-api",
            "examples/Solana/Solana-Lifinity-dex-api",
            "examples/Solana/Believe-API",
            "examples/Solana/Solana-OpenBook-api",
            "examples/Solana/Solana-Phoenix-api",
            "examples/Solana/SolFi-api",
            "examples/Solana/Orbic-API",
            "examples/Solana/xstocks-api",
            "examples/dextrades/DEXScreener/solana_dexscreener",
            "examples/Solana/ai-agent-solana-data",
          ],
        },

        {
          type: "category",
          label: "Tron",
          link: {
            type: "generated-index",
            title: "Tron API Documentation",
          },
          items: [
            "examples/Tron/sunswap-api",
            "examples/Tron/tron-balance-updates",
            "examples/Tron/tron-dextrades",
            "examples/Tron/tron-mempool",
            "examples/Tron/tron-nft",
            "examples/Tron/tron-sunpump",
            "examples/Tron/tron-transactions-api",
            "examples/Tron/tron-fees-api",
            "examples/Tron/tron-transfers",
            "examples/Tron/usdt-trc20-api",
          ],
        },
        {
          type: "category",
          label: "TON",
          link: {
            type: "generated-index",
            title: "TON API Documentation",
          },
          items: ["examples/ton/ton-dex-trades"],
        },
      ],
    },

    {
      type: "category",
      label: "L2 Chains",
      link: {
        type: "generated-index",
        title: "L2 Chains Overview",
      },
      items: [
        {
          type: "category",
          label: "Arbitrum",
          items: [
            "examples/Arbitrum/Overview",
            "examples/Arbitrum/arbitrum-cross-chain",
            "examples/Arbitrum/Balance_Updates",
            "examples/Arbitrum/Blocks_Transactions",
            "examples/Arbitrum/DexTrades",
            "examples/Arbitrum/esgmx-api",
            "examples/Arbitrum/gmx-api",
            "examples/Arbitrum/Smart_Contract_Calls",
            "examples/Arbitrum/Smart_Contract_Events",
          ],
        },
        {
          type: "category",
          label: "Base",
          link: {
            type: "generated-index",
            title: "Base API Documentation",
          },
          items: [
            "examples/Base/aerodrome-base-api",
            "examples/Base/base-uniswap-api",
            "examples/Base/base-clanker-api",
            "examples/Base/apestore-base-api",
            "examples/Base/base-jump-base-api",
            "examples/Base/base-balance-updates",
            "examples/Base/base-coins-api",
            "examples/Base/base-dextrades",
            "examples/Base/base-nft",
            "examples/Base/base-transfers",
            "examples/Base/ai-agent-base-data",
          ],
        },
        {
          type: "category",
          label: "Matic (Polygon)",
          link: {
            type: "doc",
            id: "examples/Matic/index",
          },
          items: [
            "examples/Matic/matic-balance-updates",
            "examples/Matic/matic-dextrades",
            "examples/Matic/matic-uniswap-api",
            "examples/Matic/matic-nft",
            "examples/Matic/matic-transfers",
          ],
        },
        {
          type: "category",
          label: "Optimism",
          link: {
            type: "generated-index",
            title: "Optimism API Documentation",
          },
          items: [
            "examples/Optimism/optimism-balance-updates",
            "examples/Optimism/optimism-dextrades",
            "examples/Optimism/optimism-nft",
            "examples/Optimism/optimism-transfers",
          ],
        },
        {
          type: "category",
          label: "OpBNB",
          link: {
            type: "generated-index",
            title: "OpBNB API Documentation",
          },
          items: [
            "examples/OpBNB/opbnb-balance-updates",
            "examples/OpBNB/opbnb-dextrades",
            "examples/OpBNB/opbnb-nft",
            "examples/OpBNB/opbnb-transfers",
          ],
        },
        {
          type: "category",
          label: "Cross-Chain",
          link: {
            type: "generated-index",
            title: "Cross-Chain API",
          },
          items: ["examples/cross-chain/cross-chain-api"],
        },
      ],
    },
    {
      type: "category",
      label: "Trading APIs",
      link: {
        type: "generated-index",
        title: "Trading APIs",
        description:
          "Using Price Streams for Tokens & Currencies Across Chains",
      },
      items: [
        {
          type: "category",
          label: "Price Index",
          link: {
            type: "generated-index",
            title: "Crypto Price API",
            description:
              "Access token and currency pricing data across chains.",
          },
          items: [
            "trading/price-index/introduction",

            {
              type: "category",
              label: "Price Index Cubes",
              link: {
                type: "generated-index",
                title: "Cubes Overview",
                description: "Understanding each price index cube",
              },
              items: [
                "trading/price-index/tokens",
                "trading/price-index/currency",
                "trading/price-index/pairs",
              ],
            },
            // "trading/price-index/tokens",
            // "trading/price-index/currency",
            // "trading/price-index/pairs",

            "trading/price-index/in-depth",
            "trading/price-index/examples",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "How-To Guides",
      link: {
        type: "generated-index",
        title: "How-To Guides Overview",
      },
      items: [
        "usecases/MCP",
        {
          type: "category",
          label: "NFT Applications",
          link: {
            type: "generated-index",
            title: "NFT and Analytics",
          },
          items: [
            {
              type: "category",
              label: "NFT Creator Portfolio",
              items: [
                "usecases/nft-creator/gettingstarted",
                "usecases/nft-creator/pages",
                "usecases/nft-creator/app",
                "usecases/nft-creator/components",
              ],
            },
            "usecases/nft-analytics",
            "usecases/nft-scanner",
            "usecases/tokenholder-heatmap",
          ],
        },
        {
          type: "category",
          label: "Wash Trading Detector",
          link: {
            type: "generated-index",
            title: "Detecting Wash Trades on Solana",
          },
          items: [
            "usecases/wash-trading-detector/overview",
            {
              type: "category",
              label: "Data Preparations",
              items: [
                "usecases/wash-trading-detector/prepare-data/getTrades",
                "usecases/wash-trading-detector/prepare-data/rules",
                "usecases/wash-trading-detector/prepare-data/label",
              ],
            },
            "usecases/wash-trading-detector/training",
            "usecases/wash-trading-detector/app",
          ],
        },
        {
          type: "category",
          label: "TradingView Charting",
          link: {
            type: "generated-index",
            title: "TradingView Charting",
          },
          items: [
            // {
            //   type: "category",
            //   label: "TradingView Advanced Charts",
            //   items: [
            //     "usecases/tradingview-advanced-charts/getting-started",
            //     "usecases/tradingview-advanced-charts/component",
            //     "usecases/tradingview-advanced-charts/datafeed",
            //     "usecases/tradingview-advanced-charts/getBars",
            //     "usecases/tradingview-advanced-charts/advancedChart",
            //   ],
            // },
            {
              type: "category",
              label: "TradingView Advance Charts with Realtime Data",
              items: [
                "usecases/tradingview-subscription-realtime/getting-started",
                "usecases/tradingview-subscription-realtime/historical_OHLC",
                "usecases/tradingview-subscription-realtime/realtime_OHLC",
                "usecases/tradingview-subscription-realtime/custom_datafeed",
                "usecases/tradingview-subscription-realtime/widget",
                "usecases/tradingview-subscription-realtime/final-step",
              ],
            },
            "usecases/trading-indicators",
          ],
        },
        {
          type: "category",
          label: "Building Applications Using Kafka",
          link: {
            type: "generated-index",
            title: "Building Applications Using Kafka",
          },
          items: [
            "usecases/binance-exchange-wallet-monitoring",
            "usecases/track-millions-of-solana-wallets",
          ],
        },
        {
          type: "category",
          label: "Blockchain Monitoring",
          link: {
            type: "generated-index",
            title: "Blockchain Monitoring",
          },
          items: [
            "usecases/ohlcv-complete-guide",
            "usecases/mempool-transaction-fee",
            "usecases/monitoring-solana-blockchain-real-time-tutorial",
            "usecases/monitoring-solana-at-scale-managing-hundreds-of-addresses",
            "usecases/streaming-moonshot-prices",
            "usecases/solana-ohlc-calculator",
            "usecases/real-time-historical-ethereum-price-excel-google-sheets",
            {
              type: "category",
              label: "Real-Time Balance Checker",
              items: [
                "usecases/real-time-balance-tracker/overview",
                "usecases/real-time-balance-tracker/scripts",
                "usecases/real-time-balance-tracker/ui",
              ],
            },
            {
              type: "category",
              label: "P&L Calculator",
              items: [
                "usecases/p-l-product/overview",
                "usecases/p-l-product/pnl",
              ],
            },
          ],
        },
        {
          type: "category",
          label: "Apps and Dashboards",
          link: {
            type: "generated-index",
            title: "Apps and Dashboards",
          },
          items: [
            "usecases/crypto-dashboard",
            "usecases/dapps",
            "usecases/discord-bot",
            "usecases/telegram-bot",
            "usecases/Top-10-ethereum-tokens",
          ],
        },
        {
          type: "category",
          label: "Bot Building",
          link: {
            type: "generated-index",
            title: "Bot Building",
          },
          items: [
            "usecases/arbitrum-sniper-bot",
            "usecases/base-sniper-bot",
            "usecases/solana-sniper-bot",
            "usecases/copy-trading-bot",
            "usecases/automated-trading-ethereum-volume-surge-bot",
            "usecases/price-change-signal-bot",
            "usecases/add-liquidity-signal-bot",
            "usecases/solana-arbitrage-dashboard",
            "usecases/sandwitch-detection",
          ],
        },
      ],
    },

    {
      type: "category",
      label: "Data in Cloud",
      link: {
        type: "generated-index",
        title: "Data in Cloud",
      },
      items: [
        {
          type: "category",
          label: "Protobuf",
          link: {
            type: "generated-index",
            title: "Protobuf Overview",
          },
          items: [
            "cloud/protobuf/evm",
            "cloud/protobuf/protobuf",
            "cloud/protobuf/solana",
            "cloud/protobuf/tron",
            "cloud/protobuf/objects",
          ],
        },
        {
          type: "category",
          label: "Examples",
          link: {
            type: "generated-index",
            title: "Cloud Examples",
          },
          items: [
            "cloud/examples/appsync",
            "cloud/examples/lambda-functions",
            "cloud/examples/s3-eth-tutorial",
          ],
        },
      ],
    },

    {
      type: "category",
      label: "API Blog",
      link: {
        type: "generated-index",
        title: "API Blog",
      },
      items: [
        "API-Blog/migrate-v1-v2",
        "API-Blog/track-token-lock-unlock",
        "API-Blog/use-regular-expressions-to-search-solana-logs",
        "API-Blog/what-are-internal-transactions-how-to-get-them",
      ],
    },
  ],
};

module.exports = sidebars;
