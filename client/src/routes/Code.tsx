import { Code } from "lucide-react";
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
import axios, { AxiosError } from "axios";
import { useState } from "react";

import openAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import Empty from "../components/custom/Empty";
import Loader from "../components/custom/Loader";
import { cn, ErrorFromAxios } from "../lib/utils";
import UserAvatar from "../components/custom/userAvatar";
import BotAvatar from "../components/custom/BotAvatar";
import { useUser } from "@clerk/clerk-react";
import ReactMarkdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newCodeMessage } from "../query/api";
import { useModal } from "../contexts/ProModal";
import toast from "react-hot-toast";

export default function CodeGeneration() {
  const form = useForm<z.infer<typeof conversationFormSchema>>({
    resolver: zodResolver(conversationFormSchema),
    defaultValues: {
      prompt: "",
    },
  });
  const { onOpen } = useModal();
  const { user } = useUser();
  const [messages, setMessages] = useState<
    openAI.Chat.Completions.ChatCompletionMessageParam[]
  >([]);

  const queryClient = useQueryClient();
  const { mutateAsync: sendCode } = useMutation({
    mutationFn: newCodeMessage,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["api-limit"] });
    },
  });
  const isLoading = form.formState.isSubmitting;
  async function onSubmit(values: z.infer<typeof conversationFormSchema>) {
    try {
      const userMessage: ChatCompletionMessageParam = {
        role: "user",
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];
      setMessages((currentMessages) => [...currentMessages, userMessage]);
      const data = await sendCode({ messages: newMessages });
      setMessages((currentMessages) => [...currentMessages, data]);
      form.reset();
    } catch (e) {
      //toDO open Pro Modal

      setMessages(messages);
      const error = (e as AxiosError).response;

      if (error?.status === 403) onOpen();
      else toast.error("Something went wrong");
    }
  }
  return (
    <div>
      <Heading
        title="Code Generation"
        description="Generate code using descriptive text."
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
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
                        placeholder="Create a toggle button using react hooks."
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
                  {message.role === "user" ? (
                    <p className="text-sm">{message.content as string}</p>
                  ) : (
                    <ReactMarkdown
                      components={{
                        pre: ({ node, ...props }) => {
                          return (
                            <div className="my-2 w-full overflow-auto rounded-lg bg-black/10 p-2">
                              <pre {...props} />
                            </div>
                          );
                        },
                        code: ({ node, ...props }) => (
                          <code
                            className="rounded-lg bg-black/10 p-1"
                            {...props}
                          />
                        ),
                      }}
                      className="overflow-hidden text-sm leading-7"
                    >
                      {message.content as string}
                    </ReactMarkdown>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
