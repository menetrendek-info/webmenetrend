import type { NextPage } from "next"
import { apiCall } from "../components/api"
import { PageHeading } from "../components/page"
import { IconCalendarEvent, IconClock, IconLine, IconShare } from "@tabler/icons"
import { Accordion, ActionIcon, Group, Loader, Skeleton, Slider, Text, Timeline, Stack, Space } from "@mantine/core"
import { useMyAccordion } from "../components/styles"
import { ActionBullet, RouteExposition, RouteSummary } from "../components/routes"
import { memo, useEffect, useState } from "react"
import { yahoo, office365, google, ics, outlook, CalendarEvent } from "calendar-link";
import { useRouter } from "next/router"
import { useCookies } from "react-cookie"

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

const Routes: NextPage = (props: any) => {
    const { classes, theme } = useMyAccordion()
    const [cookies] = useCookies(["use-route-limit", "route-limit"])
    const [sliderVal, setSliderVal] = useState<number | undefined>()
    const router = useRouter()

    return (<>
        <PageHeading title="Járatok" subtitle={`Járatok ${props.routes[0].departure_stop} és ${props.routes[0].arrival_stop} között`} icon={IconLine} />
        <Accordion classNames={classes}>
            {props.routes.map((route: any, i: number) => {
                return (<Accordion.Item my="sm" key={i} value={i.toString()}>
                    <Accordion.Control>
                        <RouteSummary item={route} />
                    </Accordion.Control>
                </Accordion.Item>)
            })}
        </Accordion>
    </>)

}

Routes.getInitialProps = async (ctx: any) => {
    return {
        routes: await apiCall("GET", `https://api.menetrendek.info/routes/${ctx.query.day}/${ctx.query.from}/${ctx.query.to}`)
    }
}

export default Routes