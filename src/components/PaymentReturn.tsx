import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function PaymentReturn() {
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Processing your payment...');
  const [licenseKey, setLicenseKey] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const provider = params.get('provider');
    const orderId = params.get('token');
    const payerId = params.get('PayerID');

    if (provider === 'paypal' && orderId) {
      handlePayPalReturn(orderId, payerId);
    } else if (provider === 'payfast') {
      handlePayFastReturn(params);
    } else {
      setStatus('failed');
      setMessage('Invalid payment return parameters');
    }
  }, []);

  const handlePayPalReturn = async (orderId: string, payerId: string | null) => {
    try {
      if (!payerId) {
        throw new Error('Payment was not authorized');
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paypal-capture-order`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          licenseType: 'standard',
          amount: 0,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to capture PayPal payment');
      }

      const result = await response.json();

      if (result.status === 'COMPLETED') {
        setStatus('success');
        setMessage('Payment completed successfully!');
        setLicenseKey(result.captureId);
      } else {
        throw new Error('Payment was not completed');
      }
    } catch (error) {
      setStatus('failed');
      setMessage(error instanceof Error ? error.message : 'Payment processing failed');
    }
  };

  const handlePayFastReturn = async (params: URLSearchParams) => {
    const paymentStatus = params.get('payment_status');

    if (paymentStatus === 'COMPLETE') {
      setStatus('success');
      setMessage('Payment completed successfully! Your license will be sent to your email shortly.');
    } else {
      setStatus('failed');
      setMessage('Payment was not completed successfully.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 mx-auto text-blue-500 animate-spin mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Processing Payment
              </h2>
              <p className="text-slate-600 dark:text-slate-300">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Payment Successful!
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">{message}</p>

              {licenseKey && (
                <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 mb-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Transaction ID:
                  </p>
                  <code className="text-sm font-mono text-slate-900 dark:text-white break-all">
                    {licenseKey}
                  </code>
                </div>
              )}

              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Return to Home
              </button>
            </>
          )}

          {status === 'failed' && (
            <>
              <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Payment Failed
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">{message}</p>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Return to Home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
