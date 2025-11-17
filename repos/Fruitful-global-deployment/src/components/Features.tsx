import { useState } from 'react';
import { Lock, Zap, ShoppingCart, Database, Network, Shield } from 'lucide-react';
import SystemDetailModal from './SystemDetailModal';
import { SYSTEMS_DATA } from '../data/systemsData';

const features = [
  {
    id: 'claimroot',
    icon: Lock,
    name: 'ClaimRoot™',
    description: 'Blockchain-style asset ownership with immutable claim verification',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'pulsetrade',
    icon: Zap,
    name: 'PulseTrade™',
    description: '9-second pulse synchronization for real-time trading',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    id: 'barecart',
    icon: ShoppingCart,
    name: 'BareCart™',
    description: 'Zero-waste commerce counting every grain, wasting nothing',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  {
    id: '40d-store',
    icon: Database,
    name: '40D Store',
    description: '40-dimensional storage architecture for infinite scalability',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'vaultmesh',
    icon: Network,
    name: 'VaultMesh™',
    description: 'Distributed DNA node network with genome-level security',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    id: 'digital-great-wall',
    icon: Shield,
    name: 'Digital Great Wall',
    description: 'Enterprise-grade security that never falls (永不崩塌)',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  }
];

export default function Features() {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  const handleSystemClick = (systemId: string) => {
    setSelectedSystem(systemId);
  };

  const handleCloseModal = () => {
    setSelectedSystem(null);
  };

  const handleNavigate = (systemId: string) => {
    setSelectedSystem(systemId);
  };

  return (
    <div className="py-24 bg-white dark:bg-gray-900 fruitful:bg-gradient-to-br fruitful:from-orange-50 fruitful:via-amber-50 fruitful:to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white fruitful:text-orange-900 mb-4">
            Six Revolutionary Systems
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 fruitful:text-orange-700 max-w-3xl mx-auto">
            Powered by NEXUS_NAIR technology, built for planetary scale. Click any system to explore.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <button
              key={feature.name}
              onClick={() => handleSystemClick(feature.id)}
              className="group relative bg-white dark:bg-gray-800 fruitful:bg-orange-50 rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 fruitful:border-orange-200 hover:border-gray-200 dark:hover:border-gray-600 fruitful:hover:border-orange-300 cursor-pointer text-left"
            >
              <div className={`${feature.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} strokeWidth={2} />
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.name}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>

              <div className={`mt-4 text-sm font-medium ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                Click to explore →
              </div>
            </button>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            All systems operational. Pulse breathing every 9 seconds.
          </p>
        </div>
      </div>

      {selectedSystem && SYSTEMS_DATA[selectedSystem] && (
        <SystemDetailModal
          system={SYSTEMS_DATA[selectedSystem]}
          onClose={handleCloseModal}
          onNavigate={handleNavigate}
          allSystems={features.map(f => f.id)}
        />
      )}
    </div>
  );
}
