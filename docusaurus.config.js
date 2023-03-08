// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Data streaming platform',
  tagline: 'How to query data and build applications on Bitquery blockchain data platform',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://streaming.bitquery.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/tutorial/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'bitquery', // Usually your GitHub org/user name.
  projectName: 'streaming-data-platform-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

    plugins: [
    [
      "@graphql-markdown/docusaurus",
      {
        schema: "https://streaming.bitquery.io/graphql",
        rootPath: "./docs/graphql-reference/", // docs will be generated under './docs/graphql-reference'
        baseURL: ".",
        linkRoot: "/tutorial/docs/graphql-reference/",
        homepage: "./docs/graphql-reference/intro.md",
        loaders: {
          UrlLoader: "@graphql-tools/url-loader"
        },
      },
    ],
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/bitquery/streaming-data-platform-docs/tree/main',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/bitquery/streaming-data-platform-docs/tree/main',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 1,
          ignorePatterns: ['/tutorial/docs/graphql-reference/**'],
          filename: 'sitemap.xml',
			  },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/bitquery_logo_w.jpg',
      navbar: {
        title: 'Blockchain Data Platform',
        logo: {
          alt: 'Bitquery.io',
          src: 'img/bitquery_logo_w.jpg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Tutorial',
          },
          {to: 'blog', label: 'News', position: 'left'},
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Links',
            items: [
              {
                label: 'Website',
                to: 'https://bitquery.io',
              },
              {
                label: 'Tutorial',
                to: 'docs/intro',
              },
              {
                label: 'News',
                to: 'blog',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Telegram',
                href: 'https://t.me/Bloxy_info',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/EEBVTQnb2E',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/Bitquery_io',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Forum',
                href: 'https://community.bitquery.io/',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/bitquery',
              }
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
