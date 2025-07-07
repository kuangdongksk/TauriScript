import { HeroSelection } from "@/components/HeroSelection";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const GamePage = () => {
  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <HeroSelection />
      </CardContent>
    </Card>
  );
};
