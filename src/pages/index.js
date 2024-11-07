import React from 'react';
import clsx from 'clsx';
import { Helmet } from 'react-helmet'; // Import react-helmet
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/start/first-query">
             Getting Started - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Bitquery V2 API Docs`}
      description= "Blockchain Streaming APIs docs (V2 docs) to query real-time and historical transactions, balances, transfers, NFTs, tokens, Dex trades, Smart contract calls, events, etc. We support 40+ blockchains, including Bitcoin, Ethereum, Solana, Polygon, Arbitrum, Optimism, etc.">
         <Helmet>
        <meta name="baidu-site-verification" content="codeva-3D7wc6GZVP" />
      </Helmet>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
