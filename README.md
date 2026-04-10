VulnGuad<div align="center"

![VulnGuardBanner](https://img.shields.io/badge/VulnGuard-Autonomous%20Security-red?style=for-the-badge&logo=shield&logoColor=white)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

Built for HackZion V3 by AMCEC 2026**  
**

[🚀QuickStart](#quick-start)· [📖 API Docs](#api-dpoins)· [🧠 ow It Wors](#how-t-wrks)·[🛠TechStack](#tech-stack)</div>

 **zero-cofig,plafor**roje— Dropn  `package.jon`.Get a fuCVEreport. Auto-pch.Dn.

##✨ Features

- DepVulnrabiliy Sanng—Combiwiththe [](https://osv.dev)for comprehensive CVE coverage-CVSS Scoring & Severity riage** — Critical / Hig / Medium / Low bkdown wihCVE IDs
- 🔗 **Dependency Graph —Dituihes.vulnerable e-🤖—a  with safe version upgrades
- 🔀 **Before/After Diff View** — Visual diff of original vs. patched dependency tree
- 📄 **Downloadable Reports** — Export full vulnerability report as JSON
- 🌐 **GitHub Repo Scanning** — Scan any public repo by URL no clone needed
- ⚡ **Real-time Progress** — Live scanprogres wit animated status updates

---

## How It Works

```
┌─────────────────────────────────────────────────────────┐
│                      VulnGuard Fl                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   package.jon /GitHu URL                             │
│          │                                              │
│          ▼                                              │
│   ┌─────────────┐    ┌──────────────┐                  │
│   │  npm audit  │ +  │  OSV.dev API │  ← Threat Intl  │
│   └─────────────┘    └──────────────┘                  │
│          │                                              │
│          ▼                                              │
│   ┌──────────────────────────────┐                     │
│   │  CVSS Scring + CVE Mapping  │  ← Analysis         │
│   │  Direct vs Tansitive Dps   │                     │
│   └──────────────────────────────┘                     │
│          │                                              │
│          ▼                                              │
│   ┌──────────────────────────────┐                     │
│   │  Autonomous Pch Gneator │  ← Remeation      │
│   │  Di View + Safe Versions   │                     │
│   └──────────────────────────────┘                     │
│          │                                              │
│          ▼                                              │
│   Patched package.json + JSON Report                   │
└─────────────────────────────────────────────────────────┘
```

###c###MAppat

> No environment variables required. Zero config. Just works.o Walkthrugh**** — packed with known CVEsHt and watch real-time progressRev:````````````—before/ftr instantly `package.json` orul JSON rport —confirms service is live pass a []Fchby canID[]for |

###Scan acl filecan aGitHu rep
```

**Get report:**
```bash
curl http://localhost:3000/api/report/<scan-id>
```

**Trigger remediation:**
```bash
curl -X POST http://localhost:3000/api/remediate/<scan-id>
| Layer | Technology ||-------|----------|
|amwork| (App outr) |
| Lnguage | TypeSrip|
| Styling | + ||| || |o) |
| Optinal | Supabase (persistence, LLM integration |# Project Structure

```
├── app/
│   ├── page.tsx                     Main UI
│   ├── layout.tsx                 # Rotlayout
│   └── api/
│       ├── sca/route.ts           # Scan endpont
│       ├── eprt/[id]/route.ts    # Report edpoint
│       ├── rediate/[id]/route.ts # Remediatio endpoin
│      └── sttus/oute.ts         # Helth check
├── components/
│   ├── VulnTa.tx              # CVE rslts table
│   ├── DffView.tsx                # Befo/after iff│  └── SanPrgss.tsx           # Live progres UI
├── lib/
│   ├── npm-udit.ts                # pm audt + OSV iteration
│  └── supabase.ts                 # Optinal pesencelay
├──servies/
│   └── fensve_enine/           # Advanced the smulati
├──demo-package.jon               # Pre-loaded wihkown CVEs for deo
└──rt.sh                       #Oe-comandstatpscript
``

---## Environment Variables (onal)

Cpy `.ev.exmpe` to tounlok tionaleatues:

```bash
cpe .nv.local
``

| Variable |Purpse |
|----------|---------|
| `SUPABASE_URL` | Persist scan results acoss sessions |
| `SUPABASE_ANON_KEY` |e auth key |
| `OPENAI_API_KEY` | LLM-powerdremdiion sggestions |

Core scanning works with **zero** environment vaiabl

---

## Team

| Role | Name |
|------|------|
| Team Leader | Aradhya Saraf |
| Member | Chinmay Muddapur |

**Event:** HackZion V3 · AMCEC 2026 · Team Hack-It-Up

---

<div align="center">
  <sub>Built with ❤️ and too much caffeine at HackZion V3</sub>
</div>