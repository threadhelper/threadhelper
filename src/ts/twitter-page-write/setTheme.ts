import { isNil } from 'ramda';

function setTheme(
  bg_color: string,
  txt_color: string,
  border_color: string,
  accent_color: string,
  tooltip_color: string,
  bg_hover_color: string,
  search_bg_color: string
) {
  let root = document.documentElement;
  root.style.setProperty('--main-bg-color', bg_color);
  root.style.setProperty('--main-txt-color', txt_color);
  root.style.setProperty('--main-border-color', border_color);
  root.style.setProperty('--accent-color', accent_color);
  root.style.setProperty('--tooltip-color', tooltip_color);
  root.style.setProperty('--bg-hover-color', bg_hover_color);
  root.style.setProperty('--search-bg-color', search_bg_color);
}

export function updateTheme(theme = null) {
  const defaultAccentColor = 'rgb(0, 157, 255)';
  const light_theme = 'rgb(255, 255, 255)';
  const dim_theme = 'rgb(21, 32, 43)';
  const black_theme = 'rgb(0, 0, 0)';
  theme = isNil(theme)
    ? {
        bgColor: document.body.style['background-color'],
        accentColor: defaultAccentColor,
      }
    : theme;

  switch (theme.bgColor) {
    case light_theme:
      setTheme(
        '#f5f8fa',
        'black',
        '#e1e8ed',
        theme.accentColor,
        '#666666',
        'rgba(0,0,0,0.05)',
        'rgb(235, 238, 240)'
      );
      break;
    case dim_theme:
      setTheme(
        '#192734',
        'white',
        '#38444d',
        theme.accentColor,
        '#4d6072',
        'rgba(255,255,255,0.05)',
        'rgb(21, 32, 43)'
      );
      break;
    case black_theme:
      setTheme(
        'black',
        'white',
        '#2f3336',
        theme.accentColor,
        '#495a69',
        'rgba(255,255,255,0.05)',
        'rgb(32, 35, 39)'
      );
      break;
    default:
      setTheme(
        '#f5f8fa',
        'black',
        '#e1e8ed',
        theme.accentColor,
        '#666666',
        'rgba(0,0,0,0.05)',
        'rgb(235, 238, 240)'
      );
      break;
  }
}
