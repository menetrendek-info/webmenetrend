import { forwardRef, useState } from "react";
import { Autocomplete, Group, ScrollArea, SelectItemProps, Text } from "@mantine/core/";
import { IconQuestionMark, IconArrowBarRight, IconArrowBarToRight } from "@tabler/icons";
import { useLocalStorage } from "@mantine/hooks";

export interface Stop {
    value?: string
    network?: number;
    id: number;
}

const Dropdown = ({ children, ...props }: any) => {
    return (<ScrollArea
        sx={{
            maxHeight: '25vh',
            width: '100%',
        }}>
        {children}
    </ScrollArea>)
}

// eslint-disable-next-line react/display-name
const AutoCompleteItem = forwardRef<HTMLDivElement, SelectItemProps & Stop>(
    ({ value, network, id, ...others }: SelectItemProps & Stop, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap align="left">
                <div style={{ zIndex: '99 !important' }}>
                    <IconQuestionMark/>
                </div>
                <div>
                    <Text sx={{ wordWrap: 'break-word', whitespace: 'pre-wrap' }}>{value}</Text>
                </div>
            </Group>
        </div >
    )
);

export const StopInput = ({ variant }: { variant: "from" | "to" }) => {
    const [data, setData] = useState<Array<Stop & any>>([])
    const [stops, setStops] = useLocalStorage<Array<Stop>>({ key: 'frequent-stops', defaultValue: [] })
    const [loading, setLoading] = useState(false)

    return (<Autocomplete
        icon={variant == 'from' ? <IconArrowBarRight /> : <IconArrowBarToRight />}
        placeholder={variant == 'from' ? 'Honnan?' : 'Hova?'}
        data={data}
        switchDirectionOnFlip={false}
        filter={() => true}
        dropdownComponent={Dropdown}
        styles={(theme) => ({
            dropdown: {
                background: '#1A1B1E',
                borderRadius: theme.radius.md
            }
        })}
        size="md"
        autoComplete="off"
        limit={Infinity}
        sx={(theme) => ({ borderBottom: `2px solid ${theme.colors.gray[8]}` })}
        itemComponent={AutoCompleteItem}
        variant="unstyled"
    />)
}