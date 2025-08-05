# GitMetrics MVP Roadmap

This document outlines the roadmap for completing the Minimum Viable Product (MVP) of GitMetrics, a Git analytics tool for tracking commits and repositories to monitor mood, downtime, burnout, etc. The stack includes Next.js (frontend), Python with FastAPI (backend), Go (CLI), and Docker for orchestration.

The roadmap emphasizes learning opportunities (e.g., authentication best practices, data visualization), best coding practices (e.g., modular code, error handling, secure password hashing), and software engineering design patterns (e.g., MVC in frontend, repository pattern in backend, observer pattern in CLI). It is designed as an iterative, agile process to build skills for your portfolio and resume.

Assumptions:
- Weekly effort: ~10 hours (accounting for a 9-5 job).
- Total timeline: ~12-15 weeks (~120-150 hours), starting August 05, 2025.
- Focus on testability, scalability, and clean architecture.
- Use free tools: JWT for auth, PostgreSQL via Docker, etc.
- Track progress with Git issues/branches for resume appeal.

## Phase 1: Setup Authentication System (User Signup/Login)
**Objectives**: Implement secure user accounts to isolate data per user. Use JWT for session management. Update DB to associate events with users.

**Tasks**:
1. **Backend (FastAPI)**:
   - Add user model to DB (SQLAlchemy ORM; apply repository pattern for data access abstraction).
   - Create endpoints: `/signup` (POST: hash passwords with bcrypt), `/login` (POST: return JWT).
   - Update `/events` and `/summary` to require JWT auth (use FastAPI's Depends for dependency injection).
   - Modify DB queries to filter by `user_id` (add column to `raw_events` table).
   - Implement middleware for token validation.
   - Best practice: Use Pydantic for request validation, handle exceptions with custom error responses.

2. **Frontend (Next.js)**:
   - Enhance `LoginPage`: Add form submission to call `/login` API, store JWT in cookies (securely with `js-cookie`).
   - Create `SignupPage` similar to `LoginPage`.
   - Update `RootLayout`: Conditional navigation based on auth state (e.g., show "Dashboard" if logged in).
   - Protect routes like Dashboard with middleware or `getServerSideProps`.
   - Design pattern: Use React Context (AuthProvider) for global state management.

3. **CLI (Go)**:
   - Add user auth: Prompt for API token (JWT) on first run, store securely (e.g., in `~/.gitmetrics/config`).
   - Update POST requests to include Authorization header.

4. **Docker**:
   - Add PostgreSQL container; configure FastAPI to connect via environment variables.
   - Update `docker-compose.yml`: Services for frontend, backend, and DB.

**Learning Focus**: Authentication best practices (OWASP guidelines), JWT vs. sessions, ORM vs. raw SQL, secure storage in CLI apps.

**Estimated Effort**: 20-25 hours (2-3 weeks).

## Phase 2: Enhance Dashboard
**Objectives**: Create an insightful dashboard with visualizations for mood/downtime/burnout (e.g., commit streaks, hourly patterns).

**Tasks**:
1. **Backend (FastAPI)**:
   - Expand `/summary` endpoint: Add metrics like commit streaks (SQL window functions), average commits/day, burnout indicators (e.g., days with >10 commits).
   - New endpoint `/details` for raw/filtered event views.
   - Best practice: Implement caching (e.g., with Redis if added later), use async DB operations for performance.

2. **Frontend (Next.js)**:
   - Improve `Dashboard`: Add charts for streaks/heatmaps (use Chart.js or Recharts).
   - Add filters (e.g., date range) with React state management (useReducer for complex state).
   - Expand `StatCard`s: Include "Longest Streak", "Avg Commits/Week", "Downtime Days".
   - Design pattern: Component composition (reusable cards/charts), server-side rendering for data fetching.
   - Error handling: Implement loading states and user-friendly error messages.

3. **Integration**:
   - Ensure dashboard fetches user-specific data via authenticated API calls.

**Learning Focus**: Data visualization libraries, advanced SQL queries, React state patterns, performance optimization (e.g., memoization).

**Estimated Effort**: 30-35 hours (3-4 weeks).

## Phase 3: Automate CLI for Real-Time Tracking
**Objectives**: Make CLI "always on" for Git projects—detect Git folders, hook into events (e.g., post-commit), auto-update server.

**Tasks**:
1. **CLI (Go)**:
   - Convert to daemon/service: Use observer pattern—install Git hooks (e.g., post-commit script calling Go binary).
   - Command: `gitmetrics init` to setup hooks in `.git/hooks` and store config.
   - On commit: Capture extended events (e.g., branch, message length for mood inference).
   - Background mode: Goroutines for periodic polling if no hooks.
   - Best practice: File-based error logging, idempotency (deduplicate by commit SHA).

2. **Backend (FastAPI)**:
   - Update `/events` to handle more event types and deduplicate entries.

3. **Frontend/Integration**:
   - Dashboard: Add auto-refresh or WebSockets for real-time updates (if time allows; else manual).

4. **Docker**:
   - CLI as testable image, but run primarily locally.

**Learning Focus**: Git hooks/internals, Go concurrency (goroutines/channels), daemon design, event-driven architecture.

**Estimated Effort**: 25-30 hours (3 weeks).

## Phase 4: Testing, Polish, and Deployment
**Objectives**: Ensure reliability, document for portfolio, deploy for showcase.

**Tasks**:
1. **Testing**:
   - Unit tests: Jest (Next.js), pytest (FastAPI), Go's testing package.
   - E2E: Cypress for frontend; simulate CLI interactions.
   - Best practice: Adopt TDD, cover edge cases (e.g., invalid tokens).

2. **Polish**:
   - UI/UX: Responsive design, consistent dark mode.
   - Security: Sanitize inputs, add API rate limiting.
   - Docs: Update README with setup instructions, architecture diagram (e.g., via Draw.io).

3. **Deployment**:
   - Use Docker Compose for local dev.
   - Host: Vercel (frontend), Render/Heroku (backend), or AWS.
   - Design pattern: Set up CI/CD with GitHub Actions for automated testing/deployment.

**Learning Focus**: Testing frameworks, CI/CD pipelines, deployment strategies, effective documentation for portfolios.

**Estimated Effort**: 20-25 hours (2-3 weeks).

## Overall Timeline
| Week | Phase Focus | Key Milestones | End Date (Approx.) |
|------|-------------|----------------|--------------------|
| 1-3 (20-30h) | Phase 1: Auth | Working signup/login, user-isolated DB. | Aug 26, 2025 |
| 4-7 (40h) | Phase 2: Dashboard | Enhanced visuals, new metrics. | Sep 23, 2025 |
| 8-10 (30h) | Phase 3: CLI Automation | Hooks installed, auto-tracking on commits. | Oct 14, 2025 |
| 11-13 (30h) | Phase 4: Testing/Polish | Full tests, docs, deploy to Vercel/Render. | Nov 04, 2025 |
| 14-15 (Buffer) | Iterations/Review | Fix bugs, add nice-to-haves (e.g., email verification). | Nov 18, 2025 |

This roadmap is a living document—update it in Git as progress evolves. For portfolio value, highlight how it incorporates patterns like MVC and repository for maintainable code. If roadblocks arise (e.g., debugging Go concurrency), allocate research time to deepen learning.