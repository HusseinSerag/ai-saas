import { getAuth } from "@clerk/fastify";
import { FastifyRequest } from "fastify";
import { prisma } from "../app";
import { MAX_FREE_COUNTS } from "../constants";
import CustomError from "./CustomError";

export async function increaseApiLimit(req: FastifyRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      throw new Error("unauthorized");
    }
    const userApiLimit = await prisma.apiUserLimit.findUnique({
      where: {
        userID: userId,
      },
    });
    if (userApiLimit) {
      await prisma.apiUserLimit.update({
        where: {
          id: userApiLimit.id,
        },
        data: {
          count: userApiLimit.count + 1,
        },
      });
    } else {
      await prisma.apiUserLimit.create({
        data: {
          userID: userId,
        },
      });
    }
  } catch (e) {
    throw e;
  }
}

export async function checkIfUserReachedLimit(req: FastifyRequest) {
  try {
    const { userId } = getAuth(req);
    console.log(userId);
    if (!userId) {
      return false;
    }
    const userLimit = await prisma.apiUserLimit.findUnique({
      where: {
        userID: userId,
      },
    });

    if (!userLimit || userLimit.count < MAX_FREE_COUNTS) {
      return true;
    }

    return false;
  } catch (e) {
    throw e;
  }
}

export async function getApiLimitCount(userId: string) {
  try {
    const limitCount = await prisma.apiUserLimit.findUnique({
      where: {
        userID: userId,
      },
    });

    if (!limitCount) {
      return 0;
    }

    return limitCount.count;
  } catch (e) {
    throw e;
  }
}
