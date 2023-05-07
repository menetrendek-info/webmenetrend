import { ActionIcon, Avatar, Divider, Grid, Group, Stack, Text, Timeline, Button, Badge, Loader, Card } from "@mantine/core";
import { IconWalk, IconCheck, IconArrowBarToRight, IconInfoCircle, IconMap, IconListDetails, IconArrowBarToLeft, IconTrain } from "@tabler/icons";
import Link from "next/link"
import { useRouter } from "next/router"
import useColors from "./colors"
import { ColoredStopIcon, StopIcon } from "../components/stops"
import { memo, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useMediaQuery } from "@mantine/hooks";
import dynamic from "next/dynamic"
import { apiCall } from "./api";

export const calcDisc = (fee: number, discount?: number) => {
    return discount ? Math.abs(fee - (fee * (discount / 100))) : fee
}

export const currency = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0, minimumFractionDigits: 0 })
function onlyUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
}

export const ActionBullet = memo(({ muvelet, network, size, ...props }: { muvelet: "átszállás" | "leszállás" | "felszállás", network?: number, size?: number }) => {
    if (!size) { size = 20 }
    switch (muvelet) {
        case 'átszállás':
            return <IconWalk size={size} />
        case 'leszállás':
            return <IconCheck size={size} />
        default:
            return <StopIcon size={size} network={network!} />
    }
})

export const RouteSummary = memo(({ item, options }: { item: any, options?: { hideNetworks?: boolean } }) => {
    const { warning } = useColors()
    const [cookies] = useCookies(["discount-percentage"])
    const breakPoint = useMediaQuery("(max-width: 600px)")
    return (<Stack sx={{ position: 'relative' }} spacing={0}>
        <Grid>
            <Grid.Col sx={{ position: 'relative' }} span="auto">
                <Text align="center" size="xl">{item.start_departure}</Text>
                <Text align="center" size="sm">{item.departure_stop}</Text>
            </Grid.Col>
            <Grid.Col span="auto" sx={{ position: 'relative' }}>
                <Text align="center" size="xl">{item.end_arrival}</Text>
                <Text align="center" size="sm">{item.arrival_stop}</Text>
            </Grid.Col>
        </Grid>
        <Divider size="lg" my={6} />
        <Group position="center" spacing='sm'>
            <Text size="sm">{item.travel_time}</Text>
            <Text size="sm">{item.distance}km</Text>
            {item.route_short_name ? <Badge size="sm" styles={(theme) => ({ root: { backgroundColor: `${theme.fn.rgba('#' + item.route_color, .4)}` } })}>{item.route_short_name}</Badge> : <></>}
        </Group>
    </Stack>)
})

export const RouteExposition = ({ route, options }: { route: any, options?: { hideRunsButton?: boolean, disableMap?: boolean } }) => {
    const [mapView, setMapView] = useState(false)
    const [geoInfo, setGeoInfo] = useState(null)
    const router = useRouter()

    return (<Stack>
        {<Timeline active={Infinity} bulletSize={22}>
            <Timeline.Item bullet={<IconTrain />}>
                <Stack spacing={0}>
                    <Group spacing={4}>
                        <IconArrowBarToRight size={25} />
                        <Text size={25} weight={500}>{route.start_departure}</Text>
                    </Group>
                    <Text size="xl">
                        {route.departure_stop}
                    </Text>
                    <Group spacing={4}>
                        {route.trip_headsign ? <Text size="sm">{route.trip_headsign}</Text> : <></>}
                        {route.route_long_name ? <Text size="sm">{route.route_long_name}</Text> : <></>}
                    </Group>
                </Stack>
            </Timeline.Item>
            <Timeline.Item bullet={<IconCheck />}>
                <Stack spacing={0}>
                    <Group spacing={4}>
                        <IconArrowBarToLeft size={25} />
                        <Text size={25} weight={500}>{route.end_arrival}</Text>
                    </Group>
                    <Text size="xl">
                        {route.arrival_stop}
                    </Text>
                </Stack>
            </Timeline.Item>
        </Timeline>
        }
    </Stack>)
}