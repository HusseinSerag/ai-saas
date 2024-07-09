import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "./../.env") });

import Fastify from "fastify";
import { clerkPlugin } from "@clerk/fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";

import conversationRoutes from "./routes/conversations";
import codeRoutes from "./routes/code";
import imageRoutes from "./routes/image";
import musicRoutes from "./routes/music";
import videoRoutes from "./routes/video";
import CustomError from "./utils/CustomError";
import { limitRoute } from "./routes/apiLimit";
import { register } from "module";
import { paymentRoute } from "./routes/payment";
import { webhookRoute } from "./routes/webhook";

export const prisma = new PrismaClient();

export const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

fastify.register(clerkPlugin);
fastify.register(cors, {
  credentials: true,
  origin: "http://localhost:5173",
});
fastify.register(conversationRoutes, { prefix: "/conversations" });
fastify.register(codeRoutes, { prefix: "/code" });
fastify.register(imageRoutes, { prefix: "/image" });
fastify.register(musicRoutes, { prefix: "/music" });
fastify.register(videoRoutes, { prefix: "/video" });
fastify.register(limitRoute, { prefix: "/user" });
fastify.register(paymentRoute, { prefix: "/payment" });
fastify.register(webhookRoute, { prefix: "/webhook" });
fastify.setErrorHandler(function (error, request, reply) {
  if (error instanceof CustomError) {
    reply.status(error.errorCode).send({
      ok: false,
      message: error.message,
    });
  } else {
    reply.send(error);
  }
});
