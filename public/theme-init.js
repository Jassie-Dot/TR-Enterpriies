(() => {
  try {
    const key = 'tr-theme';
    const saved = localStorage.getItem(key);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved === 'light' || saved === 'dark' ? saved : (prefersDark ? 'dark' : 'light');
    // set both dataset and attribute to be resilient
    document.documentElement.dataset.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    try { document.documentElement.dataset.theme = 'dark'; document.documentElement.setAttribute('data-theme','dark'); } catch(e){}
  }
})();
