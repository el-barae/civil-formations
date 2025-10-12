import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { useStripeContext } from './StripeContext';

const StripeConfig: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { stripePromise, loading } = useStripeContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-shake border border-red-400 bg-red-100 text-red-700 px-6 py-4 rounded shadow-md max-w-md text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="font-semibold text-lg">Erreur lors du chargement de Stripe</p>
          <p className="text-sm mt-2">Veuillez réessayer plus tard ou vérifier votre configuration.</p>
        </div>
      </div>
    );
  }

  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeConfig;
