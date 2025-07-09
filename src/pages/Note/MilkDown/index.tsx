import FullScreenSwitcher from "@/components/FullScreenSwitcher";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { MilkdownProvider } from "@milkdown/react";
import "@milkdown/theme-nord/style.css";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
import type { FC } from "react";
import React from "react";
import { MilkdownEditor } from "./Editor";
import "./index.less";

const Editor: FC = () => {
  const elementRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <Card className="h-full " ref={elementRef}>
      <CardHeader>
        <CardAction>
          <FullScreenSwitcher elementRef={elementRef} />
        </CardAction>
      </CardHeader>
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
