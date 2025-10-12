import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import axios from 'axios';
import API_URL from './API_URL';

// Définition du type du contexte
interface StripeContextType {
  stripePromise: Promise<Stripe | null> | null;
  loading: boolean;
}

// Création du contexte
const StripeContext = createContext<StripeContextType>({
  stripePromise: null,
  loading: true,
});

// Provider
export const StripeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStripeKey = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/config/stripe-public-key`);
        setStripePromise(loadStripe(res.data.key));
      } catch (err) {
        console.error('Erreur récupération clé Stripe publique', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStripeKey();
  }, []);

  return (
    <StripeContext.Provider value={{ stripePromise, loading }}>
      {children}
    </StripeContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useStripeContext = () => useContext(StripeContext);
