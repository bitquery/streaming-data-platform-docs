import React, { useRef, useState } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { CardIcon, ChainIcon, RecipeIcon } from "./icons";
import { useRevealOnScroll } from "./useRevealOnScroll";
import {
  bitqueryTools,
  chainListFullUrl,
  chains,
  dataTypes,
  howToGuidesUrl,
  interfaces,
  introVideoUrl,
  mentalModelFan,
  personas,
  platformOverviewUrl,
  startHereSteps,
  trendingPages,
  useCases,
  v1V2ApiGuideUrl,
  enterpriseSalesUrl,
} from "./sectionsData";

function SectionHead({ num, kicker, title, children, className }) {
  return (
    <div className={clsx(styles.secHead, styles.reveal, className)}>
      {num ? <span className={styles.secNum}>{num}</span> : null}
      <div>
        {kicker ? <div className={styles.sk}>{kicker}</div> : null}
        <h2>{title}</h2>
        {children ? <p>{children}</p> : null}
      </div>
    </div>
  );
}

function CardLink({ item, className, children }) {
  if (item.external || item.href?.startsWith("http")) {
    return (
      <a
        href={item.href || item.to}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={item.to || item.href} className={className}>
      {children}
    </Link>
  );
}

function StepCard({ step }) {
  const body = step.bodyCode ? (
    <>
      Swap <code>query</code> for <code>subscription</code> — the same fields now
      push over WebSocket in real time.
    </>
  ) : (
    step.body
  );

  const inner = (
    <>
      <span className={styles.stepN}>{step.step}</span>
      <h3>{step.title}</h3>
      <p>{body}</p>
      <div className={styles.scode}>
        {step.codeParts.map((part, i) =>
          part.cls ? (
            <span key={i} className={styles[part.cls]}>
              {part.text}
            </span>
          ) : (
            <span key={i}>{part.text}</span>
          )
        )}
      </div>
      <span className={styles.slnk}>
        {step.linkLabel} <span className={styles.arrow}>→</span>
      </span>
    </>
  );

  if (step.external) {
    return (
      <a
        href={step.href}
        className={styles.step}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    );
  }
  return (
    <Link to={step.to} className={styles.step}>
      {inner}
    </Link>
  );
}

function VideoBand() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    setPlaying(true);
    video.play();
  };

  return (
    <section className={clsx(styles.block, styles.blockFlush)} aria-labelledby="vid-h">
      <div className={styles.wrap}>
        <div className={clsx(styles.videoBand, styles.reveal)}>
          <div>
            <div className={styles.vk}>Watch</div>
            <h2 id="vid-h">Intro walkthrough — IDE &amp; your first query</h2>
            <p>
              A short tour of the GraphQL IDE: find a dataset, shape a query, run
              it, and turn it into a live stream.
            </p>
            <div className={styles.vbtns}>
              <Link className={styles.bqBtnPrimary} to="/docs/start/first-query/">
                Start the 5-min guide <span className={styles.arrow}>→</span>
              </Link>
              <a
                className={styles.bqBtnSecondary}
                href="https://ide.bitquery.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open the IDE
              </a>
            </div>
          </div>
          <div className={clsx(styles.vframe, playing && styles.vframePlaying)}>
            <video ref={videoRef} preload="none" controls playsInline>
              <source src={introVideoUrl} type="video/mp4" />
            </video>
            {!playing ? (
              <div className={styles.poster}>
                <button
                  type="button"
                  className={styles.play}
                  aria-label="Play intro video"
                  onClick={play}
                >
                  <svg viewBox="0 0 24 24" fill="#fff" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <span className={styles.vlabel}>intro_video.mp4 · ~3 min</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomepageFeatures() {
  useRevealOnScroll(styles.reveal, styles.revealIn);

  return (
    <div className={styles.home}>
      {/* Start here */}
      <section className={styles.start} aria-labelledby="start-h">
        <div className={styles.wrap}>
          <div className={clsx(styles.startHead, styles.reveal)}>
            <h2 id="start-h">Your first query in 5 minutes.</h2>
            <p>Three steps from sign-up to streaming live data.</p>
          </div>
          <div className={clsx(styles.steps, styles.reveal)}>
            {startHereSteps.map((step) => (
              <StepCard key={step.step} step={step} />
            ))}
          </div>
        </div>
      </section>

      {/* 01 Data */}
      <section className={styles.block} id="data" aria-labelledby="data-h">
        <div className={styles.wrap}>
          <SectionHead
            num="01"
            kicker="What you query"
            title="Data & metrics"
          >
            The datasets you can query and stream — and the docs that show you how
            to build with each.
          </SectionHead>
          <div className={clsx(styles.grid, styles.g4, styles.reveal)}>
            {dataTypes.map((d) => (
              <Link key={d.to} to={d.to} className={styles.dcard}>
                <span className={styles.ic}>
                  <CardIcon name={d.icon} />
                </span>
                <h3>{d.label}</h3>
                <p>{d.hint}</p>
                <span className={styles.cardLnk}>
                  Open docs <span className={styles.arrow}>→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 02 Interfaces */}
      <section
        className={clsx(styles.block, styles.blockBorder)}
        id="interfaces"
        aria-labelledby="if-h"
      >
        <div className={styles.wrap}>
          <SectionHead num="02" kicker="How you connect" title="Interfaces">
            One mental model: design the shape in GraphQL, then stream the same
            fields over whatever fits your stack.
          </SectionHead>

          <div className={clsx(styles.mm, styles.reveal)}>
            <div className={styles.mmcode}>
              <span className={styles.cc}># design the shape once…</span>
              <br />
              <span className={styles.ck}>subscription</span> {"{"}
              <br />
              &nbsp;&nbsp;<span className={styles.cf}>EVM</span> {"{"}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className={styles.cf}>DEXTrades</span> {"{"}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Trade {"{ Buy { Price } }"}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;{"}"}
              <br />
              &nbsp;&nbsp;{"}"}
              <br />
              {"}"}
            </div>
            <div>
              <div className={styles.mmtitle}>
                …then deliver the <b>same fields</b> anywhere.
              </div>
              <p>
                You never re-model your data to change transport. Author and
                validate in GraphQL, then point a different interface at the
                identical field selection — for live apps, scale-out pipelines, AI
                agents or your warehouse.
              </p>
              <div className={styles.fan}>
                {mentalModelFan.map((item) => (
                  <span key={item.label}>
                    {item.label} <em>→ {item.hint}</em>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={clsx(styles.grid, styles.g3, styles.reveal)}>
            {interfaces.map((item) => (
              <Link key={item.abbr} to={item.to} className={clsx(styles.dcard, styles.ifaceCard)}>
                {item.isNew ? <span className={styles.tag}>New</span> : null}
                <span className={styles.badge2}>{item.abbr}</span>
                <h3>{item.name}</h3>
                <p>{item.hint}</p>
                <span className={styles.cardLnk}>
                  {item.linkLabel} <span className={styles.arrow}>→</span>
                </span>
              </Link>
            ))}
          </div>

          <div className={clsx(styles.vnote, styles.reveal)}>
            <p>
              <b>V1 and V2</b> use different GraphQL schemas and IDE flows. Compare
              them if you&apos;re migrating or reusing older queries.
            </p>
            <a
              href={v1V2ApiGuideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.vnoteLink}
            >
              V1 vs V2 API guide <span className={styles.arrow}>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* 03 Tools */}
      <section
        className={clsx(styles.block, styles.blockBorder)}
        id="tools"
        aria-labelledby="tools-h"
      >
        <div className={styles.wrap}>
          <SectionHead num="03" kicker="Ship faster" title="Tools & explorers">
            Explore markets, debug queries, and browse demos and SDKs built on
            Bitquery.
          </SectionHead>
          <div className={clsx(styles.grid, styles.g4, styles.reveal)}>
            {bitqueryTools.map((tool) => (
              <CardLink key={tool.title} item={tool} className={styles.dcard}>
                <span className={styles.ic}>
                  <CardIcon name={tool.icon} />
                </span>
                <h3>{tool.title}</h3>
                <p>{tool.hint}</p>
                <span className={styles.cardLnk}>
                  {tool.external ? "Open tool" : "Browse directory"}{" "}
                  <span className={styles.arrow}>→</span>
                </span>
              </CardLink>
            ))}
          </div>
        </div>
      </section>

      {/* 04 Chains */}
      <section
        className={clsx(styles.block, styles.blockBorder)}
        id="chains"
        aria-labelledby="ch-h"
      >
        <div className={styles.wrap}>
          <SectionHead num="04" kicker="Coverage" title="Blockchains supported">
            40+ networks across V1 &amp; V2 — EVM, Solana, Tron, Bitcoin and more,
            all on one schema.
          </SectionHead>
          <div className={clsx(styles.chainsGrid, styles.reveal)}>
            {chains.map((c) => (
              <Link key={c.label} to={c.to} className={styles.chainChip}>
                <ChainIcon id={c.id} />
                {c.label}
              </Link>
            ))}
            <Link
              to={chainListFullUrl}
              className={clsx(styles.chainChip, styles.chainChipMore)}
            >
              + 30 more · all chains <span className={styles.arrow}>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Personas */}
      <section className={clsx(styles.block, styles.blockFlush)} aria-labelledby="team-h">
        <div className={styles.wrap}>
          <SectionHead kicker="Who builds here" title="Built for your team">
            From discretionary traders to audit-ready reporting — pick a path and
            open the matching docs.
          </SectionHead>
          <div className={clsx(styles.personaGrid, styles.reveal)}>
            {personas.map((p, i) => (
              <CardLink key={p.title} item={p} className={styles.persona}>
                <span className={styles.pn}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <span className={styles.cardLnkTeal}>
                  Explore <span className={styles.arrow}>→</span>
                </span>
              </CardLink>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className={clsx(styles.block, styles.blockFlush)} aria-labelledby="trend-h">
        <div className={styles.wrap}>
          <SectionHead kicker="Popular right now" title="Trending documentation">
            High-traffic guides teams open first when integrating streaming market
            data.
          </SectionHead>
          <div className={clsx(styles.trendGrid, styles.reveal)}>
            {trendingPages.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                className={clsx(styles.trend, t.featured && styles.trendFeat)}
              >
                {t.featured ? (
                  <div className={styles.ft}>
                    <span className={styles.star}>Featured</span>
                  </div>
                ) : null}
                <h3>{t.title}</h3>
                <p>{t.body}</p>
                <span className={styles.cardLnk}>
                  Open guide <span className={styles.arrow}>→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recipes */}
      <section className={clsx(styles.block, styles.blockFlush)} aria-labelledby="rec-h">
        <div className={styles.wrap}>
          <SectionHead kicker="Recipes" title="Use cases & how-tos">
            End-to-end examples: bots, dashboards, alerts and research pipelines.
          </SectionHead>
          <div className={clsx(styles.recipes, styles.reveal)}>
            {useCases.map((u) => (
              <Link key={u.to} to={u.to} className={styles.recipe}>
                <RecipeIcon name={u.icon} />
                {u.label}
              </Link>
            ))}
            <Link to={howToGuidesUrl} className={clsx(styles.recipe, styles.recipeAll)}>
              All how-to guides <span className={styles.arrow}>→</span>
            </Link>
          </div>
        </div>
      </section>

      <VideoBand />

      {/* Trusted CTA */}
      <section className={styles.trusted} aria-labelledby="trust-h">
        <div className={styles.wrap}>
          <div className={styles.sk}>Production scale</div>
          <h2 id="trust-h">Trusted for on-chain data.</h2>
          <p>
            Exchanges, funds, protocols and investigators rely on Bitquery for
            trading, compliance and research — from ad-hoc GraphQL to Kafka-scale
            delivery.
          </p>
          <div className={styles.cta}>
            <Link className={styles.bqBtnPrimary} to="/docs/start/first-query/">
              Start with your first query <span className={styles.arrow}>→</span>
            </Link>
            <a
              className={styles.bqBtnSecondary}
              href={enterpriseSalesUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Enterprise &amp; sales
            </a>
            <Link className={styles.bqBtnSecondary} to={platformOverviewUrl}>
              Platform overview
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
