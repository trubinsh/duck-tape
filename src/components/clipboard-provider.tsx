import {
  createContext,
  type ReactNode,
  useEffect,
  useState
} from "react";
import {useClipboardMonitor} from "@/lib/clipboard-aware-context.ts";
import type { Format } from "@/lib/utils";

type ClipboardContextType = {
  enableClipboardAware: boolean;
  setEnableClipboardAware: (aware: boolean) => void;
  clipBoardFormat: Format;
  setClipBoardFormat: (format: Format) => void;
}

const ClipboardAwareContext = createContext<ClipboardContextType>({
  enableClipboardAware: false,
  setEnableClipboardAware: () => {
  },
  clipBoardFormat: "Text",
  setClipBoardFormat: () => {
  }
})

type ClipboardProviderProps = {
  children: ReactNode;
}

function ClipboardProvider({children}: ClipboardProviderProps) {
  const [enableClipboardAware, setEnableClipboardAware] = useState(false);
  const [clipBoardFormat, setClipBoardFormat] = useState<Format>("Text");

  const format = useClipboardMonitor(500, enableClipboardAware);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setClipBoardFormat(format ?? "Text");
  }, [format]);

  return (
    <ClipboardAwareContext value={{
      enableClipboardAware,
      setEnableClipboardAware,
      clipBoardFormat,
      setClipBoardFormat
    }}>
      {children}
    </ClipboardAwareContext>
  )
}

export {ClipboardAwareContext, ClipboardProvider, type Format};