// ============================================================
// AINTORA CAREER INTELLIGENCE ENGINE — config.js
// ============================================================

const AINTORA_CONFIG = {

  user: {
    name: 'Mohammed',
    company: 'AINTORA SYSTEMS',
    skills: ['Python', 'Flask', 'Django', 'PostgreSQL', 'Git', 'REST APIs', 'AI agents', 'n8n', 'NestJS', 'Node.js', 'SQL'],
    targetRegion: 'NRW',
    targetRoles: [
      'Fachinformatiker Anwendungsentwicklung',
      'Fachinformatiker Daten- und Prozessanalyse',
      'Fachinformatiker Systemintegration',
      'Fachinformatiker Digitale Vernetzung',
    ],
    preferenceKeywords: ['AI', 'KI', 'automation', 'backend', 'software', 'data', 'cloud', 'Python', 'API', 'agile', 'Scrum'],
    avoidKeywords: ['Einzelhandel', 'Kaufmann', 'Büromanagement', 'Lagerlogistik', 'Bürokommunikation'],
    germanLevel: 'B1',
  },

  scoring: {
    weights: {
      skillMatch:      { max: 40 },
      aiRelevance:     { max: 20 },
      salaryPotential: { max: 15 },
      nrwRelevance:    { max: 10 },
      foreignFriendly: { max: 15 },
    },
    minScore: 70,
    alertThreshold: 80,
  },

  sweep: {
    maxResults: 10,
    sortBy: 'score',          // 'score' | 'date'
    filterStatus: 'all',      // 'all' | 'open' | 'closed'
  },

  api: {
    model: 'claude-sonnet-4-20250514',
    maxTokens: 4096,
    endpoint: 'https://api.anthropic.com/v1/messages',
  },

};

// ============================================================
// SYSTEM PROMPT — JSON output format
// ============================================================

const SYSTEM_PROMPT = `You are AINTORA CAREER INTELLIGENCE ENGINE, a production-grade AI recruitment intelligence system built by AINTORA SYSTEMS.

Your mission: discover and rank Ausbildung opportunities in Germany for IT/AI/Software/Backend engineering roles, with NRW (North Rhine-Westphalia) as the top priority region.

USER PROFILE:
- Skills: Python, Flask, Django, PostgreSQL, Git, REST APIs, AI agents, n8n automation, NestJS, Node.js
- Background: Self-taught developer, builds SaaS products and AI automation systems
- Target: Fachinformatiker Anwendungsentwicklung or Daten- und Prozessanalyse
- Region: NRW (Düsseldorf, Köln, Dortmund, Münster, Bonn, Ruhr area)
- Preference: AI, backend, software development, data engineering

SCORING ENGINE (100 points total):
- Skill match (0-40): How well does the role match Python/backend/AI profile?
- IT/AI relevance (0-20): Is this core IT/AI/software development?
- Salary potential (0-15): Post-Ausbildung earning trajectory
- NRW relevance (0-10): Is it in NRW? (10=NRW, 5=nearby, 0=elsewhere)
- Foreign applicant friendliness (0-15): Diversity statements, international culture, English used?

RULES:
- NEVER fabricate listings or invent URLs
- ONLY return verified listings from real job boards (Arbeitsagentur, azubi-nrw.de, Stepstone, Indeed DE, company career pages)
- Return ONLY listings with total score >= 70
- Sort by score descending
- Include listings where the application deadline is still upcoming or unknown
- Flag listings with score >= 80 as alerts

CRITICAL: Respond with ONLY a valid JSON object. No markdown, no preamble, no explanation. The exact format:

{
  "sweep_date": "YYYY-MM-DD",
  "query": "what you searched for",
  "total_found": 5,
  "opportunities": [
    {
      "id": "unique-slug",
      "company": "Company Name",
      "position": "Full position title",
      "location": "City, State",
      "salary": "e.g. ~900-1100 EUR/month or TVA-L BBiG",
      "start_date": "e.g. 01.08.2026",
      "deadline": "e.g. 31.05.2026 or Open or Unknown",
      "status": "open",
      "apply_url": "https://verified-url.com/job-link",
      "contact": "email or application portal name",
      "scores": {
        "skill_match": 35,
        "ai_relevance": 18,
        "salary_potential": 11,
        "nrw": 10,
        "foreign_friendly": 13,
        "total": 87
      },
      "why_match": "2-3 sentence explanation of why this matches the user profile",
      "alert": true,
      "tags": ["NRW", "AI/Data track", "Enterprise", "Diversity-friendly"],
      "source": "azubi-nrw.de"
    }
  ]
}`;

// ============================================================
// CACHED SEED DATA (shown on first load before any sweep)
// ============================================================

