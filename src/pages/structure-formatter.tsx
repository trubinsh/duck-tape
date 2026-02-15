import CodeMirror from '@uiw/react-codemirror';
import {json} from '@codemirror/lang-json';
import {xml} from '@codemirror/lang-xml';
import {html} from '@codemirror/lang-html';
import {oneDark} from '@codemirror/theme-one-dark';
import {useEffect, useMemo, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {type Format} from "@/lib/utils.ts";
import {CustomPaper} from "@/components/custom-paper.tsx";
import {Button, Grid, NativeSelect} from "@mantine/core";
import {indentString} from "@/lib/formatter-utils.ts";
import {notifications} from "@mantine/notifications";
import {IconX} from "@tabler/icons-react";

export default function StructureFormatter() {
  const [params] = useSearchParams()
  const [format, setFormat] = useState<Format>((params.get('format') as Format) || "Text")
  const [inputValue, setInputValue] = useState('')
  const [outputValue, setOutputValue] = useState('')
  const [formatIndentSize, setFormatIndentSize] = useState<string | number>(2)

  useEffect(() => {
    const format = params.get('format') as Format;
    if (format) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormat(format);
    }
  }, [params]);

  const extensions = useMemo(() => {
    const exts = [
      oneDark
    ];
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
    <div style={{height: 'calc(100vh - 60px - 32px)', width: '100%'}}>
      <div style={{flex: 1, position: 'relative', height: '100%'}}>
        <Grid mb={"md"}>
          <Grid.Col span={6}>
            {format} Formatter
          </Grid.Col>
          <Grid.Col
            style={{justifyContent: 'flex-end', display: 'flex', width: '100%'}}
            span={6}>
            <Button variant={"filled"} me={"sm"}
                    onClick={formatString}>Format</Button>
            <Button variant={"filled"} me={"sm"}
                    onClick={minifyString}>Minify</Button>
            <NativeSelect value={formatIndentSize} data={[
              {label: 'Indentation (1 spaces)', value: '1'},
              {label: 'Indentation (2 spaces)', value: '2'},
              {label: 'Indentation (4 spaces)', value: '4'},
            ]} onChange={(e) => setFormatIndentSize(e.currentTarget.value)}/>
          </Grid.Col>
        </Grid>
        <div style={{flex: 1, position: 'relative', height: '100%'}}>
          <Grid>
            <Grid.Col span={6}
                      style={{display: 'flex', flexDirection: 'column'}}>
              <CustomPaper title="Input" value={inputValue} fullHeight>
                <CodeMirror
                  value={inputValue}
                  height="100%"
                  minHeight="100%"
                  theme={oneDark}
                  extensions={extensions}
                  onChange={(newValue) => setInputValue(newValue)}
                  style={{height: '100%'}}
                />
              </CustomPaper>
            </Grid.Col>
            <Grid.Col span={6}
                      style={{display: 'flex', flexDirection: 'column'}}>
              <CustomPaper title="Output" value={outputValue} fullHeight>
                <CodeMirror
                  value={outputValue}
                  height="100%"
                  minHeight="100%"
                  theme={oneDark}
                  extensions={extensions}
                  onChange={(newValue) => setOutputValue(newValue)}
                  style={{height: '100%'}}
                />
              </CustomPaper>
            </Grid.Col>
          </Grid>
        </div>
      </div>
    </div>
  );
}