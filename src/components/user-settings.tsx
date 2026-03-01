import {
  ActionIcon,
  Button, Grid,
  Modal,
  Stack,
  Switch,
  Tabs,
  useComputedColorScheme,
  useMantineColorScheme
} from "@mantine/core";
import {IconMoon, IconSun} from "@tabler/icons-react";
import {useBrowser} from "@/lib/utils.ts";
import {useClipboardAwareContext} from "@/lib/clipboard-aware-context.ts";

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ThemeControl() {
  const {setColorScheme} = useMantineColorScheme();
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
    enableClipboardAware,
    setEnableClipboardAware
  } = useClipboardAwareContext()

  return (
    <Modal opened={isOpen} onClose={onClose} title="User Settings">
      <Stack>
        <Tabs defaultValue="general" variant="outline">
          <Tabs.List>
            <Tabs.Tab value="general">General</Tabs.Tab>
            <Tabs.Tab value="formatter">Formatter</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="general" mt={"md"} mb={"md"}>
            <Stack gap={"md"}>
              {
                // SmartSearch not supported on Safari yet. Safari has a lockdown on read from clipboard only for user-specific actions, Clipboard API does not allow direct reads
                browser !== "Safari" && <Switch checked={enableClipboardAware}
                                                onChange={e => setEnableClipboardAware(e.currentTarget.checked)}
                                                label={"Smart Search"} labelPosition={'left'}></Switch>
              }
              <ThemeControl/>
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value="formatter">
            Formatter settings
          </Tabs.Panel>

        </Tabs>
        <Grid>
          <Grid.Col span={6}/>
          <Grid.Col span={3}>
            <Button variant={"outline"} onClick={onClose}>Cancel</Button>
          </Grid.Col>
          <Grid.Col span={3}>
            <Button variant={"filled"} onClick={onClose}>Save</Button>
          </Grid.Col>
        </Grid>
      </Stack>
    </Modal>
  )
}

export {UserSettingsModal};