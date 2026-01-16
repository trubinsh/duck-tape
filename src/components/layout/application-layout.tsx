import { AppShell, Group, Text, ScrollArea, NavLink, ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';

function ThemeControl() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="default"
      size="lg"
      aria-label="Toggle color scheme"
    >
      {computedColorScheme === 'light' ? (
        <IconMoon stroke={1.5} />
      ) : (
        <IconSun stroke={1.5} />
      )}
    </ActionIcon>
  );
}

export function ApplicationLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm' }}
      aside={{ width: 300, breakpoint: 'md' }}
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
          <Text fw={700} component={Link} to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            DevTools
          </Text>
          <ThemeControl />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section>
          <Text fw={500} mb="xs">Tools</Text>
        </AppShell.Section>
        <AppShell.Section grow component={ScrollArea}>
          <NavLink
            component={Link}
            to="/decoder-encoder"
            label="Decoder/Encoder"
            active={location.pathname === '/decoder-encoder'}
          />
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
