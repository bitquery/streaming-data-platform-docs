import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "@docusaurus/Link";
import { useHistory } from "@docusaurus/router";
import clsx from "clsx";
import {
  groupIconPath,
  SEARCH_GROUP_ORDER,
  SEARCH_INDEX,
} from "./searchIndex";
import { useHomeSearch } from "./SearchProvider";
import styles from "./CommandPalette.module.css";

function escapeHtml(text) {
  return text.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

function highlight(text, query) {
  if (!query) return escapeHtml(text);
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const i = lower.indexOf(q);
  if (i === -1) return escapeHtml(text);
  return (
    escapeHtml(text.slice(0, i)) +
    `<mark>${escapeHtml(text.slice(i, i + q.length))}</mark>` +
    escapeHtml(text.slice(i + q.length))
  );
}

function GroupIcon({ group }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={groupIconPath(group)} />
    </svg>
  );
}

function ResultRow({ item, index, active, query, onHover, onSelect }) {
  const isExternal = item.external || item.u.startsWith("http");
  const className = clsx(styles.cmdkRow, active && styles.cmdkRowOn);

  const content = (
    <>
      <span className={styles.cmdkIc}>
        <GroupIcon group={item.g} />
      </span>
      <span className={styles.cmdkTx}>
        <b dangerouslySetInnerHTML={{ __html: highlight(item.t, query) }} />
        <small dangerouslySetInnerHTML={{ __html: highlight(item.s, query) }} />
      </span>
      <span className={styles.cmdkGo}>↵</span>
    </>
  );

  if (isExternal) {
    return (
      <a
        href={item.u}
        className={className}
        data-i={index}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => onHover(index)}
        onClick={onSelect}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      to={item.u}
      className={className}
      data-i={index}
      onMouseEnter={() => onHover(index)}
      onClick={onSelect}
    >
      {content}
    </Link>
  );
}

export default function CommandPalette() {
  const { open, openSearch, closeSearch } = useHomeSearch();
  const history = useHistory();
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_INDEX;
    return SEARCH_INDEX.filter(
      (it) => (it.t + " " + it.s + " " + it.g).toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const byGroup = {};
    filtered.forEach((item) => {
      if (!byGroup[item.g]) byGroup[item.g] = [];
      byGroup[item.g].push(item);
    });
    return SEARCH_GROUP_ORDER.filter((g) => byGroup[g]).map((g) => ({
      group: g,
      items: byGroup[g],
    }));
  }, [filtered]);

  const flatResults = useMemo(
    () => grouped.flatMap((g) => g.items),
    [grouped]
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(flatResults.length ? 0 : -1);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setActiveIdx(flatResults.length ? 0 : -1);
  }, [query, flatResults.length]);

  const scrollActiveIntoView = useCallback((idx) => {
    const box = resultsRef.current;
    const row = box?.querySelector(`[data-i="${idx}"]`);
    if (!box || !row) return;
    const rt = row.offsetTop;
    const rb = rt + row.offsetHeight;
    if (rt < box.scrollTop) box.scrollTop = rt - 8;
    else if (rb > box.scrollTop + box.clientHeight) {
      box.scrollTop = rb - box.clientHeight + 8;
    }
  }, []);

  const move = useCallback(
    (delta) => {
      if (!flatResults.length) return;
      const next = (activeIdx + delta + flatResults.length) % flatResults.length;
      setActiveIdx(next);
      scrollActiveIntoView(next);
    },
    [activeIdx, flatResults.length, scrollActiveIntoView]
  );

  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = e.target.tagName;
      const typing =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        e.target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) closeSearch();
        else openSearch();
        return;
      }

      if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        openSearch();
        return;
      }

      if (e.key === "Escape" && open) {
        e.preventDefault();
        closeSearch();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, openSearch, closeSearch]);

  const onInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter" && flatResults[activeIdx]) {
      e.preventDefault();
      const item = flatResults[activeIdx];
      closeSearch();
      if (item.external || item.u.startsWith("http")) {
        window.open(item.u, "_blank", "noopener");
      } else {
        history.push(item.u);
      }
    }
  };

  if (!open) return null;

  let rowIndex = 0;

  return (
    <div
      className={styles.cmdk}
      aria-hidden={false}
      role="presentation"
    >
      <button
        type="button"
        className={styles.cmdkBackdrop}
        aria-label="Close search"
        onClick={closeSearch}
      />
      <div
        className={styles.cmdkBox}
        role="dialog"
        aria-label="Search documentation"
      >
        <div className={styles.cmdkInp}>
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
          <input
            ref={inputRef}
            type="text"
            placeholder="Search the docs — products, interfaces, chains, recipes…"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
          />
          <kbd>Esc</kbd>
        </div>
        <div className={styles.cmdkResults} ref={resultsRef}>
          {!flatResults.length ? (
            <div className={styles.cmdkEmpty}>
              No matches. Try “OHLCV”, “Kafka”, “Solana”, or “Pump.fun”.
            </div>
          ) : (
            grouped.map(({ group, items }) => (
              <div key={group}>
                <div className={styles.cmdkGrp}>{group}</div>
                {items.map((item) => {
                  const idx = rowIndex;
                  rowIndex += 1;
                  return (
                    <ResultRow
                      key={`${item.g}-${item.t}`}
                      item={item}
                      index={idx}
                      active={idx === activeIdx}
                      query={query.trim()}
                      onHover={setActiveIdx}
                      onSelect={closeSearch}
                    />
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div className={styles.cmdkFoot}>
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span className={styles.cmdkBrand}>Bitquery Docs</span>
        </div>
      </div>
    </div>
  );
}

export function SearchTrigger({ children, className, ...props }) {
  const { openSearch } = useHomeSearch();

  return (
    <div
      role="button"
      tabIndex={0}
      className={className}
      onClick={openSearch}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openSearch();
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
}
