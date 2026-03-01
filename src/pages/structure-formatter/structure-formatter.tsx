import './structure-formatter.css';
import {json} from '@codemirror/lang-json';
import {xml} from '@codemirror/lang-xml';
import {html} from '@codemirror/lang-html';
import {useEffect, useMemo, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {type Format} from "@/lib/utils.ts";
import {CodeMirrorCard} from "@/components/code-mirror-card.tsx";
import {Button, Grid, NativeSelect, useMantineColorScheme} from "@mantine/core";
import {indentString} from "@/lib/formatter-utils.ts";
import {notifications} from "@mantine/notifications";
import {IconX} from "@tabler/icons-react";
import {TitleContent} from "@/components/title-context.tsx";
import {useSettings} from "@/lib/settings.ts";
import {
  formatterIndentations
} from "@/pages/structure-formatter/structure-formatter.ts";

export default function StructureFormatter() {
  const [params] = useSearchParams()
  const {settings} = useSettings()
  const [format, setFormat] = useState<Format>((params.get('format') as Format) || "JSON")
  const [inputValue, setInputValue] = useState('')
  const [outputValue, setOutputValue] = useState('')
  const [formatIndentSize, setFormatIndentSize] = useState<string | number>(settings.formatter.indentSize)
  const {colorScheme} = useMantineColorScheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormatIndentSize(settings.formatter.indentSize);
  }, [settings.formatter.indentSize]);

  useEffect(() => {
    const format = params.get('format') as Format;
    if (format) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormat(format);
    }
  }, [params]);

  const extensions = useMemo(() => {
    const exts = [];
    if (format === 'JSON') exts.push(json());
    if (format === 'XML') exts.push(xml());
    if (format === 'HTML') exts.push(html());
    return exts;
  }, [format]);

  const minifyString = () => {
    indentString(inputValue, format, 0)
      .then(formatted => setOutputValue(formatted))
      .catch(e => {
        console.error(e);
        notifications.show({
          title: 'Formatting error',
          message: `Failed to format ${format}`,
          color: 'red',
          icon: <IconX size={16}/>
        });
      });
  }

  const formatString = () => {
    indentString(inputValue, format, parseInt(formatIndentSize as string))
      .then(formatted => setOutputValue(formatted))
      .catch(e => {
        console.error(e);
        notifications.show({
          title: 'Formatting error',
          message: `Failed to format ${format}`,
          color: 'red',
          icon: <IconX size={16}/>
        });
      });
  }

  return (
    <div className={"dt-flex-full-height"}>
      <TitleContent title={`${format} Formatter`}>
        <Button variant={"filled"} me={"sm"}
                onClick={minifyString}>Minify</Button>
        <Button variant={"filled"} me={"sm"}
                onClick={formatString}>Format</Button>
        <NativeSelect value={formatIndentSize} data={formatterIndentations} onChange={(e) => setFormatIndentSize(e.currentTarget.value)}/>
      </TitleContent>
      <Grid className={"dt-flex-full-height"} style={{ flex: 1 }}>
        <Grid.Col span={6}>
          <CodeMirrorCard extensions={extensions} onValueChange={setInputValue}
                          title="Input" value={inputValue}
                          theme={colorScheme === 'dark' ? 'dark' : 'light'}
                          className={"sf-card"}/>
        </Grid.Col>
        <Grid.Col span={6}
                  style={{
                    height: '100%'
                  }}>
          <CodeMirrorCard extensions={extensions} onValueChange={setOutputValue}
                          title="Output" value={outputValue}
                          theme={colorScheme === 'dark' ? 'dark' : 'light'}
                          className={"sf-card"}/>
        </Grid.Col>
      </Grid>
    </div>
  );
}