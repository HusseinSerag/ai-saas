import { Check, Zap } from "lucide-react";
import { useModal } from "../../contexts/ProModal";
import { cn } from "../../lib/utils";
import { tools } from "../../routes/dashboard";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";

import { useSubscribe } from "../../query/useSubscribe";

export default function Modal() {
  const { isOpen, onClose } = useModal();

  const { isSubscribing, subscribe } = useSubscribe();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        console.log(isOpen);
        onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center justify-center gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 py-1 font-bold">
              Upgrade to Genius
              <Badge variant="premium" className="py-1 text-sm uppercase">
                pro
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="space-y-2 pt-2 text-center font-medium text-zinc-900">
            {tools.map((tool) => (
              <Card
                key={tool.to}
                className="border-back/5 flex items-center justify-between p-3"
              >
                <div className="flex items-center gap-x-4">
                  <div className={cn("w-fit rounded-md p-2", tool.bgColor)}>
                    <tool.icon className={cn("h-6 w-6", tool.color)} />
                  </div>
                  <div className="text-sm font-semibold">{tool.label}</div>
                </div>
                <Check className="h-5 w-5 text-primary" />
              </Card>
            ))}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={isSubscribing}
            onClick={() => subscribe()}
            size="lg"
            variant="premium"
            className="w-full"
          >
            Upgrade <Zap className="ml-2 h-4 w-4 fill-white" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
