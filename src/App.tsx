import { useState } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import CareLoop from './components/CareLoop';
import SystemStatus from './components/SystemStatus';
import ConsultantModal from './components/ConsultantModal';
import VaultMeshPortal from './components/VaultMeshPortal';
import ThemeToggle from './components/ThemeToggle';
import BanimalFooter from './components/BanimalFooter';
import { PayPalScript } from './components/PayPalScript';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [paypalTxId, setPaypalTxId] = useState('');
  const [showVaultMesh, setShowVaultMesh] = useState(false);

  if (showVaultMesh) {
    return (
      <div className="min-h-screen">
        <VaultMeshPortal />
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => setShowVaultMesh(false)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-emerald-700 transition font-bold"
          >
            Back to Main Site
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PayPalScript />
      <ThemeToggle />
    <div className="min-h-screen bg-white dark:bg-gray-900 fruitful:bg-gradient-to-br fruitful:from-orange-50 fruitful:via-amber-50 fruitful:to-yellow-50">
      <Hero />
      <Features />
      <CareLoop />
      <SystemStatus />

      <div className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-4">Ready for Advanced Commerce?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Access the VaultMesh Treaty Checkout Portal for enterprise licensing and multi-brand transactions
          </p>
          <button
            onClick={() => setShowVaultMesh(true)}
            className="bg-[#FFB800] text-[#1a1a1a] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#FFA500] transition shadow-2xl"
          >
            Enter VaultMesh Portal
          </button>
        </div>
      </div>

      <ConsultantModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        paypalTransactionId={paypalTxId}
      />

      <BanimalFooter />
    </div>
    </>
  );
}

export default App;
