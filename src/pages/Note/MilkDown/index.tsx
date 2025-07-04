import { MilkdownProvider } from "@milkdown/react";
import "@milkdown/theme-nord/style.css";
import type { FC } from "react";
import { MilkdownEditor } from "./Editor";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
import { Card, CardContent } from "@/components/ui/card";

const Editor: FC = () => {
  return (
    <Card className="h-full bg-primary text-primary-foreground">
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
