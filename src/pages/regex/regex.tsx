import CodeMirror, {type DecorationSet} from '@uiw/react-codemirror';
import {oneDark} from '@codemirror/theme-one-dark';
import {
  Decoration,
  EditorView,
  MatchDecorator,
  ViewPlugin,
  ViewUpdate
} from "@codemirror/view";
import {javascript} from "@codemirror/lang-javascript";
import {useMemo, useState} from "react";
import {Alert, Paper, Stack, Text, useMantineColorScheme} from "@mantine/core";
import {IconAlertCircle} from "@tabler/icons-react";
import {TitleContent} from "@/components/title-context.tsx";

export function RegexPage() {
  const [regexStr, setRegexStr] = useState('');
  const [testString, setTestString] = useState('');
  const [error, setError] = useState<string | null>(null);
  const {colorScheme} = useMantineColorScheme();

  const regex = useMemo(() => {
    try {
      const r = new RegExp(regexStr, 'gm');
      setError(null);
      return r;
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
  }, [regexStr]);

  const matchDecorator = useMemo(() => {
    if (!regex) return null;

    return new MatchDecorator({
      regexp: regex,
      decorate: (add, from, to) => {
        add(from, to, Decoration.mark({class: `cm-regex-match`}));
      }
    });
  }, [regex]);

  const matchHighlighter = useMemo(() => {
    const extensions = [
      oneDark,
      EditorView.baseTheme({
        ".cm-regex-match": {
          backgroundColor: "rgba(255, 255, 0, 0.3)",
          borderRadius: "2px"
        }
      })
    ];

    if (matchDecorator) {
      extensions.push(
        ViewPlugin.fromClass(class {
          decorations: DecorationSet;

          constructor(view: EditorView) {
            this.decorations = matchDecorator!.createDeco(view);
          }

          update(update: ViewUpdate) {
            this.decorations = matchDecorator.updateDeco(update, this.decorations);
          }
        }, {
          decorations: v => v.decorations
        })
      );
    }

    return extensions;
  }, [matchDecorator]);

  const regexExtensions = useMemo(() => {
    const extensions = []
    if(colorScheme === 'dark') extensions.push(oneDark)
    extensions.push(javascript())
    return extensions
  }, [colorScheme])

  return (
    <div className={"dt-flex-full-height"}>
      <TitleContent title={"Regex Tester"}/>
      <Stack
        style={{flex: 1, position: 'relative', height: 'calc(100vh - 60px - var(--mantine-spacing-md) * 3)'}}
        gap="xs">
        <Paper withBorder p="xs" style={{height: '75px'}}>
          <Text size="sm" mb={4} fw={500}>Regular Expression</Text>
          <CodeMirror
            value={regexStr}
            extensions={regexExtensions}
            onChange={(value) => setRegexStr(value)}
            style={{height: '30px'}}
            basicSetup={{
              lineNumbers: false,
              foldGutter: false,
            }}
          />
          {error && (
            <Alert icon={<IconAlertCircle size={16}/>} title="Invalid Regex"
                   color="red" mt="xs">
              {error}
            </Alert>
          )}
        </Paper>

        <Paper withBorder p={"xs"} style={{
          flex: 1,
          position: 'relative',
          height: 'calc(100vh - 100px - 60px - var(--mantine-spacing-md) * 3)'
        }}>
          <Text size="sm" mb={4} fw={500}>Test String</Text>
          <CodeMirror
            value={testString}
            height="100%"
            minHeight="100%"
            extensions={matchHighlighter}
            onChange={(value) => setTestString(value)}
            style={{height: '100%', paddingBottom: '23px'}}
            basicSetup={{
              lineNumbers: false,
              foldGutter: false,
            }}
          />
        </Paper>
      </Stack>
    </div>
  );
}