import { X } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface ConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  paypalTransactionId: string;
}

export default function ConsultantModal({ isOpen, onClose, paypalTransactionId }: ConsultantModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('consultants')
        .insert({
          email,
          name,
          paypal_transaction_id: paypalTransactionId,
          status: 'active'
        });

      if (insertError) throw insertError;

      const careLoopAmount = 29 * 0.15;
      const animalsHelped = careLoopAmount / 12.5;

      await supabase
        .from('care_loop_transactions')
        .insert({
          amount: careLoopAmount,
          beneficiary: 'Banimals',
          animals_helped: animalsHelped
        });

      setSuccess(true);

      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmail('');
        setName('');
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome Aboard!</h3>
            <p className="text-gray-600">Your consultant license is now active.</p>
            <p className="text-sm text-gray-500 mt-4">Check your email for next steps.</p>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Registration</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Activating License...' : 'Activate My License'}
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              Transaction ID: {paypalTransactionId.substring(0, 16)}...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
