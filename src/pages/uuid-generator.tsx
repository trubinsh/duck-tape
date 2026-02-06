import './uuid-generator.css';
import {
  ActionIcon,
  Button,
  CopyButton,
  Grid,
  Input,
  NativeSelect,
  NumberInput,
  Tooltip
} from "@mantine/core";
import {useEffect, useState} from "react";
import {IconCheck, IconCopy, IconX} from "@tabler/icons-react";
import {AsideContent} from "@/components/aside-context.tsx";
import {postMessage} from "@/lib/worker-utils.ts";
import {notifications} from "@mantine/notifications";

const UUIDField =
  ({value = ''}: { value?: string }) => {
    return (
      <div className={'uuid-output-field'}>
        <div style={{position: 'absolute', top: 5, right: 20, zIndex: 10}}>
          <CopyButton value={value} timeout={2000}>
            {({copied, copy}) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow
                       position="right">
                <ActionIcon color={copied ? 'teal' : 'gray'} variant="light"
                            onClick={copy} aria-label="Copy UUID">
                  {copied ? <IconCheck size={16}/> : <IconCopy size={16}/>}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </div>
        <Input readOnly value={value} placeholder="UUID"/>
      </div>
    )
  }

const uuidVersions = ['v1', 'v4', 'v5', 'v6', 'v7'];

function UUIDGenerator() {
  const [version, setVersion] = useState('v4');
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);

  const generateUuid = (version: string) => {
    postMessage<string[]>({type: 'GENERATE_UUID', count, version})
      .then(r => {
        setUuids(r)
      })
      .catch(e => {
        console.error(e)
        notifications.show({
          title: 'Generation error',
          message: `Failed to generate UUIDs`,
          color: 'red',
          icon: <IconX size={16}/>
        });
      })
  }

  useEffect(() => {
    setUuids(Array(count).fill(''))
  }, [count]);

  return (
    <>
      <AsideContent>
        <Grid>
          <Grid.Col span={6}>
            <NativeSelect label={"Version"} data={uuidVersions} value={version}
                          onChange={e => setVersion(e.currentTarget.value)}/>
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput label={"Count"} value={count} min={1} max={30}
                         onChange={e => setCount(e as number)}/>
          </Grid.Col>
        </Grid>
        <Button mt={"1rem"}
                onClick={() => generateUuid(version)}>Generate</Button>
      </AsideContent>
      <div className={'uuid-generator-container'}>
        <div style={{position: 'absolute', top: 0, right: 20, zIndex: 10}}>
          <CopyButton value={uuids.join('\n')} timeout={2000}>
            {({copied, copy}) => (
              <Tooltip label={copied ? 'Copied All' : 'Copy All'} withArrow
                       position="right">
                <ActionIcon color={copied ? 'teal' : 'gray'} variant="light"
                            onClick={copy} aria-label="Copy All">
                  {copied ? <IconCheck size={16}/> : <IconCopy size={16}/>}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </div>
        <div className={'generated-uuids-fields'}>
        {
          uuids.map((uuid, i) =>
            <UUIDField key={`uuid-field-${i}`} value={uuid}/>)
        }
        </div>
      </div>
    </>
  );
}

export {UUIDGenerator};