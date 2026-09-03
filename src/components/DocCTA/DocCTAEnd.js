import React from "react";
import clsx from "clsx";
import CtaLink from "./CtaLink";
import {CTA, TALK_LABEL} from "./links";
import {
  KeyIcon,
  TagIcon,
  ChatIcon,
  SendIcon,
  MailIcon,
  NewsIcon,
  BotIcon,
} from "./icons";
import styles from "./styles.module.css";

/**
 * "Build with Bitquery" block after the article body. Mobile and tablet only:
 * on desktop the sticky rail card carries the same CTAs (see DocCTARail).
 */
export default function DocCTAEnd() {
  const ghost = clsx(styles.btn, styles.btnGhost);
  return (
    <section
      className={styles.end}
      aria-label="Build with Bitquery"
      data-cta-placement="end"
    >
      <div className={styles.endText}>
        <div className={styles.eyebrow}>Build with Bitquery</div>
        <p className={styles.endTitle}>Ready to run this in production?</p>
        <p className={styles.endLead}>
          Get an API key and run these queries in minutes, or talk to us about
          plans and enterprise delivery.
        </p>
      </div>

      <div className={styles.endActions}>
        <CtaLink item={CTA.apiKey} className={clsx(styles.btn, styles.btnPrimary)}>
          <KeyIcon className={styles.icon} />
          {CTA.apiKey.label}
        </CtaLink>
        <CtaLink item={CTA.pricing} className={ghost}>
          <TagIcon className={styles.icon} />
          {CTA.pricing.label}
        </CtaLink>
        <CtaLink item={CTA.mcp} className={ghost}>
          <BotIcon className={styles.icon} />
          {CTA.mcp.label}
        </CtaLink>
        <CtaLink item={CTA.newsletter} className={ghost}>
          <NewsIcon className={styles.icon} />
          {CTA.newsletter.label}
        </CtaLink>
        <div className={styles.split} role="group" aria-label={TALK_LABEL}>
          <span className={styles.splitLabel}>
            <ChatIcon className={styles.icon} />
            <span className={styles.splitLabelText}>{TALK_LABEL}</span>
          </span>
          <CtaLink item={CTA.telegram} className={styles.splitLink}>
            <SendIcon className={styles.icon} />
            {CTA.telegram.label}
          </CtaLink>
          <CtaLink item={CTA.email} className={styles.splitLink}>
            <MailIcon className={styles.icon} />
            {CTA.email.label}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
