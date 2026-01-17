import {
  ActionIcon,
  AppShell,
  Autocomplete,
  Group, Kbd,
  NavLink,
  ScrollArea,
  Text,
  useComputedColorScheme,
  useMantineColorScheme
} from '@mantine/core';
import {IconMoon, IconSun} from '@tabler/icons-react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {tools} from "@/lib/utils.ts";
import {useEffect, useRef, useState} from "react";
import {useDisclosure, useHotkeys} from "@mantine/hooks";
import * as React from "react";
import {loadSettings, saveSettings} from "@/lib/settings.ts";

function ThemeControl() {
  const {setColorScheme} = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {getInitialValueInEffect: true});

  const toggleColorScheme = () => {
    const newScheme = computedColorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(newScheme);
    saveSettings({ theme: newScheme });
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

export function ApplicationLayout({children}: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate()
  const [chosenTool, setChosenTool] = useState<string>("")
  const searchHotkey = (<><Kbd size={"xs"}>ctrl</Kbd><div>+</div><Kbd size={"xs"}>K</Kbd></>)
  const searchFieldRef = useRef<HTMLInputElement>(null)
  const [searchFieldDropdownOpened, { open, close }] = useDisclosure();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const settings = loadSettings();
    if (settings.lastPage && settings.lastPage !== location.pathname && location.pathname === '/') {
      navigate(settings.lastPage, { replace: true });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsInitialized(true);
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (isInitialized) {
      saveSettings({ lastPage: location.pathname });
    }
  }, [location.pathname, isInitialized]);

  useHotkeys([["ctrl+K", () => {
    if(searchFieldRef != null && searchFieldRef.current != null) {
      setChosenTool("")
      open()
      searchFieldRef.current.focus()
    }
  }]], [])

  const onChosenToolSubmit = (value: string) => {
    const tool = tools.find(t => t.name === value)
    if (!tool) return
    navigate(tool.redirectUrl)
    close()
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
            DevTools
          </Text>
          <ThemeControl/>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section>
          <Autocomplete mb="xs" selectFirstOptionOnChange ref={searchFieldRef}
                        data={tools.map((tool) => tool.name)}
                        onClick={open}
                        placeholder={"Search"}
                        rightSection={searchHotkey}
                        rightSectionWidth={80}
                        rightSectionPointerEvents="none"
                        value={chosenTool}
                        dropdownOpened={searchFieldDropdownOpened}
                        onOptionSubmit={onChosenToolSubmit}
                        onChange={setChosenTool}/>
        </AppShell.Section>
        <AppShell.Section grow component={ScrollArea}>
          {
            tools.map((tool) => (
              <NavLink
                key={tool.redirectUrl}
                component={Link}
                to={tool.redirectUrl}
                label={tool.name}
                active={location.pathname === tool.redirectUrl}
              />
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

      <AppShell.Aside p="md">
        <Text fw={500}>Aside</Text>
        <ScrollArea>
        </ScrollArea>
      </AppShell.Aside>
    </AppShell>
  );
}
