import '../styles/globals.css';
import '../styles/main.scss';
import 'react-toastify/dist/ReactToastify.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ToastContainer } from 'react-toastify';
import type { AppProps } from 'next/app';

import { AuthProvider } from '@/providers/AuthProvider';
import { Provider } from 'react-redux';
import { persistor, store } from '@/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import '@/utils/firebase';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';

export default function MyApp({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    typography: {
      fontFamily: 'Como',
    },
    palette: {
      primary: {
        main: '#0b074a',
      },
    },
  });

  return (
    <>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider theme={theme}>
            <PersistGate loading={null} persistor={persistor}>
              <AuthProvider>
                <Component {...pageProps} />
                <ToastContainer />
              </AuthProvider>
            </PersistGate>
          </ThemeProvider>
        </LocalizationProvider>
      </Provider>
    </>
  );
}
