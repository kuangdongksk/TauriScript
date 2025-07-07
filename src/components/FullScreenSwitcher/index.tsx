import { useFullscreen } from "ahooks";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export interface IFullScreenSwitcherProps {
  elementRef: React.RefObject<HTMLDivElement | null>;
}

function FullScreenSwitcher(props: IFullScreenSwitcherProps) {
  const { elementRef } = props;

  const [是否全屏, { toggleFullscreen }] = useFullscreen(elementRef, {
    pageFullscreen: false,
  });

  const [是否页面全屏, { toggleFullscreen: 切换页面全屏 }] = useFullscreen(
    elementRef,
    {
      pageFullscreen: true,
    }
  );

  return (
    <ToggleGroup type="single">
      <ToggleGroupItem
        value="a"
        onClick={() => {
          if (是否页面全屏) 切换页面全屏();
          toggleFullscreen();
        }}
      >
        全屏
      </ToggleGroupItem>
      <ToggleGroupItem
        value="b"
        onClick={() => {
          if (是否全屏) toggleFullscreen();
          切换页面全屏();
        }}
      >
        页面全屏
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
export default FullScreenSwitcher;
