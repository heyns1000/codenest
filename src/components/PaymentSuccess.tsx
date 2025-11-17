import { Download, CheckCircle, Mail, Key } from 'lucide-react';
import { License } from '../services/license';
import { LicenseService } from '../services/license';
import { Cart } from '../services/vaultmesh';

interface PaymentSuccessProps {
  license: License;
  cart: Cart;
  onClose: () => void;
}

export default function PaymentSuccess({ license, cart, onClose }: PaymentSuccessProps) {
  const handleDownload = async () => {
    const licenseText = LicenseService.generateLicenseFile(license, cart);
    LicenseService.downloadLicenseFile(licenseText, license.license_key);
    await LicenseService.incrementDownloadCount(license.license_id);
  };

  const handleEmailCopy = () => {
    navigator.clipboard.writeText(license.customer_email);
    alert('Email copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 fruitful:bg-orange-50 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 fruitful:bg-green-200 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 fruitful:text-green-700" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white fruitful:text-orange-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 fruitful:text-orange-700">
              Your license has been generated and is ready for download
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 fruitful:bg-orange-100 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Key className="w-6 h-6 text-blue-600 dark:text-blue-400 fruitful:text-orange-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white fruitful:text-orange-900">
                  License Key
                </h3>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 fruitful:bg-white rounded-xl p-4 font-mono text-lg text-center text-gray-900 dark:text-white fruitful:text-orange-900 tracking-wider border-2 border-blue-500 dark:border-blue-400 fruitful:border-orange-500">
              {license.license_key}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800 fruitful:bg-orange-100 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 fruitful:text-orange-600 mb-1">Order ID</p>
              <p className="font-mono text-sm text-gray-900 dark:text-white fruitful:text-orange-900">
                {license.order_id.substring(0, 8)}...
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 fruitful:bg-orange-100 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 fruitful:text-orange-600 mb-1">Payment Method</p>
              <p className="font-semibold text-gray-900 dark:text-white fruitful:text-orange-900 uppercase">
                {license.payment_method}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 fruitful:bg-orange-100 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 fruitful:text-orange-600 mb-1">Amount Paid</p>
              <p className="font-semibold text-gray-900 dark:text-white fruitful:text-orange-900">
                R{license.product_price.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 fruitful:bg-orange-100 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 fruitful:text-orange-600 mb-1">Status</p>
              <p className="font-semibold text-green-600 dark:text-green-400 fruitful:text-green-700 uppercase">
                {license.status}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 fruitful:bg-blue-100 border border-blue-200 dark:border-blue-700 fruitful:border-blue-300 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 fruitful:text-blue-700 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-blue-900 dark:text-blue-300 fruitful:text-blue-900">
                  A copy of your license has been sent to:
                </p>
                <button
                  onClick={handleEmailCopy}
                  className="font-semibold text-blue-700 dark:text-blue-400 fruitful:text-blue-800 mt-1 hover:underline"
                >
                  {license.customer_email}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDownload}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center shadow-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download License File
            </button>

            <button
              onClick={onClose}
              className="w-full bg-gray-200 dark:bg-gray-700 fruitful:bg-orange-200 hover:bg-gray-300 dark:hover:bg-gray-600 fruitful:hover:bg-orange-300 text-gray-900 dark:text-white fruitful:text-orange-900 font-semibold py-4 rounded-xl transition"
            >
              Continue Shopping
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400 fruitful:text-orange-600 mt-6">
            Save your license key securely. You can redownload your license anytime using your email.
          </p>
        </div>
      </div>
    </div>
  );
}
