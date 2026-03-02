import {
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import {
  IconArrowRight,
  IconArrowsDiff,
  IconBinary,
  IconClock,
  IconCode,
  IconFileCode,
  IconHash,
  IconKey,
  IconRegex,
  IconSettings,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { isToolGroup, tools, useTitle } from '@/lib/utils';
import { useEffect } from 'react';

function getIcon(name: string) {
  const iconProps = { size: 32, stroke: 1.5 };
  if (name.includes('JSON')) return <IconFileCode {...iconProps} />;
  if (name.includes('XML')) return <IconCode {...iconProps} />;
  if (name.includes('HTML')) return <IconCode {...iconProps} />;
  if (name.includes('Base64')) return <IconBinary {...iconProps} />;
  if (name.includes('URL')) return <IconArrowRight {...iconProps} />;
  if (name.includes('JWT')) return <IconKey {...iconProps} />;
  if (name.includes('Diff')) return <IconArrowsDiff {...iconProps} />;
  if (name.includes('Password')) return <IconKey {...iconProps} />;
  if (name.includes('UUID')) return <IconHash {...iconProps} />;
  if (name.includes('Regex')) return <IconRegex {...iconProps} />;
  if (name.includes('Timestamp')) return <IconClock {...iconProps} />;
  return <IconSettings {...iconProps} />;
}

export function Home() {
  const { setTitle } = useTitle();
  const theme = useMantineTheme();

  useEffect(() => {
    setTitle('');
  }, [setTitle]);

  const allTools = tools.flatMap((item) => {
    if (isToolGroup(item)) {
      return item.tools.map((t) => ({ ...t, group: item.group }));
    }
    return [{ ...item, group: 'General' }];
  });

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Stack gap="xs">
          <Title order={1}>Welcome to DuckTape</Title>
          <Text c="dimmed" size="lg">
            Your all-in-one client-side developer toolkit. Fast, private, and powerful.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {allTools.map((tool) => (
            <UnstyledButton
              key={tool.name}
              component={Link}
              to={tool.redirectUrl}
              style={{ height: '100%' }}
            >
              <Card
                withBorder
                padding="lg"
                radius="md"
                className="tool-card"
                style={{
                  height: '100%',
                  transition: 'transform 200ms ease, box-shadow 200ms ease',
                }}
              >
                <Group justify="space-between" mb="xs">
                  <div
                    style={{
                      backgroundColor: theme.colors.indigo[0],
                      color: theme.colors.indigo[7],
                      padding: theme.spacing.xs,
                      borderRadius: theme.radius.md,
                    }}
                  >
                    {getIcon(tool.name)}
                  </div>
                  <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                    {tool.group}
                  </Text>
                </Group>
                <Text fw={700} size="lg" mb="xs">
                  {tool.name}
                </Text>
                <Text size="sm" c="dimmed">
                  {tool.name} tool for developers. No data ever leaves your browser.
                </Text>
              </Card>
            </UnstyledButton>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
