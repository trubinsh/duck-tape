import {
  ActionIcon,
  Button, Grid,
  Modal, MultiSelect, NativeSelect, NumberInput,
  Stack,
  Switch,
  Tabs, Text,
  useComputedColorScheme,
  useMantineColorScheme
} from "@mantine/core";
import {IconMoon, IconSun} from "@tabler/icons-react";
import {useBrowser} from "@/lib/utils.ts";
import {useClipboardAwareContext} from "@/lib/clipboard-aware-context.ts";
import {useSettings, type UserSettings} from "@/lib/settings.ts";
import {useEffect, useState} from "react";
import {maxUuidCount, uuidVersions} from "@/pages/uuid-generator/uuid-generator.ts";
import {
  formatterIndentations
} from "@/pages/structure-formatter/structure-formatter.ts";
import {
  LOWER, maxLength, minLength,
  NUMBERS, SPECIAL,
  UPPER
} from "@/pages/password-generator/password-generator.ts";

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ThemeControl({setColorScheme}: {setColorScheme: (scheme: 'light' | 'dark') => void}) {
  const computedColorScheme = useComputedColorScheme('light', {getInitialValueInEffect: true});

  const toggleColorScheme = () => {
    const newScheme = computedColorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(newScheme);
  };

  return (
    <ActionIcon
      onClick={toggleColorScheme}
      variant="default"
      size="lg"
      aria-label="Toggle color scheme"
    >
      {computedColorScheme === 'light' ? (
        <IconMoon stroke={1.5}/>
      ) : (
        <IconSun stroke={1.5}/>
      )}
    </ActionIcon>
  );
}

function UserSettingsModal({isOpen, onClose}: UserSettingsModalProps) {
  const browser = useBrowser();
  const {
    setEnableClipboardAware
  } = useClipboardAwareContext()
  const {settings: globalSettings, updateSettings} = useSettings();
  const [settings, setSettings] = useState<UserSettings>(globalSettings)
  const {setColorScheme} = useMantineColorScheme();

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSettings(globalSettings);
    }
  }, [isOpen, globalSettings]);

  const onSave = () => {
    updateSettings(settings);
    onClose();
  }

  const onCancel = () => {
    setColorScheme(globalSettings.general.theme)
    setEnableClipboardAware(globalSettings.general.smartSearchEnabled)
    onClose();
  }

  const setPasswordGeneratorCharacters = (characters: string[]) => {
    if(characters.length > 0) {
      setSettings({
        ...settings,
        passwordGenerator: {...settings.passwordGenerator, characters}
      })
    }
  }

  return (
    <Modal opened={isOpen} onClose={onClose} size={"lg"} title="User Settings">
        <Tabs defaultValue="general" variant="outline">
          <Tabs.List>
            <Tabs.Tab value="general">General</Tabs.Tab>
            <Tabs.Tab value="formatter">Formatter</Tabs.Tab>
            <Tabs.Tab value="uuid-generator">UUID Generator</Tabs.Tab>
            <Tabs.Tab value="password-generator">Password Generator</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="general" mt={"md"} mb={"md"}>
            <Stack gap={"md"}>
              {
                // SmartSearch not supported on Safari yet. Safari has a lockdown on read from clipboard only for user-specific actions, Clipboard API does not allow direct reads
                browser !== "Safari" && <Switch checked={settings.general.smartSearchEnabled}
                                                onChange={e => {
                                                    const checked = e.currentTarget.checked;
                                                    setSettings({...settings, general: {...settings.general, smartSearchEnabled: checked}});
                                                    setEnableClipboardAware(checked);
                                                }}
                                                label={"Smart Search"} labelPosition={'left'}></Switch>
              }
              <ThemeControl setColorScheme={(scheme) => {
                  setSettings({...settings, general: {...settings.general, theme: scheme}});
                  setColorScheme(scheme);
              }}/>
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel mt={"md"} value="formatter">
            <Grid>
              <Grid.Col span={5}>
                <Text>Indentation size</Text>
              </Grid.Col>
              <Grid.Col span={7}>
                <NativeSelect value={settings.formatter.indentSize} data={formatterIndentations} onChange={(e) => setSettings({...settings, formatter: {indentSize: parseInt(e.currentTarget.value)}})}/>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel mt={"md"} value="uuid-generator">
            <Grid>
              <Grid.Col span={5}>
                <Text>UUID Version</Text>
              </Grid.Col>
              <Grid.Col span={7}>
                <NativeSelect value={settings.uuidGenerator.version} data={uuidVersions} onChange={(e) => setSettings({...settings, uuidGenerator: {...settings.uuidGenerator, version: e.currentTarget.value}})}/>
              </Grid.Col>
              <Grid.Col span={5}>
                <Text>Count</Text>
              </Grid.Col>
              <Grid.Col span={7}>
                <NumberInput value={settings.uuidGenerator.count} min={1} max={maxUuidCount}
                             data-testid="count-input"
                             onChange={e => setSettings({...settings, uuidGenerator: {...settings.uuidGenerator, count: e as number}})}/>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel mt={"md"} value="password-generator">
            <Grid>
              <Grid.Col span={3}>
                <Text>Length</Text>
              </Grid.Col>
              <Grid.Col span={9}>
                <NumberInput style={{width: '25vw'}} value={settings.passwordGenerator.length} min={minLength} max={maxLength}
                             data-testid="length-input"
                             onChange={e => setSettings({...settings, passwordGenerator: {...settings.passwordGenerator, length: e as number}})}/>
              </Grid.Col>
              <Grid.Col span={3}>
                <Text>Included characters</Text>
              </Grid.Col>
              <Grid.Col span={9}>
                <MultiSelect
                  value={settings.passwordGenerator.characters}
                  onChange={setPasswordGeneratorCharacters}
                  style={{width: '25vw'}}
                  data={[{
                    label: 'Lowercase letters',
                    value: LOWER,
                  },
                    {
                      label: 'Uppercase letters',
                      value: UPPER,
                    },
                    {
                      label: 'Numbers',
                      value: NUMBERS,
                    },
                    {
                      label: 'Special characters',
                      value: SPECIAL,
                    }]}
                />
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

        </Tabs>
        <Grid>
          <Grid.Col span={2}>
            <Button variant={"outline"} onClick={onCancel}>Cancel</Button>
          </Grid.Col>
          <Grid.Col span={2}>
            <Button variant={"filled"} onClick={onSave}>Save</Button>
          </Grid.Col>
          <Grid.Col span={8}/>
        </Grid>
    </Modal>
  )
}

export {UserSettingsModal};