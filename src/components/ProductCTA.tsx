import React from "react";
import styles from "./ProductCTA.module.css";

type ProductCTAProps = {
  /** Absolute URL of the bitquery.io product or chain page. */
  href: string;
  /** Anchor text — the product page's name, e.g. "Solana DEX API". */
  title: string;
  /** Short trailing note. Defaults to plans/trial phrasing. */
  note?: string;
};

export default function ProductCTA({
  href,
  title,
  note = "plans, free trial and enterprise delivery options",
}: ProductCTAProps) {
  return (
    <p className={styles.cta}>
      <span className={styles.badge}>Product</span>
      Using this in production? See the <a href={href}>{title}</a> page for {note}.
    </p>
  );
}
