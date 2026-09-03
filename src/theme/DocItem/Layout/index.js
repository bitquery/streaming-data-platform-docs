/**
 * Ejected from @docusaurus/theme-classic 3.10.1 (theme/DocItem/Layout).
 *
 * Changes from upstream, all for the site-wide doc CTAs:
 *  1. The desktop right column renders on every doc page (upstream skips it
 *     when a page has no headings), so the "Next steps" card is always there.
 *  2. That column is a sticky rail: CTA card, "On this page" label, TOC.
 *  3. The mobile CTA block renders after the article body.
 * Everything else is upstream verbatim; re-check when upgrading Docusaurus.
 */
import React from "react";
import clsx from "clsx";
import {useWindowSize} from "@docusaurus/theme-common";
import {useDoc} from "@docusaurus/plugin-content-docs/client";
import DocItemPaginator from "@theme/DocItem/Paginator";
import DocVersionBanner from "@theme/DocVersionBanner";
import DocVersionBadge from "@theme/DocVersionBadge";
import DocItemFooter from "@theme/DocItem/Footer";
import DocItemTOCMobile from "@theme/DocItem/TOC/Mobile";
import DocItemTOCDesktop from "@theme/DocItem/TOC/Desktop";
import DocItemContent from "@theme/DocItem/Content";
import DocBreadcrumbs from "@theme/DocBreadcrumbs";
import ContentVisibility from "@theme/ContentVisibility";
import DocRail from "@site/src/components/DocCTA/DocRail";
import DocCTAEnd from "@site/src/components/DocCTA/DocCTAEnd";
import styles from "./styles.module.css";

/**
 * Decide what the desktop rail and the mobile TOC render.
 */
function useDocTOC() {
  const {frontMatter, toc} = useDoc();
  const windowSize = useWindowSize();
  const hidden = frontMatter.hide_table_of_contents;
  const hasToc = !hidden && toc.length > 0;
  const isDesktop = windowSize === "desktop" || windowSize === "ssr";
  const mobile = hasToc ? <DocItemTOCMobile /> : undefined;
  const desktop =
    !hidden && isDesktop ? (
      <DocRail toc={hasToc ? <DocItemTOCDesktop /> : null} />
    ) : undefined;
  return {hidden, mobile, desktop};
}

export default function DocItemLayout({children}) {
  const docTOC = useDocTOC();
  const {metadata} = useDoc();
  return (
    <div className="row">
      <div className={clsx("col", !docTOC.hidden && styles.docItemCol)}>
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            <DocVersionBadge />
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <DocCTAEnd />
            <DocItemFooter />
          </article>
          <DocItemPaginator />
        </div>
      </div>
      {docTOC.desktop && <div className="col col--3">{docTOC.desktop}</div>}
    </div>
  );
}
