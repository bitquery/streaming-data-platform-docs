// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Streaming API (V2  API Docs)",
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
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          // /docs/oldDoc -> /docs/newDoc
          {
            to: '/docs/examples/token-holders/token-holder-api/',
            from: '/docs/examples/balances/tokenHolders-api/',
          },
          {
            to: '/docs/contribution-guidelines/',
            from: '/docs/contribution_guidelines/',
          },
          {
            to: '/docs/examples/calls/contract-creation/',
            from: '/docs/examples/calls/Contract%20_creation/',
          },
          {
            to: '/docs/examples/calls/smartcontract-filterby/',
            from: '/docs/examples/calls/smartcontract_filterby/',
          },
          {
            to: '/docs/examples/events/events-api/',
            from: '/docs/examples/events/events_api/',
          },
          {
            to: '/docs/evm/token-holders/',
            from: '/docs/evm/token_holders/',
          },
          {
            to: '/docs/graphql/dataset/select-blocks/',
            from: '/docs/graphql/dataset/select_blocks/',
          },
          {
            to: '/docs/usecases/nft-analytics/',
            from: '/docs/usecases/nft_Analytics/',
          },
          {
            to: '/docs/usecases/crypto-dashboard/',
            from: '/docs/usecases/crypto_dashboard/',
          },
          {
            to: '/docs/usecases/telegram-bot/',
            from: '/docs/usecases/Telegram_bot/',
          },
          {
            to: '/docs/start/authorisation/how-to-generate',
            from:'/docs/ide/authorisation/'
          },
          
          {
            to:'/docs/start/authorisation/how-to-generate',
            from: '/docs/ide/authorisation/simple',
           
          },

          {
             to:'/docs/start/authorisation/how-to-generate' ,
            from:'/docs/start/authorisation/secure/'

          },


          {
            to:'/docs/start/authorisation/how-to-generate',
            from: '/docs/start/authorisation/',
           
          }
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
          changefreq: "weekly",
          priority: 1,
          ignorePatterns: ["/docs/graphql-reference/**"],
          filename: "sitemap.xml",
        },
        gtag: {
          trackingID: 'G-ZWB80TDH9J',
          anonymizeIP: true,
        },
        googleTagManager: {
          containerId: 'GTM-5GC69JH6',
        }
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
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
            to: "https://community.bitquery.io",
            label: "Forum",
            position: "left",
          },
          {
            to: "https://bitquery.io/forms/api",
            label: "Book Demo",
            position: "left",
          },
          {
            to: "https://ide.bitquery.io",
            label: "Get your free API key",
            position: "right"
          }
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
              {
                label: "Blog",
                to: "https://bitquery.io/blog",
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
                label: "Discord",
                href: "https://discord.gg/EEBVTQnb2E",
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