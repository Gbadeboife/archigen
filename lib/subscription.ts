// @ts-nocheck
// TODO: Fix this when we turn strict mode on.
import { pricingData } from "@/config/subscriptions";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { UserSubscriptionPlan } from "types";


/*
export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  if(!userId) throw new Error("Missing parameters");

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Check if user is on a paid plan.
  const isPaid =
    user.stripePriceId &&
    user.stripeCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now() ? true : false;

  // Find the pricing data corresponding to the user's plan
  const userPlan =
    pricingData.find((plan) => plan.stripeIds.monthly === user.stripePriceId) ||
    pricingData.find((plan) => plan.stripeIds.yearly === user.stripePriceId);

  const plan = isPaid && userPlan ? userPlan : pricingData[0]

  const interval = isPaid
    ? userPlan?.stripeIds.monthly === user.stripePriceId
      ? "month"
      : userPlan?.stripeIds.yearly === user.stripePriceId
      ? "year"
      : null
    : null;

  let isCanceled = false;
  if (isPaid && user.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      user.stripeSubscriptionId
    )
    isCanceled = stripePlan.cancel_at_period_end
  }

  return {
    ...plan,
    ...user,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime(),
    isPaid,
    interval,
    isCanceled
  }
}

*/

export async function getUserSubscriptionPlan(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      flwCustomerId: true,
      flwSubscriptionId: true,
      flwPlanId: true,
      subscriptionPeriodEnd: true,
    },
  });

  if (!user) throw new Error("User not found");

  const isPaid = user.subscriptionPeriodEnd?.getTime() ?? 0 > Date.now();
  
  const interval = isPaid
    ? user.flwPlanId === process.env.NEXT_PUBLIC_FLW_PRO_MONTHLY_PLAN_ID
      ? "month"
      : user.flwPlanId === process.env.NEXT_PUBLIC_FLW_PRO_YEARLY_PLAN_ID
      ? "year"
      : null
    : null;

  return {
    ...user,
    isPaid,
    interval,
    isCanceled: !user.flwSubscriptionId,
  };
}
