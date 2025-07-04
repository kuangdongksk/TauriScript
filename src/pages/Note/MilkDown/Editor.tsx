import { defaultValueCtx, Editor, rootCtx } from "@milkdown/kit/core";
import { block } from "@milkdown/kit/plugin/block";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { Milkdown, useEditor } from "@milkdown/react";
import { nord } from "@milkdown/theme-nord";
import "@milkdown/theme-nord/style.css";
import { usePluginViewFactory } from "@prosemirror-adapter/react";
import type { FC } from "react";
import { BlockView } from "./view/Block";
import { slash, SlashView } from "./view/SlashView";

const markdown = `# Milkdown React Slash

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **React**.

Type \`/\` to see the slash command.`;

export const MilkdownEditor: FC = () => {
  const pluginViewFactory = usePluginViewFactory();

  useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, markdown);
        ctx.set(slash.key, {
          view: pluginViewFactory({
            component: SlashView,
          }),
        });
        ctx.set(block.key, {
          view: pluginViewFactory({
            component: BlockView,
          }),
        });
      })
      .config(nord)
      .use(commonmark)
      .use(slash);
  }, []);

  return <Milkdown />;
};
