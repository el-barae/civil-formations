import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';
import API_URL from '../../API_URL';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const CheckoutForm: React.FC<{ amount: number, formationID: number }> = ({ amount,formationID }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!stripe || !elements) {
      console.error('Stripe or Elements not loaded');
      return;
    }

    const MIN_AMOUNT = 0.20;
        if (amount < MIN_AMOUNT) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Amount',
            text: `Minimum payment is $${MIN_AMOUNT}`,
          });
          return;
        }
  
    try {
      // Create a PaymentMethod
      const token = localStorage.getItem('token')
            if(token){
              const decoded = jwtDecode(token) as { id: string };
              const { id} = decoded;
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });
  
      if (paymentMethodError) {
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: paymentMethodError.message,
        });
        return;
      }
  
      // Create a PaymentIntent and Subscription
      const response = await fetch(`${API_URL}/api/subscribes/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          amount,
          pourcentage: 0,
          formationId: formationID,
          userId: id, 
        }),
      });
  
      if (!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: 'Unable to process payment. Please try again.',
        });
        return;
      }
  
      const { clientSecret, subscription } = await response.json();
  
      // Confirm the Card Payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod!.id,
      });
  
      if (confirmError) {
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: confirmError.message,
        });
      } else if (paymentIntent?.status === 'succeeded') {
        Swal.fire({
          icon: 'success',
          title: 'Payment Successful',
          text: 'You have paid successfully!',
        });
        navigate('/Formation/'+formationID)
        console.log('Subscription created:', subscription);
      }
    }
    } catch (err) {
      console.error('Unexpected Error', err);
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button className='bg-green-500 px-4 py-2 text-white font-bold rounded mt-2' type="submit" disabled={!stripe}>
        Payer ${amount.toFixed(3)}
      </button>
    </form>
  );
};

export default CheckoutForm;