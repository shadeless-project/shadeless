import React from 'react'
import ReactDOM from 'react-dom/client'
import theme from './theme/index';
import { ChakraProvider } from '@chakra-ui/react'
import Routes from './pages/routes';
import { checkLogin } from './libs/apis/auth';
import Login from './pages/auth/Login';
import NotUp from './pages/NotUp';
import './theme/index.css';

async function main() {
  const domRoot = document.getElementById('root') as HTMLElement;
  try {
    const isAuth = await checkLogin();
    if (isAuth.statusCode === 200) {
      ReactDOM.createRoot(domRoot).render(
        <React.StrictMode>
          <ChakraProvider theme={theme}>
            <Routes />
          </ChakraProvider>
        </React.StrictMode>
      )
    } else {
      ReactDOM.createRoot(domRoot).render(
        <React.StrictMode>
          <ChakraProvider theme={theme}>
            <Login />
          </ChakraProvider>
        </React.StrictMode>
      )
    }
  } catch (err) {
    ReactDOM.createRoot(domRoot).render(
      <React.StrictMode>
        <ChakraProvider theme={theme}>
          <NotUp />
        </ChakraProvider>
      </React.StrictMode>
    )
  }
}

main();
