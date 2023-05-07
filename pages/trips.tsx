import type { NextPage } from "next"
import { apiCall } from "../components/api"
import { PageHeading } from "../components/page"
import { IconCalendar, IconCalendarEvent, IconClock, IconLine, IconShare } from "@tabler/icons"
import { Accordion, ActionIcon, Group, Loader, Skeleton, Slider, Text, Timeline, Stack, Space } from "@mantine/core"
import { useMyAccordion } from "../components/styles"
import { ActionBullet, RouteExposition, RouteSummary } from "../components/routes"
import { createContext, memo, useContext, useEffect, useState } from "react"
import { yahoo, office365, google, ics, outlook, CalendarEvent } from "calendar-link";
import { useRouter } from "next/router"
import { useCookies } from "react-cookie"
import { getDateString, getDayName } from "@/functions"

const AccordionControl = createContext<any[]>([undefined, () => { }])

const cal = (service: number, body: any) => {
    window.open((() => {
        switch (service) {
            case 1:
                return google(body)
            case 2:
                return outlook(body)
            case 3:
                return office365(body)
            case 4:
                return yahoo(body)
            case 5:
            default:
                return ics(body)
        }
    })(), "_blank")
}

const Route = ({ route, val }: { route: any, val: any }) => {
    const router = useRouter()
    const [body, setBody] = useState<any>({})
    const [cookies, setCookies] = useCookies(['calendar-service'])
    const [value, setVal] = useContext(AccordionControl)
    const [image, setImage] = useState<File | undefined>(undefined)

    useEffect(() => {
        if (route && !Object.keys(body).length) {
            const start = new Date(`${router.query['d'] || getDateString(new Date())} ${route.start_departure}`)
            const end = new Date(`${router.query['d'] || getDateString(new Date())} ${route.end_arrival}`)
            let details: string[] = []
            details.push(`Indulás: ${route.start_departure} - ${route.departure_stop}`)
            details.push(`Érkezés: ${route.end_arrival} - ${route.arrival_stop}`)
            details.push(`Vonat: ${route.trip_headsign ? route.trip_headsign + ' ' : ''}${route.route_short_name ? route.route_short_name + ' ' : ''}${route.route_long_name ? route.route_long_name : ''}`)
            details.push(`Távolság: ${route.distance}km`)
            details.push(`Időtartam: ${route.travel_time}`)

            setBody({
                start,
                end,
                description: `${details.join("\n")}`,
                location: `${route.departure_stop} vasútállomás`,
                title: `${route.departure_stop} - ${route.arrival_stop}`
            })
        }
    }, [body, route])

    useEffect(() => {
        (async () => {
            if (value === val && !image) {
                const id = Date.now().toString()
                const image = `/api/render?id=${route.trip_id}`
                const blob = await (await fetch(image)).blob()
                setImage(new File([blob], `menetrendek-${id}.jpeg`, { type: "image/jpeg" }))
            }
        })()
    }, [value])

    return (<Accordion.Item my="sm" value={val}>
        <Accordion.Control>
            <RouteSummary item={route} />
        </Accordion.Control>
        <Accordion.Panel>
            <RouteExposition route={route} />
            <Group spacing="sm" position="right" mt={-12}>
                {!body ? <></> :
                    <ActionIcon onClick={() => cal(Number(cookies['calendar-service']), body)}>
                        <IconCalendarEvent />
                    </ActionIcon>}
                {!image ? <Loader size={24} /> : <ActionIcon onClick={() => {
                    navigator.share({ files: [image], url: `https://menetrendek.info/trip?id=${route.trip_id}`, "title": body?.title })
                }}>
                    <IconShare />
                </ActionIcon>}
            </Group>
        </Accordion.Panel>
    </Accordion.Item>)
}

const Routes: NextPage = (props: any) => {
    const { classes, theme } = useMyAccordion()
    const [val, setVal] = useState<any>(undefined)

    return (<>
        <PageHeading title="Járatok" subtitle={`Járatok ${props.routes[0].departure_stop} és ${props.routes[0].arrival_stop} között`} icon={IconLine} />
        <AccordionControl.Provider value={[val, setVal]}>
            <Accordion value={val} onChange={setVal} classNames={classes}>
                {props.routes.map((route: any, i: number) => {
                    return (<Route key={i} val={i.toString()} route={route} />)
                })}
            </Accordion>
        </AccordionControl.Provider>
    </>)

}

Routes.getInitialProps = async (ctx: any) => {
    return {
        routes: await apiCall("GET", `https://api.menetrendek.info/trips/${ctx.query.d}/${ctx.query.from}/${ctx.query.to}`)
    }
}

export default Routes