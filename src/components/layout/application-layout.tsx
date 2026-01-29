import {
  ActionIcon,
  AppShell,
  Group,
  NavLink,
  ScrollArea,
  Switch,
  Text,
  useComputedColorScheme,
  useMantineColorScheme
} from '@mantine/core';
import {IconMoon, IconSun} from '@tabler/icons-react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {tools, useBrowser} from "@/lib/utils.ts";
import * as React from "react";
import {type BaseSyntheticEvent, useEffect, useState} from "react";
import {loadSettings, saveSettings} from "@/lib/settings.ts";
import {useClipboardAwareContext} from "@/lib/clipboard-aware-context.ts";
import {SearchAutocomplete} from "@/components/search-autocomplete.tsx";
import {useAside} from "@/components/aside-context.tsx";

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

export function ApplicationLayout({children, title = "DevTools"}: {
  children: React.ReactNode,
  title?: string
}) {
  const settings = loadSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const browser = useBrowser();
  const {enableClipboardAware, setEnableClipboardAware} = useClipboardAwareContext()
  const {content: asideContent} = useAside();

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
      header={{height: 60}}
      navbar={{width: 300, breakpoint: 'sm'}}
      aside={{width: 300, breakpoint: 'md'}}
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
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Text fw={700} component={Link} to="/"
                style={{textDecoration: 'none', color: 'inherit'}}>
            {title}
          </Text>
          <Group gap={"md"}>
            {
              // SmartSearch not supported on Safari yet. Safari has a lockdown on read from clipboard only for user-specific actions, Clipboard API does not allow direct reads
              browser !== "Safari" && <Switch checked={enableClipboardAware}
                                              onChange={handleSmartSearchToggle}
                                              label={"Smart Search"}></Switch>
            }
            <ThemeControl/>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section>
          <SearchAutocomplete/>
        </AppShell.Section>
        <AppShell.Section grow component={ScrollArea}>
          {
            tools.map((tool) => (
              <NavLink
                key={tool.redirectUrl}
                label={tool.group}
                childrenOffset={28}
                defaultOpened
              >
                {
                  tool.formats.map(f => (
                    <NavLink label={`${f} ${tool.group}`} key={`${f}-${tool.redirectUrl}`} component={Link} to={`${tool.redirectUrl}?format=${f}`}/>
                  ))
                }
              </NavLink>
            ))
          }
        </AppShell.Section>
        <AppShell.Section>
          <Text fw={500}>Navbar Footer</Text>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>

      {
        asideContent &&
          <AppShell.Aside p="md">
            {asideContent}
          </AppShell.Aside>
      }
    </AppShell>
  );
}
