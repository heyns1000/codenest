import { useEffect } from 'react';

export function PayPalScript() {
  useEffect(() => {
    if (document.querySelector('script[src*="paypal.com/sdk/js"]')) {
      return;
    }

    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test';
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    script.async = true;
    script.setAttribute('data-paypal-sdk', 'true');
    document.head.appendChild(script);
  }, []);

  return null;
}
