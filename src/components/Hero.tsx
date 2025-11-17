import { Sprout, Globe, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function Hero() {
  const [showPayFast, setShowPayFast] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    const initPayPal = () => {
      if (window.paypal && !paypalLoaded) {
        console.log('Initializing PayPal buttons...');
        setPaypalLoaded(true);

        try {
          window.paypal.Buttons({
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [{
                  description: 'Consultant License - NEXUS_NAIR',
                  amount: {
                    currency_code: 'USD',
                    value: '29.00'
                  }
                }]
              });
            },
            onApprove: async (data: any, actions: any) => {
              setPaymentLoading(true);
              const order = await actions.order.capture();

              window.location.href = `/payment-success?transaction_id=${order.id}&gateway=paypal&email=${order.payer.email_address}&name=${order.payer.name.given_name} ${order.payer.name.surname}`;
            },
            onError: (err: any) => {
              console.error('PayPal error:', err);
              alert('Payment failed. Please try again.');
              setPaymentLoading(false);
            },
            style: {
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: 'paypal',
              height: 50
            }
          }).render('#paypal-button-container').then(() => {
            console.log('PayPal button rendered successfully');
          }).catch((err: any) => {
            console.error('PayPal render error:', err);
            setPaypalLoaded(false);
          });
        } catch (err) {
          console.error('PayPal initialization error:', err);
          setPaypalLoaded(false);
        }
      }
    };

    let attempts = 0;
    const maxAttempts = 50;

    const checkPayPal = setInterval(() => {
      attempts++;
      console.log(`Checking for PayPal SDK... Attempt ${attempts}/${maxAttempts}`);

      if (window.paypal) {
        console.log('PayPal SDK loaded successfully!');
        clearInterval(checkPayPal);
        initPayPal();
      } else if (attempts >= maxAttempts) {
        console.error('PayPal SDK failed to load after maximum attempts');
        clearInterval(checkPayPal);
      }
    }, 100);

    return () => clearInterval(checkPayPal);
  }, [paypalLoaded]);

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 fruitful:bg-gradient-to-br fruitful:from-orange-50 fruitful:via-amber-50 fruitful:to-yellow-50">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="text-center space-y-8">
          <div className="flex justify-center mb-16">
            <img
              src="/Fruitful_cover_photo_1754146572189.jpg"
              alt="Fruitful - If you don't like the fruits you are growing, change the seeds..."
              className="max-w-4xl w-full h-auto rounded-3xl"
            />
          </div>

          <div className="max-w-3xl mx-auto space-y-8 text-xl text-gray-900 dark:text-gray-100 fruitful:text-orange-900">
            <p className="leading-relaxed font-light">
              Join thousands of consultants building their dream businesses with <strong className="font-semibold">13,713 licensed brands</strong>,
              zero-waste commerce, and revolutionary 9-second pulse synchronization.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white dark:bg-gray-800 fruitful:bg-orange-50 rounded-2xl p-8 hover:bg-gray-50 dark:hover:bg-gray-700 fruitful:hover:bg-orange-100 transition-colors">
                <div className="text-5xl font-semibold text-gray-900 dark:text-white fruitful:text-orange-900 mb-3">13,713</div>
                <div className="text-base font-normal text-gray-600 dark:text-gray-300 fruitful:text-orange-700">Licensed Brands</div>
              </div>

              <div className="bg-white dark:bg-gray-800 fruitful:bg-orange-50 rounded-2xl p-8 hover:bg-gray-50 dark:hover:bg-gray-700 fruitful:hover:bg-orange-100 transition-colors">
                <div className="text-5xl font-semibold text-gray-900 dark:text-white fruitful:text-orange-900 mb-3">9s</div>
                <div className="text-base font-normal text-gray-600 dark:text-gray-300 fruitful:text-orange-700">Pulse Synchronization</div>
              </div>

              <div className="bg-white dark:bg-gray-800 fruitful:bg-orange-50 rounded-2xl p-8 hover:bg-gray-50 dark:hover:bg-gray-700 fruitful:hover:bg-orange-100 transition-colors">
                <div className="text-5xl font-semibold text-gray-900 dark:text-white fruitful:text-orange-900 mb-3">15%</div>
                <div className="text-base font-normal text-gray-600 dark:text-gray-300 fruitful:text-orange-700">Helps Rescue Animals</div>
              </div>
            </div>
          </div>

          <div className="pt-16">
            <div className="inline-block bg-gray-50 dark:bg-gray-800 fruitful:bg-orange-50 rounded-3xl p-12">
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white fruitful:text-orange-900 mb-6">
                Join as a Consultant Today
              </h2>
              <p className="text-gray-600 dark:text-gray-300 fruitful:text-orange-700 mb-8 text-lg">
                One-time license fee: <span className="text-4xl font-semibold text-gray-900 dark:text-white fruitful:text-orange-900">$29</span>
              </p>
              <p className="text-base text-gray-500 dark:text-gray-400 fruitful:text-orange-600 mb-8">
                15% of all revenue helps rescue animals through Banimals™
              </p>

              <div id="paypal-button-container" className="min-h-[50px] mb-4">
                {!paypalLoaded && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Loading PayPal...</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
              </div>

              <button
                onClick={() => setShowPayFast(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Pay with PayFast (ZAR)
              </button>

              {showPayFast && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">PayFast Payment (South Africa)</h3>
                    <form action="https://sandbox.payfast.co.za/eng/process" method="POST">
                      <input type="hidden" name="merchant_id" value="10000100" />
                      <input type="hidden" name="merchant_key" value="46f0cd694581a" />
                      <input type="hidden" name="amount" value="435.00" />
                      <input type="hidden" name="item_name" value="Consultant License - NEXUS_NAIR" />
                      <input type="hidden" name="return_url" value={`${window.location.origin}/payment-success?gateway=payfast`} />
                      <input type="hidden" name="cancel_url" value={window.location.href} />
                      <input type="hidden" name="notify_url" value={`${window.location.origin}/api/payfast/notify`} />

                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                          <input
                            type="text"
                            name="name_first"
                            required
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                          <input
                            type="email"
                            name="email_address"
                            required
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="your@email.com"
                          />
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">Amount: <span className="font-bold">R435.00 ZAR</span></p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">Includes 15% Care Loop donation (R65.25 → Banimals™)</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setShowPayFast(false)}
                          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                          Proceed to PayFast
                        </button>
                      </div>
                    </form>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">Sandbox mode - Test only</p>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-400 dark:text-gray-500 fruitful:text-orange-500 mt-6">
                Secure payment powered by PayPal & PayFast
              </p>
            </div>
          </div>

          <div className="pt-20 space-y-3 text-base text-gray-400 dark:text-gray-500 fruitful:text-orange-600">
            <p className="font-light">Count every grain. Breathe every 9s. Care for every animal. Build the future.</p>
            <p className="font-normal">NEXUS_NAIR - ACTIVATED</p>
            <p className="font-light">SOVEREIGNTY. SEALED. EMPIRE-READY. 永不止息。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