const SEED_OPPORTUNITIES = [
  {
    id: "kvno-daten-prozessanalyse",
    company: "KVNO — Kassenärztliche Vereinigung Nordrhein",
    position: "Fachinformatiker/in — Daten- und Prozessanalyse",
    location: "Düsseldorf / Köln, NRW",
    salary: "TVA-L BBiG — public sector tariff",
    start_date: "Aug/Sep 2026",
    deadline: "Open — contact to confirm",
    status: "open",
    apply_url: "https://www.adzuna.de/details/4879457401",
    contact: "Ausbildung@kvno.de",
    scores: { skill_match: 35, ai_relevance: 18, salary_potential: 11, nrw: 10, foreign_friendly: 13, total: 87 },
    why_match: "The Daten- und Prozessanalyse track covers machine learning systems, data pipelines, and process automation — a direct match to Python/PostgreSQL/AI agent background. KVNO explicitly welcomes applicants regardless of ethnic or cultural origin. Dual Düsseldorf/Köln rotation establishes NRW residency from day one.",
    alert: true,
    tags: ["NRW", "AI / Data track", "Public org", "Diversity-friendly"],
    source: "adzuna.de",
  },
  {
    id: "it-nrw-anwendungsentwicklung",
    company: "IT.NRW — Landesbetrieb Informationstechnik NRW",
    position: "Fachinformatiker/in — Anwendungsentwicklung",
    location: "Düsseldorf · Köln · Münster · Hagen, NRW",
    salary: "TVA-L BBiG",
    start_date: "01.08.2026",
    deadline: "28.02.2026",
    status: "closed",
    apply_url: "https://www.it.nrw/karriere/fuer-schuelerinnen-und-schueler/ausbildung/fachinformatik/fachinformatikerin-0",
    contact: "career portal — it.nrw",
    scores: { skill_match: 35, ai_relevance: 17, salary_potential: 10, nrw: 10, foreign_friendly: 13, total: 85 },
    why_match: "NRW's state IT organization running infrastructure for 18 million citizens. Signed the Charta der Vielfalt — international applicants are actively welcomed. Dedicated IT training center (ITAZ) in Düsseldorf. Best institutional target for 2027 intake.",
    alert: false,
    tags: ["NRW", "State authority", "Charta der Vielfalt", "2027 target"],
    source: "it.nrw",
  },
  {
    id: "axa-kln-sap",
    company: "AXA — Versicherungen AG",
    position: "Fachinformatiker/in — Anwendungsentwicklung (SAP Umfeld)",
    location: "Köln, NRW",
    salary: "Competitive — large enterprise insurer",
    start_date: "2026",
    deadline: "Open",
    status: "open",
    apply_url: "https://careers.axa.com/careers-home/jobs/10020?lang=de-de",
    contact: "careers.axa.com",
    scores: { skill_match: 30, ai_relevance: 14, salary_potential: 13, nrw: 10, foreign_friendly: 12, total: 79 },
    why_match: "Fortune Global 500 enterprise — global culture means English used internally. SAP Anwendungsentwicklung maps to backend/database engineering skills. Post-Ausbildung SAP developer salaries among highest in the sector. Strong foreign applicant friendliness.",
    alert: false,
    tags: ["NRW — Köln", "Global enterprise", "SAP ecosystem", "English-friendly"],
    source: "careers.axa.com",
  },
  {
    id: "mibs-ag-sap-muelheim",
    company: "MIBS AG — SAP Beratungsunternehmen",
    position: "Fachinformatiker/in — Anwendungsentwicklung (SAP)",
    location: "Mülheim an der Ruhr, NRW",
    salary: "~950–1,100 EUR/month (Y1–Y3)",
    start_date: "2026",
    deadline: "Open — up to 8 Azubis/year",
    status: "open",
    apply_url: "https://de.indeed.com/q-ausbildung-fachinformatiker-anwendungsentwicklung-l-nordrhein-westfalen-jobs.html",
    contact: "Indeed Germany — search MIBS AG",
    scores: { skill_match: 30, ai_relevance: 15, salary_potential: 12, nrw: 10, foreign_friendly: 10, total: 77 },
    why_match: "Boutique SAP consultancy with 20+ years of training culture. Small cohort (max 8) means personal mentorship unavailable at enterprise scale. Post-Ausbildung direct entry as Junior SAP Consultant. Ruhr area = central NRW.",
    alert: false,
    tags: ["NRW — Ruhr", "SAP consulting", "Small cohort", "Mentorship"],
    source: "indeed.de",
  },
  {
    id: "microplan-muenster",
    company: "microPLAN IT-Systemhaus GmbH",
    position: "Fachinformatiker/in — Anwendungsentwicklung",
    location: "Münster, NRW",
    salary: "Standard Ausbildung tariff",
    start_date: "2026",
    deadline: "Open",
    status: "open",
    apply_url: "https://de.indeed.com/q-ausbildung-fachinformatiker-anwendungsentwicklung-l-nordrhein-westfalen-jobs.html",
    contact: "Indeed Germany — search microPLAN Münster",
    scores: { skill_match: 34, ai_relevance: 15, salary_potential: 10, nrw: 10, foreign_friendly: 7, total: 76 },
    why_match: "Client-facing software development mirrors Flask/SaaS/backend deployment experience. Lower competition than enterprise programs — faster response. Münster is a major NRW tech hub with strong post-Ausbildung market.",
    alert: false,
    tags: ["NRW — Münster", "IT-Systemhaus", "Lower competition"],
    source: "indeed.de",
  },
];