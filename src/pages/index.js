import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import CommandPalette, {
  SearchTrigger,
} from "@site/src/components/HomepageFeatures/CommandPalette";
import { SearchProvider } from "@site/src/components/HomepageFeatures/SearchProvider";
import { deliveryModes, heroQuickLinks } from "@site/src/components/HomepageFeatures/sectionsData";

import heroStyles from "./index.module.css";
import homeStyles from "../components/HomepageFeatures/styles.module.css";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function QuickIcon({ type }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    width: 14,
    height: 14,
    "aria-hidden": true,
  };
  if (type === "starter") {
    return (
      <svg {...props}>
        <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" />
      </svg>
    );
  }
  if (type === "streams") {
    return (
      <svg {...props}>
        <path d="M3 12a9 9 0 0 1 9-9M3 12a9 9 0 0 0 9 9M7 12a5 5 0 0 1 5-5" />
      </svg>
    );
  }
  if (type === "overview") {
    return (
      <svg {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function HeroCodePanel() {
  return (
    <div className={heroStyles.heroVisual} aria-hidden="true">
      <div className={heroStyles.qpanel}>
        <div className={heroStyles.qbar}>
          <span className={heroStyles.dots}>
            <i style={{ background: "#ec6a5e" }} />
            <i style={{ background: "#f3bf4f" }} />
            <i style={{ background: "#61c554" }} />
          </span>
          <span className={heroStyles.fn}>first_query.graphql</span>
          <span className={heroStyles.pill}>one schema</span>
        </div>
        <pre>
          <span className={heroStyles.cc}># your first query — runs in the IDE</span>
          {"\n"}
          <span className={heroStyles.ck}>query</span> <span className={heroStyles.cp}>{"{"}</span>
          {"\n  "}
          <span className={heroStyles.cf}>Solana</span> <span className={heroStyles.cp}>{"{"}</span>
          {"\n    "}
          <span className={heroStyles.cf}>DEXTrades</span>
          <span className={heroStyles.cp}>(</span>limit
          <span className={heroStyles.cp}>:</span> {"{count"}
          <span className={heroStyles.cp}>:</span> <span className={heroStyles.cs}>3</span>
          {"}"}
          <span className={heroStyles.cp}>)</span> <span className={heroStyles.cp}>{"{"}</span>
          {"\n      "}
          <span className={heroStyles.cf}>Trade</span> <span className={heroStyles.cp}>{"{"}</span>{" "}
          <span className={heroStyles.cf}>Buy</span> <span className={heroStyles.cp}>{"{"}</span> Price
          Currency <span className={heroStyles.cp}>{"{"}</span> Symbol <span className={heroStyles.cp}>{"} } }"}</span>
          {"\n      "}
          <span className={heroStyles.cf}>Dex</span> <span className={heroStyles.cp}>{"{"}</span> ProtocolName{" "}
          <span className={heroStyles.cp}>{"}"}</span>
          {"\n    "}
          <span className={heroStyles.cp}>{"}"}</span>
          {"\n  "}
          <span className={heroStyles.cp}>{"}"}</span>
          {"\n"}
          <span className={heroStyles.cp}>{"}"}</span>
        </pre>
        <div className={heroStyles.qsplit}>
          <div className={heroStyles.lab}>Response</div>
          <div className={heroStyles.qout}>
            <div className={heroStyles.orow}>
              <span className={heroStyles.pr}>SOL/USDC</span>
              <span className={clsx(heroStyles.sd, heroStyles.sdBuy)}>buy</span>
              <span className={heroStyles.px}>$184.20</span>
              <span className={heroStyles.dx}>Raydium</span>
            </div>
            <div className={heroStyles.orow}>
              <span className={heroStyles.pr}>BONK/SOL</span>
              <span className={clsx(heroStyles.sd, heroStyles.sdSell)}>sell</span>
              <span className={heroStyles.px}>$0.0000241</span>
              <span className={heroStyles.dx}>Orca</span>
            </div>
            <div className={heroStyles.orow}>
              <span className={heroStyles.pr}>WIF/USDC</span>
              <span className={clsx(heroStyles.sd, heroStyles.sdBuy)}>buy</span>
              <span className={heroStyles.px}>$2.14</span>
              <span className={heroStyles.dx}>Meteora</span>
            </div>
          </div>
        </div>
        <div className={heroStyles.qfoot}>
          <span className={heroStyles.ok}>
            <i />200 · 312ms
          </span>
          <span className={heroStyles.qfootNote}>
            same fields → WS · Kafka · gRPC · MCP
          </span>
        </div>
      </div>
      <div className={heroStyles.deliv}>
        {deliveryModes.map((mode, i) => (
          <span key={mode} className={i === 0 ? heroStyles.delivOn : undefined}>
            {mode}
          </span>
        ))}
      </div>
    </div>
  );
}

function HomepageHero() {
  const quickIcons = ["start", "starter", "streams", "overview"];

  return (
    <section className={heroStyles.hero} aria-labelledby="hero-h">
      <div className={clsx(heroStyles.wrap, heroStyles.heroGrid)}>
        <div>
          <p className={heroStyles.eyebrow}>V2 · GraphQL · 40+ chains</p>
          <h1 id="hero-h">Bitquery Streaming API docs.</h1>
          <p className={heroStyles.sub}>
            Query and stream historical and real-time blockchain data through
            GraphQL, WebSocket, Kafka, MCP and cloud exports — one schema, many
            interfaces.
          </p>
          <SearchTrigger
            className={heroStyles.heroSearch}
            aria-label="Search documentation"
          >
            <SearchIcon />
            <span className={heroStyles.ph}>
              Search the docs — “OHLCV”, “Kafka”, “Pump.fun”…
            </span>
            <kbd>⌘K</kbd>
          </SearchTrigger>
          <div className={heroStyles.quick}>
            {heroQuickLinks.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                className={clsx(link.primary && heroStyles.quickPrimary)}
              >
                <QuickIcon type={quickIcons[i]} />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <HeroCodePanel />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <SearchProvider>
      <Layout
        title="Bitquery V2 API Docs"
        description="Blockchain Streaming APIs (V2) for real-time and historical transactions, balances, transfers, NFTs, DEX trades, smart contract calls, and events across 40+ blockchains."
      >
        <div className={homeStyles.pageShell}>
          <HomepageHero />
          <main>
            <HomepageFeatures />
          </main>
        </div>
        <CommandPalette />
      </Layout>
    </SearchProvider>
  );
}
