import './diff-viewer.css'
import {MergeView} from "@codemirror/merge"
import {basicSetup} from "codemirror";
import {useEffect, useRef} from "react";
import {json} from "@codemirror/lang-json";
import {oneDark} from "@codemirror/theme-one-dark";

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
      revertControls: "b-to-a"
    })
    return () => view.destroy()
  }, [mergeViewRef]);

  return (
    <div style={{height: 'calc(100vh - 60px - 32px)', width: '100%'}}>
      <div ref={mergeViewRef} id="diff-viewer" className={"diff-viewer-root"}/>
    </div>
  );
}
