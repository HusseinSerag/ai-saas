import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function UserAvatar() {
  const { user } = useUser();
  const avatar = user?.imageUrl;
  return (
    <Avatar>
      <AvatarImage src={avatar} />
      <AvatarFallback>
        {user?.firstName?.charAt(0)}
        {user?.lastName?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
}
