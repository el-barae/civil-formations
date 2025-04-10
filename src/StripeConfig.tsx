import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Replace with your actual publishable key
const stripePromise = loadStripe('pk_test_51PtCVpRobdDMpPtbwrAHFDihyInZAAhskPD9U7k6g1mVZjOuIrgKoQL9trP0TIKnfqoUHA3lHUXpNuh86lB6mBHW00rmxkzsNE');

const StripeConfig: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeConfig;
