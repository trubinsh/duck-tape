import svgLogo from '@/assets/logo.svg';
import {
  ActionIcon,
  AppShell, Box,
  Container,
  Divider,
  Grid,
  Group, Image,
  NavLink,
  ScrollArea,
  Switch, Text,
  Title,
  useComputedColorScheme,
  useMantineColorScheme
} from '@mantine/core';
import {IconMoon, IconSun} from '@tabler/icons-react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {isToolGroup, tools, useBrowser, useTitle} from "@/lib/utils.ts";
import * as React from "react";
import {type BaseSyntheticEvent, useEffect, useState} from "react";
import {loadSettings, saveSettings} from "@/lib/settings.ts";
import {useClipboardAwareContext} from "@/lib/clipboard-aware-context.ts";
import {SearchAutocomplete} from "@/components/search-autocomplete.tsx";

function ThemeControl() {
  const {setColorScheme} = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {getInitialValueInEffect: true});

  const toggleColorScheme = () => {
    const newScheme = computedColorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(newScheme);
    saveSettings({theme: newScheme});
  };

  return (
    <ActionIcon
      onClick={toggleColorScheme}
      variant="default"
      size="lg"
      aria-label="Toggle color scheme"
    >
      {computedColorScheme === 'light' ? (
        <IconMoon stroke={1.5}/>
      ) : (
        <IconSun stroke={1.5}/>
      )}
    </ActionIcon>
  );
}

export function ApplicationLayout({children}: {
  children: React.ReactNode
}) {
  const settings = loadSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const browser = useBrowser();
  const {content: titleContent, title} = useTitle();
  const {
    enableClipboardAware,
    setEnableClipboardAware
  } = useClipboardAwareContext()

  useEffect(() => {
    setEnableClipboardAware(settings.smartSearchEnabled)
  }, [setEnableClipboardAware, settings.smartSearchEnabled]);

  useEffect(() => {
    if (settings.lastPage && settings.lastPage !== location.pathname && location.pathname === '/') {
      navigate(settings.lastPage, {replace: true});
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsInitialized(true);
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (isInitialized) {
      saveSettings({lastPage: location.pathname});
    }
  }, [location.pathname, isInitialized]);

  const handleSmartSearchToggle = (e: BaseSyntheticEvent) => {
    setEnableClipboardAware(e.currentTarget.checked)
    saveSettings({smartSearchEnabled: e.currentTarget.checked})
  }

  return (
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
          <Box >
            <Image src={svgLogo}  w={70} h={60}/>
            <Text gradient={{from: 'grey', to:'orange', deg: 90}} variant={'gradient'} size={'xl'}>DuckTape</Text>
          </Box>
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
          <Group gap={"md"}>
            <ThemeControl/>
            {
              // SmartSearch not supported on Safari yet. Safari has a lockdown on read from clipboard only for user-specific actions, Clipboard API does not allow direct reads
              browser !== "Safari" && <Switch checked={enableClipboardAware}
                                              onChange={handleSmartSearchToggle}
                                              label={"Smart Search"}></Switch>
            }
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
        <Container fluid mt={"xs"} ml={0} mr="auto" style={{ width: '85%', display: 'flex', flexDirection: 'column', flex: 1, padding: 0 }}>
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
