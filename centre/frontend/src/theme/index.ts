import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config : ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};
const colors = {
  custom: {
    'white': 'rgb(255, 255, 255)',
    'primary': 'rgb(97, 91, 194)',
    'focus-primary': '#E3E2F6',
    'hover-primary': '#F4F3FC',
    'hover-grey': 'rgb(249, 249, 249)',
    'grey': 'rgb(244, 244, 244)',
    'focus-grey': 'rgb(230, 230, 230)',
    'black': 'rgb(10, 10, 10)',
    'orange': '#F7B155',
  },
};
const fonts = {
  heading: '',
  body: '',
};
const theme = extendTheme({ colors, config, fonts });

export default theme;
