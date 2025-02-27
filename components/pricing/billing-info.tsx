import Link from "next/link";
import * as React from "react";

import { CustomerPortalButton } from "@/components/forms/customer-portal-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import { UserSubscriptionPlan } from "types";

interface BillingInfoProps extends React.HTMLAttributes<HTMLFormElement> {
  userSubscriptionPlan: UserSubscriptionPlan;
}

export function BillingInfo({ userSubscriptionPlan }: BillingInfoProps) {
  const {
    title,
    description,
    flwCustomerId,
    flwPlanId,
    isPaid,
    isCanceled,
    subscriptionPeriodEnd,
  } = userSubscriptionPlan;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>
          You are currently on the <strong>{flwPlanId === process.env.NEXT_PUBLIC_FLW_PRO_MONTHLY_PLAN_ID?
          "Pro" : "Free" 
         }</strong> plan.
        </CardDescription>
      </CardHeader>
      <CardContent>{description}</CardContent>
      <CardFooter className="flex flex-col items-center space-y-2 border-t bg-accent py-2 md:flex-row md:justify-between md:space-y-0">
        {isPaid ? (
          <p className="text-sm font-medium text-muted-foreground">
            {isCanceled
              ? "Your plan will be canceled on "
              : "Your plan renews on "}
            {subscriptionPeriodEnd ? formatDate(subscriptionPeriodEnd) : "N/A"}.
          </p>
        ) : null}

        
          
        <Link href="/pricing" className={cn(buttonVariants())}>
          {isPaid && flwCustomerId ? "Manage subscription" : "Upgrade plan"}
        </Link>
        
      </CardFooter>
    </Card>
  );
}
