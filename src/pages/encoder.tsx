import './encoder.css';
import {useState} from "react";
import {Card, Grid, Group, Stack, Text, Textarea, Title} from "@mantine/core";
import {IconX} from "@tabler/icons-react";
import {notifications} from "@mantine/notifications";
import {
  decodeBase64,
  decodeJwt,
  decodeUrl,
  encodeBase64,
  encodeUrl
} from "@/lib/encoder-utils.ts";
import {useSearchParams} from "react-router-dom";
import type {Format} from "@/lib/utils.ts";
import {CodeHighlight} from "@mantine/code-highlight";
import {CustomCopyButton} from "@/components/custom-copy-button.tsx";

export function Encoder() {
  const [params] = useSearchParams();
  const format = params.get('format') as Format;

  if (format === 'Base64' || format === 'URL') {
    return <SimpleEncoder format={format}/>
  } else if (format === 'JWT') {
    return <JWTEncoder/>
  }
}

function SimpleEncoder({format}: { format: Format }) {
  const [encodedValue, setEncodedValue] = useState('')
  const [decodedValue, setDecodedValue] = useState('')

  const decodeValue = (value: string) => {
    setEncodedValue(value)

    let result: Promise<string> | null = null;

    if (format === 'Base64') {
      result = decodeBase64(value)
    } else if (format === 'URL') {
      result = decodeUrl(value)
    }

    if (result) {
      result
        .then(decoded => setDecodedValue(decoded))
        .catch(e => {
          console.error(e)
          notifications.show({
            title: 'Formatting error',
            message: `Failed to decode ${format}`,
            color: 'red',
            icon: <IconX size={16}/>
          });
        })
    }
  }

  const encodeValue = (value: string) => {
    setDecodedValue(value)

    let result: Promise<string> | null = null;

    if (format === 'Base64') {
      result = encodeBase64(value)
    } else if (format === 'URL') {
      result = encodeUrl(value)
    }

    if (result) {
      result
        .then(encoded => setEncodedValue(encoded))
        .catch(e => {
          console.error(e)
          notifications.show({
            title: 'Formatting error',
            message: `Failed to decode ${format}`,
            color: 'red',
            icon: <IconX size={16}/>
          });
        })
    }
  }

  return (
    <Grid className={"e-grid"}>
      <Grid.Col span={6} className={"e-grid-col"}>
        <Card withBorder className={"e-card"}>
          <Card.Section className={"e-card-header"}>
            <Group justify="space-between">
              <Text fw={500}>Plain Text</Text>
              <CustomCopyButton value={decodedValue}/>
            </Group>
          </Card.Section>
          <Card.Section>
            <Textarea
              placeholder={`Plain text`}
              value={decodedValue}
              onChange={(newValue) => encodeValue(newValue.currentTarget.value)}
            />
          </Card.Section>
        </Card>
      </Grid.Col>
      <Grid.Col span={6} className={"e-grid-col"}>
        <Card withBorder className={"e-card"}>
          <Card.Section className={"e-card-header"}>
            <Group justify="space-between">
              <Text fw={500}>Encoded</Text>
              <CustomCopyButton value={encodedValue}/>
            </Group>
          </Card.Section>
          <Card.Section>
            <Textarea
              placeholder={`${format} encoded string`}
              value={encodedValue}
              onChange={(newValue) => decodeValue(newValue.currentTarget.value)}
            />
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  )
}

function JWTEncoder() {
  const [encodedValue, setEncodedValue] = useState('')
  const [decodedHeader, setDecodedHeader] = useState('')
  const [decodedBody, setDecodedBody] = useState('')

  const decodeValue = (value: string) => {
    setEncodedValue(value)
    if (!value) {
      setDecodedHeader('')
      setDecodedBody('')
      return
    }

    decodeJwt(value)
      .then(({header, body}) => {
        setDecodedHeader(header)
        setDecodedBody(body)
      })
      .catch((error) => {
        console.error('Error decoding JWT:', error)
        setDecodedHeader('')
        setDecodedBody('')
        notifications.show({
          title: 'Decoding error',
          message: `JWT decoding failed`,
          color: 'red',
          icon: <IconX size={16}/>
        });
      })
  }

  return (
    <div className={"dt-flex-full-height"}>
      <Grid m={"md"}>
        <Grid.Col span={6} className={"dt-flex-full-height"}>
          <Title order={6}>Encoded</Title>
          <Textarea
            placeholder={`JWT encoded string`}
            value={encodedValue}
            onChange={(newValue) => decodeValue(newValue.currentTarget.value)}
            mt={"sm"}
            autosize
            rightSection={<CustomCopyButton value={encodedValue}/>}
            rightSectionPointerEvents={"all"}
            styles={{
              root: {flex: 1, display: 'flex', flexDirection: 'column'},
              wrapper: {flex: 1},
              input: {flex: 1}
            }}
          />
        </Grid.Col>
        <Grid.Col span={6} className={"dt-flex-full-height"}>
          <Stack gap="xs">
            <Title order={6}>Headers</Title>
            <CodeHighlight
              code={decodedHeader}
              language="json"
              radius={"md"}
              styles={{code: {height: '25vh', overflow: 'auto'}}}
            />
            <Title order={6}>Body</Title>
            <CodeHighlight
              code={decodedBody}
              language="json"
              radius={"md"}
              styles={{code: {height: '60vh', overflow: 'auto'}}}
            />
          </Stack>
        </Grid.Col>
      </Grid>
    </div>
  )
}