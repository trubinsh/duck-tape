import './password-generator.css';
import {useEffect, useState} from "react";
import {
  Box,
  Button,
  MultiSelect,
  NumberInput,
  Textarea,
  Tooltip
} from "@mantine/core";
import {IconX} from "@tabler/icons-react";
import {notifications} from "@mantine/notifications";
import {postMessage} from "@/lib/worker-utils.ts";
import {CustomCopyButton} from "@/components/custom-copy-button.tsx";
import {TitleContent} from "@/components/title-context.tsx";
import {
  LOWER, maxLength, minLength,
  NUMBERS, SPECIAL,
  UPPER
} from "@/pages/password-generator/password-generator.ts";
import {useSettings} from "@/lib/settings.ts";

function PasswordGenerator() {
  const {settings} = useSettings()
  const [characters, setCharacters] = useState<string[]>(settings.passwordGenerator.characters);
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(settings.passwordGenerator.length);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCharacters(settings.passwordGenerator.characters)
    setLength(settings.passwordGenerator.length)
  }, [settings.passwordGenerator.characters, settings.passwordGenerator.length])

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
    <>
      <TitleContent title={"Password Generator"}>
        <Button variant={"filled"} me={"sm"}
                onClick={onGeneratePassword}>Generate</Button>
        <Tooltip label={"Password length"}>
          <NumberInput placeholder={"Length"} value={length} min={minLength}
                       max={maxLength}
                       aria-label={"Password length"}
                       data-testid="length-input"
                       onChange={(v) => setLength(v as number)}/>
        </Tooltip>
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
      </TitleContent>
      <Box className={"dt-flex-full-height pwg-output-box"}>
        <Textarea rightSectionPointerEvents={"all"}
                  rightSection={<CustomCopyButton value={password} ariaLabel="Copy password"/>}
                  value={password} readOnly aria-label="Generated password"/>
      </Box>
    </>
  )
}

export {PasswordGenerator};