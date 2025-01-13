import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { Analytics } from '@vercel/analytics/next';
import "@/styles/globals.css";

import theme from '../theme/themeConfig.js';

function App({ Component, pageProps }) {

  useEffect(() => {
    // const setupVConsole = async () => {
    //   const VConsole = (await import('vconsole')).default
    //   new VConsole()
    // }
    // setupVConsole()
  }, [])

  return (
    <ConfigProvider theme={theme}>
      <Component {...pageProps} />
      <Analytics />
    </ConfigProvider>
  );
}

export default App;