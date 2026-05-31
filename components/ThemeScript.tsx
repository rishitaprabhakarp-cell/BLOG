const themeScript = `(function(){try{var s=localStorage.getItem('theme');var t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function ThemeScript() {
  return (
    <script
      // Inline so it runs before paint and prevents a theme flash on first load.
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  );
}
