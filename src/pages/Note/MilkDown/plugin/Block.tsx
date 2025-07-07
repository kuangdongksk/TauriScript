import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { BlockProvider } from "@milkdown/kit/plugin/block";
import { useInstance } from "@milkdown/react";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import { useEffect, useRef } from "react";

export const BlockView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const tooltipProvider = useRef<BlockProvider>(null);

  const [loading, get] = useInstance();

  useEffect(() => {
    const div = ref.current;
    if (loading || !div) return;

    const editor = get();
    if (!editor) return;

    tooltipProvider.current = new BlockProvider({
      ctx: editor.ctx,
      content: div,
    });
    tooltipProvider.current?.update();

    return () => {
      tooltipProvider.current?.destroy();
    };
  }, [loading]);

  return (
    <div ref={ref} className="absolute data-[show=true]:block hidden">
      <ContextMenu>
        <ContextMenuTrigger className="bg-secondary hover:bg-chart-2 rounded-md cursor-grab active:cursor-grabbing">
          <DragIndicatorOutlinedIcon />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Profile</ContextMenuItem>
          <ContextMenuItem>Billing</ContextMenuItem>
          <ContextMenuItem>Team</ContextMenuItem>
          <ContextMenuItem>Subscription</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};
