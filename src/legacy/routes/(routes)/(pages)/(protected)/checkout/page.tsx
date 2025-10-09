'use client';
import { AdyenCheckout, Dropin, Card } from '@adyen/adyen-web';
import '@adyen/adyen-web/styles/adyen.css';
import { useEffect, useRef } from 'react';
import { signIn } from '@/legacy/services/authService';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { preauthPayment, voidPayment, createSalesOrder } from './paymentApi';

/*
 NOTE! This is Temporary to test Adyen Checkout 
 Please use examples below to implement a proper checkout flow
*/

const CheckoutPage = () => {
  const dropinContainer = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });

  useEffect(() => {
    async function initCheckout() {
      const paymentMethodsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVICE_URL}/api/payments/session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({
            UserId: 1,
            Amount: 75,
            Currency: 'USD',
            CountryCode: 'US',
          }),
        }
      ).then((res) => res.json());

      // TODO - NEXT_PUBLIC is exposed to the client-side code for testing purposes.
      // In production, you should not expose sensitive information like the client key.
      // Consider fetching this from your backend instead
      const clientKey = process.env.NEXT_PUBLIC_ADYEN_CLIENT_KEY;

      const paymentData = paymentMethodsResponse.checkoutSession;

      console.log(paymentMethodsResponse, clientKey, JSON.parse(paymentData));

      const parsedPaymentData = JSON.parse(paymentData);

      let checkout = await AdyenCheckout({
        environment: 'test', // or 'live'
        clientKey: clientKey,
        countryCode: 'US',
        locale: 'en-US',
        session: {
          id: parsedPaymentData.id,
          sessionData: parsedPaymentData.sessionData,
        },
        onSubmit: (state, dropin, actions) => {
          console.log('onSubmit', state, dropin);

          preauthPayment(state.data, session?.accessToken)
            .then((data) => {
              console.log('Payment response:', data);

              // TODO - Implement your logic here
              // We'd check if the payment was successful
              // We'd check kount risk score - either we'd void if kount declines or create a sales order with approval or suspected fraud

              createSalesOrder(data.transactionId, session?.accessToken)
                .then((salesOrderData) => {
                  console.log('Sales Order response:', salesOrderData);
                  router.push('/'); // Redirect here
                })
                .catch((error) => {
                  console.error('Sales Order error:', error);
                });
            })
            .catch((error) => {
              console.error('Payment error:', error);
            });

          // voidPayment(data.transactionId)
          //     .then(voidData => {
          //         console.log('Void response:', voidData);
          //     })
          //     .catch(error => {
          //         console.error('Void error:', error);
          //     });
        },
        onAdditionalDetails: (state, dropin) => {},
        onError: (error, dropin) => {
          console.error('onError', error, dropin);
        },
      });

      console.log(checkout);

      const dropinConfiguration = {
        paymentMethodComponents: [Card],
        // Other Drop-in configuration...
        paymentMethodsConfiguration: {
          card: {
            // Optional configuration.
            hasHolderName: false, // Show the cardholder name field.
            holderNameRequired: false, // Mark the cardholder name field as required.
          },
        },
      };

      const dropin = new Dropin(checkout, dropinConfiguration).mount(
        '#dropin-container'
      );
    }

    initCheckout();
  }, []);

  return (
    <div>
      <h1>Checkout TESTING</h1>
      <div ref={dropinContainer} id="dropin-container" />
    </div>
  );
};

export default CheckoutPage;
