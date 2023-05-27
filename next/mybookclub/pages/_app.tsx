import '../styles/globals.css';
import '../styles/main.scss';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import type { AppProps } from 'next/app';

import { AuthProvider } from '@/providers/AuthProvider';
import { Provider } from 'react-redux';
import { persistor, store } from '@/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import '@/utils/firebase';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>
            <Component {...pageProps} />
            <ToastContainer />
          </AuthProvider>
        </PersistGate>
      </Provider>
    </>
  );
}
