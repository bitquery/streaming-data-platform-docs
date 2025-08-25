// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Blockchain Data API (V2)",
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
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  scripts: [
    // {
    //   src: "https://widget.kapa.ai/kapa-widget.bundle.js",
    //   "data-website-id": "09a87c07-c1f9-4831-9349-7087e535dc3e",
    //   "data-project-name": "Bitquery",
    //   "data-project-color": "#2E8555",
    //   "data-project-logo":
    //     "https://explorer.bitquery.io/assets/bitqueryLogoicon-538ee00cce4394fd0477e388630363c66374a0f2f6f2d53a1750bd3201307905.png",
    //   "data-modal-disclaimer":
    //     "This is a custom LLM for BitQuery with access to [All V2 documentation](https://docs.bitquery.io/).",
    //   "data-modal-example-questions":
    //     "How to query using GraphQL?, What is BitQuery Explorer?, How to access blockchain data?, What APIs does BitQuery offer?",
    //   async: true,
    // },

    {
      src: "https://www.chatbase.co/embed.min.js",
      async: true,
      id: "Vz0cwoEYRJW6n5B2JeSeu",
      domain: "www.chatbase.co",
    },

    {
      src: "/js/chatbase-open.js", // Custom script to auto-open Chatbase
      defer: true,
    },
  ],

  plugins: [
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
    [
      require.resolve("@cmfcmf/docusaurus-search-local"),
      {
        indexDocs: true,
        indexDocSidebarParentCategories: 0,
        indexBlog: true,
        indexPages: false,
        language: "en",
        style: undefined,
        maxSearchResults: 8,

        // lunr.js-specific settings
        lunr: {
          tokenizerSeparator: /[\s\-]+/,
          b: 0.75,
          k1: 1.2,
          titleBoost: 5,
          contentBoost: 1,
          tagsBoost: 3,
          parentCategoriesBoost: 2,
        },
      },
    ],
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          // /docs/oldDoc -> /docs/newDoc
          {
            to: "/docs/examples/token-holders/token-holder-api/",
            from: "/docs/examples/balances/tokenHolders-api/",
          },
          {
            to: "/docs/contribution-guidelines/",
            from: "/docs/contribution_guidelines/",
          },
          {
            to: "/docs/examples/calls/contract-creation/",
            from: "/docs/examples/calls/Contract%20_creation/",
          },
          {
            to: "/docs/examples/calls/smartcontract-filterby/",
            from: "/docs/examples/calls/smartcontract_filterby/",
          },
          {
            to: "/docs/examples/events/events-api/",
            from: "/docs/examples/events/events_api/",
          },
          {
            to: "/docs/schema/evm/token-holders/",
            from: "/docs/evm/token_holders/",
          },
          {
            to: "/docs/graphql/dataset/select-blocks/",
            from: "/docs/graphql/dataset/select_blocks/",
          },
          {
            to: "/docs/usecases/nft-analytics/",
            from: "/docs/usecases/nft_Analytics/",
          },
          {
            to: "/docs/usecases/crypto-dashboard/",
            from: "/docs/usecases/crypto_dashboard/",
          },
          {
            to: "/docs/usecases/telegram-bot/",
            from: "/docs/usecases/Telegram_bot/",
          },
          {
            to: "/docs/authorisation/how-to-generate",
            from: "/docs/ide/authorisation/",
          },
          {
            to: "/docs/authorisation/how-to-generate",
            from: "/docs/category/authorization/",
          },

          {
            to: "/docs/authorisation/how-to-generate",
            from: "/docs/ide/authorisation/simple",
          },

          {
            to: "/docs/authorisation/how-to-generate",
            from: "/docs/start/authorisation/secure/",
          },

          {
            to: "/docs/authorisation/how-to-generate",
            from: "/docs/start/authorisation/",
          },
          {
            to: "/docs/authorisation/how-to-generate",
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
            to: "/docs/authorisation/how-to-generate",
            from: "/docs/start/authorisation/simple/",
          },

          {
            to: "/docs/examples/Solana/Pump-Fun-API/",
            from: "/docs/examples/dextrades/Pump-Fun-API/",
          },

          {
            to: "/docs/examples/ethers-library/eth_subscribe",
            from: "/docs/category/ethsubscribe-alternatives/",
          },
          {
            to: "/docs/examples/ethers-library/eth_subscribe/",
            from: "/docs/examples/Ethereum-subscriptions/eth-subscribe/",
          },
          {
            to: "/docs/schema/schema-intro/",
            from: "/docs/evm/",
          },
          {
            to: "/docs/category/how-to-guides/",
            from: "/docs/category/use-cases/",
          },
          {
            to: "/docs/examples/nft/nft-api/",
            from: "/docs/category/nft/",
          },
          {
            to: "/docs/examples/Arbitrum/Overview/",
            from: "/docs/category/arbitrum/",
          },
          {
            to: "/docs/examples/Base/",
            from: "/docs/category/base/",
          },

          {
            to: "/docs/examples/Matic/",
            from: "/docs/category/matic/",
          },
          {
            to: "/docs/examples/Tron/",
            from: "/docs/category/Tron/",
          },
          {
            to: "/docs/examples/Optimism/",
            from: "/docs/category/Optimism/",
          },
          {
            to: "/docs/examples/dextrades/uniswap-api/",
            from: "/docs/examples/realtimetrades/",
          },
          {
            to: "/docs/examples/Solana/", // new target
            from: "/docs/category/solana/", // old category URL
          },
          {
            to: "/docs/examples/BSC/", // new target
            from: "/docs/category/bsc/", // old category URL
          },
          {
            to: "/docs/examples/Ethereum/",
            from: "/docs/category/ethereum/",
          },
          {
            to: "/docs/examples/Solana/letsbonk-api/",
            from: "/docs/examples/Solana/Bonk-Fun-API/",
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
        ],
      },
    ],
  ],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/bitquery/streaming-data-platform-docs/tree/main",
        },
        blog: {
          showReadingTime: true,
          editUrl:
            "https://github.com/bitquery/streaming-data-platform-docs/tree/main",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        sitemap: {
          changefreq: "daily",
          priority: 1,
          ignorePatterns: ["/docs/graphql-reference/**"],
          filename: "sitemap.xml",
        },
        gtag: {
          trackingID: "G-ZWB80TDH9J",
          anonymizeIP: true,
        },
        googleTagManager: {
          containerId: "GTM-5GC69JH6",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: false,
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
            to: "https://bitquery.io/forms/api",
            label: "Book Demo",
            position: "left",
          },
          {
            to: "https://account.bitquery.io/user/api_v2/access_tokens",
            label: "Get Your Access Token",
            position: "right",
          },
          {
            to: "https://dexrabbit.com/",
            label: "DEXRabbit",
            position: "left",
          },
          {
            to: "https://lite.bitquery.io/",
            label: "Free Investigation Tool",
            position: "left",
          },
          {
            to: "https://bitquery.substack.com/",
            label: "Newsletter",
            position: "left",
          },
          {
            to: "https://docs.bitquery.io/docs/trading/price-index/introduction/",
            label: "Crypto Price API 🚀",
            position: "left",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Links",
            items: [
              {
                label: "Website",
                to: "https://bitquery.io",
              },
              {
                label: "V1 Docs",
                to: "https://docs.bitquery.io/v1/",
              },
              {
                label: "V2 Docs",
                to: "docs/intro",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Telegram",
                href: "https://t.me/Bloxy_info",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/Bitquery_io",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Forum",
                href: "https://community.bitquery.io/",
              },
              {
                label: "GitHub",
                href: "https://github.com/bitquery",
              },
              {
                label: "Blog",
                to: "https://bitquery.io/blog",
              },
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
