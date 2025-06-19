import { useEffect, useRef } from "react";
import "vditor/src/assets/less/index.less";

import Vditor from "vditor";

export interface IVditorNoteProps {}

function VditorNote(props: IVditorNoteProps) {
  const {} = props;

  const vditorWrapperRef = useRef<HTMLDivElement>(null);
  const vditorRef = useRef<Vditor>(null);

  useEffect(() => {
    if (vditorWrapperRef.current) {
      vditorRef.current = new Vditor(vditorWrapperRef.current, {
        cache: {
          id: "vditorNote",
        },
        lang: "zh_CN",
        tab: "\t",
        // toolbar: [],
      });
    }
  }, []);

  return <div ref={vditorWrapperRef}></div>;
}
export default VditorNote;