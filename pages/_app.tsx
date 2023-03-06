
import '../styles/globals.css'
import '../styles/nprogress.css'
import '../styles/twemoji.css'

import type { AppProps /*, AppContext */ } from 'next/app'
import Head from 'next/head'
import { SessionProvider } from "next-auth/react"

import NProgress from "nprogress"
import Router from "next/router"

Router.events.on("routeChangeError", NProgress.done);
Router.events.on("routeChangeStart", NProgress.start);
Router.events.on("routeChangeComplete", NProgress.done);

function App({ Component, pageProps: { session, metaTags, ...pageProps } }: AppProps) {
    return (
        <SessionProvider session={session}>
          <Head>
            {metaTags &&
              Object.entries(metaTags).map((entry) => {
                return (
                  <meta key={entry[0] + entry[1]} property={entry[0]} content={entry[1][0]} />
                )
            })}
            <title>Reseda</title>
    		<link rel="icon" href="/assets/icon-purpl.png" />
    		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </Head>
          <Component {...pageProps} />
    	</SessionProvider>
      )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default App
