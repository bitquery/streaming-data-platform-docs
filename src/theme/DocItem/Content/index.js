/**
 * Swizzled DocItem/Content:
 *  - "Copy MD" button next to the title (unchanged).
 *  - Auto "Related pages" footer generated from the sidebar (sibling links in the
 *    same category). This gives every doc inbound + outbound links with no
 *    per-page frontmatter, mechanically removing dead-ends. Renders nothing when
 *    the page has no sidebar category siblings.
 * No import needed in any .md file - applies to all doc pages.
 */
import React, {useState, useCallback} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc, useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import MDXContent from '@theme/MDXContent';

function toRawGitHubUrl(editUrl) {
  if (!editUrl || !editUrl.includes('github.com')) {
    return null;
  }
  return editUrl
    .replace('https://github.com/', 'https://raw.githubusercontent.com/')
    .replace('/tree/', '/');
}

function CopyMDButton() {
  const {metadata} = useDoc();
  const [status, setStatus] = useState('Copy MD');

  const handleClick = useCallback(async () => {
    try {
      let text = '';
      const rawUrl = toRawGitHubUrl(metadata.editUrl);
      if (rawUrl) {
        const res = await fetch(rawUrl);
        if (res.ok) {
          text = await res.text();
        }
      }
      if (!text) {
        const el = document.querySelector(
          'article .theme-doc-markdown, article .markdown, .theme-doc-markdown',
        );
        text = el ? el.innerText : '';
      }
      if (!text) {
        throw new Error('Nothing to copy');
      }
      await navigator.clipboard.writeText(text);
      setStatus('✓ Copied!');
    } catch {
      setStatus('Copy failed');
    }
    setTimeout(() => setStatus('Copy MD'), 2000);
  }, [metadata.editUrl]);

  return (
    <button type="button" className="copy-md" onClick={handleClick}>
      {status}
    </button>
  );
}

// Find the sibling doc-links of the current page within its sidebar category.
function findSiblingLinks(items, permalink) {
  for (const item of items || []) {
    if (item && item.type === 'category') {
      const links = (item.items || []).filter((c) => c && c.type === 'link');
      if (links.some((c) => c.href === permalink)) {
        return links;
      }
      const nested = findSiblingLinks(item.items, permalink);
      if (nested) {
        return nested;
      }
    }
  }
  return null;
}

function RelatedPages() {
  let permalink;
  let sidebar;
  try {
    permalink = useDoc()?.metadata?.permalink;
    sidebar = useDocsSidebar();
  } catch {
    return null;
  }
  if (!sidebar || !permalink) {
    return null;
  }
  const siblings = findSiblingLinks(sidebar.items, permalink);
  if (!siblings) {
    return null;
  }
  const links = siblings.filter((c) => c.href !== permalink).slice(0, 8);
  if (links.length === 0) {
    return null;
  }
  return (
    <nav className="related-pages" aria-label="Related pages">
      <p className="related-pages__title">Related pages</p>
      <ul className="related-pages__list">
        {links.map((c) => (
          <li key={c.href}>
            <a href={c.href}>{c.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function DocItemContent({children}) {
  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      <div className="copy-md-header copy-md-header--no-title">
        <CopyMDButton />
      </div>
      <MDXContent>{children}</MDXContent>
      <RelatedPages />
    </div>
  );
}
