import { getAuth } from "@clerk/fastify";
import fastify, { FastifyInstance, FastifyPluginOptions } from "fastify";
import replicate from "../config/replicate";
import {
  checkIfUserReachedLimit,
  increaseApiLimit,
} from "../utils/increase-api-limit";
import CustomError from "../utils/CustomError";
import { getSubscription } from "./apiLimit";

async function musicRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post<{
    Body: {
      prompt: string;
    };
  }>(
    "/",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            prompt: { type: "string" },
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
        const { prompt } = req.body;

        const response = await replicate.run(
          "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
          { input: { prompt_b: prompt } }
        );
        if (!isPro) {
          await increaseApiLimit(req);
        }
        return response;
      } catch (e) {
        throw e;
      }
    }
  );
}

export default musicRoutes;
