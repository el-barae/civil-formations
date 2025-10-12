import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { useStripeContext } from './StripeContext';

const StripeConfig: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { stripePromise, loading } = useStripeContext();

  if (loading) return <div>Chargement Stripe...</div>;
  if (!stripePromise) return <div>Erreur chargement Stripe</div>;

  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeConfig;
