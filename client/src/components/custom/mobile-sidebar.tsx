import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { SheetContent, SheetTrigger, Sheet } from "../ui/sheet";
import Sidebar from "./Sidebar";

export default function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="border-0 p-0 md:hidden">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
