# AINTORA AUSBILDUNG HUNTER — v1.1
### Career Intelligence Engine | Built by AINTORA SYSTEMS

---

## Overview

A standalone, AI-powered job intelligence dashboard for discovering, scoring, and tracking
Ausbildung opportunities in Germany — NRW (North Rhine-Westphalia) as top priority.

**No server required. Open `index.html` in any browser.**

---

## API Key — Google Gemini (Free)

This project uses **Google Gemini 2.0 Flash** with Google Search grounding for live sweeps.

### How to get your free Gemini API key

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the key (starts with `AIza...`)

> **Free tier is enough** — Gemini 2.0 Flash has a generous free quota (15 req/min, 1500 req/day).
> No credit card required.

### Without a key

The dashboard works immediately in **seed data mode** — 5 pre-ranked opportunities are shown
on first load with no key needed.

---

## How to Run a Live Sweep

1. Open `index.html` in your browser (or `python3 -m http.server 3000` and go to `localhost:3000`)
2. Paste your Gemini key (`AIza...`) into the **Gemini API Key** field in the sidebar
3. Click **Save**
4. Click **Run Sweep**
5. Results are scored, ranked, filtered, and rendered automatically

---

## Project Structure

```
ausbildung-hunter/
├── index.html    ← Full SPA dashboard (open this)
├── config.js     ← User profile, scoring weights, seed data, system prompt
├── engine.js     ← Gemini sweep engine (API calls, parsing, scoring, export)
└── README.md     ← This file
```

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

## Features

| Feature | Status |
|---------|--------|
| Live AI sweep (Gemini 2.0 Flash + Google Search) | ✅ |
| Seed data mode (no API key needed) | ✅ |
| 100-point scoring engine | ✅ |
| Score ≥ 70 filter | ✅ |
| Alert system (score ≥ 80) | ✅ |
| Save / unsave opportunities | ✅ |
| Views: Sweep · Saved · Alerts | ✅ |
| Filter: open / closed | ✅ |
| Sort: score / A–Z / salary | ✅ |
| JSON export | ✅ |
| Progress bar with live status | ✅ |

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
- [ ] Auto-apply form prefill
- [ ] CV match scoring against listings
- [ ] Chrome extension for real-time scraping
- [ ] Daily digest via n8n

---

*AINTORA SYSTEMS — AI Career Intelligence Infrastructure*