import React from "react";
import Head from "@docusaurus/Head";
import styles from "./FAQ.module.css";

/**
 * `a` is the plain-text answer used for the FAQPage JSON-LD and, by default,
 * for rendering. `answer` is an optional rich version (links, code) that is
 * rendered in its place; the schema always uses `a`.
 */
export type FAQItem = { q: string; a: string; id?: string; answer?: React.ReactNode };

type FAQProps = {
  items: FAQItem[];
  title?: string;
};

export default function FAQ({ items, title = "Frequently Asked Questions" }: FAQProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <section className={styles.faq}>
      <Head>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
      <h2>{title}</h2>
      {items.map((it, i) => (
        <details key={i} id={it.id} className={styles.item}>
          <summary>{it.q}</summary>
          {it.answer !== undefined ? it.answer : <p>{it.a}</p>}
        </details>
      ))}
    </section>
  );
}
