import {
    Navbar,
    Center,
    UnstyledButton,
    createStyles,
    Stack,
    MantineNumberSize,
    Group,
    Modal,
    Text,
    Button,
} from '@mantine/core';
import { useMediaQuery } from "@mantine/hooks"
import { TablerIcon } from '@tabler/icons';
import { Logo } from './brand';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const useStyles = createStyles((theme) => ({
    link: {
        width: 50,
        height: 50,
        borderRadius: "100%",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
        },
    },

    active: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
            color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
    },
}));

interface NavbarLinkProps {
    icon: TablerIcon;
    label: string;
    href?: string;
    active?: boolean;
    onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, onClick, active, href }: NavbarLinkProps) {
    const { classes, cx } = useStyles();
    const touchScreen = useMediaQuery('(hover: none)');
    const external = href && href.startsWith("http")
    const [open, setOpen] = useState(false)

    return (<>
        {!external ? <></> : <Modal size="lg" title={`Tovább ide: ${(new URL(href)).origin.split("://")[1]}`} opened={open} onClose={() => setOpen(false)}>
            <Text>
                Egy külső weboldalra készülsz átmenni. Az oldalunk nem felelős a külső weboldalak tartalmáért vagy biztonságáért. Folytatod?
            </Text>
            <Group pt="sm" position='right'>
                <Button onClick={() => setOpen(false)} color='gray'>
                    Nem
                </Button>
                <Button onClick={() => {
                    setOpen(false)
                    window.open(href, "_blank")
                }}>
                    Igen
                </Button>
            </Group>
        </Modal>}
        <Link href={external ? "#" : href || "#"}>
            <UnstyledButton onClick={external ? () => setOpen(true) : onClick} className={cx(classes.link, { [classes.active]: active })}>
                <Icon stroke={1.5} size={30} />
            </UnstyledButton>
        </Link>
    </>);
}

const navSize = 80

const FluidStack = ({ doBreak, children, spacing, p, m }: { doBreak: boolean, children: any, spacing?: MantineNumberSize, p?: MantineNumberSize, m?: MantineNumberSize }) => {
    return (!doBreak ? <Stack p={p} m={m} justify="center" align="center" spacing={spacing}>{children}</Stack> : <Group p={p} m={m} noWrap position="center" align="center" spacing={spacing}>{children}</Group>)
}

export function NavbarMinimal({ data, doBreak }: { data: Array<NavbarLinkProps>, doBreak: boolean }) {
    const router = useRouter()
    if (doBreak && data) {
        let myData = data.slice(1)
        myData.splice(Math.floor(myData.length / 2), 0, data[0])
        data = myData
    }

    const links = data.map((link) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={link.href == router.pathname}
        />
    ));

    return (<>
        <Navbar p={!doBreak ? "md" : undefined} sx={{ position: "fixed", display: "flex", ...(doBreak ? { bottom: 0, alignItems: "center", justifyContent: "center", } : {}) }} height={doBreak ? navSize : "100vh"} width={{ base: !doBreak ? navSize : "100vw" }}>
            <Stack>
                {doBreak ? <></> : <Center>
                    <Logo size={45} />
                </Center>}
                <Navbar.Section grow>
                    <FluidStack doBreak={doBreak} spacing="xs">
                        {links}
                    </FluidStack>
                </Navbar.Section>
            </Stack>
        </Navbar >
    </>);
}