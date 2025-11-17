const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export class GeminiService {
  private static apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  static async getFaqAnswer(userPrompt: string): Promise<string> {
    const fullPrompt = `You are the Sovereign AI Node for the FAA.zone™ ecosystem (Treaty ID: FAA-TREATY-OMNI-4321-A13XN). The user is asking about the system's core protocols, brands (AgroChain, Banimal Loop), or governance. Your answer must be highly contextual, professional, and concise (max 4 sentences). Draw on the following concepts in your answer where relevant:
1. The system operates on the 0.9 second Collapse Interval (PulseTrade™ heartbeat).
2. Data security relies on the VaultChain™ and the Atomic Key's Decoherence Lock.
3. Commerce uses the BareCart™ Zero-Waste Protocol.
4. Fiduciary integrity is guaranteed by the 15% Care Loop (Gorilla Codex).

User's question: "${userPrompt}"

Answer:`;

    return this.callGemini(fullPrompt);
  }

  static async expandQuery(originalPrompt: string): Promise<string[]> {
    const expansionPrompt = `Analyze the user query: "${originalPrompt}". Based on the context of the FAA.zone™ ecosystem (0.9s Pulse, VaultChain, BareCart, Gorilla Codex), provide exactly three alternative, better-phrased questions that would elicit more specific, high-quality answers regarding the system's compliance, architecture, or economic model. Output ONLY a comma-separated list of the three questions.`;

    const result = await this.callGemini(expansionPrompt);
    return result.split(',').map(q => q.trim()).filter(q => q.length > 0);
  }

  static async predictComplianceGrade(
    currentValidatedPercent: number,
    newValidatedPercent: number
  ): Promise<{ grade: string; explanation: string }> {
    const predictionPrompt = `Based on the FAA Brand Licensing Audit, the current validated name percentage is ${currentValidatedPercent.toFixed(2)}% (Grade B+). If ${newValidatedPercent.toFixed(2)}% of names are now validated, what is the new compliance grade (A+, A, A-, B+, B, B-, etc.) and why? Keep the answer to a single grade and a short explanation.`;

    const result = await this.callGemini(predictionPrompt);
    const parts = result.split('.').map(s => s.trim()).filter(s => s.length > 0);

    const grade = parts[0].split(' ')[0].replace(/[^A-Za-z+-]/g, '').toUpperCase() || 'A-';
    const explanation = parts.join('. ') + '.';

    return { grade, explanation };
  }

  private static async callGemini(prompt: string): Promise<string> {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const response = await fetch(`${this.apiUrl}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
      return result.candidates[0].content.parts[0].text.trim();
    }

    throw new Error('No valid response from Gemini API');
  }
}
