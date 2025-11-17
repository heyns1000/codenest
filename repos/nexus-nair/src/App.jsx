import React, { useState, useEffect } from 'react';
import Dashboard from './interface/Dashboard.jsx';
import NexusSystem from './NexusSystem.js';
import { generateBrandsData } from './generateBrands.js';

/**
 * Main Application Component
 * NEXUS_NAIR: 5-Layer FCU Stack
 */

function App() {
  const [nexusSystem, setNexusSystem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    initializeSystem();
  }, []);

  const initializeSystem = async () => {
    try {
      setLoadingProgress(10);
      console.log('🚀 Starting NEXUS_NAIR System...');
      
      // Create system
      const system = new NexusSystem();
      setLoadingProgress(20);
      
      // Initialize system
      await system.initialize();
      setLoadingProgress(30);
      
      // Generate brands data
      console.log('📦 Generating 13,713 brands...');
      const brandsData = generateBrandsData(13713);
      setLoadingProgress(50);
      
      // Load brands
      console.log('📥 Loading brands into system...');
      await system.loadBrandsData(brandsData);
      setLoadingProgress(90);
      
      // Generate report
      system.generateReport();
      setLoadingProgress(100);
      
      setNexusSystem(system);
      
      // Small delay to show 100%
      setTimeout(() => {
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('❌ Error initializing system:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              NEXUS_NAIR
            </h1>
            <p className="text-xl text-purple-300">5-Layer FCU Stack™</p>
          </div>
          
          <div className="w-96 bg-white/10 rounded-full h-4 overflow-hidden backdrop-blur">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          
          <p className="text-white mt-4 text-sm">
            Loading... {loadingProgress}%
          </p>
          
          <div className="mt-8 text-gray-400 text-xs space-y-1">
            {loadingProgress >= 10 && <div>✓ Initializing system core</div>}
            {loadingProgress >= 20 && <div>✓ Starting 5-layer stack</div>}
            {loadingProgress >= 30 && <div>✓ Infrastructure ready</div>}
            {loadingProgress >= 50 && <div>✓ Generated 13,713 brands</div>}
            {loadingProgress >= 90 && <div>✓ Loading complete</div>}
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard nexusSystem={nexusSystem} />;
}

export default App;
