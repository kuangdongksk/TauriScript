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
        hint: {
          extend: [
            {
              key: "/",
              hint: (value) => {
                return [
                  {
                    html: `<p>一级标题</p>`,
                    value: `# ${value}`,
                  },
                  {
                    html: `<p>二级标题</p>`,
                    value: `## ${value}`,
                  },
                ];
              },
            },
          ],
        },
        lang: "zh_CN",
        tab: "\t",
        theme: "dark",
        preview: {
          markdown: {
            paragraphBeginningSpace: true,
          },
        },
        toolbar: [
          "emoji",
          "headings",
          "bold",
          "italic",
          "strike",
          "|",
          "line",
          "quote",
          "list",
          "ordered-list",
          "check",
          "outdent",
          "indent",
          "code",
          "inline-code",
          "insert-after",
          "insert-before",
          "undo",
          "redo",
          "upload",
          "link",
          "table",
          "record",
          "edit-mode",
          "both",
          "preview",
          "fullscreen",
          "outline",
          "code-theme",
          "content-theme",
          "export",
          "devtools",
          "info",
          "help",
          "br",
        ],
      });
    }
  }, []);

  return <div ref={vditorWrapperRef} className="!text-accent-foreground"></div>;
}
export default VditorNote;
