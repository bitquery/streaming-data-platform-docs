import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

const capabilityCards = [
  {
    icon: "⚡",
    title: "GraphQL queries",
    description:
      "HTTP queries for transfers, trades, NFTs, and events across 40+ networks.",
    to: "/docs/start/first-query/",
  },
  {
    icon: "🔌",
    title: "Live subscriptions",
    description:
      "WebSocket streams with the same GraphQL shape as your queries.",
    to: "/docs/start/starter-subscriptions/",
  },
  {
    icon: "📡",
    title: "Kafka streams",
    description:
      "Protobuf topics for high-volume pipelines and many consumers.",
    to: "/docs/streams/kafka-streaming-concepts/",
  },
  {
    icon: "☁️",
    title: "Cloud datasets",
    description:
      "Parquet in S3, Snowflake, BigQuery, and more for analytics workloads.",
    to: "/docs/cloud/",
  },
  {
    icon: "⏳",
    title: "Mempool data",
    description:
      "Broadcast transactions before confirmation—simulation, ordering, tooling.",
    to: "/docs/start/mempool/",
  },
  {
    icon: "📊",
    title: "DeFi & trading cubes",
    description:
      "DEX trades, pools, and aggregates without running archive nodes.",
    to: "/docs/cubes/dextrades-dextradebytokens-trading-trades/",
  },
];

const interfaceCards = [
  {
    icon: "🌐",
    name: "GraphQL (HTTP)",
    hint: "Ad-hoc queries, dashboards, backfills",
    to: "/docs/start/endpoints/",
  },
  {
    icon: "⚡",
    name: "Subscriptions (WebSocket)",
    hint: "Push updates as blocks and trades arrive",
    to: "/docs/start/getting-updates/",
  },
  {
    icon: "📨",
    name: "Kafka",
    hint: "Scale-out pipelines and replay",
    to: "/docs/streams/kafka-streaming-concepts/",
  },
  {
    icon: "📦",
    name: "Cloud files",
    hint: "Long windows, warehouses, ML",
    to: "/docs/cloud/",
  },
];

const conceptItems = [
  {
    icon: "🧭",
    title: "Mental model",
    desc: "Transfers, events, and contract calls on-chain.",
    to: "/docs/start/mental-model-transfers-events-calls/",
  },
  {
    icon: "🗄️",
    title: "Datasets",
    desc: "Archive, realtime, and combined windows.",
    to: "/docs/graphql/dataset/combined/",
  },
  {
    icon: "📚",
    title: "Examples by chain",
    desc: "Starter queries grouped by ecosystem.",
    to: "/docs/start/starter-queries/",
  },
  {
    icon: "🛰️",
    title: "gRPC (Solana+)",
    desc: "Native streaming alongside GraphQL.",
    to: "/docs/grpc/solana/introduction/",
  },
  {
    icon: "🔗",
    title: "Internal txs",
    desc: "Traces and internal calls explained.",
    to: "/docs/API-Blog/what-are-internal-transactions-how-to-get-them/",
  },
];

const useCaseLinks = [
  { label: "Telegram trading bot", to: "/docs/usecases/telegram-bot/" },
  { label: "Polymarket alerts", to: "/docs/usecases/polymarket-tg-alerts-bot/" },
  {
    label: "Real-time balance tracker",
    to: "/docs/usecases/real-time-balance-tracker/overview/",
  },
  {
    label: "Mempool fees & analysis",
    to: "/docs/usecases/mempool-transaction-fee/",
  },
  { label: "NFT analytics", to: "/docs/usecases/nft-analytics/" },
  { label: "Copy trading bot", to: "/docs/usecases/copy-trading-bot/" },
];

function Section({ children, alt }) {
  return (
    <div className={clsx(styles.section, alt && styles.sectionAlt)}>{children}</div>
  );
}

function SectionHeader({ kicker, title, children }) {
  return (
    <header className={styles.sectionHeader}>
      {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
      <h2 className={styles.sectionHeading}>{title}</h2>
      {children ? <div className={styles.sectionLead}>{children}</div> : null}
    </header>
  );
}

function CapabilityCard({ icon, title, description, to }) {
  return (
    <div className={clsx("col col--12 col--md-6 col--lg-4", styles.cardCol)}>
      <Link to={to} className={styles.capabilityCard}>
        <span className={styles.cardIcon} aria-hidden>
          {icon}
        </span>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardBody}>{description}</p>
        <span className={styles.cardCta}>
          Read docs <span aria-hidden>→</span>
        </span>
      </Link>
    </div>
  );
}

