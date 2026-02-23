import './uuid-generator.css';
import {
  Box,
  Button,
  Input,
  NumberInput,
  Select,
  Tooltip
} from "@mantine/core";
import {useEffect, useState} from "react";
import {IconX} from "@tabler/icons-react";
import {postMessage} from "@/lib/worker-utils.ts";
import {notifications} from "@mantine/notifications";
import {CustomCopyButton} from "@/components/custom-copy-button.tsx";
import {TitleContent} from "@/components/title-context.tsx";

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
      <TitleContent title={"UUID Generator"}>
        <Button onClick={() => generateUuid(version)}>Generate</Button>
        <Tooltip label={"Version"}>
          <Select data={uuidVersions}
                  value={version}
                  allowDeselect={false}
                  onChange={e => setVersion(e!)}/>
        </Tooltip>
        <Tooltip label={"Count"}>
          <NumberInput value={count} min={1} max={30}
                       onChange={e => setCount(e as number)}/>
        </Tooltip>
        <CustomCopyButton tooltip={'Copy all UUIDs'} value={uuids.join('\n')}/>
      </TitleContent>
        <Box className={'dt-flex-full-height ug-output-box'}>
          {
            uuids.map((uuid, i) =>
              <Input className={"ug-output-field"} key={`uuid-field-${i}`}
                     rightSectionPointerEvents={"all"}
                     rightSection={<CustomCopyButton value={uuid}/>} readOnly
                     value={uuid} placeholder="UUID"/>)
          }
        </Box>
    </>
  );
}

export {UUIDGenerator};