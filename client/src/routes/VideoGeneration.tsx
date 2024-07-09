import { VideoIcon } from "lucide-react";
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
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { AxiosError } from "axios";
import { useState } from "react";

import Empty from "../components/custom/Empty";
import Loader from "../components/custom/Loader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newVideoMessage } from "../query/api";

import { useModal } from "../contexts/ProModal";
import toast from "react-hot-toast";

export default function VideoGeneration() {
  const form = useForm<z.infer<typeof conversationFormSchema>>({
    resolver: zodResolver(conversationFormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const { onOpen } = useModal();
  const [video, setVideo] = useState<string>("");
  const queryClient = useQueryClient();
  const { mutateAsync: sendVideo } = useMutation({
    mutationFn: newVideoMessage,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["api-limit"] });
    },
  });
  const isLoading = form.formState.isSubmitting;
  async function onSubmit(values: z.infer<typeof conversationFormSchema>) {
    try {
      setVideo("");

      const response = await sendVideo(values);

      setVideo(response);
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
        title="Video Generation"
        description="Turning your prompt into video"
        icon={VideoIcon}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
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
                        placeholder="Clown fish swimming around a coral reef"
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
            {!video && !isLoading && <Empty label="No video generated" />}
            {video && (
              <video
                controls
                className="mx-auto mt-8 aspect-video w-full max-w-[900px] rounded-lg border bg-black"
              >
                <source src={video} />
              </video>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
