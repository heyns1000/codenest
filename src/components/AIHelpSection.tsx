import { useState } from 'react';
import { HelpCircle, Sparkles, ChevronRight } from 'lucide-react';
import { GeminiService } from '../services/gemini';

export default function AIHelpSection() {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [expansions, setExpansions] = useState<string[]>([]);
  const [showExpansions, setShowExpansions] = useState(false);

  const getAnswer = async () => {
    if (!prompt.trim()) {
      setAnswer('Please enter a question to get an answer.');
      return;
    }

    setLoading(true);
    setAnswer('');

    try {
      const result = await GeminiService.getFaqAnswer(prompt);
      setAnswer(result);
    } catch (error) {
      setAnswer(error instanceof Error ? error.message : 'Error connecting to AI service. Please check your API key configuration.');
    } finally {
      setLoading(false);
    }
  };

  const expandQuery = async () => {
    if (!prompt.trim()) {
      setAnswer('Please enter a base question before trying to expand it.');
      return;
    }

    setLoading(true);
    setShowExpansions(false);

    try {
      const result = await GeminiService.expandQuery(prompt);
      setExpansions(result);
      setShowExpansions(true);
    } catch (error) {
      setAnswer('Failed to generate query refinements.');
    } finally {
      setLoading(false);
    }
  };

  const selectRefinement = (refinement: string) => {
    setPrompt(refinement);
    setShowExpansions(false);
    setAnswer('');
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 fruitful:bg-orange-50 p-6 rounded-xl">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 fruitful:text-orange-900 mb-4 flex items-center">
        <HelpCircle className="w-6 h-6 mr-2 text-[#9370DB]" />
        AI Help & FAQ Answers
      </h3>
      <p className="text-sm mb-4 text-center text-gray-600 dark:text-gray-400 fruitful:text-orange-700">
        Ask about AgroChain™, Banimal Loop™ or FAA.zone
      </p>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full bg-white dark:bg-gray-900 fruitful:bg-white text-gray-900 dark:text-white fruitful:text-orange-900 border border-gray-300 dark:border-gray-700 fruitful:border-orange-300 p-3 rounded-lg mb-4"
        rows={3}
        placeholder="e.g., What is the core protocol of AgroChain™?"
      />

      {showExpansions && expansions.length > 0 && (
        <div className="mb-4 p-3 bg-[#0c0c0c] border border-gray-700 rounded-lg">
          <p className="text-xs font-semibold text-gray-400 mb-2">Suggested Refinements:</p>
          <div className="space-y-2">
            {expansions.map((exp, idx) => (
              <button
                key={idx}
                onClick={() => selectRefinement(exp)}
                className="w-full text-left text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-full transition flex items-center"
              >
                <ChevronRight className="w-3 h-3 mr-1" />
                {exp}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={getAnswer}
          disabled={loading}
          className="w-full bg-[#0071e3] text-white font-bold py-3 rounded-lg hover:bg-[#005bb5] transition flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Get Answer
            </>
          )}
        </button>

        <button
          onClick={expandQuery}
          disabled={loading}
          className="w-full bg-gray-600 text-white font-bold py-2 rounded-lg hover:bg-gray-500 transition text-sm disabled:opacity-50"
        >
          Expand Query (AI Refinement)
        </button>
      </div>

      {answer && (
        <div className="mt-4 p-4 bg-[#0c0c0c] border border-gray-700 rounded-lg">
          <p className="text-sm text-gray-300 whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
}
