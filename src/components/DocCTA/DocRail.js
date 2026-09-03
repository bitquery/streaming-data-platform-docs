import React from "react";
import DocCTARail from "./DocCTARail";
import styles from "./styles.module.css";

/** Sticky desktop rail: the CTA card on top, then the page's table of contents. */
export default function DocRail({toc}) {
  return (
    <div className={styles.rail}>
      <DocCTARail />
      {toc && (
        <>
          <p className={styles.tocLabel}>On this page</p>
          {toc}
        </>
      )}
    </div>
  );
}
