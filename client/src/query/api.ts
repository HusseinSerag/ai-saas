import axios from "axios";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import * as z from "zod";
import { imageFormSchema } from "../constants/image";
import { conversationFormSchema } from "../constants/conversation";

export async function getApiLimit() {
  try {
    const response = await axios.get(`http://localhost:3000/user`, {
      withCredentials: true,
    });
    return {
      limit: response.data.limit as number,
      isPro: response.data.isPro as boolean,
    };
  } catch (e) {
    throw e;
  }
}

export async function newConvoMessage({
  messages,
}: {
  messages: ChatCompletionMessageParam[];
}) {
  try {
    const response = await axios.post(
      "http://localhost:3000/conversations",
      {
        messages,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (e) {
    throw e;
  }
}

export async function newCodeMessage({
  messages,
}: {
  messages: ChatCompletionMessageParam[];
}) {
  try {
    const response = await axios.post(
      "http://localhost:3000/code",
      {
        messages,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (e) {
    throw e;
  }
}

export async function newImageMessage(values: z.infer<typeof imageFormSchema>) {
  try {
    const response = await axios.post("http://localhost:3000/image", values, {
      withCredentials: true,
    });
    return response.data;
  } catch (e) {
    throw e;
  }
}

export async function newMusicMessage(
  values: z.infer<typeof conversationFormSchema>,
) {
  try {
    const response = await axios.post("http://localhost:3000/music", values, {
      withCredentials: true,
    });
    return response.data;
  } catch (e) {
    throw e;
  }
}

export async function newVideoMessage(
  values: z.infer<typeof conversationFormSchema>,
) {
  try {
    const response = await axios.post("http://localhost:3000/video", values, {
      withCredentials: true,
    });
    return response.data[0];
  } catch (e) {
    throw e;
  }
}

export async function onSubscribe() {
  try {
    const response = await axios.get("http://localhost:3000/payment/", {
      withCredentials: true,
    });
    window.location.href = response.data.url;
  } catch (e) {
    throw e;
  }
}
