import { Zap } from "lucide-react";
import useApiLimit from "../../query/useApiLimit";
import { Button } from "../ui/button";

import { useSubscribe } from "../../query/useSubscribe";

export default function SubscrptionButton() {
  const { data } = useApiLimit();
  const { isPro } = data!;

  const { isSubscribing, subscribe } = useSubscribe();
  function onClick() {
    subscribe();
  }
  return (
    <Button
      disabled={isSubscribing}
      variant={isPro ? "default" : "premium"}
      onClick={onClick}
    >
      {isPro ? "manage subscriptions" : "Upgrade"}
      {!isPro && <Zap className="ml-2 h-4 w-4 fill-white" />}
    </Button>
  );
}
