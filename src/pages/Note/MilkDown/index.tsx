import { MilkdownProvider } from "@milkdown/react";
import "@milkdown/theme-nord/style.css";
import type { FC } from "react";
import { MilkdownEditor } from "./Editor";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";

const Editor: FC = () => {
  return (
    <div className="bg-primary text-primary-foreground">
      <MilkdownProvider>
        <ProsemirrorAdapterProvider>
          <MilkdownEditor />
        </ProsemirrorAdapterProvider>
      </MilkdownProvider>
    </div>
  );
};
export default Editor;
