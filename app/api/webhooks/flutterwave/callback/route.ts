import { redirect } from 'next/navigation';
import { verifyTransaction } from '@/lib/flutterwave';
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const transactionId = searchParams.get('transaction_id');
  const tx_ref = searchParams.get('tx_ref');

  if (!transactionId || !tx_ref) {
    redirect('/pricing');
  }

  try {
    const verificationResponse = await verifyTransaction(transactionId);
    
    if (verificationResponse.status === "success" && 
        verificationResponse.data.status === "successful") {
      
      const { customer, meta } = verificationResponse.data;
      const userId = meta.userId;

      // Update user subscription
      const subscriptionEnd = new Date();
      subscriptionEnd.setDate(subscriptionEnd.getDate() + (meta.planType === 'yearly' ? 365 : 30));

      await prisma.user.update({
        where: { id: userId },
        data: {
          flwCustomerId: customer.id,
          flwSubscriptionId: tx_ref,
          flwPlanId: meta.planType === 'yearly' ? '137432' : '137431',
          subscriptionPeriodEnd: subscriptionEnd,
        },
      });

      // Redirect to dashboard after successful verification
      redirect('/dashboard');
    }
  } catch (error) {
    console.error('Verification error:', error);
  }

  // Redirect to pricing page if verification fails
  redirect('/pricing');
}