function InterfaceCard({ icon, name, hint, to }) {
  return (
    <div className={clsx("col col--12 col--sm-6", styles.interfaceCol)}>
      <Link to={to} className={styles.interfaceCard}>
        <span className={styles.interfaceIcon} aria-hidden>
          {icon}
        </span>
        <div className={styles.interfaceBody}>
          <h3 className={styles.interfaceName}>{name}</h3>
          <p className={styles.interfaceHint}>{hint}</p>
        </div>
      </Link>
    </div>
  );
}

function ConceptTile({ icon, title, desc, to }) {
  return (
    <Link to={to} className={styles.conceptTile}>
      <span className={styles.conceptIcon} aria-hidden>
        {icon}
      </span>
      <div>
        <h3 className={styles.conceptTitle}>{title}</h3>
        <p className={styles.conceptDesc}>{desc}</p>
      </div>
      <span className={styles.conceptArrow} aria-hidden>
        →
      </span>
    </Link>
  );
}

export default function HomepageFeatures({ tagline }) {
  return (
    <section className={styles.features}>
      {tagline ? (
        <div className={styles.taglineStrip}>
          <div className={clsx("container", styles.taglineInner)}>
            <span className={styles.taglineMark} aria-hidden>
              ◆
            </span>
            <p>{tagline}</p>
          </div>
        </div>
      ) : null}

      <Section>
        <div className="container">
          <SectionHeader kicker="Capabilities" title="What you can build with">
            <p>
              Same indexed chains and protocols everywhere—pick HTTP, websocket,
              or batch export. Prefer the{" "}
              <Link to="/docs/intro/">platform overview</Link> for IDE, auth,
              and dataset details.
            </p>
          </SectionHeader>
          <div className="row">
            {capabilityCards.map((card) => (
              <CapabilityCard key={card.to} {...card} />
            ))}
          </div>
        </div>
      </Section>

      <Section alt>
        <div className="container">
          <SectionHeader kicker="Delivery" title="Interfaces">
            <p>
              Match latency and throughput to your stack. Agents and editors
              can also use{" "}
              <Link to="/docs/mcp/mcp-server/">MCP Server</Link>.
            </p>
          </SectionHeader>
          <div className="row">
            {interfaceCards.map((card) => (
              <InterfaceCard key={card.to} {...card} />
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="container">
          <SectionHeader kicker="Foundations" title="Data concepts">
            <p>
              Start with how on-chain activity is modeled, then align time
              windows with your product.
            </p>
          </SectionHeader>
          <div className={styles.conceptGrid}>
            {conceptItems.map((item) => (
              <ConceptTile key={item.to} {...item} />
            ))}
          </div>
          <p className={styles.datasetLinks}>
            <Link className={styles.datasetLink} to="/docs/graphql/dataset/archive/">
              Archive
            </Link>
            <span className={styles.dot} aria-hidden>
              ·
            </span>
            <Link className={styles.datasetLink} to="/docs/graphql/dataset/realtime/">
              Realtime
            </Link>
            <span className={styles.dot} aria-hidden>
              ·
            </span>
            <Link className={styles.datasetLink} to="/docs/graphql/dataset/combined/">
              Combined
            </Link>
          </p>
        </div>
      </Section>

      <Section alt>
        <div className="container">
          <SectionHeader kicker="Recipes" title="Popular use cases">
            <p>
              End-to-end tutorials for bots and dashboards.{" "}
              <Link
                className={styles.inlineBrowse}
                to="/docs/category/how-to-guides/"
              >
                Browse all how-to guides
              </Link>
            </p>
          </SectionHeader>
          <div className="row">
            {useCaseLinks.map((item) => (
              <div
                key={item.to}
                className={clsx(
                  "col col--12 col--md-6 col--lg-4",
                  styles.useCaseCol
                )}
              >
                <Link className={styles.useCaseLink} to={item.to}>
                  <span>{item.label}</span>
                  <span className={styles.useCaseArrow} aria-hidden>
                    →
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className={clsx("container", styles.videoSection)}>
          <SectionHeader kicker="Overview" title="See Bitquery in action">
            <p>Quick walkthrough of the IDE and running your first query.</p>
          </SectionHeader>
          <div className={styles.videoFrame}>
            <video className={styles.video} controls preload="metadata">
              <source src="/img/intro_video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </Section>
    </section>
  );
}
