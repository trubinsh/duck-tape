import {ActionIcon, CopyButton, Tooltip} from "@mantine/core";
import {IconCheck, IconCopy} from "@tabler/icons-react";

function CustomCopyButton({value, timeout} : {value: string, timeout?: number}) {
  return (
    <CopyButton value={value} timeout={timeout ?? 2000}>
      {({copied, copy}) => (
        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow
                 position="right">
          <ActionIcon color={copied ? 'teal' : 'gray'} variant="light"
                      onClick={copy} aria-label="Copy password">
            {copied ? <IconCheck size={16}/> : <IconCopy size={16}/>}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>)
}

export {CustomCopyButton};