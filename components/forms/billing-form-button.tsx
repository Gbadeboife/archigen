"use client";

import { useTransition } from "react";
import { SubscriptionPlan, UserSubscriptionPlan } from "@/types";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { generatePaymentSession } from "@/actions/generate-payment-session";
import { toast } from "@/components/ui/use-toast";

interface BillingFormButtonProps {
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
}

export function BillingFormButton({
  year,
  offer,
  subscriptionPlan,
}: BillingFormButtonProps) {
  let [isPending, startTransition] = useTransition();

  const handlePayment = async () => {
    try {
      const amount = year ? offer.prices.yearly : offer.prices.monthly;
      const planType = year ? "yearly" : "monthly";
      
      const response = await generatePaymentSession(amount, offer.title, planType);

      if (response.status === "success" && response.data?.link) {
        window.location.href = response.data.link;
      } else {
        throw new Error(response.message || "Payment initialization failed");
      }
    } catch (error) {
      console.error("Payment error details:", {
        error,
        offer,
        year,
        planTitle: offer.title
      });
      
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to initialize payment",
        variant: "destructive",
      });
    }
  };

  const userOffer =
    subscriptionPlan.flwPlanId === offer.flwIds[year ? "yearly" : "monthly"];

  return (
    <Button
      variant={userOffer ? "default" : "outline"}
      rounded="full"
      className="w-full"
      disabled={isPending}
      onClick={() => startTransition(handlePayment)}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" /> Loading...
        </>
      ) : (
        <>{userOffer ? "Manage Subscription" : "Upgrade"}</>
      )}
    </Button>
  );
}
