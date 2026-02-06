import {
  Autocomplete,
  type ComboboxParsedItemGroup,
  Kbd,
  type OptionsFilter
} from "@mantine/core";
import {isToolGroup, tools, useOS} from "@/lib/utils.ts";
import {useRef, useState} from "react";
import {useDisclosure, useHotkeys} from "@mantine/hooks";
import {useNavigate} from "react-router-dom";
import {useClipboardAwareContext} from "@/lib/clipboard-aware-context.ts";

function SearchAutocomplete() {
  const [chosenTool, setChosenTool] = useState<string>("")
  const os = useOS()
  const navigate = useNavigate()
  const searchFieldRef = useRef<HTMLInputElement>(null)
  const [searchFieldDropdownOpened, {open, close}] = useDisclosure();
  const searchHotkey = (<><Kbd size={"xs"}>{os === "MacOS" ? "cmd" : "ctrl"}</Kbd>
    <div>+</div>
    <Kbd size={"xs"}>K</Kbd></>)
  const {enableClipboardAware, clipBoardFormat} = useClipboardAwareContext()

  useHotkeys([["mod+K", () => {
    if (searchFieldRef != null && searchFieldRef.current != null) {
      setChosenTool("")
      open()
      searchFieldRef.current.focus()
    }
  }]], [], true)

  const searchableTools = tools.map((t) => {
    if (isToolGroup(t)) {
      return ({
        group: t.group,
        items: t.tools.map(f => f.name)
      })
    }
    else {
      return ({
        group: t.name,
        items: [t.name]
      })
    }
  })

  const onChosenToolSubmit = (value: string) => {
    console.debug(`Chosen tool ${value}`)
    const tool = tools.find(t => {
      if (isToolGroup(t)) {
        return t.tools.find(f => f.name === value)
      }
      else {
        return t.name === value
      }
    })
    if (!tool) return
    if(isToolGroup(tool)) {
      navigate(tool.tools.find(f => f.name === value)!.redirectUrl)
    }
    else {
      navigate(tool.redirectUrl!)
    }
    close()
  }

  const optionsFilter: OptionsFilter = ({options, search}) => {
    const filtered = (options as ComboboxParsedItemGroup[]).filter((option) =>
      option.group.toLowerCase().trim().includes(search.toLowerCase().trim()) ||
      option.items.some(item => item.label.toLowerCase().trim().includes(search.toLowerCase().trim()))
    );

    if(enableClipboardAware) {
      filtered.forEach((option) => {
        if (tools.find(t => isToolGroup(t) && t.group === option.group && t.clipboardAware)) {
          option.items.sort((a, b) => {
            if (a.label.includes(clipBoardFormat) && !b.label.includes(clipBoardFormat)) return -1
            if (!a.label.includes(clipBoardFormat) && b.label.includes(clipBoardFormat)) return 1
            return 0
          })
        }
      })
    }
    return filtered;
  };

  return (
    <Autocomplete mb="xs" selectFirstOptionOnChange ref={searchFieldRef}
                  data={searchableTools}
                  onClick={open}
                  onBlur={close}
                  placeholder={"Search"}
                  rightSection={searchHotkey}
                  rightSectionWidth={80}
                  rightSectionPointerEvents="none"
                  value={chosenTool}
                  dropdownOpened={searchFieldDropdownOpened}
                  onOptionSubmit={onChosenToolSubmit}
                  onChange={setChosenTool}
                  filter={optionsFilter}/>
  )
}

export {SearchAutocomplete};