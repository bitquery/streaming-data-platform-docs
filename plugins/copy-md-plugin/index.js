module.exports = function copyMdPlugin() {
    return {
      name: 'copy-md-plugin',
      injectHtmlTags() {
        return {
          headTags: [
            {
              tagName: 'script',
              innerHTML: `
                function copyMarkdown() {
                  var btn = document.querySelector('button.copy-md');
                  if (!btn) return;
                  var originalText = btn.innerHTML;
                  var md = document.body.innerText;
                  navigator.clipboard.writeText(md)
                    .then(function() {
                      btn.innerHTML = '✓ Copied!';
                      setTimeout(function() { btn.innerHTML = originalText; }, 2000);
                    })
                    .catch(function(err) {
                      btn.innerHTML = 'Copy failed';
                      setTimeout(function() { btn.innerHTML = originalText; }, 2000);
                    });
                }
                document.addEventListener('DOMContentLoaded', function() {
                  var btn = document.querySelector('button.copy-md');
                  var container = document.querySelector('main article') || document.querySelector('main .theme-doc-markdown') || document.querySelector('main');
                  if (btn && container) {
                    container.style.position = 'relative';
                    container.appendChild(btn);
                  }
                });
              `,
            },
          ],
          postBodyTags: [
            {
              tagName: 'button',
              attributes: {
                type: 'button',
                class: 'copy-md',
                onclick: 'copyMarkdown()',
              },
              innerHTML: 'Copy MD',
            },
          ],
        };
      },
    };
  };
  