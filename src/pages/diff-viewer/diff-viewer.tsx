import './diff-viewer.css'
import {MergeView} from "@codemirror/merge"
import {basicSetup} from "codemirror";
import {useEffect, useRef} from "react";
import {json} from "@codemirror/lang-json";
import {oneDark} from "@codemirror/theme-one-dark";
import {TitleContent} from "@/components/title-context.tsx";
import {xml} from "@codemirror/lang-xml";
import {html} from "@codemirror/lang-html";
import type {Extension} from "@uiw/react-codemirror";
import {useMantineColorScheme} from "@mantine/core";

export default function DiffViewer() {
  const mergeViewRef = useRef<HTMLDivElement>(null)
  const {colorScheme} = useMantineColorScheme();

  useEffect(() => {
    if (!mergeViewRef.current) return;

    const extension: Extension[] = [
      json(),
      xml(),
      html(),
      basicSetup
    ]

    if(colorScheme === 'dark') extension.push(oneDark)

    const view = new MergeView({
      a: {
        extensions: extension
      },
      b: {
        extensions: extension
      },
      gutter: true,
      parent: mergeViewRef.current,
      orientation: "a-b",
      highlightChanges: true,
    })
    return () => view.destroy()
  }, [colorScheme, mergeViewRef]);

  return (
    <div className={"dt-flex-full-height"}>
      <TitleContent
        title={"Diff Viewer"}
        description={"Compare two pieces of text or code and highlight the differences. Side-by-side or unified view supported."}
      />
      <div ref={mergeViewRef} id="diff-viewer"
           className={"dv-container"}/>
    </div>
  );
}
