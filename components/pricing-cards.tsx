import React from 'react';
import { PaymentModal } from "./flutterwave/PaymentModal"

export function PricingCard({ user }: { user: any }) {
  return (
    <div className="pricing-card">
      <h2>Pricing</h2>
      <p>Choose your plan</p>
      <PaymentModal 
        email={user.email!}
        name={user.name || "Anonymous"}
        amount={20} // or 192 for yearly
        planId="monthly" // or "yearly"
        userId={user.id}
      />
    </div>
  );
}
