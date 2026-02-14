import CodeMirror from '@uiw/react-codemirror';
import {json} from '@codemirror/lang-json';
import {xml} from '@codemirror/lang-xml';
import {html} from '@codemirror/lang-html';
import {oneDark} from '@codemirror/theme-one-dark';
import {useEffect, useMemo, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {ActionIcon, Button, CopyButton, Grid, NumberInput, Tooltip} from "@mantine/core";
import {notifications} from "@mantine/notifications";
import {IconCheck, IconCopy, IconX} from "@tabler/icons-react";
import {indentString} from "@/lib/formatter-utils.ts";
import {type Format} from "@/lib/utils.ts";

export default function StructureFormatter() {
  const [params] = useSearchParams()
  const [format, setFormat] = useState<Format>((params.get('format') as Format) || "Text")
  const [value, setValue] = useState('')
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

  return (
    <div style={{height: 'calc(100vh - 60px - 32px)', width: '100%'}}>
      {/*<AsideContent>*/}
      {/*  <Grid>*/}
      {/*    <Grid.Col span={6}>*/}
      {/*      <NumberInput label={"Indent Size"} value={formatIndentSize} min={1}*/}
      {/*                   max={8}*/}
      {/*                   onChange={setFormatIndentSize}/>*/}
      {/*    </Grid.Col>*/}
      {/*    <Grid.Col span={6}>*/}
      {/*      <div/>*/}
      {/*    </Grid.Col>*/}
      {/*    <Grid.Col span={6}>*/}
      {/*      <Button*/}
      {/*        fullWidth*/}
      {/*        onClick={() => {*/}
      {/*          indentString(value, format, parseInt(formatIndentSize as string))*/}
      {/*            .then(formatted => setValue(formatted))*/}
      {/*            .catch(e => {*/}
      {/*              console.error(e);*/}
      {/*              notifications.show({*/}
      {/*                title: 'Formatting error',*/}
      {/*                message: `Failed to format ${format}`,*/}
      {/*                color: 'red',*/}
      {/*                icon: <IconX size={16}/>*/}
      {/*              });*/}
      {/*            });*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        Indent*/}
      {/*      </Button>*/}
      {/*    </Grid.Col>*/}
      {/*    <Grid.Col span={6}>*/}
      {/*      <Button*/}
      {/*        fullWidth*/}
      {/*        onClick={() => {*/}
      {/*          indentString(value, format, 0)*/}
      {/*            .then(formatted => setValue(formatted))*/}
      {/*            .catch(e => {*/}
      {/*              console.error(e);*/}
      {/*              notifications.show({*/}
      {/*                title: 'Formatting error',*/}
      {/*                message: `Failed to format ${format}`,*/}
      {/*                color: 'red',*/}
      {/*                icon: <IconX size={16}/>*/}
      {/*              });*/}
      {/*            });*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        Inline*/}
      {/*      </Button>*/}
      {/*    </Grid.Col>*/}
      {/*  </Grid>*/}
      {/*</AsideContent>*/}
      <div style={{flex: 1, position: 'relative', height: '100%'}}>
        <div style={{position: 'absolute', top: 10, right: 20, zIndex: 10}}>
          <CopyButton value={value} timeout={2000}>
            {({copied, copy}) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                <ActionIcon color={copied ? 'teal' : 'gray'} variant="light" onClick={copy}>
                  {copied ? <IconCheck size={16}/> : <IconCopy size={16}/>}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </div>
        <CodeMirror
          value={value}
          height="100%"
          minHeight="100%"
          theme={oneDark}
          extensions={extensions}
          onChange={(newValue) => setValue(newValue)}
          style={{height: '100%'}}
        />
      </div>
    </div>
  );
}