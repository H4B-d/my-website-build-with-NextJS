// pages/_app.jsx
import "../src/index.css"; 
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Ha Bao personal website</title>      {/* Title tab */}
        <link rel="icon" href="/logo.png" />     {/* Favicon */}
      </Head>
      <Component {...pageProps} />
    </>
  );
}