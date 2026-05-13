import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

const capabilityCards = [
  {
    title: "GraphQL queries",
    description:
      "HTTP queries for transfers, trades, NFTs, and events across 40+ networks.",
    to: "/docs/start/first-query/",
  },
  {
    title: "Live subscriptions",
    description:
      "WebSocket streams with the same GraphQL shape as your queries.",
    to: "/docs/start/starter-subscriptions/",
  },
  {
    title: "Kafka streams",
    description:
      "Protobuf topics for high-volume pipelines and many consumers.",
    to: "/docs/streams/kafka-streaming-concepts/",
  },
  {
    title: "Cloud datasets",
    description:
      "Parquet in S3, Snowflake, BigQuery, and warehouses.",
    to: "/docs/cloud/",
  },
  {
    title: "Mempool data",
    description:
      "Broadcast transactions before confirmation.",
    to: "/docs/start/mempool/",
  },
  {
    title: "DeFi & trading cubes",
    description:
      "DEX trades, pools, and aggregates without archive nodes.",
    to: "/docs/cubes/dextrades-dextradebytokens-trading-trades/",
  },
];

const interfaceItems = [
  { abbr: "HTTP", name: "GraphQL (HTTP)", hint: "Queries, dashboards", to: "/docs/start/endpoints/" },
  { abbr: "WS", name: "Subscriptions", hint: "Push over WebSocket", to: "/docs/start/getting-updates/" },
  { abbr: "KF", name: "Kafka", hint: "Scale-out pipelines", to: "/docs/streams/kafka-streaming-concepts/" },
  { abbr: "CL", name: "Cloud files", hint: "Batch & analytics", to: "/docs/cloud/" },
];

const conceptLinks = [
  { label: "Mental model: transfers, events, calls", to: "/docs/start/mental-model-transfers-events-calls/" },
  { label: "Archive dataset", to: "/docs/graphql/dataset/archive/" },
  { label: "Realtime dataset", to: "/docs/graphql/dataset/realtime/" },
  { label: "Combined dataset", to: "/docs/graphql/dataset/combined/" },
  { label: "Starter queries by chain", to: "/docs/start/starter-queries/" },
  { label: "gRPC streaming (Solana)", to: "/docs/grpc/solana/introduction/" },
  { label: "Internal transactions & traces", to: "/docs/API-Blog/what-are-internal-transactions-how-to-get-them/" },
];

const useCaseLinks = [
  { label: "Telegram trading bot", to: "/docs/usecases/telegram-bot/" },
  { label: "Polymarket alerts", to: "/docs/usecases/polymarket-tg-alerts-bot/" },
  { label: "Real-time balance tracker", to: "/docs/usecases/real-time-balance-tracker/overview/" },
  { label: "Mempool fees & analysis", to: "/docs/usecases/mempool-transaction-fee/" },
  { label: "NFT analytics", to: "/docs/usecases/nft-analytics/" },
  { label: "Copy trading bot", to: "/docs/usecases/copy-trading-bot/" },
];

function SquareMark({ large }) {
  return (
    <span
      className={clsx(styles.squareMark, large && styles.squareMarkLg)}
      aria-hidden
    />
  );
}

function CapabilityCard({ title, description, to }) {
  return (
    <div className={clsx("col col--12 col--sm-6 col--lg-4", styles.cardCol)}>
      <Link to={to} className={styles.capabilityCard}>
        <SquareMark />
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardBody}>{description}</p>
        <span className={styles.cardCta}>Read docs</span>
      </Link>
    </div>
  );
}

export default function HomepageFeatures({ tagline }) {
  return (
    <section className={styles.features}>
      {/* Single dense band: narrative + caps + interfaces */}
      <div className={styles.band}>
        <div className="container">
          <div className={styles.topRow}>
            <SquareMark large />
            <div className={styles.topRowText}>
              <h2 className={styles.primaryTitle}>What you can build</h2>
              {tagline ? <p className={styles.taglineInline}>{tagline}</p> : null}
              <p className={styles.primaryLead}>
                Same data over HTTP, websocket, Kafka, or cloud files. Details:{" "}
                <Link to="/docs/intro/">platform overview</Link>,{" "}
                <Link to="/docs/mcp/mcp-server/">MCP Server</Link>.
              </p>
            </div>
            <SquareMark large />
          </div>

          <div className="row">
            {capabilityCards.map((card) => (
              <CapabilityCard key={card.to} {...card} />
            ))}
          </div>

          <div className={styles.interfaceLabelRow}>
            <span className={styles.squareRule} aria-hidden />
            <h3 className={styles.interfaceHeading}>Interfaces</h3>
            <span className={styles.squareRule} aria-hidden />
          </div>
          <div className={styles.interfaceGrid}>
            {interfaceItems.map((item) => (
              <Link key={item.to} to={item.to} className={styles.interfaceCell}>
                <span className={styles.abbrSquare}>{item.abbr}</span>
                <div>
                  <span className={styles.interfaceName}>{item.name}</span>
                  <span className={styles.interfaceHint}>{item.hint}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* One compact band: concepts | use cases (side by side on large screens) */}
      <div className={clsx(styles.band, styles.bandAlt)}>
        <div className="container">
          <div className={styles.twoCol}>
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>
                <SquareMark /> Data concepts
              </h3>
              <ul className={styles.compactList}>
                {conceptLinks.map((c) => (
                  <li key={c.to}>
                    <Link className={styles.conceptLink} to={c.to}>
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>
                <SquareMark /> Popular use cases
              </h3>
              <ul className={styles.useCaseDense}>
                {useCaseLinks.map((u) => (
                  <li key={u.to}>
                    <Link to={u.to} className={styles.useCaseDenseLink}>
                      {u.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className={styles.browseMore}>
                <Link to="/docs/category/how-to-guides/">All how-to guides</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal video block: square frame, minimal copy */}
      <div className={styles.band}>
        <div className={clsx("container", styles.videoRow)}>
          <SquareMark />
          <p className={styles.videoCaption}>Intro walkthrough · IDE · first query</p>
          <SquareMark />
        </div>
        <div className={clsx("container", styles.videoBox)}>
          <div className={styles.videoSquareFrame}>
            <video className={styles.video} controls preload="metadata">
              <source src="/img/intro_video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
