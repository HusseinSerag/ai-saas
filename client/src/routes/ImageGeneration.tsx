import { Download, ImageIcon } from "lucide-react";
import Heading from "../components/custom/Heading";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

import { useState } from "react";

import Empty from "../components/custom/Empty";
import Loader from "../components/custom/Loader";

import {
  amountOptions,
  imageFormSchema,
  resolutionOptions,
} from "../constants/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardFooter } from "../components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newImageMessage } from "../query/api";
import { useModal } from "../contexts/ProModal";
import { AxiosError } from "axios";
import { ErrorFromAxios } from "../lib/utils";
import toast from "react-hot-toast";

export default function ImageGeneration() {
  const form = useForm<z.infer<typeof imageFormSchema>>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512",
    },
  });

  const [images, setImages] = useState<string[]>([]);
  const { onOpen } = useModal();

  const queryClient = useQueryClient();
  const { mutateAsync: sendImage } = useMutation({
    mutationFn: newImageMessage,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["api-limit"] });
    },
  });

  const isLoading = form.formState.isSubmitting;
  async function onSubmit(values: z.infer<typeof imageFormSchema>) {
    try {
      setImages([]);

      const response = await sendImage(values);

      const urls = response.map((image: { url: string }) => image.url);

      setImages(urls);
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
        title="Image Generation"
        description="Turn your prompt into an image"
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
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
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="A picture of a horse in Swiss apls"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="amount"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                name="resolution"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              <div className="p-20">
                <Loader />
              </div>
            )}
            {images.length === 0 && !isLoading && (
              <Empty label="No images generated" />
            )}
            <div className="mt-8 grid w-fit grid-cols-1 items-center gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images.map((image) => (
                <Card className="overflow-hidden rounded-lg" key={image}>
                  <div className="relative aspect-square">
                    <img className="" alt="image" src={image} />
                  </div>
                  <CardFooter className="p-2">
                    <Button
                      onClick={() => window.open(image)}
                      variant={"secondary"}
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4">Download</Download>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
