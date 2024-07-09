import { clerkClient, getAuth } from "@clerk/fastify";
import fastify, { FastifyInstance, FastifyPluginOptions } from "fastify";
import { type ChatCompletionMessageParam } from "openai/resources";
import { openai } from "../config/openAI";
import {
  checkIfUserReachedLimit,
  increaseApiLimit,
} from "../utils/increase-api-limit";
import CustomError from "../utils/CustomError";
import { getSubscription } from "./apiLimit";

async function conversationRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post<{
    Body: {
      messages: ChatCompletionMessageParam[];
    };
  }>("/", async (req, reply) => {
    const { userId } = getAuth(req);
    console.log(userId);
    if (!userId) {
      throw new Error("unauthorized");
    }

    const isPro = await getSubscription(userId);

    const freeTrial = await checkIfUserReachedLimit(req);
    if (!freeTrial && !isPro) {
      throw new CustomError("Free trail has expired", 403);
    }
    const { messages } = req.body;
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
      });
      if (!isPro) {
        await increaseApiLimit(req);
      }
      return response.choices[0].message;
    } catch (e) {
      throw e;
    }
  });
}

export default conversationRoutes;

// fastify.post<{
//     Body: {
//       messages: ChatCompletionMessageParam[];
//     };
//   }>(
//     "/",

//     async (req, reply) => {
//       /**
//        * Access the auth state for this request.
//        * In this example, the userId loads the whole User object
//        * from the Clerk servers
//        */
//       const { messages } = req.body;

//       try {
//         // const { userId } = getAuth(req);
//         // if (!userId) {
//         //   throw new Error("unauthorized");
//         // }
//         console.log(messages[0].role);
//         return { messages: messages };
//         // const completion = await openai.chat.completions.create({
//         //   model: "gpt-3.5-turbo",
//         //   messages: [
//         //     {
//         //       role: "user",
//         //       content: [
//         //         {
//         //           type: "text",
//         //           text: "generate code",
//         //         },
//         //       ],
//         //     },
//         //   ],
//         //   temperature: 1,
//         //   max_tokens: 256,
//         //   top_p: 1,
//         //   frequency_penalty: 0,
//         //   presence_penalty: 0,
//         // });

//         // const user = await clerkClient.users.getUser(userId);
//         // // return { message: "success", text: completion.choices[0] };
//         // return { user };
//       } catch (e) {
//         return e;
//       }
//     }
//   );
