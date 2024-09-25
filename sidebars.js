// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Start',
      items: [
        'start/embed',
        'start/errors',
        'start/first-query',
        'start/getting-updates',
        'start/mempool',
      ],
    },
    
    {
      type: 'category',
      label: 'Authorisation',
      items: [
        'authorisation/how-to-generate',
        'authorisation/how-to-use',
        'authorisation/websocket',
      ],
    }
    ,
    {
      type: 'category',
      label: 'Streaming via Subscription',
      items: [
        'subscriptions/examples',
        'subscriptions/example-rust',
        'subscriptions/mempool-subscriptions',
        'subscriptions/subscription',
        'subscriptions/trigger',
        'subscriptions/websockets',
      ],
    },
    
    {
      type: 'category',
      label: 'Understanding Cubes',
      items: [
        {
          type: 'category',
          label: 'EVM Cube',
          items: [
            'cubes/EVM',
            'cubes/balance-updates-cube',
            'cubes/dextrades-dextradesbyTokens',
            'cubes/dextrades',
            'cubes/dextradesbyTokens',
            'cubes/transaction-cube',
            'cubes/transfers-cube',
          ],
        },
        'cubes/solana',  // Solana cube remains separate
      ],
    },
    
    {
      type: 'category',
      label: 'L1 Chains',
      items: [
        {
          type: 'category',
          label: 'Ethereum',
          items: [
            'examples/blocks/blocks-api',
            'examples/calls/smartcontract',
            'examples/calls/smartcontract-filterby',
            'examples/transfers/erc20-token-transfer-api',
            'examples/token-holders/token-holder-api',
            {
              type: 'category',
              label: 'Ethers Library',
              items: [
                'examples/ethers-library/debug_traceCall',
                'examples/ethers-library/debug_traceTransaction',
                'examples/ethers-library/eth-getbalance',
                'examples/ethers-library/eth_blockNumber',
                'examples/ethers-library/eth_gasPrice',
                'examples/ethers-library/eth_getBlockReceipts',
                'examples/ethers-library/eth_getCode',
                'examples/ethers-library/eth_getLogs',
                'examples/ethers-library/eth_getTransactionByHash',
                'examples/ethers-library/eth_getTransactionReceipt',
                'examples/ethers-library/eth_subscribe',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Base',
          items: [
            'examples/Base/aerodrome-base-api',
            'examples/Base/base-balance-updates',
            'examples/Base/base-coins-api',
            'examples/Base/base-dextrades',
            'examples/Base/base-nft',
            'examples/Base/base-transfers',
          ],
        },
        {
          type: 'category',
          label: 'BSC',
          items: [
            'examples/BSC/bsc-balance-updates',
            'examples/BSC/bsc-calls-api',
            'examples/BSC/bsc-dextrades',
            'examples/BSC/bsc-events-api',
            'examples/BSC/bsc-nft',
            'examples/BSC/bsc-transfers',
          ],
        },
        {
          type: 'category',
          label: 'Solana',
          items: [
            'examples/Solana/Moonshot-API',
            'examples/Solana/Pump-Fun-API',
            'examples/Solana/Pump-Fun-Marketcap-Bonding-Curve-API',
            'examples/Solana/Solana-AldrinAmm-api',
            'examples/Solana/Solana-DexPools-API',
            'examples/Solana/Solana-Jito-Bundle-api',
            'examples/Solana/Solana-Lifinity-dex-api',
            'examples/Solana/Solana-Meteora-api',
            'examples/Solana/Solana-OpenBook-api',
            'examples/Solana/Solana-Phoenix-api',
            'examples/Solana/Solana-Raydium-DEX-API',
            'examples/Solana/raydium-clmm-API',
            'examples/Solana/solana-balance-updates',
            'examples/Solana/solana-dextrades',
            'examples/Solana/solana-instructions',
            'examples/Solana/solana-jupiter-api',
            'examples/Solana/solana-logs',
            'examples/Solana/solana-nft',
            'examples/Solana/solana-orca-dex-api',
            'examples/Solana/solana-rewards',
            'examples/Solana/solana-search-tokens',
            'examples/Solana/solana-transactions',
            'examples/Solana/solana-transfers',
            'examples/Solana/solana-zeta',
          ],
        },
        
        {
          type: 'category',
          label: 'Tron',
          items: [
            'examples/Tron/sunswap-api',
            'examples/Tron/tron-balance-updates',
            'examples/Tron/tron-dextrades',
            'examples/Tron/tron-nft',
            'examples/Tron/tron-transactions-api',
            'examples/Tron/tron-transfers',
          ],
        },
        {
          type: 'category',
          label: 'Optimism',
          items: [
            'examples/Optimism/optimism-balance-updates',
            'examples/Optimism/optimism-dextrades',
            'examples/Optimism/optimism-nft',
            'examples/Optimism/optimism-transfers',
          ],
        },
        {
          type: 'category',
          label: 'EVM Chain Examples',
          items: [
            {
              type: 'category',
              label: 'Balances',
              items: [
                'examples/balances/balance-api',
              ],
            },
            {
              type: 'category',
              label: 'DEX Trades',
              items: [
                'examples/dextrades/dex-api',
                'examples/dextrades/token-trades-apis',
                'examples/dextrades/trades-of-an-address-api',
                'examples/dextrades/pair-creation-time',
                'examples/dextrades/crypto-coin-ticker',
              ],
            },
            {
              type: 'category',
              label: 'NFT',
              items: [
                'examples/nft/nft-api',
                'examples/nft/nft-ownership-api',
                'examples/nft/nft-trades-apI',
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'L2 Chains',
      items: [
        {
          type: 'category',
          label: 'Arbitrum',
          items: [
            'examples/Arbitrum/Balance_Updates',
            'examples/Arbitrum/Blocks_Transactions',
            'examples/Arbitrum/DexTrades',
            'examples/Arbitrum/Smart_Contract_Calls',
            'examples/Arbitrum/Smart_Contract_Events',
          ],
        },
        {
          type: 'category',
          label: 'Matic (Polygon)',
          items: [
            'examples/Matic/matic-balance-updates',
            'examples/Matic/matic-dextrades',
            'examples/Matic/matic-nft',
            'examples/Matic/matic-transfers',
          ],
        },
        {
          type: 'category',
          label: 'OpBNB',
          items: [
            'examples/OpBNB/opbnb-balance-updates',
            'examples/OpBNB/opbnb-dextrades',
            'examples/OpBNB/opbnb-nft',
            'examples/OpBNB/opbnb-transfers',
          ],
        },
        {
          type: 'category',
          label: 'Cross-Chain',
          items: [
            'examples/cross-chain/cross-chain-api',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'How-To Guides',
      items: [
        {
          type: 'category',
          label: 'NFT Creator Portfolio',
          items: [
            
            'usecases/nft-creator/gettingstarted',
            'usecases/nft-creator/pages',
            'usecases/nft-creator/app',
            'usecases/nft-creator/components',
          ],
        },
        {
          type: 'category',
          label: 'P&L Calculator',
          items: [
            'usecases/p-l-product/overview',
            
            'usecases/p-l-product/balanceUpdates',
            'usecases/p-l-product/price',
            'usecases/p-l-product/pl',
          ],
        },
        {
          type: 'category',
          label: 'TradingView Advanced Charts',
          items: [
            
            'usecases/tradingview-advanced-charts/getting-started',
            'usecases/tradingview-advanced-charts/datafeed',
            'usecases/tradingview-advanced-charts/getBars',
            'usecases/tradingview-advanced-charts/advancedChart',
          ],
        },
        {
          type: 'category',
          label: 'TradingView',
          items: [
            'usecases/tradingview/tradingview',
          ],
        },
        'usecases/Top-10-ethereum-tokens',
        'usecases/arbitrum-sniper-bot',
        'usecases/automated-trading-ethereum-volume-surge-bot',
        'usecases/base-sniper-bot',
        'usecases/crypto-dashboard',
        'usecases/dapps',
        'usecases/discord-bot',
        'usecases/mempool-transaction-fee',
        'usecases/monitoring-solana-blockchain-real-time-tutorial',
        'usecases/nft-analytics',
        'usecases/nft-scanner',
        'usecases/real-time-historical-ethereum-price-excel-google-sheets',
        'usecases/sandwitch-detection',
        'usecases/solana-arbitrage-dashboard',
        'usecases/solana-sniper-bot',
        'usecases/streaming-moonshot-prices',
        'usecases/telegram-bot',
        'usecases/tokenholder-heatmap',
        'usecases/trading-indicators',
      ],
    },
    
    {
      type: 'category',
      label: 'Data in Cloud',
      items: [
        'cloud/appsync',
        'cloud/lambda-functions',
        'cloud/s3-eth-tutorial',
        'cloud/s3-tron-tutorial',
        {
          type: 'category',
          label: 'Protobuf',
          items: [
            'cloud/protobuf/evm',
            'cloud/protobuf/protobuf',
            'cloud/protobuf/solana',
          ],
        },
        {
          type: 'category',
          label: 'S3',
          items: [
            'cloud/s3/awscli',
            'cloud/s3/buckets',
            'cloud/s3/demo',
            'cloud/s3/messages',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Data Streams',
      items: [
        'streams/kafka-streaming-concepts',
        'streams/kafka-streams-go',
        'streams/kafka-streams-java',
        'streams/kafka-streams-js',
        'streams/kafka-streams-python',
      ],
    },
    
    
  ],
};

module.exports = sidebars;
