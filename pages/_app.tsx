import { AppProps } from 'next/app';
import Head from 'next/head';
import { Box, Container, LoadingOverlay, MantineProvider } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { NavbarMinimal } from '@/components/nav';
import { IconInfoCircle, IconRoadSign, IconSettings } from '@tabler/icons';
import { useState } from 'react';
import "@/styles/globals.css"

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const mobileBreakpoint = useMediaQuery("(max-width: 600px)")
  const [pageLoading, setPageLoading] = useState(false)

  return (
    <>
      <Head>
        <title>Menetrendek</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'dark',
          primaryColor: 'indigo',
          primaryShade: 7,
          fontFamily: 'Sora, sans-serif',
        }}
      >
        <NavbarMinimal doBreak={mobileBreakpoint} data={[
          {
            icon: IconRoadSign,
            label: 'Útvonal tervezés',
            href: '/',
          },
          {
            icon: IconInfoCircle,
            label: 'Rólunk',
            href: '/about',
          },
          {
            icon: IconSettings,
            label: 'Beállítások',
            href: '/settings',
          }
        ]} />
        <div className='bg' style={{ backgroundImage: 'url("/api/img/bg.jpg?s=2000")' }} />
        <Box ml={mobileBreakpoint ? 0 : 80} mb={mobileBreakpoint ? 80 : 0} pt="xl" sx={{ position: "relative", minHeight: !mobileBreakpoint ? '100vh' : 'calc(100vh - 80px)', width: mobileBreakpoint ? '100%' : 'calc(100% - 80px)' }}>
          <LoadingOverlay overlayOpacity={.5} loaderProps={{ size: "lg" }} style={{ zIndex: '99 !import', width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }} visible={pageLoading} />
          <Container p="lg" pt="xl">
            <Component {...pageProps} />
          </Container>
        </Box>
      </MantineProvider>
    </>
  );
}