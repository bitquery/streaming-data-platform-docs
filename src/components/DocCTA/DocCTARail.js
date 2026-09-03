import React from "react";
import CtaLink from "./CtaLink";
import {CTA, TALK_LABEL} from "./links";
import {KeyIcon, SendIcon, MailIcon, ArrowIcon} from "./icons";
import styles from "./styles.module.css";

const Dot = () => (
  <span className={styles.dot} aria-hidden="true">
    ·
  </span>
);

/**
 * "Next steps" card at the top of the desktop right rail:
 * primary button, two contact buttons, muted meta line.
 * A container query trims it on rails narrower than ~215px.
 */
export default function DocCTARail() {
  return (
    <aside
      className={styles.card}
      aria-label="Next steps"
      data-cta-placement="rail"
    >
      <CtaLink item={CTA.apiKey} className={styles.primary}>
        <KeyIcon className={styles.icon} />
        <span>{CTA.apiKey.label}</span>
        <ArrowIcon className={`${styles.icon} ${styles.arrow}`} />
      </CtaLink>

      <div className={styles.ghostRow} role="group" aria-label={TALK_LABEL}>
        <CtaLink item={CTA.telegram} className={styles.ghostBtn}>
          <SendIcon className={styles.icon} />
          {CTA.telegram.label}
        </CtaLink>
        <CtaLink item={CTA.email} className={styles.ghostBtn}>
          <MailIcon className={styles.icon} />
          {CTA.email.label}
        </CtaLink>
      </div>

      <div className={styles.metaLine}>
        <CtaLink item={CTA.pricing} className={styles.metaLink}>
          {CTA.pricing.shortLabel}
        </CtaLink>
        <Dot />
        <CtaLink item={CTA.mcp} className={styles.metaLink}>
          <span className={styles.labelLong}>{CTA.mcp.shortLabel}</span>
          <span className={styles.labelTiny}>{CTA.mcp.tinyLabel}</span>
        </CtaLink>
        <Dot />
        <CtaLink item={CTA.newsletter} className={styles.metaLink}>
          {CTA.newsletter.shortLabel}
        </CtaLink>
      </div>
    </aside>
  );
}
