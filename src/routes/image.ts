import { getAuth } from "@clerk/fastify";
import fastify, { FastifyInstance, FastifyPluginOptions } from "fastify";
import { type ChatCompletionMessageParam } from "openai/resources";
import { openai } from "../config/openAI";
import {
  checkIfUserReachedLimit,
  increaseApiLimit,
} from "../utils/increase-api-limit";
import CustomError from "../utils/CustomError";
import { getSubscription } from "./apiLimit";

async function imageRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post<{
    Body: {
      prompt: string;
      amount: string;
      resolution:
        | "256x256"
        | "512x512"
        | "1024x1024"
        | "1792x1024"
        | "1024x1792"
        | null
        | undefined;
    };
  }>(
    "/",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            prompt: { type: "string" },
            amount: { type: "string" },
            resolution: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      try {
        const { userId } = getAuth(req);
        if (!userId) {
          throw new Error("unauthorized");
        }
        const freeTrial = await checkIfUserReachedLimit(req);
        const isPro = await getSubscription(userId);
        if (!freeTrial && !isPro) {
          throw new CustomError("Free trail has expired", 403);
        }
        const { amount, prompt, resolution } = req.body;

        const response = await openai.images.generate({
          prompt,
          n: parseInt(amount, 10),
          size: resolution,
        });
        if (!isPro) {
          await increaseApiLimit(req);
        }
        return response.data;
      } catch (e) {
        throw e;
      }
    }
  );
}

export default imageRoutes;
