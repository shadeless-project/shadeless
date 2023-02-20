import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config : ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};
const colors = {
  custom: {
    'white': 'rgb(255, 255, 255)',
    'grey': 'rgb(244, 244, 244)',
    'primary': 'rgb(97, 91, 194);',
    'focus-grey': 'rgb(230, 230, 230)',
    'black': 'rgb(10, 10, 10)',
  },
};
const fonts = {
  heading: '',
  body: '',
};
const theme = extendTheme({ colors, config, fonts });

export default theme;
