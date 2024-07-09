import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export default function LandingNavbar() {
  const { isSignedIn } = useAuth();
  return (
    <nav className="flex items-center justify-between bg-transparent p-4">
      <Link to={"/"} className="flex items-center">
        <div className="relative mr-4 h-8 w-8">
          <img src="/logo.png" />
        </div>
        <h1 className={cn("font-montserrat text-2xl font-bold text-white")}>
          Genius
        </h1>
      </Link>
      <div className="flex items-center gap-x-2">
        <Link to={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button variant={"outline"} className="rounded-full">
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  );
}
