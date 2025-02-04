import { headers } from "next/headers";
import { prisma } from "@/lib/db";

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY!;

export async function POST(req: Request) {
  const body = await req.json();
  const secretHash = headers().get("verif-hash");

  if (!secretHash || secretHash !== process.env.FLW_WEBHOOK_HASH) {
    return new Response("Invalid signature", { status: 400 });
  }

  const { event, data } = body;

  try {
    if (event === "charge.completed") {
      // Only handle background events here
      // No need to redirect as this is a server-to-server communication
      return new Response(null, { status: 200 });
    }

    // Verify transaction directly using transaction ID
    const verifyResponse = await fetch(
      `https://api.flutterwave.com/v3/transactions/${data.id}/verify`,
      {
        headers: {
          'Authorization': `Bearer ${FLW_SECRET_KEY}`,
        },
      }
    );

    const verifyData = await verifyResponse.json();
    
    if (verifyData.status === "success" && verifyData.data.status === "successful") {
      const { customer, tx_ref, meta } = data;
      const [, userId] = tx_ref.split('-');

      const subscriptionEnd = new Date();
      subscriptionEnd.setDate(subscriptionEnd.getDate() + 30);

      await prisma.user.update({
        where: { id: userId },
        data: {
          flwCustomerId: customer.id,
          flwSubscriptionId: tx_ref,
          flwPlanId: meta.plan_id,
          subscriptionPeriodEnd: subscriptionEnd,
        },
      });
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook handler failed', { status: 400 });
  }
}
