import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onSubscribe } from "./api";
import toast from "react-hot-toast";

export function useSubscribe() {
  const queryClient = useQueryClient();
  const { isPending: isSubscribing, mutate: subscribe } = useMutation({
    mutationFn: onSubscribe,
    onError: () => toast.error("Something went wrong"),
    onSuccess: async () => await queryClient.invalidateQueries(),
  });

  return {
    isSubscribing,
    subscribe,
  };
}
