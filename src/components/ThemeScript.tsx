import React from "react";

export function ThemeScript() {
  const code = `
    (function() {
      try {
        var savedTheme = localStorage.getItem('app-theme') || 'system';
        if (savedTheme !== 'system') {
          document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
          document.documentElement.setAttribute('data-theme', 'system');
        }
      } catch (e) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
