import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config : ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};
const colors = {
  background: {
    'primary-black': '#0B2B5A',
    'primary-active': 'rgb(37, 150, 190)',
    // 'primary-yellow': '#8C8E53',
    // 'primary-green': '#175020',
    'primary-white': 'rgb(255, 255, 255)',
    'primary-grey': 'var(--bg-grey)',
    'focus-grey': 'rgb(230, 230, 230)',
    'focus-orange': 'DarkMagenta',
    // 'focus-white': 'GhostWhite',
    // 'focus-black': 'black',
  },
};
const fonts = {
  heading: '',
  body: '',
};
const theme = extendTheme({ colors, config, fonts });

export default theme;
