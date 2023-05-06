import { ActionIcon, Avatar, Divider, Grid, Group, Stack, Text, Timeline, Button, Badge, Loader } from "@mantine/core";
import { IconWalk, IconCheck, IconAlertTriangle, IconInfoCircle, IconMap, IconListDetails } from "@tabler/icons";
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

export const RouteExposition = ({ route, exposition, options }: { route: any, exposition: any, options?: { hideRunsButton?: boolean, disableMap?: boolean } }) => {
    const [mapView, setMapView] = useState(false)
    const [geoInfo, setGeoInfo] = useState(null)
    const router = useRouter()

    return (<Stack>
        {options?.disableMap ? <></> : <Button variant="outline" leftIcon={!geoInfo || !exposition ? <Loader size="sm" /> : !mapView ? <IconMap /> : <IconListDetails />} onClick={!geoInfo || !exposition ? () => { } : () => setMapView(!mapView)}>
            {!mapView ? "Térkép nézet" : "Idővonal nézet"}
        </Button>}
        {<Timeline active={Infinity}>
            {exposition.map((item: any, index: any) => (<Timeline.Item lineVariant={item.action === "átszállás" ? "dashed" : "solid"} key={index} bullet={<ActionBullet muvelet={item.action} network={item.network!} />}>
                <Stack spacing={0}>
                    <ExpositionBody item={item} options={options} />
                </Stack>
            </Timeline.Item>))}
        </Timeline>
        }
    </Stack>)
}

export const ExpositionBody = ({ item, options, onClick }: { item: any, options?: { hideRunsButton?: boolean }, onClick?: any }) => {
    const router = useRouter()
    const [cookies] = useCookies(["discount-percentage"])

    return (<>
        <Group onClick={onClick} spacing={0} position="apart">
            <Stack spacing={0}>
                <Text>{item.station}</Text>
                <Group spacing="xs" position="left">
                    <Text size="xl" my={-2}>{item.time}</Text>
                    {!item.departurePlatform ? <></> : <Avatar variant="outline" radius="xl" size={25}>{item.departurePlatform}</Avatar>}
                </Group>
            </Stack>
            {!item.runsData || options?.hideRunsButton ? <></> :
                <ActionIcon>
                    <IconInfoCircle />
                </ActionIcon>
            }
        </Group>
        {!item.provider || !item.runId || !item.network ? <></> : <Group spacing="xs">
            <ColoredStopIcon stroke={1.5} network={item.network} />
            <Text size="sm">{item.provider}</Text>
            <Text size="sm">{item.runId}</Text>
        </Group>}
        {!item.fare || !item.distance || !item.duration ? <></> :
            <Group spacing={10}>
                {item.fare < 0 ? <></> : <Text suppressHydrationWarning size="sm">{currency.format(calcDisc(item.fare, cookies["discount-percentage"]))}</Text>}
                <Text size="sm">{item.distance} km</Text>
                <Text size="sm">{item.duration} perc</Text>
            </Group>
        }
        {!item.stations ? <></> : <Text size="sm">{item.stations}</Text>}
        {!item.operates ? <></> : <Text size="sm">Közlekedik: {item.operates}</Text>}
        {!item.timeForTransfer ? <></> :
            <Text size="sm">{item.timeForTransfer}</Text>}
    </>)
}