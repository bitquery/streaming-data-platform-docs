import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import styles from "./index.module.css";

function HomepageHeader() {
  return (
    <div className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className={clsx("container", styles.heroInner)}>
        <p className={styles.eyebrow}>V2 · GraphQL · 40+ chains</p>
        <h1 className={clsx("hero__title", styles.heroTitle)}>
          Bitquery Streaming API Docs
        </h1>
        <p className={clsx("hero__subtitle", styles.heroSubtitle)}>
          Query and stream historical and real-time blockchain data through
          GraphQL, WebSocket, Kafka, and cloud exports—one schema, multiple
          interfaces.
        </p>
        <div className={styles.buttonGroup}>
          <Link
            className="button button--primary button--lg"
            to="/docs/start/first-query/"
          >
            Getting started — 5 min
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/start/starter-queries/"
          >
            Starter queries
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/start/starter-subscriptions/"
          >
            Live streams
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro/"
          >
            Platform overview
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Bitquery V2 API Docs"
      description="Blockchain Streaming APIs (V2) for real-time and historical transactions, balances, transfers, NFTs, DEX trades, smart contract calls, and events across 40+ blockchains."
    >
      <HomepageHeader />
      <main className={styles.main}>
        <HomepageFeatures tagline={siteConfig.tagline} />
      </main>
    </Layout>
  );
}
