import { Music as MusicIcon } from "lucide-react";
import Heading from "../components/custom/Heading";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { conversationFormSchema } from "../constants/conversation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import axios, { AxiosError } from "axios";
import { useState } from "react";

import Empty from "../components/custom/Empty";
import Loader from "../components/custom/Loader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newMusicMessage } from "../query/api";
import { useModal } from "../contexts/ProModal";
import { ErrorFromAxios } from "../lib/utils";
import toast from "react-hot-toast";

export default function Music() {
  const form = useForm<z.infer<typeof conversationFormSchema>>({
    resolver: zodResolver(conversationFormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const { onOpen } = useModal();
  const [music, setMusic] = useState<string>("");
  const queryClient = useQueryClient();
  const { mutateAsync: sendVideo } = useMutation({
    mutationFn: newMusicMessage,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["api-limit"] });
    },
  });

  const isLoading = form.formState.isSubmitting;
  async function onSubmit(values: z.infer<typeof conversationFormSchema>) {
    try {
      setMusic("");

      const response = await sendVideo(values);
      setMusic(response.audio);
      form.reset();
    } catch (e) {
      //toDO open Pro Modal
      const error = (e as AxiosError).response;

      if (error?.status === 403) onOpen();
      else toast.error("Something went wrong");
    }
  }
  return (
    <div>
      <Heading
        title="Music Generation"
        description="Turning your prompt into music"
        icon={MusicIcon}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid w-full grid-cols-12 gap-2 rounded-lg border p-4 px-3 focus-within:shadow-sm md:px-6"
            >
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Piano solo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 w-full lg:col-span-2"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
          <div className="mt-4 space-y-4">
            {isLoading && (
              <div className="flex w-full items-center justify-center rounded-lg bg-muted p-8">
                <Loader />
              </div>
            )}
            {!music && !isLoading && <Empty label="No music generated" />}
            {music && (
              <audio controls className="mt-8 w-full">
                <source src={music} />
              </audio>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
