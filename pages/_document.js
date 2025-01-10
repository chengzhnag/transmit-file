import React from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import Document, { Head, Html, Main, NextScript } from 'next/document';

const MyDocument = () => (
  <Html lang="en">
    <Head>
      <title>Chengzhnag Trans File - 免费跨端文件传输平台</title>
      {/* 页面描述 */}
      <meta
        name="description"
        content="Chengzhnag Trans File 是一款便捷的文件传输平台，专为用户提供跨设备、跨平台的快速文件传输服务。"
      />
      {/* 关键词 */}
      <meta
        name="keywords"
        content="文件传输, 在线文件传输, 跨端传输, 在线跨端传输, 免费文件传输, 在线免费文件传输, 文件共享, 在线文件共享, Chengzhnag Trans File"
      />
      {/* 作者 */}
      <meta name="author" content="Chengzhnag" />
      {/* 字符编码 */}
      <meta charSet="UTF-8" />
      {/* 视口设置，适配移动端 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Chengzhnag Trans File - 免费跨端文件传输平台" />
      <meta
        property="og:description"
        content="Chengzhnag Trans File 是一款便捷的文件传输平台，专为用户提供跨设备、跨平台的快速文件传输服务。"
      />
      <meta
        name="og:keywords"
        content="文件传输, 在线文件传输, 跨端传输, 在线跨端传输, 免费文件传输, 在线免费文件传输, 文件共享, 在线文件共享, Chengzhnag Trans File"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://a.952737.xyz" />
      <meta property="og:site_name" content="Chengzhnag Trans File" />
      <link rel="icon" href="/favicon.ico" />
      <meta name="google-site-verification" content="GWERX3_br4Kd-DNDS6AtM-9H53fdN6vZBumiC6nsqGU" />
      <meta name="baidu-site-verification" content="codeva-JLkk2SFISm" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

MyDocument.getInitialProps = async (ctx) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => (
        <StyleProvider cache={cache}>
          <App {...props} />
        </StyleProvider>
      ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  const style = extractStyle(cache, true);
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </>
    ),
  };
};

export default MyDocument;