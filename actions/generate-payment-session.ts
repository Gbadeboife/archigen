"use server";

import { auth } from "@/auth";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { absoluteUrl } from "@/lib/utils";
import { createPaymentLink, FlutterwaveConfig } from "@/lib/flutterwave";
import { redirect } from "next/navigation";

export type PaymentResponse = {
  status: "success" | "error";
  data?: {
    link: string;
  };
  message?: string;
};

const billingUrl = absoluteUrl("/pricing");
const dashboardUrl = absoluteUrl("/dashboard");

export async function generatePaymentSession(
  amount: number,
  planTitle: string,
  planType: "monthly" | "yearly"
): Promise<PaymentResponse> {  // Change return type to PaymentResponse
  try {
    const session = await auth(); 
    const user = session?.user;

    if (!user || !user.email || !user.id) {
      return { status: "error", message: "User not authenticated" };
    }

    const subscriptionPlan = await getUserSubscriptionPlan(user.id);

    if (subscriptionPlan.isPaid) {
      return { status: "success", data: { link: billingUrl } };
    }

    const flutterwaveConfig: FlutterwaveConfig = {
      public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY!,
      tx_ref: `sub_${Date.now()}`,  // Changed back to Date.now()
      amount,
      currency: "USD",
      redirect_url: billingUrl,
      session_duration: 120,
      payment_options: "card",
      customer: {
        email: user.email,
        name: user.name || user.email,
      },
      customizations: {
        title: `ArchiGen ${planTitle} Subscription`,
        description: `${planType} subscription to ${planTitle}`,
        logo: "https://zxsbodlyoxevsftj.public.blob.vercel-storage.com/logo-Crf35lLIDE1qr03qER6fBUAvrA7gY1.jpg",
      },
      meta: {
        userId: user.id,
        planType,
      },
      payment_plan: planType === 'yearly'? `${process.env.NEXT_PUBLIC_FLW_PRO_YEARLY_PLAN_ID}` : `${process.env.NEXT_PUBLIC_FLW_PRO_MONTHLY_PLAN_ID}` ,
    };

    console.log('Initiating payment with config:', {
      amount,
      planType,
      userId: user.id,
      planTitle
    });

    const response = await createPaymentLink(flutterwaveConfig);
    console.log('Flutterwave response:', response);
    
    if (response.status === "success" && response.data?.link) {
      return { 
        status: "success", 
        data: { link: response.data.link } 
      };
    }

    return { 
      status: "error", 
      message: response.message || "Payment initialization failed" 
    };

  } catch (error) {
    console.error('Payment session error:', error);
    return { 
      status: "error", 
      message: error instanceof Error ? error.message : "Failed to generate payment session" 
    };
  }
}
