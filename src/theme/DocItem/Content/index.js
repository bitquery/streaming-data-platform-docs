/**
 * Swizzled DocItem/Content to add Copy MD button next to the title.
 * No import needed in any .md file - applies to all doc pages.
 */
import React, {useState, useCallback} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';

function CopyMDButton() {
  const [status, setStatus] = useState('Copy MD');
  const handleClick = useCallback(() => {
    const text = document.body.innerText;
    navigator.clipboard.writeText(text)
      .then(() => {
        setStatus('✓ Copied!');
        setTimeout(() => setStatus('Copy MD'), 2000);
      })
      .catch(() => {
        setStatus('Copy failed');
        setTimeout(() => setStatus('Copy MD'), 2000);
      });
  }, []);
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
