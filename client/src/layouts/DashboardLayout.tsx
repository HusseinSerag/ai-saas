import { Outlet } from "react-router-dom";
import Navbar from "../components/custom/Navbar";
import Sidebar from "../components/custom/Sidebar";

export default function DashboardLayoutComponent() {
  return (
    <div className="relative h-full">
      <div className="z-[10] hidden h-full bg-gray-900 md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col">
        <Sidebar />
      </div>
      <main className="md:pl-72">
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
}
