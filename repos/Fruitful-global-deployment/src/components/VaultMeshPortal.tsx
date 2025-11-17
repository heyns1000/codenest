import { useState } from 'react';
import { ShoppingCart, Lock, Zap, DollarSign, User, Mail } from 'lucide-react';
import { VaultMeshService, PRODUCT_CATALOG, type Cart, type CartItem } from '../services/vaultmesh';
import { PaymentService } from '../services/payment';
import { License } from '../services/license';
import AIHelpSection from './AIHelpSection';
import BrandAuditSection from './BrandAuditSection';
import ThemeToggle from './ThemeToggle';
import PaymentSuccess from './PaymentSuccess';

export default function VaultMeshPortal() {
  const [cart, setCart] = useState<Cart>({
    items: [],
    status: 'BUILDING',
    owner: 'Anonymous'
  });

  const [selectedProduct, setSelectedProduct] = useState('Sovereign');
  const [atomicKey, setAtomicKey] = useState('Awaiting Collapse...');
  const [paymentStatus, setPaymentStatus] = useState('Enter your details below to proceed with payment.');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedLicense, setCompletedLicense] = useState<License | null>(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const addItem = () => {
    const product = PRODUCT_CATALOG[selectedProduct as keyof typeof PRODUCT_CATALOG];

    const existingItem = cart.items.find(i => i.id === selectedProduct);
    if (existingItem) {
      setCart({
        ...cart,
        items: cart.items.map(item =>
          item.id === selectedProduct
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      setCart({
        ...cart,
        items: [...cart.items, {
          id: selectedProduct,
          name: product.name,
          price: product.price,
          unit: product.unit,
          quantity: 1
        }]
      });
    }
  };

  const finalizeAndTrace = () => {
    if (cart.items.length === 0) {
      alert("Cannot finalize: Cart Vortex is empty. Add items first.");
      return;
    }

    const finalizationTime = Date.now();
    const generatedKey = VaultMeshService.generateAtomicKey(finalizationTime);

    setAtomicKey(generatedKey);
    setCart({ ...cart, status: 'READY', atomicKey: generatedKey });

    alert(`SUCCESS: Cart Finalized (READY).
Atomic Key Generated (Trace Lock): ${generatedKey}
Ready for Payment Processing.`);
  };

  const initiatePayment = async (gateway: 'paypal' | 'payfast') => {
    if (cart.items.length === 0) {
      alert("Payment initiation failed: Cart Vortex is empty. Add items first.");
      return;
    }

    if (!customerEmail || !customerName) {
      setShowCustomerForm(true);
      setPaymentStatus('Please enter your email and name to continue.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      setPaymentStatus('Please enter a valid email address.');
      return;
    }

    setIsProcessing(true);
    const totals = VaultMeshService.calculateTotals(cart);
    const amount = totals.totalDue.toFixed(2);

    setPaymentStatus(`Processing ${gateway.toUpperCase()} payment for R${amount}...`);

    try {
      const result = gateway === 'paypal'
        ? await PaymentService.processPayPalPayment(cart, customerEmail, customerName)
        : await PaymentService.processPayFastPayment(cart, customerEmail, customerName);

      if (result.success && result.license) {
        setPaymentStatus(`Payment Success via ${gateway.toUpperCase()}. License Generated!`);
        setAtomicKey(result.license.license_key);
        setCart({ ...cart, status: 'COMPLETED' });
        setCompletedLicense(result.license);
      } else {
        setPaymentStatus(`Payment failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      setPaymentStatus(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const totals = VaultMeshService.calculateTotals(cart);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 fruitful:bg-gradient-to-br fruitful:from-orange-50 fruitful:via-amber-50 fruitful:to-yellow-50 text-gray-900 dark:text-white">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="bg-gray-50 dark:bg-gray-800 fruitful:bg-orange-100 text-gray-900 dark:text-white fruitful:text-orange-900 py-16 px-8 rounded-3xl mb-12">
          <div className="text-center">
            <div className="flex justify-center mb-12">
              <img
                src="/Fruitful_cover_photo_1754146572189.jpg"
                alt="Fruitful Global Planet"
                className="max-w-4xl w-full h-auto rounded-3xl"
              />
            </div>
            <h1 className="text-5xl font-semibold mb-3">VaultMesh Treaty Checkout</h1>
            <p className="text-xl text-gray-600 font-light">Finalizing FAA-TREATY-OMNI-4321-A13XN Transaction</p>
          </div>
        </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800 fruitful:bg-orange-50 p-8 rounded-3xl">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white fruitful:text-orange-900 mb-6 flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2" />
            BareCart™ Vortex Grain Pathway
          </h2>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-base">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 fruitful:text-orange-600 border-b border-gray-200 dark:border-gray-700 fruitful:border-orange-200">
                  <th className="py-3 font-normal">Item</th>
                  <th className="py-3 font-normal">Qty</th>
                  <th className="py-3 text-right font-normal">Price (R)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cart.items.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-gray-400 dark:text-gray-500 fruitful:text-orange-500">
                      Vortex is Empty. Add items below.
                    </td>
                  </tr>
                ) : (
                  cart.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 text-gray-900 dark:text-gray-100 fruitful:text-orange-900">{item.name} ({item.unit})</td>
                      <td className="py-3 text-gray-900 dark:text-gray-100 fruitful:text-orange-900">{item.quantity}</td>
                      <td className="py-3 font-mono text-right text-gray-900 dark:text-gray-100 fruitful:text-orange-900">
                        R{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700 fruitful:border-orange-200">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white fruitful:text-orange-900">Add Systems to Cart</h3>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 fruitful:bg-white text-gray-900 dark:text-white fruitful:text-orange-900 border border-gray-300 dark:border-gray-600 fruitful:border-orange-300 p-4 rounded-xl"
            >
              {Object.entries(PRODUCT_CATALOG).map(([key, product]) => (
                <option key={key} value={key}>
                  {product.name} ({product.price.toFixed(2)} {product.unit})
                </option>
              ))}
            </select>
            <button
              onClick={addItem}
              className="w-full bg-blue-600 text-white font-medium py-4 rounded-xl hover:bg-blue-700 transition"
            >
              Add Selected Item to Vortex
            </button>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">

          <div className="bg-gray-50 dark:bg-gray-800 fruitful:bg-orange-50 p-8 rounded-3xl">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white fruitful:text-orange-900 mb-6 flex items-center">
              <DollarSign className="w-6 h-6 mr-2" />
              Final Ledger Totals
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <p className="text-gray-600 dark:text-gray-400 fruitful:text-orange-700">Subtotal (ECR/R)</p>
                <p className="font-mono text-gray-900 dark:text-gray-100 fruitful:text-orange-900">R{totals.subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between bg-green-50 dark:bg-green-900/20 fruitful:bg-green-100 border border-green-200 dark:border-green-700 fruitful:border-green-300 text-green-700 dark:text-green-400 fruitful:text-green-800 p-3 rounded-xl">
                <p className="font-medium text-sm">Treaty Obligation (15% Care Loop)</p>
                <p className="font-mono text-sm font-medium">R{totals.careSplit.toFixed(2)}</p>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700 fruitful:border-orange-200">
                <p className="text-lg font-semibold text-gray-900 dark:text-white fruitful:text-orange-900">TOTAL DUE (AUDITED)</p>
                <p className="text-lg font-semibold font-mono text-gray-900 dark:text-white fruitful:text-orange-900">R{totals.totalDue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 fruitful:bg-orange-50 p-8 rounded-3xl">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white fruitful:text-orange-900 mb-6 flex items-center">
              <Lock className="w-6 h-6 mr-2" />
              Checkout & Payment
            </h2>

            {showCustomerForm || customerEmail === '' ? (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 fruitful:text-orange-800 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-white dark:bg-gray-900 fruitful:bg-white text-gray-900 dark:text-white fruitful:text-orange-900 border border-gray-300 dark:border-gray-600 fruitful:border-orange-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 fruitful:text-orange-800 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-white dark:bg-gray-900 fruitful:bg-white text-gray-900 dark:text-white fruitful:text-orange-900 border border-gray-300 dark:border-gray-600 fruitful:border-orange-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 dark:bg-blue-900/20 fruitful:bg-blue-100 border border-blue-200 dark:border-blue-700 fruitful:border-blue-300 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-900 dark:text-blue-300 fruitful:text-blue-900">
                  <strong>{customerName}</strong>
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400 fruitful:text-blue-800">{customerEmail}</p>
                <button
                  onClick={() => setShowCustomerForm(true)}
                  className="text-xs text-blue-600 dark:text-blue-400 fruitful:text-blue-700 hover:underline mt-2"
                >
                  Edit details
                </button>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <button
                onClick={() => initiatePayment('paypal')}
                disabled={isProcessing || cart.items.length === 0}
                className="w-full bg-blue-600 text-white font-medium py-4 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Pay Now with PayPal (Global)'}
              </button>
              <button
                onClick={() => initiatePayment('payfast')}
                disabled={isProcessing || cart.items.length === 0}
                className="w-full bg-emerald-600 text-white font-medium py-4 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Pay Now with PayFast (ZA)'}
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 fruitful:text-orange-600 text-center mt-3">{paymentStatus}</p>
            </div>

            <button
              onClick={finalizeAndTrace}
              className="w-full bg-blue-600 text-white font-medium py-4 rounded-xl hover:bg-blue-700 transition flex items-center justify-center"
            >
              <Zap className="w-5 h-5 mr-2" />
              Finalize Cart & Generate Atomic Key
            </button>

            <p className="text-xs font-mono text-gray-500 dark:text-gray-400 fruitful:text-orange-600 mt-6 break-all">
              Trace ID (Temporal Anchor): <span className="text-gray-900 dark:text-white fruitful:text-orange-900">{atomicKey}</span>
            </p>
          </div>

          <AIHelpSection />
        </div>
      </div>

      <BrandAuditSection />
      </div>

      {completedLicense && (
        <PaymentSuccess
          license={completedLicense}
          cart={cart}
          onClose={() => {
            setCompletedLicense(null);
            setCart({ items: [], status: 'BUILDING', owner: 'Anonymous' });
            setCustomerEmail('');
            setCustomerName('');
            setShowCustomerForm(false);
            setAtomicKey('Awaiting Collapse...');
            setPaymentStatus('Enter your details below to proceed with payment.');
          }}
        />
      )}
    </div>
  );
}
