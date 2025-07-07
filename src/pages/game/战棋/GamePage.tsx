import FullScreenSwitcher from "@/components/FullScreenSwitcher";
import { HeroSelection } from "@/components/HeroSelection";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { useRef } from "react";

export const GamePage = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  return (
    <Card ref={elementRef}>
      <CardHeader>
        <CardAction>
          <FullScreenSwitcher elementRef={elementRef} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <HeroSelection />
      </CardContent>
    </Card>
  );
};
