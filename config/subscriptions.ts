import { PlansRow, SubscriptionPlan } from "types";
import { env } from "@/env.mjs";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Free",
    description: "For Beginners",
    benefits: [
      "Up to 10 renders",
      "Custom prompts",
      "No watermark",
      "Commercial use",
      "Basic quality renders",
    ],
    limitations: [
      "No priority access to new features.",
      /*"Limited customer support",
      "No custom branding",
      "Limited access to business resources.",*/
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    flwIds: {
      monthly: null,
      yearly: null,
    },
    
  },
  {
    title: "Pro",
    description: "Unlock Advanced Features",
    benefits: [
      "Unlimited renders",
      "Custom prompts",
      "Commercial use",
      "No watermark",
      "High resolution renders",
      "Early access to new features",
    ],
    limitations: [
      /*"No custom branding",
      "Limited access to business resources.",*/
    ],
    prices: {
      monthly: 20,
      yearly: 192,
    },
    flwIds: {
      monthly: env.NEXT_PUBLIC_FLW_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_FLW_PRO_YEARLY_PLAN_ID,
    },
  },
  /*{
    title: "Business",
    description: "For Power Users",
    benefits: [
      "Unlimited posts",
      "Real-time analytics and reporting",
      "Access to all templates, including custom branding",
      "24/7 business customer support",
      "Personalized onboarding and account management.",
    ],
    limitations: [],
    prices: {
      monthly: 30,
      yearly: 300,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
    },
  },*/
];

export const plansColumns = [
  "starter",
  "pro",
  "business",
  "enterprise",
] as const;
