import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

const capabilityCards = [
  {
    title: "GraphQL queries",
    description:
      "Build HTTP queries for transfers, trades, NFTs, and events across 40+ networks.",
    to: "/docs/start/first-query/",
  },
  {
    title: "Live subscriptions",
    description:
      "Stream updates over WebSocket with the same GraphQL shape as queries.",
    to: "/docs/start/starter-subscriptions/",
  },
  {
    title: "Kafka streams",
    description:
      "Low-latency protobuf topics for high-volume pipelines and fan-out.",
    to: "/docs/streams/kafka-streaming-concepts/",
  },
  {
    title: "Cloud datasets",
    description:
      "Parquet exports to S3, Snowflake, BigQuery, and other warehouses.",
    to: "/docs/cloud/",
  },
  {
    title: "Mempool data",
    description:
      "See broadcast transactions before confirmation for simulation and tooling.",
    to: "/docs/start/mempool/",
  },
  {
    title: "DeFi & trading cubes",
    description:
      "DEX trades, pools, and token-level aggregates without running your own node.",
    to: "/docs/cubes/dextrades-dextradebytokens-trading-trades/",
  },
];

const interfaceRows = [
  {
    name: "GraphQL (HTTP)",
    bestFor: "Ad-hoc queries, dashboards, backfills.",
    to: "/docs/start/endpoints/",
  },
  {
    name: "Subscriptions (WebSocket)",
    bestFor: "Live feeds with push updates.",
    to: "/docs/start/getting-updates/",
  },
  {
    name: "Kafka",
    bestFor: "Scale-out consumers and enterprise pipelines.",
    to: "/docs/streams/kafka-streaming-concepts/",
  },
  {
    name: "Cloud files",
    bestFor: "Analytics, ML, and long archival windows.",
    to: "/docs/cloud/",
  },
];

const useCaseLinks = [
  { label: "Telegram trading bot", to: "/docs/usecases/telegram-bot/" },
  { label: "Polymarket alerts", to: "/docs/usecases/polymarket-tg-alerts-bot/" },
  {
    label: "Real-time balance tracker",
    to: "/docs/usecases/real-time-balance-tracker/overview/",
  },
  { label: "Mempool fees & analysis", to: "/docs/usecases/mempool-transaction-fee/" },
  { label: "NFT analytics", to: "/docs/usecases/nft-analytics/" },
  { label: "Copy trading bot", to: "/docs/usecases/copy-trading-bot/" },
];

function CapabilityCard({ title, description, to }) {
  return (
    <div className={clsx("col col--4", styles.cardCol)}>
      <div className={styles.capabilityCard}>
        <h3 className={styles.cardTitle}>
          <Link to={to}>{title}</Link>
        </h3>
        <p className={styles.cardBody}>{description}</p>
        <Link className={styles.cardLink} to={to}>
          Open docs →
        </Link>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className={styles.sectionHeading}>What you can build with</h2>
        <p className={styles.sectionLead}>
          Pick a capability below, or read the{" "}
          <Link to="/docs/intro/">full platform overview</Link> for datasets,
          IDE, and auth.
        </p>
        <div className="row">
          {capabilityCards.map((card) => (
            <CapabilityCard key={card.to} {...card} />
          ))}
        </div>
      </div>

      <div className={clsx("container", styles.sectionBlock)}>
        <h2 className={styles.sectionHeading}>Interfaces</h2>
        <p className={styles.sectionLead}>
          Same underlying data—choose the delivery mechanism that fits latency
          and scale. See also{" "}
          <Link to="/docs/mcp/mcp-server/">MCP Server</Link> for IDE and agent
          integrations.
        </p>
        <div className={styles.interfaceTableWrap}>
          <table className={styles.interfaceTable}>
            <thead>
              <tr>
                <th scope="col">Interface</th>
                <th scope="col">Best for</th>
              </tr>
            </thead>
            <tbody>
              {interfaceRows.map((row) => (
                <tr key={row.to}>
                  <td>
                    <Link to={row.to}>{row.name}</Link>
                  </td>
                  <td>{row.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={clsx("container", styles.sectionBlock)}>
        <h2 className={styles.sectionHeading}>Data concepts</h2>
        <p className={styles.sectionLead}>
          Learn how transfers, events, calls, and protocol-level trades fit
          together, then browse curated examples by chain.
        </p>
        <ul className={styles.linkList}>
          <li>
            <Link to="/docs/start/mental-model-transfers-events-calls/">
              Mental model: transfers, events &amp; calls
            </Link>
          </li>
          <li>
            <Link to="/docs/graphql/dataset/archive/">Archive dataset</Link>
            {" · "}
            <Link to="/docs/graphql/dataset/realtime/">Realtime dataset</Link>
            {" · "}
            <Link to="/docs/graphql/dataset/combined/">Combined dataset</Link>
          </li>
          <li>
            <Link to="/docs/start/starter-queries/">Starter queries by chain</Link>
            {" · "}
            <Link to="/docs/grpc/solana/introduction/">
              gRPC streaming (Solana &amp; more)
            </Link>
          </li>
          <li>
            <Link to="/docs/API-Blog/what-are-internal-transactions-how-to-get-them/">
              Internal transactions &amp; traces
            </Link>
          </li>
        </ul>
      </div>

      <div className={clsx("container", styles.sectionBlock)}>
        <h2 className={styles.sectionHeading}>Popular use cases</h2>
        <p className={styles.sectionLead}>
          Step-by-step guides for bots, dashboards, and monitoring.{" "}
          <Link to="/docs/category/how-to-guides/">
            Browse all how-to guides →
          </Link>
        </p>
        <div className="row">
          {useCaseLinks.map((item) => (
            <div
              key={item.to}
              className={clsx("col col--12 col--md-6 col--lg-4", styles.useCaseCol)}
            >
              <Link className={styles.useCaseLink} to={item.to}>
                {item.label}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className={clsx("container", styles.sectionBlock)}>
        <div className="text--center" style={{ marginBottom: "1rem" }}>
          <p style={{ fontWeight: "bold", fontSize: "1.1em" }}>
            New to Bitquery? Watch a short intro{" "}
            <span role="img" aria-label="point down">
              👇
            </span>
          </p>
        </div>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <video style={{ width: "100%", height: "auto" }} controls>
            <source src="/img/intro_video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}
