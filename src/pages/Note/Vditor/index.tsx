import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import Vditor from "vditor";
import "vditor/src/assets/less/index.less";
import "./index.less";

export interface IVditorNoteProps {}

function VditorNote(props: IVditorNoteProps) {
  const {} = props;

  const vditorWrapper = useRef<HTMLDivElement>(null);
  const vditorRef = useRef<Vditor>(null);

  useEffect(() => {
    if (vditorWrapper.current) {
      vditorRef.current = new Vditor(vditorWrapper.current, {
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
                  {
                    html: `<p>三级标题</p>`,
                    value: `### ${value}`,
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
          theme: {
            current: "dark",
            list: {
              "ant-design": "Ant Design",
              dark: "Dark",
              light: "Light",
              wechat: "WeChat",
            },
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

  return (
    <Card className="h-full">
      <CardHeader>
        <CardAction>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>文件</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  New Window <MenubarShortcut>⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem disabled>New Incognito Window</MenubarItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>Share</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem
                      onClick={async () => {
                        const value = vditorRef.current?.getValue();
                        await navigator.clipboard.writeText(value ?? "");
                        toast.success("复制成功");
                      }}
                    >
                      复制全文到剪贴板
                    </MenubarItem>
                    <MenubarItem>Messages</MenubarItem>
                    <MenubarItem>Notes</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarItem>
                  Print... <MenubarShortcut>⌘P</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>Find</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>Search the web</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Find...</MenubarItem>
                    <MenubarItem>Find Next</MenubarItem>
                    <MenubarItem>Find Previous</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarItem>Cut</MenubarItem>
                <MenubarItem>Copy</MenubarItem>
                <MenubarItem>Paste</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>视图</MenubarTrigger>
              <MenubarContent>
                <MenubarCheckboxItem>全屏</MenubarCheckboxItem>
                <MenubarCheckboxItem checked>
                  Always Show Full URLs
                </MenubarCheckboxItem>
                <MenubarSeparator />
                <MenubarItem inset>
                  Reload <MenubarShortcut>⌘R</MenubarShortcut>
                </MenubarItem>
                <MenubarItem disabled inset>
                  Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem inset>Toggle Fullscreen</MenubarItem>
                <MenubarSeparator />
                <MenubarItem inset>Hide Sidebar</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Profiles</MenubarTrigger>
              <MenubarContent>
                <MenubarRadioGroup value="benoit">
                  <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
                  <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
                  <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
                </MenubarRadioGroup>
                <MenubarSeparator />
                <MenubarItem inset>Edit...</MenubarItem>
                <MenubarSeparator />
                <MenubarItem inset>Add Profile...</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div id="vditor" ref={vditorWrapper}></div>
      </CardContent>
    </Card>
  );
}
export default VditorNote;
