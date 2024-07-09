import { Zap } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { useModal } from "../../contexts/ProModal";

const MAX_FREE_COUNT = 5;

interface FreeCounterProps {
  limit: {
    limit: number;
  };
}
export default function FreeCounter({ limit }: FreeCounterProps) {
  const { onOpen } = useModal();
  return (
    <div className="px-3">
      <Card className="border-0 bg-white/10">
        <CardContent className="py-6">
          <div className="mb-4 space-y-2 text-center text-sm text-white">
            <p>
              {limit.limit} / {MAX_FREE_COUNT} free generations
            </p>
            <div>
              <Progress
                className="h-3"
                value={(limit.limit * 100) / MAX_FREE_COUNT}
              />
            </div>
          </div>
          <Button onClick={onOpen} className="w-full" variant={"premium"}>
            Upgrade
            <Zap className="ml-2 h-4 w-4 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
