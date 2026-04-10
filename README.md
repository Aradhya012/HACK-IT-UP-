# 🔐 VulnGuard — Autonomous NPM Security System

> **Team Hack-It-Up** | Leader: Aradhya Saraf | Member: Chinmay Muddapur  
> **Event:** HackZion V3 by AMCEC 2026

---

## What is VulnGuard?

VulnGuard is an autonomous cybersecurity system that **detects, analyses, and remediates vulnerabilities in npm-based applications without human intervention**.

### 3 Pillars

| Pillar | What it does |
|--------|-------------|
| 🔍 **Threat Detection** | Scans `package.json` using `npm audit` + OSV.dev API |
| 📊 **Threat Analysis** | CVSS scoring, CVE IDs, direct vs transitive dependency analysis |
| 🛠️ **Autonomous Remediation** | Auto-generates patched `package.json`, shows before/after diff |

---

## Quick Start (One Command)

```bash
bash start.sh
```

Or manually:

```bash
npm install
npm run dev
```

Frontend runs on **http://localhost:3000**

---

## Demo

1. Open http://localhost:3000
2. Upload `demo-package.json` (included in repo)
3. Click **SCAN NOW**
4. View CVEs for lodash, axios, express, minimist, node-fetch, serialize-javascript
5. Click **AUTO-REMEDIATE** to see patched package.json diff
6. Download the report or patched file

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/status` | Health check |
| `POST` | `/api/scan` | Upload `package.json` or GitHub URL, run full scan |
| `GET` | `/api/report/:id` | Get full vulnerability report as JSON |
| `POST` | `/api/remediate/:id` | Trigger autonomous remediation |

### POST /api/scan — Examples

**File upload:**
```bash
curl -X POST http://localhost:3000/api/scan \
  -F "file=@demo-package.json"
```

**JSON body:**
```bash
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"repoUrl": "https://github.com/owner/repo"}'
```

---

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes (Node.js)
- **Vulnerability Data:** npm audit CLI + OSV.dev API (https://api.osv.dev/v1/query)
- **Storage:** In-memory (no DB needed for demo)

---

## No Environment Variables Required

The core scanning works with zero configuration. Just `npm install && npm run dev`.

Optional `.env.local` (copy from `.env.example`) for LLM/Supabase features.
