import './code-mirror-card.css'
import {
  ActionIcon,
  Card,
  type CardProps,
  CopyButton,
  Group,
  Text,
  Tooltip
} from "@mantine/core";
import {IconCheck, IconCopy} from "@tabler/icons-react";
import CodeMirror, {type Extension} from "@uiw/react-codemirror";
import {oneDark} from "@codemirror/theme-one-dark";

interface CustomPaperProps {
  title: string;
  value: string;
  extensions: Extension[];
  onValueChange: (newValue: string) => void;
}


  function CodeMirrorCard({title, value, style, onValueChange, extensions}: CustomPaperProps & CardProps) {
  return (
    <Card withBorder style={style}>
      <Card.Section className={"cmc-header"}>
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
      <Card.Section className={"cmc-body"}>
        <CodeMirror
          value={value}
          theme={oneDark}
          extensions={extensions}
          onChange={onValueChange}
          style={{height: '100%'}}
        />
      </Card.Section>
    </Card>
  );
}

export {CodeMirrorCard};