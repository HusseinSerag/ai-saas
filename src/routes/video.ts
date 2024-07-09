import { getAuth } from "@clerk/fastify";
import fastify, { FastifyInstance, FastifyPluginOptions } from "fastify";
import replicate from "../config/replicate";
import {
  checkIfUserReachedLimit,
  increaseApiLimit,
} from "../utils/increase-api-limit";
import CustomError from "../utils/CustomError";
import { getSubscription } from "./apiLimit";

async function videoRoutes(
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

        const input = {
          prompt,
        };

        const response = await replicate.run(
          "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
          { input }
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

export default videoRoutes;
