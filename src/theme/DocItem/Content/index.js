/**
 * Swizzled DocItem/Content to add Copy MD button next to the title.
 * No import needed in any .md file - applies to all doc pages.
 */
import React, {useState, useCallback} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
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
    <button
      type="button"
      className="copy-md"
      onClick={handleClick}
    >
      {status}
    </button>
  );
}

export default function DocItemContent({children}) {
  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      <div className="copy-md-header copy-md-header--no-title">
        <CopyMDButton />
      </div>
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
