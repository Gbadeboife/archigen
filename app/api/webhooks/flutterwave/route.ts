import { headers } from "next/headers";
import { prisma } from "@/lib/db";

const WEBHOOK_HASH = process.env.FLW_WEBHOOK_HASH!;

export async function POST(req: Request) {
  try {
    const headersList = headers();
    const secretHash = headersList.get("verif-hash");

    // Log headers for debugging
    console.log("Incoming webhook headers:", Object.fromEntries(headersList));

    if (!secretHash || secretHash !== WEBHOOK_HASH) {
      console.error("Invalid webhook signature");
      return new Response(JSON.stringify({ status: "error", message: "Invalid signature" }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await req.json();
    
    // Enhanced debug logging
    console.log("Full webhook payload:", body);
    console.log("Event type:", body?.event);
    console.log("Data object:", body?.data);

    // More permissive payload structure validation
    if (!body) {
      console.error("Empty payload received");
      return new Response(JSON.stringify({ status: "error", message: "Empty payload" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Extract event and data with optional chaining
    const event = body?.event;
    const data = body?.data;
    const meta = body?.meta_data;

    console.log("Extracted event:", event);
    console.log("Extracted data:", data);

    if (!event) {
      console.error("Missing event field in payload");
      return new Response(JSON.stringify({ status: "error", message: "Missing event field" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!data) {
      console.error("Missing data field in payload");
      return new Response(JSON.stringify({ status: "error", message: "Missing data field" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Handle successful charge events
    if (event === "charge.completed" && data.status === "successful") {
      const { customer, tx_ref, amount } = data;
      
      // Validate required data fields
      if (!customer || !tx_ref || !amount) {
        console.error("Missing required payment data fields");
        return new Response(JSON.stringify({ status: "error", message: "Invalid payment data" }), { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Extract user ID from transaction reference
      const userId = meta.userId
      if (!userId) {
        throw new Error("Invalid transaction reference format");
      }

      // Calculate subscription end date (30 days from now)
      const subscriptionEnd = new Date();
      subscriptionEnd.setDate(subscriptionEnd.getDate() + 30);

      // Update user subscription details
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionPeriodEnd: subscriptionEnd,
          flwCustomerId: `${customer.id}`,
          flwSubscriptionId: data.id,
          flwPlanId: meta?.planType === 'monthly' 
          ? process.env.NEXT_PUBLIC_FLW_PRO_MONTHLY_PLAN_ID 
          : meta?.planType === 'yearly' 
            ? process.env.NEXT_PUBLIC_FLW_PRO_YEARLY_PLAN_ID 
            : null,
        },
      });

      return new Response(JSON.stringify({ status: "success" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Handle subscription cancellation event
    if (event === "subscription.cancelled") {
      const { customer, subscription_id } = data;


      // Update user subscription status
      await prisma.user.update({
        where: { email: customer.email },
        data: {
          subscriptionPeriodEnd: new Date(), // End subscription immediately
          flwSubscriptionId: null,
          flwPlanId: null,
          flwCustomerId: null,
        },
      });

      return new Response(JSON.stringify({ status: "success" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // For other events, acknowledge receipt
    return new Response(JSON.stringify({ status: "success", message: "Webhook received" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ 
        status: "error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
