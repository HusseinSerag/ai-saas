import { clerkClient, getAuth } from "@clerk/fastify";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import CustomError from "../utils/CustomError";
import { prisma } from "../app";
import { stripe } from "../config/stripe";
import Stripe from "stripe";

export async function paymentRoute(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get("/", async (req, reply) => {
    try {
      const { userId } = getAuth(req);

      if (!userId) {
        throw new CustomError("Unauthorized", 401);
      }
      const user = await clerkClient.users.getUser(userId);
      const userSubscription = await prisma.userSubscription.findUnique({
        where: {
          userID: userId,
        },
      });

      if (userSubscription && userSubscription.stripeCustomerId) {
        const stripeSession = await stripe.billingPortal.sessions.create({
          customer: userSubscription.stripeCustomerId,
          return_url: "http://localhost:5173/settings",
        });
        return {
          url: stripeSession.url,
        };
      }

      const stripeSession = await stripe.checkout.sessions.create({
        success_url: "http://localhost:5173/settings",
        cancel_url: "http://localhost:5173/settings",
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user.emailAddresses[0].emailAddress,
        line_items: [
          {
            price_data: {
              currency: "USD",
              product_data: {
                name: "Genius Pro",
                description: "Unlimited AI Generation",
              },
              unit_amount: 2000,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          userID: userId,
        },
      });

      return {
        url: stripeSession.url,
      };
    } catch (e) {
      throw e;
    }
  });
}
