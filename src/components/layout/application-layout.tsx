import svgLogo from '@/assets/logo.svg';
import {
  ActionIcon,
  AppShell,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  NavLink,
  ScrollArea,
  Text,
  Title,
} from '@mantine/core';
import {IconSettings} from '@tabler/icons-react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {isToolGroup, tools, useTitle} from "@/lib/utils.ts";
import * as React from "react";
import {useEffect, useState} from "react";
import {useSettings} from "@/lib/settings.ts";
import {SearchAutocomplete} from "@/components/search-autocomplete.tsx";
import {useDisclosure} from "@mantine/hooks";
import {UserSettingsModal} from "@/components/user-settings.tsx";

export function ApplicationLayout({children}: {
  children: React.ReactNode
}) {
  const {settings, updateSettings} = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const {content: titleContent, title} = useTitle();
  const [opened, {open, close}] = useDisclosure(false);

  useEffect(() => {
    if (settings.lastPage && settings.lastPage !== location.pathname && location.pathname === '/') {
      navigate(settings.lastPage, {replace: true});
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsInitialized(true);
  }, [location.pathname, navigate, settings.lastPage]);

  useEffect(() => {
    if (isInitialized) {
      updateSettings({lastPage: location.pathname});
    }
  }, [location.pathname, isInitialized, updateSettings]);

  return (
    <>
      <AppShell
        navbar={{width: 300, breakpoint: 'sm'}}
        padding="md"
        styles={{
          main: {
            backgroundColor: 'var(--mantine-color-body)',
          },
          navbar: {
            backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))',
          },
          aside: {
            backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))',
          },
          header: {
            backgroundColor: 'var(--mantine-color-body)',
          },
        }}
      >
        <AppShell.Navbar p="md">
          <AppShell.Section>
            <Text gradient={{from: 'grey', to: 'orange', deg: 90}}
                  variant={'gradient'} size={'xl'}>
              <Image src={svgLogo} w={75} h={60}/>
              DuckTape
            </Text>
          </AppShell.Section>
          <Divider mt={"md"} mb={"md"}/>
          <AppShell.Section>
            <SearchAutocomplete/>
          </AppShell.Section>
          <AppShell.Section grow component={ScrollArea}>
            {
              tools.map((tool) => {
                if (isToolGroup(tool)) {
                  return (
                    <NavLink
                      key={tool.group}
                      label={tool.group}
                      childrenOffset={28}
                      defaultOpened
                    >
                      {
                        tool.tools.map(t => (
                          <NavLink label={`${t.name}`}
                                   key={`${t.name}-${t.redirectUrl}`}
                                   component={Link}
                                   to={t.redirectUrl}/>
                        ))
                      }
                    </NavLink>
                  )
                } else {
                  return <NavLink
                    key={tool.redirectUrl}
                    to={tool.redirectUrl!}
                    component={Link}
                    label={tool.name}
                    childrenOffset={28}
                    defaultOpened
                  />
                }
              })
            }
          </AppShell.Section>
          <AppShell.Section>
            <Divider mb={"md"} mt={"md"}/>
            <Group gap={"md"}>
              <ActionIcon
                onClick={open}
                variant="default"
                size="lg"
                aria-label="Open settings"
              >
                <IconSettings/>
              </ActionIcon>
            </Group>
          </AppShell.Section>
        </AppShell.Navbar>

        <AppShell.Main style={{display: 'flex', flexDirection: 'column'}}>
          <Divider/>
          <Grid m={"md"}>
            <Grid.Col span={3}>
              <Title order={4}>{title}</Title>
            </Grid.Col>
            <Grid.Col span={9}>
              <Group justify={"flex-end"}>
                {titleContent}
              </Group>
            </Grid.Col>
          </Grid>
          <Divider/>
          <Container fluid mt={"xs"} ml={0} mr="auto" style={{
            width: '85%',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: 0
          }}>
            {children}
          </Container>
        </AppShell.Main>
      </AppShell>
      <UserSettingsModal isOpen={opened} onClose={close}/>
    </>
  );
}
