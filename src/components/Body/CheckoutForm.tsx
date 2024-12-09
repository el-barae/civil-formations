import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';
import API_URL from '../../API_URL';

const handleSubmit1 = async (event: React.FormEvent) => {
  event.preventDefault();
  /*
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
  }*/
};

const CheckoutForm: React.FC<{ amount: number }> = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  /*
    const stripe = useStripe();
    const elements = useElements();
  
    if (!stripe || !elements) {
      console.error('Stripe or Elements not loaded');
      return;
    }
  
    try {
      // Create a PaymentMethod
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });
  
      if (paymentMethodError) {
        console.error('[PaymentMethod Error]', paymentMethodError);
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: paymentMethodError.message,
        });
        return;
      }
  
      // Create a PaymentIntent
      const response = await fetch(`${API_URL}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
  
      if (!response.ok) {
        console.error('Failed to create PaymentIntent');
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: 'Unable to process payment. Please try again.',
        });
        return;
      }
  
      const { clientSecret } = await response.json();
  
      // Confirm the Card Payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod!.id,
      });
  
      if (confirmError) {
        console.error('[Payment Confirmation Error]', confirmError);
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: confirmError.message,
        });
      } else if (paymentIntent?.status === 'succeeded') {
        console.log('[PaymentIntent]', paymentIntent);
        Swal.fire({
          icon: 'success',
          title: 'Payment Successful',
          text: 'You have paid successfully!',
        });
        // Handle successful payment here (e.g., redirect, update UI)
      }
    } catch (err) {
      console.error('Unexpected Error', err);
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: 'An unexpected error occurred. Please try again.',
      });
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
