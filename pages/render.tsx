import { Box, Center, Group, MantineProvider, Paper, Space, Text } from "@mantine/core";
import { IconLink } from "@tabler/icons";
import type { NextPage } from "next";
import { apiCall, getHost } from "../components/api";
import { RouteExposition, RouteSummary } from "../components/routes";
import React from "react";

const Render: NextPage = (props: any) => {
    const { route, exposition } = props

    return (<MantineProvider withGlobalStyles withNormalizeCSS theme={{
        colorScheme: 'dark',
        primaryColor: 'indigo',
        primaryShade: 7,
        fontFamily: 'Sora, sans-serif',
        fontSizes: {
            "xs": '18px',
            "sm": '20px',
            "md": '22px',
            "lg": '24px',
            "xl": '26px',
        }
    }}>
        <Center sx={{ zIndex: 89, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'black' }}>
            <Box id="renderBox" p="md" pb={0} sx={{ zIndex: 90, background: '#25262B', maxWidth: 800, minWidth: 600 }}>
                <Paper p="sm" radius="lg">
                    <RouteSummary item={route} options={{ hideNetworks: true }} />
                    <Space h='md' />
                    <RouteExposition route={route} />
                </Paper>
                <Group py={6} style={{ opacity: .8 }} position="right" spacing={2}>
                    <IconLink size={17} />
                    <Text suppressHydrationWarning size={15}>{typeof window !== 'undefined' && location.origin.split("://")[1]}</Text>
                </Group>
            </Box>
        </Center>
    </MantineProvider>)
}

Render.getInitialProps = async (ctx) => {
    let props: any = {}
    props.route = (await apiCall("GET", `https://api.menetrendek.info/trips/${ctx.query.id}`,))
    return props
}

export default Render;