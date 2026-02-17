import {ActionIcon, CopyButton, Tooltip} from "@mantine/core";
import {IconCheck, IconCopy} from "@tabler/icons-react";

function CustomCopyButton({value, timeout, tooltip} : {value: string, timeout?: number, tooltip?: string}) {
  return (
    <CopyButton value={value} timeout={timeout ?? 2000}>
      {({copied, copy}) => (
        <Tooltip label={copied ? 'Copied' : tooltip ?? 'Copy'} withArrow
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