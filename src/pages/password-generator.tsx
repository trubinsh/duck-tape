import './password-generator.css';
import {useState} from "react";
import {
  Box,
  Button,
  Container, Divider,
  Grid,
  MultiSelect,
  NumberInput,
  Textarea,
  Tooltip
} from "@mantine/core";
import {IconX} from "@tabler/icons-react";
import {notifications} from "@mantine/notifications";
import {postMessage} from "@/lib/worker-utils.ts";
import {CustomCopyButton} from "@/components/custom-copy-button.tsx";

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SPECIAL = '!@#$%^&*()_+~`|}{[]\\:;?><,./-=';

function PasswordGenerator() {
  const [characters, setCharacters] = useState<string[]>([LOWER, UPPER]);
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);

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
      <Divider/>
      <Grid m={"md"} className={"dt-flex-full-height"}>
        <Grid.Col span={4}>
          Password Generator
        </Grid.Col>
        <Grid.Col
          span={8}>
          <Grid className={"pwg-justify-content-right"}>
            <Grid.Col span={4} className={"pwg-justify-content-right"}>
              <Button variant={"filled"} me={"sm"}
                      onClick={onGeneratePassword}>Generate</Button>
            </Grid.Col>
            <Grid.Col span={2} className={"pwg-justify-content-right"}>
              <Tooltip label={"Password length"}>
                <NumberInput placeholder={"Length"} value={length} min={6}
                             max={128}
                             onChange={(v) => setLength(v as number)}/>
              </Tooltip>
            </Grid.Col>
            <Grid.Col span={6} className={"pwg-justify-content-right"}>
              <MultiSelect
                value={characters}
                onChange={setCharacters}
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
        </Grid.Col>
      </Grid>
      <Divider/>
      <Container>
        <Box className={"dt-flex-full-height pwg-output-box"}>
          <Textarea rightSection={<CustomCopyButton value={password}/>} value={password} readOnly/>
        </Box>
      </Container>
    </div>
  )
}

export {PasswordGenerator};