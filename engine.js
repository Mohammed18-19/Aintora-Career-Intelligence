// ============================================================
// AINTORA CAREER INTELLIGENCE ENGINE — engine.js
// ============================================================

class SweepEngine {

  constructor() {
    this.apiKey   = null;
    this.lastSweep = null;
    this.isSweeping = false;
  }

  setApiKey(key) {
    this.apiKey = key ? key.trim() : null;
  }

  hasApiKey() {
    return !!(this.apiKey && this.apiKey.startsWith('sk-ant-'));
  }

  // ──────────────────────────────────────────────────────────
  // MAIN SWEEP — calls Anthropic API with web_search tool
  // ──────────────────────────────────────────────────────────
  async runSweep(onProgress) {
    if (this.isSweeping) return null;
    if (!this.hasApiKey()) throw new Error('API key required. Enter your Anthropic API key in Settings.');

    this.isSweeping = true;
    const today = new Date().toISOString().split('T')[0];

    try {
      onProgress?.('Initializing intelligence sweep…', 10);

      const userMessage = `Run a full intelligence sweep for Ausbildung 2026 opportunities in NRW and Germany for IT/Software/AI/Backend engineering roles. Today is ${today}. Search for: "Ausbildung Fachinformatiker Anwendungsentwicklung NRW 2026", "Ausbildung Fachinformatiker Daten Prozessanalyse NRW 2026", and "IT Ausbildung Düsseldorf Köln Dortmund 2026". Find real, current, open listings. Return results as JSON only.`;

      onProgress?.('Searching German job boards…', 30);

      const response = await fetch(AINTORA_CONFIG.api.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: AINTORA_CONFIG.api.model,
          max_tokens: AINTORA_CONFIG.api.maxTokens,
          system: SYSTEM_PROMPT,
          tools: [{ type: 'web_search_20250305', name: 'web_search' }],
          messages: [{ role: 'user', content: userMessage }],
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error ${response.status}`);
      }

      onProgress?.('Processing intelligence data…', 70);

      const data = await response.json();
      const result = this._parseApiResponse(data, today);

      onProgress?.('Scoring and ranking opportunities…', 90);

      result.opportunities = this._rankAndFilter(result.opportunities);

      this.lastSweep = result;
      onProgress?.('Sweep complete.', 100);

      return result;

    } finally {
      this.isSweeping = false;
    }
  }

  // ──────────────────────────────────────────────────────────
  // PARSE API RESPONSE
  // ──────────────────────────────────────────────────────────
  _parseApiResponse(data, today) {
    // Extract text content from response
    const textBlocks = (data.content || [])
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n');

    // Try to extract JSON from the response text
    const json = this._extractJSON(textBlocks);

    if (json && json.opportunities && Array.isArray(json.opportunities)) {
      return {
        sweep_date: json.sweep_date || today,
        query: json.query || 'NRW Ausbildung IT 2026',
        total_found: json.total_found || json.opportunities.length,
        opportunities: json.opportunities.map((o, i) => ({
          id: o.id || `opp-${Date.now()}-${i}`,
          company: o.company || 'Unknown',
          position: o.position || 'Unknown',
          location: o.location || 'Germany',
          salary: o.salary || 'Not specified',
          start_date: o.start_date || '2026',
          deadline: o.deadline || 'Unknown',
          status: o.status || 'open',
          apply_url: o.apply_url || '#',
          contact: o.contact || '',
          scores: this._normalizeScores(o.scores),
          why_match: o.why_match || '',
          alert: !!(o.alert || (o.scores?.total >= AINTORA_CONFIG.scoring.alertThreshold)),
          tags: Array.isArray(o.tags) ? o.tags : [],
          source: o.source || 'web',
          _live: true,
        })),
        _source: 'live',
      };
    }

    // If JSON parsing fails, return raw text as a single error result
    throw new Error('Could not parse structured job data from response. The API returned: ' + textBlocks.slice(0, 200));
  }

  _extractJSON(text) {
    // Try direct parse
    try { return JSON.parse(text.trim()); } catch (_) {}

    // Try extracting JSON block from markdown
    const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlock) {
      try { return JSON.parse(codeBlock[1].trim()); } catch (_) {}
    }

    // Try finding a raw JSON object
    const objMatch = text.match(/\{[\s\S]*"opportunities"[\s\S]*\}/);
    if (objMatch) {
      try { return JSON.parse(objMatch[0]); } catch (_) {}
    }

    return null;
  }

  _normalizeScores(scores) {
    if (!scores || typeof scores !== 'object') {
      return { skill_match: 0, ai_relevance: 0, salary_potential: 0, nrw: 0, foreign_friendly: 0, total: 0 };
    }
    const sm  = Math.min(40, Math.max(0, parseInt(scores.skill_match || 0)));
    const ai  = Math.min(20, Math.max(0, parseInt(scores.ai_relevance || 0)));
    const sal = Math.min(15, Math.max(0, parseInt(scores.salary_potential || scores.salary || 0)));
    const nrw = Math.min(10, Math.max(0, parseInt(scores.nrw || scores.nrw_relevance || 0)));
    const ff  = Math.min(15, Math.max(0, parseInt(scores.foreign_friendly || 0)));
    const total = scores.total ? Math.min(100, parseInt(scores.total)) : sm + ai + sal + nrw + ff;
    return { skill_match: sm, ai_relevance: ai, salary_potential: sal, nrw, foreign_friendly: ff, total };
  }

  // ──────────────────────────────────────────────────────────
  // RANK + FILTER
  // ──────────────────────────────────────────────────────────
  _rankAndFilter(opps) {
    return opps
      .filter(o => o.scores.total >= AINTORA_CONFIG.scoring.minScore)
      .sort((a, b) => b.scores.total - a.scores.total);
  }

  // ──────────────────────────────────────────────────────────
  // SEED DATA (used on first load)
  // ──────────────────────────────────────────────────────────
  getSeedData() {
    return {
      sweep_date: '2026-05-03',
      query: 'Ausbildung Fachinformatiker NRW 2026 (seed data)',
      total_found: SEED_OPPORTUNITIES.length,
      opportunities: this._rankAndFilter(SEED_OPPORTUNITIES),
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
    a.href     = url;
    a.download = `aintora-sweep-${sweepData.sweep_date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Singleton instance
const engine = new SweepEngine();