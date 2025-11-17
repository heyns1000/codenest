import React, { useState } from 'react';

/**
 * Banimal Checkout - Checkout Interface Component
 * Part of Interface Layer (React + Tailwind)
 */

const BanimalCheckout = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    brandName: '',
    category: 'Tech',
    email: '',
    payment: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete checkout
      alert('Brand registration complete! Added to Vault Chain™');
      onClose();
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-800 to-purple-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-purple-500/30 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <span className="mr-2">🛒</span>
            Banimal Checkout
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map(num => (
            <div
              key={num}
              className={`flex items-center ${num < 3 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= num
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > num ? 'bg-purple-600' : 'bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Brand Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={e => updateField('brandName', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter brand name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => updateField('category', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Tech">Tech</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Food">Food</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Contact Info */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Method
                </label>
                <select
                  value={formData.payment}
                  onChange={e => updateField('payment', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                >
                  <option value="">Select payment method</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="credit">Credit Card</option>
                  <option value="wire">Wire Transfer</option>
                </select>
              </div>
              <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
                <div className="text-sm text-gray-300 space-y-1">
                  <div>Brand: {formData.brandName}</div>
                  <div>Category: {formData.category}</div>
                  <div>Email: {formData.email}</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all text-white font-medium"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-white font-medium shadow-lg"
            >
              {step === 3 ? 'Complete Registration' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BanimalCheckout;
