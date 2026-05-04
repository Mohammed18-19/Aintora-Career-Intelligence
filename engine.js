// ============================================================
// AINTORA CAREER INTELLIGENCE ENGINE — engine.js
// Powered by Google Gemini 2.0 Flash + Google Search grounding
// ============================================================

class SweepEngine {

  constructor() {
    this.apiKey    = null;
    this.lastSweep = null;
    this.isSweeping = false;
  }

  setApiKey(key) {
    this.apiKey = key ? key.trim() : null;
  }

  hasApiKey() {
    return !!(this.apiKey && this.apiKey.length > 10);
  }

  // ──────────────────────────────────────────────────────────
  // MAIN SWEEP — Gemini 2.0 Flash + Google Search grounding
  // ──────────────────────────────────────────────────────────
  async runSweep(onProgress) {
    if (this.isSweeping) return null;
    if (!this.hasApiKey()) throw new Error('API key required. Enter your Gemini API key in the sidebar.');

    this.isSweeping = true;
    const today = new Date().toISOString().split('T')[0];

    try {
      onProgress?.('Initializing intelligence sweep…', 10);

      const userMessage = `Run a full Ausbildung intelligence sweep for Germany, NRW focus. Today is ${today}.

Search for ALL of these:
1. "Ausbildung Fachinformatiker Anwendungsentwicklung NRW 2026"
2. "Ausbildung Fachinformatiker Daten Prozessanalyse NRW 2026"
3. "IT Ausbildung Düsseldorf Köln Dortmund 2026 offen"
4. "Ausbildung Software Entwicklung NRW 2026 bewerben"

Find real, currently open listings. Return ONLY a valid JSON object — no markdown, no explanation, no preamble.`;

      onProgress?.('Searching German job boards via Google…', 30);

      const url = `${AINTORA_CONFIG.api.endpoint}?key=${this.apiKey}`;

      const body = {
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: [{
          role: 'user',
          parts: [{ text: userMessage }]
        }],
        tools: [{ google_search: {} }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 4096,
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const msg = err?.error?.message || `Gemini API error ${response.status}`;
        throw new Error(msg);
      }

      onProgress?.('Processing intelligence data…', 65);

      const data = await response.json();
      const result = this._parseGeminiResponse(data, today);

      onProgress?.('Scoring and ranking opportunities…', 88);

      result.opportunities = this._rankAndFilter(result.opportunities);
      this.lastSweep = result;

      onProgress?.('Sweep complete.', 100);
      return result;

    } finally {
      this.isSweeping = false;
    }
  }

  // ──────────────────────────────────────────────────────────
  // PARSE GEMINI RESPONSE
  // ──────────────────────────────────────────────────────────
  _parseGeminiResponse(data, today) {
    // Extract text from Gemini candidates
    const text = data?.candidates?.[0]?.content?.parts
      ?.filter(p => p.text)
      ?.map(p => p.text)
      ?.join('\n') || '';

    if (!text) throw new Error('Empty response from Gemini. Try again.');

    const json = this._extractJSON(text);

    if (json && Array.isArray(json.opportunities)) {
      return {
        sweep_date: json.sweep_date || today,
        query: json.query || 'NRW Ausbildung IT 2026',
        total_found: json.total_found || json.opportunities.length,
        opportunities: json.opportunities.map((o, i) => ({
          id:         o.id || `opp-${Date.now()}-${i}`,
          company:    o.company    || 'Unknown',
          position:   o.position   || 'Unknown',
          location:   o.location   || 'Germany',
          salary:     o.salary     || 'Not specified',
          start_date: o.start_date || '2026',
          deadline:   o.deadline   || 'Unknown',
          status:     o.status     || 'open',
          apply_url:  o.apply_url  || '#',
          contact:    o.contact    || '',
          scores:     this._normalizeScores(o.scores),
          why_match:  o.why_match  || '',
          alert:      !!(o.alert || ((o.scores?.total || 0) >= AINTORA_CONFIG.scoring.alertThreshold)),
          tags:       Array.isArray(o.tags) ? o.tags : [],
          source:     o.source || 'google-search',
          _live: true,
        })),
        _source: 'live',
      };
    }

    throw new Error('Could not parse structured job data from Gemini response. Raw: ' + text.slice(0, 300));
  }

  _extractJSON(text) {
    try { return JSON.parse(text.trim()); } catch (_) {}

    const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence) { try { return JSON.parse(fence[1].trim()); } catch (_) {} }

    const obj = text.match(/\{[\s\S]*"opportunities"[\s\S]*\}/);
    if (obj)  { try { return JSON.parse(obj[0]); } catch (_) {} }

    return null;
  }

  _normalizeScores(s) {
    if (!s || typeof s !== 'object') {
      return { skill_match: 0, ai_relevance: 0, salary_potential: 0, nrw: 0, foreign_friendly: 0, total: 0 };
    }
    const sm  = Math.min(40, Math.max(0, parseInt(s.skill_match  || 0)));
    const ai  = Math.min(20, Math.max(0, parseInt(s.ai_relevance || 0)));
    const sal = Math.min(15, Math.max(0, parseInt(s.salary_potential || s.salary || 0)));
    const nrw = Math.min(10, Math.max(0, parseInt(s.nrw || s.nrw_relevance || 0)));
    const ff  = Math.min(15, Math.max(0, parseInt(s.foreign_friendly || 0)));
    const total = s.total ? Math.min(100, parseInt(s.total)) : sm + ai + sal + nrw + ff;
    return { skill_match: sm, ai_relevance: ai, salary_potential: sal, nrw, foreign_friendly: ff, total };
  }

  _rankAndFilter(opps) {
    return opps
      .filter(o => o.scores.total >= AINTORA_CONFIG.scoring.minScore)
      .sort((a, b) => b.scores.total - a.scores.total);
  }

  // ──────────────────────────────────────────────────────────
  // SEED DATA (shown instantly before any sweep)
  // ──────────────────────────────────────────────────────────
  getSeedData() {
    return {
      sweep_date: '2026-05-03',
      query: 'Ausbildung Fachinformatiker NRW 2026 (seed data)',
      total_found: SEED_OPPORTUNITIES.length,
      opportunities: this._rankAndFilter([...SEED_OPPORTUNITIES]),
      _source: 'seed',
    };
  }

  // ──────────────────────────────────────────────────────────
  // EXPORT
  // ──────────────────────────────────────────────────────────
  exportJSON(sweepData) {
    const blob = new Blob([JSON.stringify(sweepData, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `aintora-sweep-${sweepData.sweep_date}.json`;
    a.click(); URL.revokeObjectURL(url);
  }
}

const engine = new SweepEngine();