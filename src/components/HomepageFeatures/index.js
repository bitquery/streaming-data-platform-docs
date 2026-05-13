import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { PRODUCTION_MARKETING_SITE } from "@site/src/utils/productionUrl";
import {
  bitqueryTools,
  chainListFullUrl,
  chains,
  dataTypes,
  interfaces,
  introVideoUrl,
  personas,
  platformOverviewUrl,
  trendingPages,
  useCases,
  v1V2ApiGuideUrl,
} from "./sectionsData";

function SectionHeader({ kicker, title, children, align = "center" }) {
  return (
    <header
      className={clsx(
        styles.sectionHeader,
        align === "left" && styles.sectionHeaderLeft,
        align === "center" && styles.sectionHeaderCenter
      )}
    >
      {kicker ? <p className={styles.sectionKicker}>{kicker}</p> : null}
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children ? <div className={styles.sectionIntro}>{children}</div> : null}
    </header>
  );
}

export default function HomepageFeatures({ tagline }) {
  return (
    <section className={styles.features}>
      {/* 1 — Data: split rail + sharp chips */}
      <div className={clsx(styles.band, styles.bandData)}>
        <div className={styles.bandDataDecor} aria-hidden />
        <div className="container">
          <div className={styles.dataSectionLayout}>
            <aside className={styles.dataRail} aria-hidden="true">
              <span className={styles.dataRailNum}>01</span>
              <span className={styles.dataRailLine} />
              <span className={styles.dataRailLabel}>Data</span>
            </aside>
            <div className={styles.dataSectionBody}>
              <SectionHeader kicker="What you query" title="Data & metrics" align="left">
                {tagline ? (
                  <p className={styles.sectionLead}>{tagline}</p>
                ) : (
                  <p className={styles.sectionLead}>
                    Prices, liquidity events, wallet flows, and protocol traces
                    across Bitquery datasets — same schema for historical and live
                    workloads.
                  </p>
                )}
              </SectionHeader>
              <ul className={styles.dataChipGrid}>
                {dataTypes.map((d) => (
                  <li key={d.to}>
                    <Link to={d.to} className={styles.dataChip}>
                      <span className={styles.dataChipLabel}>{d.label}</span>
                      <span className={styles.dataChipHint}>{d.hint}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 2 — Interfaces: striped band + offset panel */}
      <div className={clsx(styles.band, styles.bandInterfaces)}>
        <div className={styles.bandInterfacesStripes} aria-hidden />
        <div className="container">
          <div className={styles.interfacesIntro}>
            <span className={styles.stepBadge}>02</span>
            <SectionHeader kicker="How you connect" title="Interfaces" align="left">
              <p className={styles.sectionLead}>
                One mental model: GraphQL for shapes, then stream the same fields
                over WebSocket, Kafka, MCP, or gRPC.
              </p>
            </SectionHeader>
          </div>
          <div className={styles.interfacesPanel}>
            <div className={styles.interfacesPanelHd}>
              <span className={styles.interfacesPanelAccent} aria-hidden />
              <p className={styles.interfacesPanelTag}>Delivery modes</p>
            </div>
            <div className={styles.interfaceGrid}>
              {interfaces.map((item) => (
                <Link key={item.abbr} to={item.to} className={styles.interfaceCell}>
                  <span className={styles.abbrSquare}>{item.abbr}</span>
                  <div>
                    <span className={styles.interfaceName}>{item.name}</span>
                    <span className={styles.interfaceHint}>{item.hint}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className={styles.apiVersionCta} role="note">
            <p className={styles.apiVersionCtaText}>
              <strong>V1 and V2</strong> use different GraphQL schemas and IDE
              flows. Compare them if you are migrating or reusing older queries.
            </p>
            <Link
              href={v1V2ApiGuideUrl}
              className={clsx(
                "button button--outline button--primary",
                styles.apiVersionBtn
              )}
            >
              V1 vs V2 API guide
            </Link>
          </div>
        </div>
      </div>

      {/* 3 — Tools & explorers */}
      <div className={clsx(styles.band, styles.bandTools)}>
        <div className="container">
          <div className={styles.toolsIntro}>
            <span className={styles.stepBadge}>03</span>
            <SectionHeader kicker="Ship faster" title="Tools & explorers" align="left">
              <p className={styles.sectionLead}>
                Explore markets, debug queries, and browse demos and SDKs built on
                Bitquery.
              </p>
            </SectionHeader>
          </div>
          <ul className={styles.toolsGrid}>
            {bitqueryTools.map((tool) => (
              <li key={tool.title}>
                <Link
                  href={tool.href}
                  className={styles.toolCard}
                  {...(tool.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <span className={styles.toolCardTitleRow}>
                    <span className={styles.toolCardTitle}>{tool.title}</span>
                    {tool.external ? (
                      <span className={styles.toolCardOutbound} aria-hidden>
                        ↗
                      </span>
                    ) : null}
                  </span>
                  <span className={styles.toolCardHint}>{tool.hint}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4 — Chains: monospace matrix */}
      <div className={clsx(styles.band, styles.bandChains)}>
        <div className="container">
          <div className={styles.chainsHeaderRow}>
            <span className={styles.stepBadgeAlt}>04</span>
            <SectionHeader
              kicker="Coverage"
              title="Blockchains supported"
              align="left"
            >
              <p className={styles.sectionLead}>
                40+ networks across V1 & V2 — EVM, Solana, Tron, Bitcoin, and
                more.
              </p>
            </SectionHeader>
          </div>
          <div className={styles.chainMatrix}>
            <div className={styles.chainMatrixInner}>
              {chains.map((c) => (
                <Link key={c.label} to={c.to} className={styles.chainTag}>
                  {c.label}
                </Link>
              ))}
              <Link
                to={chainListFullUrl}
                className={clsx(styles.chainTag, styles.chainTagEm)}
              >
                Supported chains →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4 — Personas: numbered + alternating frames */}
      <div className={clsx(styles.band, styles.bandPersonas)}>
        <div className={styles.bandPersonasWaves} aria-hidden />
        <div className="container">
          <div className={styles.personasIntro}>
            <SectionHeader
              kicker="Who builds here"
              title="Built for your team"
              align="center"
            >
              <p className={styles.sectionLead}>
                From discretionary traders to audit-ready reporting — pick a path
                and open the matching docs.
              </p>
            </SectionHeader>
          </div>
          <div className={styles.personaGrid}>
            {personas.map((p, i) => (
              <Link
                key={p.title}
                to={p.to}
                className={clsx(
                  styles.personaCard,
                  i % 2 === 1 && styles.personaCardDashed
                )}
              >
                <span className={styles.personaNum}>{i + 1}</span>
                <h3 className={styles.personaTitle}>{p.title}</h3>
                <p className={styles.personaBody}>{p.body}</p>
                <span className={styles.personaCta}>Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 5 — Trending: bento (featured + grid) */}
      <div className={clsx(styles.band, styles.bandTrending)}>
        <div className="container">
          <SectionHeader
            kicker="Popular right now"
            title="Trending documentation"
            align="center"
          >
            <p className={styles.sectionLead}>
              High-traffic guides teams open first when integrating streaming
              market data.
            </p>
          </SectionHeader>
          <div className={styles.trendingBento}>
            {trendingPages.map((t, i) => (
              <Link
                key={t.to}
                to={t.to}
                className={clsx(
                  styles.trendingCard,
                  i === 0 && styles.trendingCardFeatured
                )}
              >
                {i === 0 ? (
                  <span className={styles.trendingFeaturedLabel}>Featured</span>
                ) : null}
                <h3 className={styles.trendingTitle}>{t.title}</h3>
                <p className={styles.trendingBody}>{t.body}</p>
                <span className={styles.trendingCta}>Open guide</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 6 — Use cases: terminal-style block */}
      <div className={clsx(styles.band, styles.bandUseCases)}>
        <div className="container">
          <div className={styles.useCasesSplit}>
            <SectionHeader kicker="Recipes" title="Use cases & how-tos" align="left">
              <p className={styles.sectionLead}>
                End-to-end examples: bots, dashboards, alerts, and research
                pipelines.
              </p>
            </SectionHeader>
            <div className={styles.useCaseTerminal}>
              <div className={styles.useCaseTerminalBar}>
                <span className={styles.useCaseDot} />
                <span className={styles.useCaseDot} />
                <span className={styles.useCaseDot} />
                <span className={styles.useCaseTerminalTitle}>examples</span>
              </div>
              <div className={styles.useCaseCols}>
                <ul className={styles.useCaseList}>
                  {useCases.slice(0, 4).map((u) => (
                    <li key={u.to}>
                      <Link className={styles.useCaseLink} to={u.to}>
                        {u.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className={styles.useCaseList}>
                  {useCases.slice(4).map((u) => (
                    <li key={u.to}>
                      <Link className={styles.useCaseLink} to={u.to}>
                        {u.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7 — Trust: inverted strip */}
      <div className={clsx(styles.band, styles.bandTrust)}>
        <div className="container">
          <div className={styles.trustSplit}>
            <div className={styles.trustCopy}>
              <p className={styles.trustKicker}>Production scale</p>
              <h2 className={styles.trustTitle}>Trusted for on-chain data</h2>
              <p className={styles.trustLead}>
                Exchanges, funds, protocols, and investigators rely on Bitquery for
                trading, compliance, and research — from ad-hoc GraphQL to
                Kafka-scale delivery.
              </p>
            </div>
            <div className={styles.trustActions}>
              <Link
                className={styles.trustBtn}
                href={`${PRODUCTION_MARKETING_SITE}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit bitquery.io
              </Link>
              <Link
                className={styles.trustBtnGhost}
                href={`${PRODUCTION_MARKETING_SITE}/contact`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Enterprise & sales
              </Link>
              <Link className={styles.trustBtnGhost} to={platformOverviewUrl}>
                Platform overview
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Video — rounded + label chip */}
      <div className={clsx(styles.band, styles.bandVideo)}>
        <div className={clsx("container", styles.videoRow)}>
          <span className={styles.videoChip}>Watch</span>
          <p className={styles.videoCaption}>
            Intro walkthrough · IDE · first query
          </p>
        </div>
        <div className={clsx("container", styles.videoBox)}>
          <div className={styles.videoFrame}>
            <video className={styles.video} controls preload="metadata">
              <source src={introVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
