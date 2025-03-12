"use server";

import { auth } from "@/auth";
import { createPaymentLink } from "@/lib/flutterwave";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { absoluteUrl } from "@/lib/utils";
import { redirect } from "next/navigation";

const billingUrl = absoluteUrl("/pricing");

export async function generateUserPayment(planId: string): Promise<void> {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.email || !user.id) {
      throw new Error("Unauthorized");
    }

    const payload = {
      tx_ref: `sub-${user.id}-${Date.now()}`,
      amount: planId === 'monthly' ? '20' : '192',
      currency: 'USD',
      redirect_url: billingUrl,
      customer: {
        email: user.email,
        name: user.name || 'Anonymous',
      },
      customizations: {
        title: 'ArchiGen AI Subscription',
        description: 'Pro Plan Subscription',
        logo: '/_static/logo.jpg'
      },
      meta: {
        user_id: user.id,
        plan_id: planId
      }
    };

    
    const response = await createPaymentLink(payload);
    
    if (response.status !== 'success') {
      throw new Error(response.message);
    }

    redirect(response.data.link);
  } catch (error) {
    throw new Error("Failed to generate payment link");
  }
}
