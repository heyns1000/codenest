import { Heart, PawPrint } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase, type CareLoopTransaction } from '../lib/supabase';

export default function CareLoop() {
  const [totalDonations, setTotalDonations] = useState(0);
  const [animalsHelped, setAnimalsHelped] = useState(0);

  useEffect(() => {
    loadCareLoopStats();
  }, []);

  const loadCareLoopStats = async () => {
    const { data, error } = await supabase
      .from('care_loop_transactions')
      .select('amount, animals_helped');

    if (!error && data) {
      const total = data.reduce((sum, tx) => sum + Number(tx.amount), 0);
      const animals = data.reduce((sum, tx) => sum + (Number(tx.animals_helped) || 0), 0);

      setTotalDonations(total);
      setAnimalsHelped(animals);
    }
  };

  return (
    <div className="py-24 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 dark:bg-gray-900 fruitful:bg-gradient-to-br fruitful:from-orange-50 fruitful:via-amber-50 fruitful:to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center space-x-3 mb-6">
            <Heart className="w-12 h-12 text-rose-500" fill="currentColor" />
            <PawPrint className="w-12 h-12 text-orange-500" fill="currentColor" />
          </div>

          <h2 className="text-4xl font-bold text-gray-900 dark:text-white fruitful:text-orange-900 mb-4">
            Care Loop™
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 fruitful:text-orange-700 max-w-2xl mx-auto">
            15% of all revenue automatically helps rescue animals through Banimals™
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 fruitful:bg-orange-50 rounded-2xl p-8 shadow-lg border border-rose-100 dark:border-gray-700 fruitful:border-orange-200">
            <div className="text-5xl font-bold text-rose-600 dark:text-rose-400 fruitful:text-rose-600 mb-2">
              ${totalDonations.toFixed(2)}
            </div>
            <div className="text-gray-600 dark:text-gray-300 fruitful:text-orange-800 font-medium">Total Donated</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 fruitful:text-orange-600 mt-2">
              To Banimals™ animal rescue
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 fruitful:bg-orange-50 rounded-2xl p-8 shadow-lg border border-orange-100 dark:border-gray-700 fruitful:border-orange-200">
            <div className="text-5xl font-bold text-orange-600 dark:text-orange-400 fruitful:text-orange-600 mb-2">
              {Math.floor(animalsHelped)}
            </div>
            <div className="text-gray-600 dark:text-gray-300 fruitful:text-orange-800 font-medium">Animals Helped</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 fruitful:text-orange-600 mt-2">
              Lives saved and improved
            </p>
          </div>
        </div>

        <div className="mt-12 max-w-3xl mx-auto bg-white/80 dark:bg-gray-800/80 fruitful:bg-orange-50/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white fruitful:text-orange-900 mb-4">How It Works</h3>
          <div className="space-y-4 text-gray-600 dark:text-gray-300 fruitful:text-orange-800 leading-relaxed">
            <p>
              Every time a consultant license is purchased or a transaction occurs on the platform,
              <strong> 15% of the revenue</strong> is automatically set aside.
            </p>
            <p>
              These funds go directly to <strong>Banimals™</strong>, our partner animal rescue organization,
              helping provide food, shelter, medical care, and love to animals in need.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 fruitful:text-orange-600 italic">
              Transparency is built-in: all Care Loop transactions are publicly viewable on the blockchain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
