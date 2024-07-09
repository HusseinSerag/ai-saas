import { Link, useLocation } from "react-router-dom";
import {
  Code,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Music,
  Settings,
  VideoIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";
import useApiLimit from "../../query/useApiLimit";
import FreeCounter from "./FreeCounter";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    to: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Conversation",
    icon: MessageSquare,
    to: "/conversation",
    color: "text-violet-500",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    to: "/image",
    color: "text-pink-700",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    to: "/video",
    color: "text-orange-700",
  },
  {
    label: "Music Generation",
    icon: Music,
    to: "/music",
    color: "text-emerald-500",
  },
  {
    label: "Code Generation",
    icon: Code,
    to: "/code",
    color: "text-green-700",
  },
  {
    label: "Settings",
    icon: Settings,
    to: "/settings",
  },
];
export default function Sidebar() {
  const { pathname } = useLocation();
  const { data } = useApiLimit();
  const { limit, isPro } = data!;
  return (
    <div className="flex h-full flex-col space-y-4 bg-[#111827] py-4 text-white">
      <div className="flex-1 px-3 py-2">
        <Link className="mb-14 flex items-center pl-3" to={"/dashboard"}>
          <div className="relative mr-4 h-8 w-8">
            <img src="logo.png" alt="logo" />
          </div>
          <h1 className="font-montserrat text-2xl font-bold">Genius</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.to}
              className={cn(
                "w-fill group flex cursor-pointer justify-start rounded-lg p-3 text-sm font-medium transition hover:bg-white/10 hover:text-white",
                pathname === route.to
                  ? "bg-white/10 text-white"
                  : "text-zinc-400",
              )}
              to={route.to}
            >
              <div className="flex flex-1 items-center">
                <route.icon className={cn("mr-3 h-5 w-5", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      {!isPro && <FreeCounter limit={{ limit: limit }} />}
    </div>
  );
}
