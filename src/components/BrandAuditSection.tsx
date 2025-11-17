import { useState } from 'react';
import { Building2, TrendingUp, Shield } from 'lucide-react';
import { BRAND_AUDIT_DATA } from '../services/vaultmesh';
import { GeminiService } from '../services/gemini';

const TOTAL_BRANDS = 7344;
const ORIGINAL_PLACEHOLDERS = 1164;

export default function BrandAuditSection() {
  const [cleanupInput, setCleanupInput] = useState('');
  const [prediction, setPrediction] = useState<{ grade: string; explanation: string } | null>(null);
  const [predicting, setPredicting] = useState(false);

  const runPrediction = async () => {
    const namesToClean = parseInt(cleanupInput);

    if (isNaN(namesToClean) || namesToClean < 0 || namesToClean > ORIGINAL_PLACEHOLDERS) {
      setPrediction({
        grade: 'ERROR',
        explanation: `Invalid input. Must be between 0 and ${ORIGINAL_PLACEHOLDERS}.`
      });
      return;
    }

    setPredicting(true);

    try {
      const remainingPlaceholders = ORIGINAL_PLACEHOLDERS - namesToClean;
      const currentValidatedPercent = ((TOTAL_BRANDS - ORIGINAL_PLACEHOLDERS) / TOTAL_BRANDS) * 100;
      const newValidatedPercent = currentValidatedPercent + (namesToClean / TOTAL_BRANDS) * 100;

      const result = await GeminiService.predictComplianceGrade(currentValidatedPercent, newValidatedPercent);
      setPrediction(result);
    } catch (error) {
      setPrediction({
        grade: 'ERROR',
        explanation: 'AI Node connection failed.'
      });
    } finally {
      setPredicting(false);
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'text-green-400';
    if (grade.includes('B')) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <section className="mt-12 mb-8">
      <div className="bg-[#1e1e1e] p-6 rounded-xl shadow-xl">
        <h2 className="text-3xl font-black text-[#FFB800] mb-4 text-center flex items-center justify-center">
          <Building2 className="w-8 h-8 mr-3" />
          COMPLETE BRAND ECOSYSTEM AUDIT
        </h2>
        <p className="text-sm text-gray-400 mb-6 text-center">
          Full Stack Verification (October 31, 2025). Status: <strong className="text-green-400">PRODUCTION READY</strong>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 fruitful:bg-white p-4 rounded-lg border border-gray-200 dark:border-gray-700 fruitful:border-orange-200">
            <div className="text-sm text-gray-400 mb-1">TOTAL BRANDS</div>
            <div className="text-2xl font-bold text-green-400">{BRAND_AUDIT_DATA.totalBrands.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">✅ VERIFIED</div>
          </div>

          <div className="bg-white dark:bg-gray-900 fruitful:bg-white p-4 rounded-lg border border-gray-200 dark:border-gray-700 fruitful:border-orange-200">
            <div className="text-sm text-gray-600 dark:text-gray-400 fruitful:text-orange-700 mb-1">WATER SEED TARGET</div>
            <div className="text-2xl font-bold text-yellow-400">{BRAND_AUDIT_DATA.waterSeedTarget.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">⭐⭐⭐⭐⭐</div>
          </div>

          <div className="bg-white dark:bg-gray-900 fruitful:bg-white p-4 rounded-lg border border-gray-200 dark:border-gray-700 fruitful:border-orange-200">
            <div className="text-sm text-gray-600 dark:text-gray-400 fruitful:text-orange-700 mb-1">ACHIEVEMENT</div>
            <div className="text-2xl font-bold text-green-400">{BRAND_AUDIT_DATA.achievementPercent}%</div>
            <div className="text-xs text-gray-500 mt-1">✅ EXCEEDED</div>
          </div>

          <div className="bg-white dark:bg-gray-900 fruitful:bg-white p-4 rounded-lg border border-gray-200 dark:border-gray-700 fruitful:border-orange-200">
            <div className="text-sm text-gray-600 dark:text-gray-400 fruitful:text-orange-700 mb-1">DATA QUALITY</div>
            <div className="text-2xl font-bold text-green-400">A+</div>
            <div className="text-xs text-gray-500 mt-1">0% Missing Fields</div>
          </div>
        </div>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#0c0c0c] border-b border-gray-700">
                <th colSpan={4} className="py-3 text-white text-center font-bold flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  TIER FINANCIAL BREAKDOWN (FAA System)
                </th>
              </tr>
              <tr className="text-gray-300 text-left border-b border-gray-800">
                <th className="py-2 px-3">Tier</th>
                <th className="py-2 px-3">Count</th>
                <th className="py-2 px-3">Avg Fee</th>
                <th className="py-2 px-3">Avg Royalty</th>
              </tr>
            </thead>
            <tbody>
              {BRAND_AUDIT_DATA.tierBreakdown.map((tier) => (
                <tr key={tier.tier} className="border-b border-gray-800">
                  <td className="py-2 px-3 text-white font-semibold text-base">{tier.tier}</td>
                  <td className="py-2 px-3 font-mono text-blue-300 font-medium">{tier.count.toLocaleString()}</td>
                  <td className="py-2 px-3 font-mono text-green-400 font-medium">
                    {tier.avgFee.toFixed(2)} ECR
                  </td>
                  <td className="py-2 px-3 font-mono text-white font-medium">{tier.avgRoyalty.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#0c0c0c] border border-gray-700 p-6 rounded-lg">
          <h4 className="font-bold text-white mb-3 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-purple-400" />
            AI Compliance Score Prediction (VaultMesh)
          </h4>
          <p className="text-sm text-gray-300 mb-4">
            Simulate cleanup effort to predict new Data Quality Grade. Original Placeholder Names: {ORIGINAL_PLACEHOLDERS}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            <input
              type="number"
              value={cleanupInput}
              onChange={(e) => setCleanupInput(e.target.value)}
              className="bg-[#0f0f0f] text-white border border-gray-600 p-3 rounded-lg w-full sm:w-1/2 placeholder-gray-400"
              placeholder={`Placeholder Names to Clean (max ${ORIGINAL_PLACEHOLDERS})`}
              min="0"
              max={ORIGINAL_PLACEHOLDERS}
            />
            <button
              onClick={runPrediction}
              disabled={predicting}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition w-full sm:w-auto whitespace-nowrap disabled:opacity-50"
            >
              {predicting ? 'Predicting...' : 'Run Compliance Prediction'}
            </button>
          </div>

          {prediction && (
            <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm">
              <p className={`text-lg font-bold mb-2 ${getGradeColor(prediction.grade)}`}>
                Predicted Grade: {prediction.grade}
              </p>
              <p className="text-xs text-gray-400 italic">{prediction.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
