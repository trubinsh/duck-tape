import {ActionIcon, Card, CopyButton, Group, Text, Tooltip} from "@mantine/core";
import {IconCheck, IconCopy} from "@tabler/icons-react";

interface CustomPaperProps {
  children: React.ReactNode;
  title: string;
  value: string;
  fullHeight?: boolean;
}

function CustomPaper({children, title, value, fullHeight}: CustomPaperProps) {
  return (
    <Card withBorder style={{height: fullHeight ? '100%' : 'auto', display: 'flex', flexDirection: 'column'}}>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Text fw={500}>{title}</Text>
          <CopyButton value={value} timeout={2000}>
            {({copied, copy}) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow
                       position="right">
                <ActionIcon color={copied ? 'teal' : 'gray'} variant="light"
                            onClick={copy}>
                  {copied ? <IconCheck size={16}/> : <IconCopy size={16}/>}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      </Card.Section>
      <Card.Section style={{flex: 1, height: fullHeight ? '100%' : 'auto', display: fullHeight ? 'flex' : 'block', flexDirection: 'column'}}>
        {children}
      </Card.Section>
    </Card>
  );
}

export {CustomPaper};