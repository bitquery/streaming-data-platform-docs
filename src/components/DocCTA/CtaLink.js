import React from "react";
import Link from "@docusaurus/Link";

/**
 * Renders one CTA from links.js with the right anchor semantics:
 *  - external (`item.external`): new tab + noopener
 *  - site route (href starts with "/"): Docusaurus <Link> (client-side navigation)
 *  - anything else (mailto:): plain anchor
 * Every link carries `data-cta` for GTM click tracking.
 */
export default function CtaLink({item, className, children}) {
  if (item.external) {
    return (
      <a
        className={className}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        data-cta={item.id}
      >
        {children}
      </a>
    );
  }
  if (item.href.startsWith("/")) {
    return (
      <Link to={item.href} className={className} data-cta={item.id}>
        {children}
      </Link>
    );
  }
  return (
    <a className={className} href={item.href} data-cta={item.id}>
      {children}
    </a>
  );
}
