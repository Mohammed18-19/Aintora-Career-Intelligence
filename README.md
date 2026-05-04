# AINTORA AUSBILDUNG HUNTER — v1.1
### Career Intelligence Engine | Built by AINTORA SYSTEMS

---

## Overview

A standalone, multi-file AI-powered job intelligence dashboard for discovering, scoring, and tracking Ausbildung opportunities in Germany — with NRW (North Rhine-Westphalia) as top priority.

**No server required. Open `index.html` in any browser.**

With an Anthropic API key: live AI sweeps via Claude + web_search.
Without a key: instant seed data mode with 5 pre-ranked opportunities.

---

## Project Structure

```
ausbildung-hunter/
├── index.html        ← Full SPA dashboard (open this)
├── config.js         ← User profile, scoring weights, seed data, system prompt
├── engine.js         ← AI sweep engine (API calls, parsing, scoring, export)
└── README.md         ← This file
```

---

## Features

| Feature | Status |
|---------|--------|
| Live AI sweep (Anthropic API + web_search) | ✅ |
| Seed data mode (no API key needed) | ✅ |
| 100-point scoring engine | ✅ |
| Score ≥ 70 filter | ✅ |
| Alert system (score ≥ 80) | ✅ |
| Save / unsave opportunities | ✅ |
| Views: Sweep · Saved · Alerts | ✅ |
| Filter: open/closed | ✅ |
| Sort: score / A–Z / salary | ✅ |
| JSON export | ✅ |
| Progress bar with live status | ✅ |
| API key management (sidebar) | ✅ |

---

## How to Run a Live Sweep

1. Open `index.html` in your browser
2. Enter your Anthropic API key in the sidebar (sk-ant-...)
3. Click **Run Sweep**
4. The engine calls Claude with `web_search` tool enabled
5. Results are scored, ranked, filtered, and rendered automatically

---

## Scoring Engine (100 pts)

| Dimension | Max |
|-----------|-----|
| Skill match (Python, backend, AI, DB) | 40 |
| IT / AI relevance | 20 |
| Salary potential | 15 |
| NRW location | 10 |
| Foreign applicant friendliness | 15 |

**Threshold:** score ≥ 70 shown · score ≥ 80 triggers alert

---

## User Profile (config.js)

```js
AINTORA_CONFIG.user = {
  skills: ['Python', 'Flask', 'Django', 'PostgreSQL', 'AI agents', 'n8n', 'NestJS'],
  targetRegion: 'NRW',
  targetRoles: [
    'Fachinformatiker Anwendungsentwicklung',
    'Fachinformatiker Daten- und Prozessanalyse',
  ],
}
```

---

## Seed Data — Sweep 03.05.2026

| Company | Role | Score | Status |
|---------|------|-------|--------|
| KVNO Nordrhein | Fachinformatiker Daten- & Prozessanalyse | **87** | 🟢 Open |
| IT.NRW | Fachinformatiker Anwendungsentwicklung | **85** | 🔴 Deadline passed |
| AXA Köln | Fachinformatiker Anwendungsentwicklung (SAP) | **79** | 🟢 Open |
| MIBS AG | Fachinformatiker Anwendungsentwicklung (SAP) | **77** | 🟢 Open |
| microPLAN IT-Systemhaus | Fachinformatiker Anwendungsentwicklung | **76** | 🟢 Open |

---

## Roadmap

- [ ] Telegram notification bot (alert on score ≥ 80)
- [ ] Auto-apply form prefill system
- [ ] CV match scoring against job listings
- [ ] Chrome extension for real-time scraping
- [ ] Daily digest email via n8n
- [ ] Supabase/Firebase auth + cloud sync

---

*AINTORA SYSTEMS — AI Career Intelligence Infrastructure*