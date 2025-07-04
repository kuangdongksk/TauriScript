import { defaultValueCtx, Editor, rootCtx } from "@milkdown/kit/core";
import { block } from "@milkdown/kit/plugin/block";
import {
  commonmark,
  headingSchema,
  paragraphSchema,
} from "@milkdown/kit/preset/commonmark";
import { Plugin } from "@milkdown/kit/prose/state";
import { Decoration, DecorationSet } from "@milkdown/kit/prose/view";
import { $prose, $view } from "@milkdown/kit/utils";
import { Milkdown, useEditor } from "@milkdown/react";
import { nord } from "@milkdown/theme-nord";
import "@milkdown/theme-nord/style.css";
import {
  useNodeViewFactory,
  usePluginViewFactory,
  useWidgetViewFactory,
} from "@prosemirror-adapter/react";
import type { FC } from "react";
import CustomP from "./custom/node/CustomP";
import { TotalCount } from "./custom/plugin/TotalCount";
import { HeadingAnchor } from "./custom/widget/HeadingAnchor";
import { BlockView } from "./plugin/Block";
import { slash, SlashView } from "./plugin/Slash";
import { tooltip, TooltipView } from "./plugin/Tooltip";

const markdown = `# Milkdown 编辑器

> 这是一行注释.

这是一个如何在**React**中使用的演示.

输入 \`/\` 来查看斜杆命令`;

export const MilkdownEditor: FC = () => {
  const nodeViewFactory = useNodeViewFactory();
  const pluginViewFactory = usePluginViewFactory();
  const widgetViewFactory = useWidgetViewFactory();

  useEditor((root) => {
    return (
      Editor.make()
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
        .use(tooltip)
        //添加自定义节点视图
        .use(
          $view(paragraphSchema.node, () =>
            nodeViewFactory({
              component: CustomP,
            })
          )
        )
        // Add a custom plugin view
        .use(
          $prose(
            () =>
              new Plugin({
                view: pluginViewFactory({ component: TotalCount }),
              })
          )
        )
        // Add a custom widget view
        .use(
          $prose((ctx) => {
            const getAnchorWidget = widgetViewFactory({
              as: "span",
              component: HeadingAnchor,
            });
            return new Plugin({
              props: {
                decorations: (state) => {
                  const widgets: Decoration[] = [];

                  state.doc.descendants((node, pos) => {
                    if (node.type === headingSchema.type(ctx)) {
                      widgets.push(
                        getAnchorWidget(pos + 1, {
                          id: node.attrs.id,
                          level: node.attrs.level,
                          side: -1,
                        })
                      );
                    }
                  });

                  return DecorationSet.create(state.doc, widgets);
                },
              },
            });
          })
        )
    );
  }, []);

  return <Milkdown />;
};
