import React, { useState, useEffect } from 'react';
import BanimalCheckout from './BanimalCheckout';

/**
 * NEXUS_NAIR Dashboard - Interface Layer
 * React + Tailwind UI for 5-Layer FCU Stack
 */

const Dashboard = ({ nexusSystem }) => {
  const [stats, setStats] = useState({
    brands: 0,
    target: 13713,
    percentage: 0,
    chainValid: true
  });
  
  const [activeLayer, setActiveLayer] = useState('overview');
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (nexusSystem) {
      updateStats();
      const interval = setInterval(updateStats, 5000);
      return () => clearInterval(interval);
    }
  }, [nexusSystem]);

  const updateStats = () => {
    if (!nexusSystem) return;
    
    const progress = nexusSystem.logic.getTargetProgress();
    setStats({
      brands: progress.current,
      target: progress.target,
      percentage: progress.percentage,
      baseTarget: progress.baseTarget,
      targetPercentage: progress.targetPercentage,
      chainValid: nexusSystem.logic.validateChain()
    });
  };

  const addSampleBrand = () => {
    const categories = ['Tech', 'Fashion', 'Food', 'Finance', 'Healthcare'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    nexusSystem.logic.processTransaction({
      type: 'ADD_BRAND',
      data: {
        name: `Brand ${stats.brands + 1}`,
        category,
        status: 'ACTIVE',
        value: Math.floor(Math.random() * 1000000)
      }
    });
    
    updateStats();
  };

  const layers = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'ledger', name: 'Vault Chain™', icon: '🔐' },
    { id: 'logic', name: 'Gorilla Codex', icon: '🦍' },
    { id: 'infra', name: 'FAA Cloud™', icon: '☁️' },
    { id: 'governance', name: 'ClaimRoot™', icon: '⚖️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-purple-500/30">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            NEXUS_NAIR
          </h1>
          <p className="text-sm text-purple-300 mt-1">5-Layer FCU Stack™ Platform</p>
        </div>
      </header>

      {/* Main Stats Bar */}
      <div className="bg-black/20 backdrop-blur border-b border-purple-500/20">
        <div className="container mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{stats.brands.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Current Brands</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{stats.target.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Target Brands</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{stats.percentage}%</div>
              <div className="text-xs text-gray-400">Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{stats.targetPercentage}%</div>
              <div className="text-xs text-gray-400">Target %</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${stats.chainValid ? 'text-green-400' : 'text-red-400'}`}>
                {stats.chainValid ? '✓' : '✗'}
              </div>
              <div className="text-xs text-gray-400">Chain Status</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-black/30 backdrop-blur min-h-screen border-r border-purple-500/20">
          <nav className="p-4 space-y-2">
            {layers.map(layer => (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeLayer === layer.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                <span className="mr-2">{layer.icon}</span>
                {layer.name}
              </button>
            ))}
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full text-left px-4 py-3 rounded-lg transition-all bg-green-600 hover:bg-green-700 text-white mt-4"
            >
              <span className="mr-2">🛒</span>
              Banimal Checkout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeLayer === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-6">System Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">🔐</span>
                    Layer 1: Vault Chain™
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Blockchain-based ledger system securing {stats.brands} brands with immutable records.
                  </p>
                  <div className="mt-4 text-sm text-purple-300">
                    Status: {stats.chainValid ? 'Valid ✓' : 'Invalid ✗'}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">🦍</span>
                    Layer 2: Gorilla Codex + 9s PulseTrade™
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Business logic engine with 9-second pulse cycles for real-time processing.
                  </p>
                  <div className="mt-4 text-sm text-purple-300">
                    Target: {stats.targetPercentage}% ({stats.target.toLocaleString()} brands)
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">☁️</span>
                    Layer 3: FAA Cloud™ + R2
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Cloud infrastructure with distributed storage for scalable operations.
                  </p>
                  <div className="mt-4 text-sm text-purple-300">
                    Status: Operational
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">⚖️</span>
                    Layer 5: ClaimRoot™
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Decentralized governance system for claims and proposals validation.
                  </p>
                  <div className="mt-4 text-sm text-purple-300">
                    Status: Active
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="space-x-4">
                  <button
                    onClick={addSampleBrand}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                  >
                    Add Sample Brand
                  </button>
                  <button
                    onClick={updateStats}
                    className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Refresh Stats
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeLayer === 'ledger' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">🔐 Vault Chain™ Ledger</h2>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-purple-500/20">
                <p className="text-gray-300">
                  Blockchain ledger with {stats.brands} brands secured.
                </p>
                <div className="mt-4 text-sm">
                  <div>Chain Valid: {stats.chainValid ? '✓ Yes' : '✗ No'}</div>
                  <div>Total Brands: {stats.brands}</div>
                </div>
              </div>
            </div>
          )}

          {activeLayer === 'logic' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">🦍 Gorilla Codex Logic</h2>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-purple-500/20">
                <p className="text-gray-300 mb-4">
                  Core business logic with 9s PulseTrade™ cycles
                </p>
                <div className="space-y-2 text-sm">
                  <div>Current Brands: {stats.brands}</div>
                  <div>Base Target: {stats.baseTarget}</div>
                  <div>Extended Target: {stats.target} ({stats.targetPercentage}%)</div>
                  <div>Progress: {stats.percentage}%</div>
                </div>
              </div>
            </div>
          )}

          {activeLayer === 'infra' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">☁️ FAA Cloud™ Infrastructure</h2>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-purple-500/20">
                <p className="text-gray-300">
                  Cloud infrastructure with R2 storage integration
                </p>
                <div className="mt-4 text-sm">
                  <div>Status: Operational</div>
                  <div>Storage: R2 Compatible</div>
                  <div>Region: Auto-scaling</div>
                </div>
              </div>
            </div>
          )}

          {activeLayer === 'governance' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">⚖️ ClaimRoot™ Governance</h2>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-purple-500/20">
                <p className="text-gray-300">
                  Decentralized governance for claims and proposals
                </p>
                <div className="mt-4 text-sm">
                  <div>Status: Active</div>
                  <div>Type: Decentralized</div>
                  <div>Validators: Multi-signature</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Banimal Checkout Modal */}
      {showCheckout && (
        <BanimalCheckout onClose={() => setShowCheckout(false)} />
      )}
    </div>
  );
};

export default Dashboard;
