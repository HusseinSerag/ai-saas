import { Outlet } from "react-router-dom";

export default function authLayout() {
  return (
    <div className="flex h-full items-center justify-center">
      <Outlet />
    </div>
  );
}
