export type FlutterwaveConfig = {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  redirect_url: string;
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
      'Authorization': `Bearer ${FLW_SECRET_KEY}`,
    },
  });

  return response.json();
}
