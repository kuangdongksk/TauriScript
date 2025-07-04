import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { editorViewCtx } from "@milkdown/kit/core";
import { Ctx } from "@milkdown/kit/ctx";
import { createCodeBlockCommand } from "@milkdown/kit/preset/commonmark";
import { callCommand } from "@milkdown/kit/utils";
import { slashFactory, SlashProvider } from "@milkdown/plugin-slash";
import { useInstance } from "@milkdown/react";
import { usePluginViewContext } from "@prosemirror-adapter/react";
import React, { useCallback, useEffect, useRef } from "react";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";

export const slash = slashFactory("Commands");

export const SlashView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const slashProvider = useRef<SlashProvider>(null);

  const { view, prevState } = usePluginViewContext();
  const [loading, get] = useInstance();
  const action = useCallback(
    (fn: (ctx: Ctx) => void) => {
      if (loading) return;
      get().action(fn);
    },
    [loading]
  );

  useEffect(() => {
    const div = ref.current;
    if (loading || !div) {
      return;
    }
    slashProvider.current = new SlashProvider({
      content: div,
    });

    return () => {
      slashProvider.current?.destroy();
    };
  }, [loading]);

  useEffect(() => {
    slashProvider.current?.update(view, prevState);
  });

  const command = (e: React.KeyboardEvent | React.MouseEvent) => {
    e.preventDefault(); // 阻止键盘输入插入到编辑器中。
    action((ctx) => {
      const view = ctx.get(editorViewCtx);
      const { dispatch, state } = view;
      const { tr, selection } = state;
      const { from } = selection;
      dispatch(tr.deleteRange(from - 1, from));
      view.focus();

      return callCommand(createCodeBlockCommand.key)(ctx);
    });
  };

  return (
    <Card
      ref={ref}
      aria-expanded="false"
      className="absolute data-[show='false']:hidden py-3"
    >
      <CardContent className="px-3 grid gap-2">
        <Button
          onKeyDown={(e) => command(e)}
          onMouseDown={(e) => {
            command(e);
          }}
        >
          <CodeRoundedIcon />
          代码块
        </Button>
        <Button
          onKeyDown={(e) => command(e)}
          onMouseDown={(e) => {
            command(e);
          }}
        >
          <CodeRoundedIcon />
          代码块
        </Button>
      </CardContent>
    </Card>
  );
};
