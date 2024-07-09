import * as React from "react";
import { useAuth } from "@clerk/clerk-react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/custom/Navbar";
import Sidebar from "../components/custom/Sidebar";
import FullPageLoader from "../components/custom/FullPageLoader";

export default function DashboardLayout() {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId]);

  if (!isLoaded) return <FullPageLoader />;

  return <Outlet />;
}
