import { MessageSquare } from "lucide-react";
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

import openAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import Empty from "../components/custom/Empty";
import Loader from "../components/custom/Loader";
import { cn, ErrorFromAxios } from "../lib/utils";
import UserAvatar from "../components/custom/userAvatar";
import BotAvatar from "../components/custom/BotAvatar";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newConvoMessage } from "../query/api";
import { useModal } from "../contexts/ProModal";
import toast from "react-hot-toast";

export default function Conversation() {
  const form = useForm<z.infer<typeof conversationFormSchema>>({
    resolver: zodResolver(conversationFormSchema),
    defaultValues: {
      prompt: "",
    },
  });
  const { user } = useUser();
  const [messages, setMessages] = useState<
    openAI.Chat.Completions.ChatCompletionMessageParam[]
  >([]);
  const queryClient = useQueryClient();
  const { mutateAsync: sendConvo } = useMutation({
    mutationFn: newConvoMessage,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["api-limit"] });
    },
  });
  const { onOpen } = useModal();

  const isLoading = form.formState.isSubmitting;
  async function onSubmit(values: z.infer<typeof conversationFormSchema>) {
    const userMessage: ChatCompletionMessageParam = {
      role: "user",
      content: values.prompt,
    };
    try {
      const newMessages = [...messages, userMessage];
      setMessages((currentMessages) => [...currentMessages, userMessage]);
      const data = await sendConvo({
        messages: newMessages,
      });
      setMessages((currentMessages) => [...currentMessages, data]);
      form.reset();
    } catch (e) {
      setMessages(messages);
      //toDO open Pro Modal
      const error = (e as AxiosError).response;

      if (error?.status === 403) onOpen();
      else toast.error("Something went wrong");
    }
  }
  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced conversation model"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
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
                        placeholder="How do I calculate the radius of a circle?"
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
            {messages.length === 0 && !isLoading && (
              <Empty label="No conversation started" />
            )}
            <div className="flex flex-col-reverse gap-y-4">
              {messages.map((message) => (
                <div
                  className={cn(
                    "flex w-full flex-col gap-x-8 gap-y-4 rounded-lg p-8 md:flex-row md:items-center md:gap-y-0",
                    message.role === "user"
                      ? "border border-black/10 bg-white"
                      : "bg-muted",
                  )}
                  key={message.content as string}
                >
                  <div className="flex items-center gap-2">
                    {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                    <p className="font-semibold md:hidden">
                      {message.role === "user"
                        ? user?.firstName || "You"
                        : "Genius"}
                    </p>
                  </div>
                  <p className="text-sm">{message.content as string}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
