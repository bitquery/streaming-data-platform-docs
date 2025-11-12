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
        "start/learning-path",
        "start/first-query",
        "start/starter-queries",
        "start/starter-subscriptions",
        "start/endpoints",
        "start/embed",
        "start/errors",
        "start/getting-updates",
        "start/mempool",
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
            "graphql/capabilities/json-filtering",
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
        type: "doc",
        id: "streams/index",
      },
      items: [
        {
          type: "category",
          label: "GraphQL Subscriptions",
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
          label: "Kafka Streams",
          link: {
            type: "generated-index",
            title: "Data Streams Overview",
          },
          items: [
            "streams/kafka-streaming-concepts",
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
            "streams/real-time-solana-data",
            "streams/sniper-trade-using-bitquery-kafka-stream",
          ],
        },
        {
          type: "category",
          label: "gRPC Streams",
          link: {
            type: "generated-index",
            title: "gRPC Streams",
            description: "Docs on how to use Bitquery gRPC streams",
          },
          items: [
            {
              type: "category",
              label: "Solana",
              items: [
                "grpc/solana/introduction",
                "grpc/solana/authorisation",

                {
                  type: "category",
                  label: "Topics",
                  link: {
                    type: "generated-index",
                    title: "gRPC Solana Topics",
                    description:
                      "Docs on how to use Bitquery Solana gRPC topics",
                  },
                  items: [
                    "grpc/solana/topics/dextrades",
                    "grpc/solana/topics/transactions",
                    "grpc/solana/topics/balance",
                    "grpc/solana/topics/dexorder",
                    "grpc/solana/topics/dexpools",
                    "grpc/solana/topics/transfer",
                  ],
                },
                {
                  type: "category",
                  label: "Examples",
                  link: {
                    type: "generated-index",
                    title: "gRPC Solana Examples",
                    description:
                      "Docs on how to use Bitquery Solana gRPC to get Pump.fun data",
                  },
                  items: [
                    "grpc/solana/examples/pump-fun-grpc-streams",
                    "grpc/solana/examples/letsbonk-grpc-streams",
                    "grpc/solana/examples/grpc-copy-trading-bot",
                  ],
                },
                "grpc/solana/best_practices",
                "grpc/solana/live-reload",
                "grpc/solana/errors",
              ],
            },
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
            "cubes/dextrades",
            "cubes/dextradesbyTokens",
            "cubes/transaction-cube",
            "cubes/balance-updates-cube",
            "cubes/transfers-cube",
            "evm/token-holders",
          ],
        },
        "cubes/solana",
      ],
    },

    {
      type: "category",
      label: "Blockchains",
      link: {
        type: "doc",
        id: "blockchain/introduction",
      },
      items: [
        {
          type: "category",
          label: "Ethereum",
          link: {
            type: "doc",
            id: "blockchain/Ethereum/index",
          },
          items: [
            "blockchain/Ethereum/blocks/blocks-api",
            {
              type: "category",
              label: "Balances",
              link: {
                type: "doc",
                id: "blockchain/Ethereum/balances/index",
              },
              items: [
                "blockchain/Ethereum/balances/balance-api",
                "blockchain/Ethereum/token-holders/token-holder-api",
                {
                  type: "category",
                  label: "Transaction Balance Tracker",
                  link: {
                    type: "doc",
                    id: "blockchain/Ethereum/balances/transaction-balance-tracker/index",
                  },
                  items: [
                    "blockchain/Ethereum/balances/transaction-balance-tracker/eth-transaction-balance-tracker",
                    "blockchain/Ethereum/balances/transaction-balance-tracker/eth-self-destruct-balance-api",
                    "blockchain/Ethereum/balances/transaction-balance-tracker/eth-validator-balance-tracker",
                    "blockchain/Ethereum/balances/transaction-balance-tracker/eth-miner-balance-tracker",
                    "blockchain/Ethereum/balances/transaction-balance-tracker/eth-mev-balance-tracker",
                    "blockchain/Ethereum/balances/transaction-balance-tracker/eth-gas-balance-tracker",
                    "blockchain/Ethereum/balances/transaction-balance-tracker/eth-transfer-balance-tracker"
                  ],
                },
              ],
            },
            "blockchain/Ethereum/calls/smartcontract",
            "blockchain/Ethereum/calls/smartcontract-filterby",
            "blockchain/Ethereum/events/events-api",
            "blockchain/Ethereum/fees/fees-api",
            "blockchain/Ethereum/mempool/mempool-api",
            "blockchain/Ethereum/transfers/total-supply",
            "blockchain/Ethereum/transactions/transaction-api",
            "blockchain/Ethereum/calls/contract-creation",

            {
              type: "category",
              label: "Token Transfers",
              items: ["blockchain/Ethereum/transfers/erc20-token-transfer-api"],
            },
            {
              type: "category",
              label: "DEX Trades",
              link: {
                type: "generated-index",
                title: "DEX Trades",
              },
              items: [
                "blockchain/Ethereum/dextrades/dex-api",
                "blockchain/Ethereum/dextrades/token-trades-apis",
                "blockchain/Ethereum/dextrades/trades-of-an-address-api",
                "blockchain/Ethereum/dextrades/pair-creation-time",
                "blockchain/Ethereum/dextrades/crypto-coin-ticker",
                "blockchain/Ethereum/dextrades/uniswap-api",
                "blockchain/Ethereum/dextrades/uniswap-position-api",
                "blockchain/Ethereum/dextrades/pancakeswap-api",
                "blockchain/Ethereum/dextrades/fluid-dex-api",
                "blockchain/Ethereum/dextrades/DEXScreener/evm_dexscreener",
                "blockchain/Ethereum/dextrades/evm-bullx-api",
                "blockchain/Ethereum/dextrades/evm-gmgn-api",
                "blockchain/Ethereum/dextrades/evm-photon-api",
                "blockchain/Ethereum/dextrades/pools-api",
              ],
            },
            {
              type: "category",
              label: "NFT",
              items: [
                "blockchain/Ethereum/nft/nft-api",
                "blockchain/Ethereum/nft/nft-blur-marketplace-api",
                "blockchain/Ethereum/nft/nft-calls-apI",
                "blockchain/Ethereum/nft/nft-collection-api",
                "blockchain/Ethereum/nft/nft-metadata-api",
                "blockchain/Ethereum/nft/nft-ownership-api",
                "blockchain/Ethereum/nft/nft-trades-apI",
                "blockchain/Ethereum/nft/nft-transfer-api",
              ],
            },
            {
              type: "category",
              label: "Ethers Library",
              items: [
                "blockchain/Ethereum/ethers-library/debug_traceCall",
                "blockchain/Ethereum/ethers-library/debug_traceTransaction",
                "blockchain/Ethereum/ethers-library/eth-getbalance",
                "blockchain/Ethereum/ethers-library/eth_blockNumber",
                "blockchain/Ethereum/ethers-library/eth_gasPrice",
                "blockchain/Ethereum/ethers-library/eth_getBlockReceipts",
                "blockchain/Ethereum/ethers-library/eth_getCode",
                "blockchain/Ethereum/ethers-library/eth_getLogs",
                "blockchain/Ethereum/ethers-library/eth_getTransactionByHash",
                "blockchain/Ethereum/ethers-library/eth_getTransactionReceipt",
                "blockchain/Ethereum/ethers-library/eth_subscribe",
              ],
            },
            "blockchain/Ethereum/transfers/rwa-api",
          ],
        },

        {
          type: "category",
          label: "BSC",
          link: {
            type: "doc",
            id: "blockchain/BSC/index",
          },
          items: [
            "blockchain/BSC/bsc-balance-updates",
            {
              type: "category",
              label: "Transaction Balance Tracker",
              link: {
                type: "doc",
                id: "blockchain/BSC/transaction-balance-tracker/index",
              },
              items: [
                "blockchain/BSC/transaction-balance-tracker/bsc-transaction-balance-tracker",
                "blockchain/BSC/transaction-balance-tracker/bsc-self-destruct-balance-api",
                "blockchain/BSC/transaction-balance-tracker/bsc-validator-balance-tracker",
                "blockchain/BSC/transaction-balance-tracker/bsc-miner-balance-tracker",
                "blockchain/BSC/transaction-balance-tracker/bsc-mev-balance-tracker",
                "blockchain/BSC/transaction-balance-tracker/bsc-gas-balance-tracker",
                "blockchain/BSC/transaction-balance-tracker/bsc-transfer-balance-tracker",
              ],
            },
            "blockchain/BSC/bsc-calls-api",
            "blockchain/BSC/bsc-dextrades",
            "blockchain/BSC/bsc-uniswap-api",
            "blockchain/BSC/bsc-events-api",
            "blockchain/BSC/bsc-nft",
            "blockchain/BSC/bsc-transfers",
            "blockchain/BSC/gra-fun-api",
            "blockchain/BSC/four-meme-api",
            "blockchain/BSC/four-meme-mempool-API",
            "blockchain/BSC/binance-memerush-api",
            "blockchain/BSC/pancake-swap-api",
            "blockchain/BSC/bsc-mempool-stream",
          ],
        },
        {
          type: "category",
          label: "Solana",
          link: {
            type: "doc",
            id: "blockchain/Solana/index",
          },
          items: [
            {
              type: "category",
              label: "PumpFun",
              link: {
                type: "doc",
                id: "blockchain/Solana/Pumpfun/index",
              },
              items: [
                "blockchain/Solana/Pumpfun/Pump-Fun-API",
                "blockchain/Solana/Pumpfun/pump-swap-api",
                "blockchain/Solana/Pumpfun/Pump-Fun-Marketcap-Bonding-Curve-API",
                "blockchain/Solana/Pumpfun/pump-fun-to-pump-swap",
              ],
            },
            {
              type: "category",
              label: "Raydium",
              items: [
                "blockchain/Solana/launchpad-raydium",
                "blockchain/Solana/Solana-Raydium-DEX-API",
                "blockchain/Solana/raydium-clmm-API",
                "blockchain/Solana/raydium-cpmm-API",
              ],
            },
            {
              type: "category",
              label: "Meteora",
              items: [
                "blockchain/Solana/Meteora-DAMM-v2-API",
                "blockchain/Solana/Meteora-DLMM-API",
                "blockchain/Solana/Meteora-DYN-API",
                "blockchain/Solana/meteora-dynamic-bonding-curve-api",
              ],
            },
            "blockchain/Solana/letsbonk-api",
            "blockchain/Solana/goonfi-api",
            "blockchain/Solana/heaven-dex-api",
            "blockchain/Solana/bags-fm-api",
            "blockchain/Solana/solana-balance-updates",
            "blockchain/Solana/solana-dextrades",
            "blockchain/Solana/solana-trader-API",
            "blockchain/Solana/historical-aggregate-data",
            "blockchain/Solana/token-supply-cube",
            "blockchain/Solana/solana-instructions",
            "blockchain/Solana/solana-transactions",
            "blockchain/Solana/solana-transfers",
            "blockchain/Solana/solana_fees_api",
            "blockchain/Solana/Boop-Fun-API",
            "blockchain/Solana/BonkSwap-API",
            "blockchain/Solana/trends-fun-API",
            "blockchain/Solana/jupiter-studio-api",
            "blockchain/Solana/solana-jupiter-api",
            "blockchain/Solana/solana-gmgn-api",
            "blockchain/Solana/solana-bullx-api",
            "blockchain/Solana/solana-photon-api",
            "blockchain/Solana/solana-logs",
            "blockchain/Solana/solana-nft",
            "blockchain/Solana/solana-orca-dex-api",
            "blockchain/Solana/solana-rewards",
            "blockchain/Solana/solana-search-tokens",
            "blockchain/Solana/solana-zeta",
            "blockchain/Solana/Moonshot-API",
            "blockchain/Solana/Solana-AldrinAmm-api",
            "blockchain/Solana/Solana-DEX-Orders-API",
            "blockchain/Solana/Solana-DexPools-API",
            "blockchain/Solana/Solana-Jito-Bundle-api",
            "blockchain/Solana/Solana-Lifinity-dex-api",
            "blockchain/Solana/Believe-API",
            "blockchain/Solana/Solana-OpenBook-api",
            "blockchain/Solana/Solana-Phoenix-api",
            "blockchain/Solana/SolFi-api",
            "blockchain/Solana/Orbic-API",
            "blockchain/Solana/xstocks-api",
            "blockchain/Solana/DEXScreener/solana_dexscreener",
            "blockchain/Solana/ai-agent-solana-data",
          ],
        },

        {
          type: "category",
          label: "Tron",
          link: {
            type: "doc",
            id: "blockchain/Tron/index",
          },
          items: [
            "blockchain/Tron/sunswap-api",
            "blockchain/Tron/tron-balance-updates",
            "blockchain/Tron/tron-dextrades",
            "blockchain/Tron/tron-mempool",
            "blockchain/Tron/tron-nft",
            "blockchain/Tron/tron-sunpump",
            "blockchain/Tron/tron-transactions-api",
            "blockchain/Tron/tron-fees-api",
            "blockchain/Tron/tron-transfers",
            "blockchain/Tron/usdt-trc20-api",
          ],
        },
        {
          type: "category",
          label: "Arbitrum",
          link: {
            type: "doc",
            id: "blockchain/Arbitrum/index",
          },
          items: [
            "blockchain/Arbitrum/arbitrum-cross-chain",
            "blockchain/Arbitrum/Balance_Updates",
            "blockchain/Arbitrum/Blocks_Transactions",
            "blockchain/Arbitrum/DexTrades",
            "blockchain/Arbitrum/esgmx-api",
            "blockchain/Arbitrum/gmx-api",
            "blockchain/Arbitrum/Smart_Contract_Calls",
            "blockchain/Arbitrum/Smart_Contract_Events",
          ],
        },
        {
          type: "category",
          label: "Base",
          link: {
            type: "doc",
            id: "blockchain/Base/index",
          },
          items: [
            "blockchain/Base/aerodrome-base-api",
            "blockchain/Base/aerodrome-gauge-vaults-api",
            "blockchain/Base/base-uniswap-api",
            "blockchain/Base/base-clanker-api",
            "blockchain/Base/apestore-base-api",
            "blockchain/Base/base-jump-base-api",
            "blockchain/Base/base-zora-api",
            "blockchain/Base/base-balance-updates",
            "blockchain/Base/base-coins-api",
            "blockchain/Base/base-dextrades",
            "blockchain/Base/base-nft",
            "blockchain/Base/base-transfers",
            "blockchain/Base/ai-agent-base-data",
          ],
        },
        {
          type: "category",
          label: "Matic (Polygon)",
          link: {
            type: "doc",
            id: "blockchain/Matic/index",
          },
          items: [
            "blockchain/Matic/matic-balance-updates",
            "blockchain/Matic/matic-dextrades",
            "blockchain/Matic/matic-uniswap-api",
            "blockchain/Matic/matic-nft",
            "blockchain/Matic/matic-transfers",
          ],
        },
        {
          type: "category",
          label: "Optimism",
          link: {
            type: "doc",
            id: "blockchain/Optimism/index",
          },
          items: [
            "blockchain/Optimism/optimism-balance-updates",
            "blockchain/Optimism/optimism-dextrades",
            "blockchain/Optimism/optimism-nft",
            "blockchain/Optimism/optimism-transfers",
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
        {
          type: "category",
          label: "Prediction Markets",
          link: {
            type: "generated-index",
            title: "Prediction Market APIs",
            description:
              "APIs for accessing prediction market data and trading information",
          },
          items: ["examples/polymarket-api/polymarket-api"],
        },
        {
          type: "category",
          label: "Futures DEXs",
          link: {
            type: "generated-index",
            title: "Futures DEX APIs",
            description:
              "APIs for accessing futures and perpetual decentralized exchanges data including AsterDEX on BNB Smart Chain.",
          },
          items: ["examples/futures-dexs/asterdex-api"],
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
          label: "Crypto Price APIs",
          link: {
            type: "generated-index",
            title: "Crypto Price API",
            description:
              "Access token and currency pricing data across chains.",
          },
          items: [
            "trading/crypto-price-api/introduction",

            {
              type: "category",
              label: "Price Index Cubes",
              link: {
                type: "generated-index",
                title: "Cubes Overview",
                description: "Understanding each price index cube",
              },
              items: [
                "trading/crypto-price-api/tokens",
                "trading/crypto-price-api/currency",
                "trading/crypto-price-api/pairs",
              ],
            },
            // "trading/price-index/tokens",
            // "trading/price-index/currency",
            // "trading/price-index/pairs",

            "trading/crypto-price-api/in-depth",
            "trading/crypto-price-api/examples",
            "trading/crypto-price-api/crypto-market-data-api",
            "trading/crypto-price-api/crypto-ohlc-candle-k-line-api",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Stablecoin APIs",
      link: {
        type: "generated-index",
        title: "Stablecoin APIs",
      },
      items: [
        "stablecoin-APIs/stablecoin-price-api",
        "stablecoin-APIs/stablecoin-payments-api",
        "stablecoin-APIs/stablecoin-reserve-api",
        "stablecoin-APIs/stablecoin-balance-api",
        "stablecoin-APIs/stablecoin-trades-api",
        "stablecoin-APIs/stablecoin-transfers-api",
        "stablecoin-APIs/usdt-api",
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
