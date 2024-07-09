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

const instructionMessage: ChatCompletionMessageParam = {
  role: "system",
  content:
    "You are a code generator. You must only generate in markdown code snippets and after generating code you should always provide explanation. Use Code comments for explanation and be detailed",
};
async function codeRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post<{
    Body: {
      messages: ChatCompletionMessageParam[];
    };
  }>("/", async (req, reply) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        throw new Error("unauthorized");
      }

      const { messages } = req.body;

      const isPro = await getSubscription(userId);
      const freeTrial = await checkIfUserReachedLimit(req);
      if (!freeTrial && !isPro) {
        throw new CustomError("Free trail has expired", 403);
      }
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [instructionMessage, ...messages],
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

export default codeRoutes;
