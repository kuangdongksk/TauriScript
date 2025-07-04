import { Ctx } from "@milkdown/kit/ctx";
import { tooltipFactory, TooltipProvider } from "@milkdown/kit/plugin/tooltip";
import { toggleStrongCommand } from "@milkdown/kit/preset/commonmark";
import { useInstance } from "@milkdown/react";
import { usePluginViewContext } from "@prosemirror-adapter/react";
import { useCallback, useEffect, useRef } from "react";
import { callCommand } from "@milkdown/kit/utils";
import Button from "@mui/material/Button";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

export const tooltip = tooltipFactory("Text");

export const TooltipView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const tooltipProvider = useRef<TooltipProvider>(null);

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
    tooltipProvider.current = new TooltipProvider({
      content: div,
    });

    return () => {
      tooltipProvider.current?.destroy();
    };
  }, [loading]);

  useEffect(() => {
    tooltipProvider.current?.update(view, prevState);
  });

  return (
    <div className="absolute data-[show=false]:hidden" ref={ref}>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger
            onMouseDown={(e) => {
              // Use `onMouseDown` with `preventDefault` to prevent the editor from losing focus.
              e.preventDefault();

              action(callCommand(toggleStrongCommand.key));
            }}
          >
            B
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};
