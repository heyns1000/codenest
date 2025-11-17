import { useState, useEffect } from 'react';
import App from '../App';
import { PaymentReturn } from './PaymentReturn';
import { PaymentCancel } from './PaymentCancel';

export function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentPath === '/payment-return') {
    return <PaymentReturn />;
  }

  if (currentPath === '/payment-cancel') {
    return <PaymentCancel />;
  }

  return <App />;
}
