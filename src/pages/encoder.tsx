import {useState} from "react";
import {AsideContent} from "@/components/aside-context.tsx";
import {
  ActionIcon,
  CopyButton,
  Grid,
  Stack,
  Textarea, Title,
  Tooltip
} from "@mantine/core";
import {IconCheck, IconCopy, IconX} from "@tabler/icons-react";
import {notifications} from "@mantine/notifications";
import {
  decodeBase64,
  decodeJwt,
  decodeUrl,
  encodeBase64, encodeUrl
} from "@/lib/encoder-utils.ts";
import {useSearchParams} from "react-router-dom";
import type {Format} from "@/lib/utils.ts";
import {CodeHighlight} from "@mantine/code-highlight";

export function Encoder() {
  const [params] = useSearchParams();
  const format = params.get('format') as Format;

  if (format === 'Base64' || format === 'URL') {
    return <SimpleEncoder format={format}/>
  }
  else if (format === 'JWT') {
    return <JWTEncoder/>
  }
}

function SimpleEncoder({format}: {format: Format}) {
  const [encodedValue, setEncodedValue] = useState('')
  const [decodedValue, setDecodedValue] = useState('')

  const decodeValue = (value: string) => {
    setEncodedValue(value)

    let result: Promise<string> | null = null;

    if (format === 'Base64') {
      result = decodeBase64(value)
    }
    else if (format === 'URL'){
      result = decodeUrl(value)
    }

    if(result) {
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
    }
    else if (format === 'URL'){
      result = encodeUrl(value)
    }

    if(result) {
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
    <div style={{flex: 1, width: '100%', display: 'flex', flexDirection: 'column'}}>
      <AsideContent>
        Info
      </AsideContent>
      <Grid style={{flex: 1, margin: 0}}>
        <Grid.Col span={6} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
          <Title order={6}>Plain text</Title>
          <div style={{flex: 1, position: 'relative', display: 'flex', flexDirection: 'column'}}>
            <div style={{position: 'absolute', top: 20, right: 10, zIndex: 10}}>
              <CopyButton value={decodedValue} timeout={2000}>
                {({copied, copy}) => (
                  <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow
                           position="right">
                    <ActionIcon color={copied ? 'teal' : 'gray'} variant="light"
                                onClick={copy}>
                      {copied ? <IconCheck size={16}/> : <IconCopy size={16}/>}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </div>
            <Textarea
              placeholder="Plain text"
              value={decodedValue}
              pt={"sm"}
              onChange={(newValue) => encodeValue(newValue.currentTarget.value)}
              styles={{
                root: {flex: 1, display: 'flex', flexDirection: 'column'},
                wrapper: {flex: 1},
                input: {flex: 1}
              }}
            />
          </div>
        </Grid.Col>
        <Grid.Col span={6} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
          <Title order={6}>Encoded</Title>
          <div style={{flex: 1, position: 'relative', display: 'flex', flexDirection: 'column'}}>
            <div style={{position: 'absolute', top: 20, right: 10, zIndex: 10}}>
              <CopyButton value={encodedValue} timeout={2000}>
                {({copied, copy}) => (
                  <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow
                           position="right">
                    <ActionIcon color={copied ? 'teal' : 'gray'} variant="light"
                                onClick={copy}>
                      {copied ? <IconCheck size={16}/> : <IconCopy size={16}/>}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </div>
            <Textarea
              placeholder={`${format} encoded string`}
              value={encodedValue}
              pt={"sm"}
              onChange={(newValue) => decodeValue(newValue.currentTarget.value)}
              styles={{
                root: {flex: 1, display: 'flex', flexDirection: 'column'},
                wrapper: {flex: 1},
                input: {flex: 1}
              }}
            />
          </div>
        </Grid.Col>
      </Grid>
    </div>
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
      })
  }

  return (
    <div style={{flex: 1, width: '100%', display: 'flex', flexDirection: 'column'}}>
      <AsideContent>
        Info
      </AsideContent>
      <Grid style={{flex: 1, margin: 0}}>
        <Grid.Col span={6} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
          <Title order={6}>Encoded</Title>
          <div style={{flex: 1, position: 'relative', display: 'flex', flexDirection: 'column'}}>
            <div style={{position: 'absolute', top: 20, right: 10, zIndex: 10}}>
              <CopyButton value={encodedValue} timeout={2000}>
                {({copied, copy}) => (
                  <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow
                           position="right">
                    <ActionIcon color={copied ? 'teal' : 'gray'} variant="light"
                                onClick={copy}>
                      {copied ? <IconCheck size={16}/> : <IconCopy size={16}/>}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </div>
            <Textarea
              placeholder={`JWT encoded string`}
              value={encodedValue}
              onChange={(newValue) => decodeValue(newValue.currentTarget.value)}
              pt={"sm"}
              styles={{
                root: {flex: 1, display: 'flex', flexDirection: 'column'},
                wrapper: {flex: 1},
                input: {flex: 1}
              }}
            />
          </div>
        </Grid.Col>
        <Grid.Col span={6} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
          <Stack gap="xs" style={{ height: '100%' }}>
            <Title order={6}>Headers</Title>
            <CodeHighlight 
              code={decodedHeader} 
              language="json"
              radius={"md"}
              styles={{ code: { height: '150px', overflow: 'auto' } }}
            />
            <Title order={6}>Body</Title>
            <CodeHighlight
              code={decodedBody}
              language="json"
              radius={"md"}
              styles={{ code: { height: '300px', overflow: 'auto' } }}
            />
          </Stack>
        </Grid.Col>
      </Grid>
    </div>
  )
}