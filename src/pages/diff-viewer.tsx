import './diff-viewer.css'
import {MergeView} from "@codemirror/merge"
import {basicSetup} from "codemirror";
import {useEffect, useRef} from "react";
import {json} from "@codemirror/lang-json";
import {oneDark} from "@codemirror/theme-one-dark";
import {TitleContent} from "@/components/title-context.tsx";

export default function DiffViewer() {
  const mergeViewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mergeViewRef.current) return;
    const view = new MergeView({
      a: {
        extensions: [
          oneDark,
          json(),
          basicSetup
        ]
      },
      b: {
        extensions: [
          oneDark,
          json(),
          basicSetup,
        ]
      },
      gutter: true,
      parent: mergeViewRef.current,
      orientation: "a-b",
      highlightChanges: true,
    })
    return () => view.destroy()
  }, [mergeViewRef]);

  return (
    <div className={"dt-flex-full-height"}>
      <TitleContent title={"Diff Viewer"}/>
      <div ref={mergeViewRef} id="diff-viewer"
           className={"dv-container"}/>
    </div>
  );
}
