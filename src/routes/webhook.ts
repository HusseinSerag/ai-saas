import { FastifyInstance, FastifyPluginOptions } from "fastify";
import Stripe from "stripe";
import { stripe } from "../config/stripe";
import CustomError from "../utils/CustomError";
import { prisma } from "../app";

export async function webhookRoute(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.addContentTypeParser(
    "application/json",
    { parseAs: "string" },
    function (req, body, done) {
      try {
        done(null, body);
      } catch (error) {
        const e = error as Error;
        done(e, undefined);
      }
    }
  );
  fastify.post("/", async (req, reply) => {
    const body = req.body;
    const signature = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body as string,
        signature,
        process.env.STRIPE_WEBHOOK!
      );
    } catch (e) {
      console.log(e);
      throw e;
    }

    const session = event.data.object as Stripe.Checkout.Session;
    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      if (!session?.metadata?.userID) {
        return new CustomError("User ID is required", 400);
      }

      await prisma.userSubscription.create({
        data: {
          userID: session?.metadata?.userID,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });
    } else if (event.type === "invoice.payment_succeeded") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      await prisma.userSubscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });
    }

    return;
  });
}
