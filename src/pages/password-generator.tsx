import {AsideContent} from "@/components/aside-context.tsx";
import {useEffect, useState} from "react";
import {
  ActionIcon,
  Button,
  Checkbox,
  CopyButton,
  Grid,
  NumberInput,
  Textarea,
  Tooltip
} from "@mantine/core";
import {IconCheck, IconCopy, IconX} from "@tabler/icons-react";
import {notifications} from "@mantine/notifications";
import {postMessage} from "@/lib/worker-utils.ts";

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SPECIAL = '!@#$%^&*()_+~`|}{[]\\:;?><,./-=';

function PasswordGenerator() {
  const [characters, setCharacters] = useState<string[]>([LOWER]);
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecial, setIncludeSpecial] = useState(false);

  useEffect(() => {
    const chars = [LOWER];
    if (includeUpper) chars.push(UPPER);
    if (includeNumbers) chars.push(NUMBERS);
    if (includeSpecial) chars.push(SPECIAL);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCharacters(chars);
  }, [includeUpper, includeNumbers, includeSpecial]);

  const onGeneratePassword = () => {
    postMessage<string>({type: 'GENERATE_PASSWORD', length, characters})
      .then(p => setPassword(p))
      .catch(e => {
        console.error(e)
        setPassword('');
        notifications.show({
          title: 'Generation error',
          message: `Failed to generate password`,
          color: 'red',
          icon: <IconX size={16}/>
        });
      });
  }

  return (
    <div>
      <AsideContent>
        <Grid>
          <Grid.Col span={6}>
            <NumberInput label={"Password length"} value={length} min={8}
                         max={128} onChange={(v) => setLength(v as number)}/>
          </Grid.Col>
          <Grid.Col span={6}>
            <Checkbox label="Include numbers" checked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}/>
          </Grid.Col>
          <Grid.Col span={6}>
            <Checkbox label="Include upper case letter" checked={includeUpper}
                      onChange={(e) => setIncludeUpper(e.target.checked)}/>
          </Grid.Col>
          <Grid.Col span={6}>
            <Checkbox label="Include special characters"
                      checked={includeSpecial}
                      onChange={(e) => setIncludeSpecial(e.target.checked)}/>
          </Grid.Col>
        </Grid>
        <Button onClick={onGeneratePassword}>Generate</Button>
      </AsideContent>
      <div style={{flex: 1, position: 'relative', height: '100%'}}>
        <div style={{position: 'absolute', top: 10, right: 20, zIndex: 10}}>
          <CopyButton value={password} timeout={2000}>
            {({copied, copy}) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow
                       position="right">
                <ActionIcon color={copied ? 'teal' : 'gray'} variant="light"
                            onClick={copy} aria-label="Copy password">
                  {copied ? <IconCheck size={16}/> : <IconCopy size={16}/>}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </div>
        <Textarea value={password} readOnly aria-label="Generated password"/>
      </div>
    </div>
  )
}

export {PasswordGenerator};