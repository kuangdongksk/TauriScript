import { defaultValueCtx, Editor, rootCtx } from "@milkdown/kit/core";
import { block } from "@milkdown/kit/plugin/block";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { Milkdown, useEditor } from "@milkdown/react";
import { nord } from "@milkdown/theme-nord";
import "@milkdown/theme-nord/style.css";
import { usePluginViewFactory } from "@prosemirror-adapter/react";
import type { FC } from "react";
import { BlockView } from "./view/Block";
import { slash, SlashView } from "./view/Slash";
import { tooltip, TooltipView } from "./view/Tooltip";

const markdown = `# Milkdown 编辑器

> 这是一行注释.

这是一个如何在**React**中使用的演示.

输入 \`/\` 来查看斜杆命令`;

export const MilkdownEditor: FC = () => {
  const pluginViewFactory = usePluginViewFactory();

  useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, markdown);
        ctx.set(block.key, {
          view: pluginViewFactory({
            component: BlockView,
          }),
        });
        ctx.set(slash.key, {
          view: pluginViewFactory({
            component: SlashView,
          }),
        });
        ctx.set(tooltip.key, {
          view: pluginViewFactory({
            component: TooltipView,
          }),
        });
      })
      .config(nord)
      .use(commonmark)
      .use(block)
      .use(slash)
      .use(tooltip);
  }, []);

  return <Milkdown />;
};
