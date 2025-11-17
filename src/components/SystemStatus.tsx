import { Activity, Clock, TrendingUp, Database } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SystemStats {
  totalConsultants: number;
  totalTrades: number;
  totalProducts: number;
  totalClaims: number;
  currentPulse: number;
}

export default function SystemStatus() {
  const [stats, setStats] = useState<SystemStats>({
    totalConsultants: 0,
    totalTrades: 0,
    totalProducts: 0,
    totalClaims: 0,
    currentPulse: 0
  });

  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    loadSystemStats();

    const pulseInterval = setInterval(() => {
      setPulseActive(true);
      setStats(prev => ({ ...prev, currentPulse: prev.currentPulse + 1 }));

      setTimeout(() => setPulseActive(false), 500);
    }, 9000);

    return () => clearInterval(pulseInterval);
  }, []);

  const loadSystemStats = async () => {
    const [consultants, trades, products, claims] = await Promise.all([
      supabase.from('consultants').select('consultant_id', { count: 'exact', head: true }),
      supabase.from('trades').select('trade_id', { count: 'exact', head: true }),
      supabase.from('products').select('item_id', { count: 'exact', head: true }),
      supabase.from('claims').select('claim_id', { count: 'exact', head: true })
    ]);

    setStats({
      totalConsultants: consultants.count || 0,
      totalTrades: trades.count || 0,
      totalProducts: products.count || 0,
      totalClaims: claims.count || 0,
      currentPulse: Math.floor(Date.now() / 9000)
    });
  };

  return (
    <div className="py-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Activity className={`w-8 h-8 ${pulseActive ? 'text-green-400 scale-125' : 'text-green-500'} transition-all duration-300`} />
            <h2 className="text-4xl font-bold">System Status</h2>
          </div>
          <p className="text-gray-400 text-lg">
            NEXUS_NAIR operational. All systems synchronized.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <div className="text-3xl font-bold text-blue-400">{stats.totalConsultants}</div>
            </div>
            <div className="text-sm text-gray-400">Active Consultants</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-yellow-400" />
              <div className="text-3xl font-bold text-yellow-400">{stats.totalTrades}</div>
            </div>
            <div className="text-sm text-gray-400">PulseTrade™ Exchanges</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <Database className="w-8 h-8 text-emerald-400" />
              <div className="text-3xl font-bold text-emerald-400">{stats.totalProducts}</div>
            </div>
            <div className="text-sm text-gray-400">BareCart™ Products</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-purple-400" />
              <div className="text-3xl font-bold text-purple-400">{stats.totalClaims}</div>
            </div>
            <div className="text-sm text-gray-400">ClaimRoot™ Claims</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-8 border border-green-700/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400 mb-2">Current Pulse Number</div>
              <div className="text-5xl font-bold text-green-400">{stats.currentPulse.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-2">Breathing every 9 seconds</div>
            </div>

            <div className="relative">
              <div className={`w-24 h-24 rounded-full bg-green-500 ${pulseActive ? 'animate-ping' : ''}`}></div>
              <div className="absolute inset-0 w-24 h-24 rounded-full bg-green-400 flex items-center justify-center">
                <Activity className="w-12 h-12 text-gray-900" strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Uptime: 99.97% | Response Time: &lt;100ms | Licensed Brands: 13,713</p>
          <p className="mt-2">永不崩塌 - Never Falls</p>
        </div>
      </div>
    </div>
  );
}
