# CommitMood · User Journeys

_A lightweight reference that keeps the core product flows crystal‑clear while you build._

---

## Journey 1 – First‑Time Signup (Solo Developer)

| Step | Channel / UI               | Alex’s Goal                         | CommitMood’s Response                                                           | Success Metric                                  |
| ---- | -------------------------- | ----------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------- |
| 1    | GitHub Marketplace listing | “Is this easy and safe to install?” | One‑click **Install** button, privacy headline: “Metadata only, no source code” | Click‑through rate ≥ 25 %                       |
| 2    | OAuth consent screen       | “What perms am I granting?”         | Scope list ⟂ limited to webhooks; tooltip explains SHA‑256 repo hash            | Drop‑off at OAuth < 10 %                        |
| 3    | Terminal (CLI install)     | “Make it quick.”                    | `curl -sSL …                                                                    | bash` downloads static binary, prints ✅ checks | Install time < 60 s |
| 4    | First commit push          | “Did CommitMood see that?”          | API receives event → Slack DM: “🎉 first event logged!”                         | Time‑to‑first‑event < 30 s                      |
| 5    | Personal dashboard         | “Show me the data.”                 | Heat‑map placeholder + streak timer (greyed until 3 commits)                    | Day‑1 return ≥ 50 %                             |

> **Moment of truth:** If Alex doesn’t see a Slack “welcome” DM inside 30 seconds, perceived value drops sharply.

---

## Journey 2 – Daily Check‑In (Solo Developer)

1. **Morning stand‑up prep** – Alex glances at the **Dashboard** bookmark; yesterday’s heat‑map + bar chart loads in < 2 s.
2. **Long coding session** – After 4 h uninterrupted commits, the CLI pops a **toast**: “Time for a 5‑minute break?”
3. **End‑of‑day wrap‑up** – Slack DM summary shows total commits, longest streak, break count.

_Delight metric: Alex spends < 2 minutes/day in the UI yet feels informed._

---

## Journey 3 – Long‑Session Break Nudge

| Trigger                                    | Detection Logic                     | Nudge Type                                          | Opt‑out Path               |
| ------------------------------------------ | ----------------------------------- | --------------------------------------------------- | -------------------------- |
| ≥ 4 h continuous activity (no 15‑min gaps) | Rolling window query in TimescaleDB | Local OS toast (`notify-send` / macOS notification) | `commitmood pause 30` CLI  |
| ≥ 6 h                                      | Same as above                       | Slack DM _and_ toast                                | Global disable in Settings |

_Goal: ≤ 1 false‑positive per fortnight._

---
