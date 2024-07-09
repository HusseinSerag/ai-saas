import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getApiLimit } from "./api";

export default function useApiLimit() {
  const { userId } = useAuth();
  const userID = userId!;
  const { data, isLoading } = useQuery({
    queryKey: ["api-limit", userID],
    queryFn: () => getApiLimit(),
  });
  return {
    data,
    isLoading,
  };
}
