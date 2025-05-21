# CommitMood

> **Privacy‑first wellness analytics straight from your Git commits.**

CommitMood turns raw Git activity — nothing more than timestamps, commit SHAs and line counts — into friendly visualisations and subtle nudges that help you (and eventually, small teams) spot burnout before it bites.

---

## ✨ Why build this?

| Problem                                                                             | How CommitMood helps                                                      |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Late‑night or weekend coding streaks go unnoticed until productivity drops.         | Calendar heat‑map + “long‑session” timer surface unhealthy patterns fast. |
| Most time‑tracking tools feel like surveillance or require full source‑code access. | Collects **metadata only** (no filenames, no diffs, SHA‑256 repo hash).   |
| Setting up self‑hosted dashboards is a pain.                                        | One‑command Docker‑Compose; batteries‑included FastAPI + Postgres stack.  |

---

## 🎯 Goals (MVP — first 12 weeks)

- Ingest ≥ 95 % of commits within 5 seconds (p99)
- Show personal streak heat‑map and a break‑nudge toast after 4 h continuous coding
- Toggle tracking on/off from the CLI in ≤ 2 clicks
- Ship a one‑liner `docker compose up` demo

---

## 🗺️ High‑Level Roadmap

| Phase | Focus                               | ETA        |
| ----- | ----------------------------------- | ---------- |
| **0** | Vision, event schema, repo scaffold | Week 0‑2   |
| **1** | CLI collector + basic dashboard     | Week 3‑6   |
| **2** | Daily roll‑ups, personal insights   | Week 7‑10  |
| **3** | ML‑powered burnout risk & Slack bot | Week 11‑14 |
| **4** | Team mode & privacy controls        | Week 15‑20 |
| **5** | Billing, SaaS polish                | Week 21‑24 |

---

## 👥 Personas

- **Alex (Individual Dev)** – Wants quick feedback on coding habits without being spied on.
- **Priya (Future Team Lead)** – Needs early signals of team burnout, values opt‑in privacy.
- **Jordan (DevSecOps Gatekeeper)** – Approves tools only if they never touch source code.

---
