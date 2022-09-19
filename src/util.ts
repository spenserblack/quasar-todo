const themeKey = 'dark-theme';

export function loadTheme(): boolean | 'auto' {
  const theme = window?.localStorage?.getItem(themeKey);

  switch(theme) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return 'auto';
  }
}

export function saveTheme(theme: boolean) {
  window?.localStorage?.setItem(themeKey, theme.toString());
}
