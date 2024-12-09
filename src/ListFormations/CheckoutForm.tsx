import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm: React.FC<{ amount: number }> = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit1 = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement!,
    });

    if (error) {
      console.error('[error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      // Send paymentMethod.id to your server to create a charge
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    /*if (!stripe || !elements) {
      return;
    }
  
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
    });
  
    if (!error) {
      const response = await fetch('http://localhost:3001/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
  
      const { clientSecret } = await response.json();
  
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });
  
      if (confirmError) {
        console.error('[error]', confirmError);
      } else {
        console.log('[PaymentIntent]', paymentIntent);
        // Handle successful payment here
      }
    } else {
      console.error('[error]', error);
    }*/
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button className='bg-green-500 px-4 py-2 text-white font-bold rounded mt-2' type="submit" disabled={!stripe}>
        Payer ${amount.toFixed(2)}
      </button>
    </form>
  );
};

export default CheckoutForm;
