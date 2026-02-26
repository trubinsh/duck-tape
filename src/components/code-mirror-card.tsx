import './code-mirror-card.css'
import {Card, type CardProps, Group, Text,} from "@mantine/core";
import CodeMirror, {type Extension} from "@uiw/react-codemirror";
import {CustomCopyButton} from "@/components/custom-copy-button.tsx";

interface CustomPaperProps {
  title: string;
  value: string;
  extensions: Extension[];
  onValueChange: (newValue: string) => void;
  theme: 'light' | 'dark';
}


function CodeMirrorCard({title, value, style, className, onValueChange, extensions, theme}: CustomPaperProps & CardProps) {
  return (
    <Card withBorder style={style} className={className}>
      <Card.Section className={"cmc-header"}>
        <Group justify="space-between">
          <Text fw={500}>{title}</Text>
          <CustomCopyButton value={value}/>
        </Group>
      </Card.Section>
      <Card.Section className={"cmc-body"}>
        <CodeMirror
          value={value}
          theme={theme}
          extensions={extensions}
          onChange={onValueChange}
          style={{height: '100%'}}
        />
      </Card.Section>
    </Card>
  );
}

export {CodeMirrorCard};