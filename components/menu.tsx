import { Grid, Button, useMantineTheme, createStyles } from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import { IconSearch } from "@tabler/icons"
import { useState } from "react";
import Link from "next/link"
import { useRouter } from "next/router"
import { StopInput } from "./stops";

export const Search = () => {
    const theme = useMantineTheme()
    const [searchHref, setSearchHref] = useState<string>("#")
    const router = useRouter()

    return (<Grid>
        <Grid.Col sm={6} span={12}>
            <StopInput variant='from' />
        </Grid.Col>
        <Grid.Col sm={6} span={12}>
            <StopInput variant='to' />
        </Grid.Col>
    </Grid>)
}