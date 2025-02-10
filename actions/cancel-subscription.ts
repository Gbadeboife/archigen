"use server"

import { cancelSubscription } from "@/lib/flutterwave";


export async function cancelSubscriptionAction(subscriptionId) {
    if (!subscriptionId) {
        return {
            status: "error",
            message: "Subscription ID is required"
        };
    }

    try {
        const result = await cancelSubscription(subscriptionId);
        
        if (!result) {
            return {
                status: "error",
                message: "No response received from subscription service"
            };
        }

        return {
            status: "success",
            message: "Subscription cancelled successfully",
            data: result
        };
    } catch (error) {
        console.error("Subscription cancellation error:", error);
        return {
            status: "error",
            message: error instanceof Error 
                ? `Failed to cancel subscription: ${error.message}`
                : "An unexpected error occurred while cancelling subscription"
        };
    }
}
