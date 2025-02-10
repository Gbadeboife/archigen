export type FlutterwaveConfig = {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  redirect_url: string;
  session_duration: number;
  payment_options: string;
  customer: {
    email: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
  meta: {
    userId: string;
    planType: string;
  };
  payment_plan: string;
}

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY!;
const FLW_BASE_URL = 'https://api.flutterwave.com/v3';

export async function createPaymentLink(payload: any) {
  const response = await fetch(`${FLW_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${FLW_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export async function verifyTransaction(transactionId: string) {
  const response = await fetch(`${FLW_BASE_URL}/transactions/${transactionId}/verify`, {
    headers: {
      Authorization: `Bearer ${FLW_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Transaction verification failed: ${response.statusText}`);
  }

  const verifyData = await response.json();

  // Validate the response structure
  if (!verifyData.status || !verifyData.data) {
    throw new Error("Invalid verification response format");
  }

  return verifyData;
}

export async function cancelSubscription(subscriptionId) {
  const response = await fetch(`${FLW_BASE_URL}/subscriptions/${subscriptionId}/cancel`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${FLW_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Subscription cancellation failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.status !== 'success') {
    throw new Error(data.message || 'Failed to cancel subscription');
  }

  return data;
}




