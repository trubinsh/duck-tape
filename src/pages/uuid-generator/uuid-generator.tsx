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
import {maxUuidCount, uuidVersions} from "@/pages/uuid-generator/uuid-generator.ts";
import {useSettings} from "@/lib/settings.ts";

function UUIDGenerator() {
  const {settings} = useSettings()
  const [version, setVersion] = useState('v4');
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);

  useEffect(() => {
    setVersion(settings.uuidGenerator.version)
    setCount(settings.uuidGenerator.count)
  }, [settings.uuidGenerator.count, settings.uuidGenerator.version]);

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
      <TitleContent
        title={"UUID Generator"}
        description={"Generate unique identifiers (UUID/GUID) for your projects. Supports version 4 and bulk generation."}
      >
        <Button onClick={() => generateUuid(version)}>Generate</Button>
        <Tooltip label={"Version"}>
          <Select data={uuidVersions}
                  value={version}
                  data-testid="version-selector"
                  allowDeselect={false}
                  onChange={e => setVersion(e!)}/>
        </Tooltip>
        <Tooltip label={"Count"}>
          <NumberInput value={count} min={1} max={maxUuidCount}
                       data-testid="count-input"
                       onChange={e => setCount(e as number)}/>
        </Tooltip>
        <CustomCopyButton tooltip={'Copy all UUIDs'} ariaLabel="Copy all UUIDs" value={uuids.join('\n')}/>
      </TitleContent>
        <Box className={'dt-flex-full-height ug-output-box'}>
          {
            uuids.map((uuid, i) =>
              <Input className={"ug-output-field"} key={`uuid-field-${i}`}
                     rightSectionPointerEvents={"all"}
                     rightSection={<CustomCopyButton value={uuid} ariaLabel="Copy UUID"/>} readOnly
                     value={uuid} placeholder="UUID"/>)
          }
        </Box>
    </>
  );
}

export {UUIDGenerator};