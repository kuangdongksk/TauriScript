import { MilkdownProvider } from "@milkdown/react";
import "@milkdown/theme-nord/style.css";
import type { FC } from "react";
import { MilkdownEditor } from "./Editor";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
import { Card, CardContent } from "@/components/ui/card";
import "./index.less";

const Editor: FC = () => {
  return (
    <Card className="h-full ">
      <CardContent>
        <MilkdownProvider>
          <ProsemirrorAdapterProvider>
            <MilkdownEditor />
          </ProsemirrorAdapterProvider>
        </MilkdownProvider>
      </CardContent>
    </Card>
  );
};
export default Editor;
