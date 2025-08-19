# GitMetrics

Self-hosted Git analytics tool for tracking code changes and metrics.

## Features
- Backend: FastAPI with Postgres for storing events.
- Frontend: Web with login, signup, and dashboard showcasing analytics.
- CLI: Go CLI for auto-submitting metrics on Git commits.

## Installation
- Backend: `docker-compose up api db`
- CLI: `go install github.com/ethanborg91/gitmetrics/cli@latest`

## Usage - CLI
- Auth: `gitmetrics auth <email> <password> [--server-url http://localhost:8000]` (creates JWT token).
- Manual Submit: `gitmetrics submit` (sends current commit metrics).
- Auto Hooks: `gitmetrics setup-hooks` (installs post-commit hook for auto on commits).
- Default: `gitmetrics` (runs submit).

Metrics include commit SHA, timestamp, lines added/deleted, files changed (hashed repo for privacy).

