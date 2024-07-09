import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "../ui/avatar";

export default function BotAvatar() {
  return (
    <Avatar>
      <AvatarImage className="p-1" src="/logo.png" />
    </Avatar>
  );
}
