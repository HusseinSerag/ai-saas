import { getAuth } from "@clerk/fastify";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getApiLimitCount } from "../utils/increase-api-limit";
import { prisma } from "../app";

const DAY_IN_MS = 86400000;

export async function limitRoute(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get(
    "/",

    async (req, reply) => {
      try {
        const { userId } = getAuth(req);

        if (!userId) {
          return 0;
        }
        const limit = await getApiLimitCount(userId);
        const isPro = await getSubscription(userId);

        return {
          limit,
          isPro,
        };
      } catch (e) {
        throw e;
      }
    }
  );
}

export async function getSubscription(userId: string) {
  try {
    const userSubscription = await prisma.userSubscription.findUnique({
      where: {
        userID: userId,
      },
      select: {
        stripeSubscriptionId: true,
        stripeCurrentPeriodEnd: true,
        stripeCustomerId: true,
        stripePriceId: true,
      },
    });
    if (!userSubscription) {
      return false;
    }

    const isValid =
      userSubscription.stripePriceId &&
      userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
        Date.now();

    return !!isValid;
  } catch (e) {
    throw e;
  }
}
