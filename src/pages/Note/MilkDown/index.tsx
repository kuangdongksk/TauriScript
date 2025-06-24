import { defaultValueCtx, Editor, rootCtx } from "@milkdown/kit/core";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { usePluginViewFactory } from "@prosemirror-adapter/react";
import SlashView, { slash } from "./SlashView";

export interface IMilkDownProps {}

const markdown = `# Milkdown React Slash

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **React**.

Type \`/\` to see the slash command.`;

const AutoSaveEditor: React.FC = () => {
  const pluginViewFactory = usePluginViewFactory();

  const { get } = useEditor(
    (root) =>
      Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, root);
          ctx.set(defaultValueCtx, markdown);
          ctx.set(slash.key, {
            view: pluginViewFactory({
              component: SlashView,
            }),
          });
          // Add markdown listener for auto-save
          ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
            // Save content to your backend or storage
            saveToBackend(markdown);
          });
        })
        .use(commonmark)
        .use(slash)
        .use(listener),
    []
  );

  const saveToBackend = (markdown: string) => {
    console.log("🚀 ~ saveToBackend ~ markdown:", markdown);
  };

  return <Milkdown />;
};

function MilkdownEditor(props: IMilkDownProps) {
  const {} = props;

  return (
    <div className="bg-primary">
      <MilkdownProvider>
        <AutoSaveEditor />
      </MilkdownProvider>
    </div>
  );
}
export default MilkdownEditor;
