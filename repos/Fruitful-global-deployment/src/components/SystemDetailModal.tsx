import { X, Check, Code, Zap, ArrowRight } from 'lucide-react';
import { SystemData } from '../data/systemsData';
import { useState } from 'react';

interface SystemDetailModalProps {
  system: SystemData;
  onClose: () => void;
  onNavigate: (systemId: string) => void;
  allSystems: string[];
}

type TabType = 'overview' | 'features' | 'api' | 'examples';

export default function SystemDetailModal({ system, onClose, onNavigate, allSystems }: SystemDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const Icon = system.icon;

  const handleCopyCode = (code: string, exampleTitle: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(exampleTitle);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useState(() => {
    document.addEventListener('keydown', handleKeyDown as any);
    return () => document.removeEventListener('keydown', handleKeyDown as any);
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
        {/* Header */}
        <div className={`${system.bgColor} dark:bg-gray-800 px-8 py-6 border-b border-gray-200 dark:border-gray-700`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`${system.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center`}>
                <Icon className={`w-8 h-8 ${system.color}`} strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {system.name}
                </h2>
                <p className={`text-lg ${system.color} dark:opacity-90`}>
                  {system.tagline}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* System Navigation */}
          <div className="mt-6 flex flex-wrap gap-2">
            {allSystems.map((sysId) => (
              <button
                key={sysId}
                onClick={() => onNavigate(sysId)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sysId === system.id
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {sysId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-8">
          <div className="flex gap-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'features', label: 'Features' },
              { id: 'api', label: 'API' },
              { id: 'examples', label: 'Code Examples' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-4 px-2 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? `${system.color} dark:text-white`
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${system.color.replace('text-', 'bg-')}`} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  About {system.name}
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {system.description}
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Purpose
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {system.overview.purpose}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Key Benefits
                  </h4>
                  <ul className="space-y-2">
                    {system.overview.keyBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className={`w-5 h-5 ${system.color} mt-0.5 flex-shrink-0`} />
                        <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Technical Highlights
                  </h4>
                  <ul className="space-y-2">
                    {system.overview.technicalHighlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Zap className={`w-5 h-5 ${system.color} mt-0.5 flex-shrink-0`} />
                        <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {system.metrics && (
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Key Metrics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {system.metrics.map((metric, idx) => (
                      <div key={idx} className={`${system.bgColor} dark:bg-gray-800 p-4 rounded-xl`}>
                        <div className={`text-2xl font-bold ${system.color} dark:text-white mb-1`}>
                          {metric.value}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Use Cases
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {system.useCases.map((useCase, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <ArrowRight className={`w-5 h-5 ${system.color} mt-0.5 flex-shrink-0`} />
                      <span className="text-gray-700 dark:text-gray-300">{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Core Features
              </h3>
              <div className="grid gap-6">
                {system.features.map((feature, idx) => (
                  <div key={idx} className={`${system.bgColor} dark:bg-gray-800 p-6 rounded-xl`}>
                    <h4 className={`text-xl font-bold mb-2 ${system.color} dark:text-white`}>
                      {feature.title}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                API Endpoints
              </h3>
              <div className="space-y-4">
                {system.apiEndpoints.map((endpoint, idx) => (
                  <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <span className={`px-3 py-1 rounded-lg text-sm font-mono font-bold ${
                        endpoint.method === 'GET'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : endpoint.method === 'POST'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {endpoint.method}
                      </span>
                      <div className="flex-1">
                        <code className="text-lg font-mono text-gray-900 dark:text-white block mb-2">
                          {endpoint.endpoint}
                        </code>
                        <p className="text-gray-600 dark:text-gray-400">
                          {endpoint.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Examples Tab */}
          {activeTab === 'examples' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Code Examples
              </h3>
              {system.codeExamples.map((example, idx) => (
                <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Code className={`w-5 h-5 ${system.color}`} />
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {example.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleCopyCode(example.code, example.title)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        copiedCode === example.title
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {copiedCode === example.title ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-gray-900 dark:bg-black text-gray-100 p-5 overflow-x-auto">
                    <code className="text-sm font-mono">{example.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-8 py-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Related Systems: {system.relatedSystems.join(', ')}
            </div>
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${system.color.replace('text-', 'bg-')} text-white hover:shadow-lg hover:scale-105`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
