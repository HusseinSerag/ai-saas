import { Outlet } from "react-router-dom";
import FullPageLoader from "../components/custom/FullPageLoader";
import useApiLimit from "../query/useApiLimit";

export default function GetUserInfoLayout() {
  const { isLoading } = useApiLimit();
  if (isLoading) return <FullPageLoader />;
  return <Outlet />;
}
