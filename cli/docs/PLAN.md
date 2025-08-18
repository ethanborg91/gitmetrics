# GitMetrics CLI Enhancement Plan

## Overview
This plan outlines enhancements to the existing Go-based CLI for GitMetrics. The current CLI uses go-git to collect basic repo metrics (repo_hash from remote URL or fallback to path, commit_sha, timestamp, tz_offset_min) and a new UUID client_id each run, then POSTs them as an Event JSON to /events without authentication. The goal is to add auto-submission on Git changes via hooks, while improving usability, security, and metrics depth. This builds iteratively on the current single-file main.go without a full rewrite.

Key Features:
- Multi-command structure for better UX (e.g., auth, submit, setup-hooks).
- Secure JWT authentication (login to get token, use Bearer header).
- Persistent client_id (UUID stored in keyring, reuse across runs).
- Expanded metrics: Add lines_added and lines_deleted from commit diff (matches backend schema); optionally files_changed.
- Automation: Git hooks to trigger submission on commits.
- Installation: Global via `go install github.com/ethanborg91/gitmetrics/cli@latest`.

This is a learning-focused project to demonstrate Go CLI development, Git integration, and full-stack alignment for resume purposes.

## Tech Choices
- **CLI Framework:** Add Cobra (github.com/spf13/cobra) for subcommands, flags, and auto-help. Chosen because it integrates easily with the existing single-purpose main.go (migrate logic to root or submit command).
- **Git Interaction:** Build on existing go-git (v5.16.0). Extend for diff stats using CommitObject.Patch() and Stats() to sum additions/deletions and count files. Pros: Pure Go, no os/exec; already a dep. Fallback repo_hash to worktree path if no remote. Use full commit_sha (40 hex).
- **Secure Storage:** Add go-keyring (github.com/zalando/go-keyring) for JWT token, server URL, and persistent client_id. Cross-platform (uses OS keychain); fallback to env vars if needed.
- **HTTP/Submission:** Reuse net/http; POST to /auth/login for token, then to /events with Bearer header and JSON payload.
- **Dependencies:** Minimal additions (Cobra, keyring); keep go.mod clean.
- **Testing:** Manual in sample repos; add Go tests in later steps.

## Commands
- `gitmetrics` (default/root): Runs the submit logic (backward-compatible with current behavior).
- `gitmetrics auth <email> <password> [--server-url http://localhost:8000]`: POSTs to /auth/login to get JWT, stores token and URL securely. Defaults to localhost:8000. (Use signup separately via API if new user.)
- `gitmetrics submit`: Collects enhanced metrics (including lines_added/lines_deleted), builds Event JSON, and POSTs to /events with auth header.
- `gitmetrics setup-hooks`: Creates an executable .git/hooks/post-commit script that runs `gitmetrics submit`.
- `gitmetrics version`: Prints CLI version (e.g., v0.1.0).

## Data Schema (Expanded Event Struct)
Match backend JSON schema exactly (required fields + optionals we add). Validation enforces formats (e.g., repo_hash 64-hex, timestamp RFC3339, commit_sha 7-40 hex).
```go
type Event struct {
    Version      int    `json:"version"`       // Always 1
    ClientID     string `json:"client_id"`     // Persistent UUID (stored in keyring)
    RepoHash     string `json:"repo_hash"`     // SHA256 hex (64 chars) of remote URL or worktree path
    CommitSHA    string `json:"commit_sha"`    // Full 40-hex SHA
    Timestamp    string `json:"timestamp"`     // UTC RFC3339
    TZOffsetMin  int    `json:"tz_offset_min"` // Local offset in minutes (-720 to 840)
    LinesAdded   int    `json:"lines_added"`   // Sum additions from diff (min 0)
    LinesDeleted int    `json:"lines_deleted"` // Sum deletions from diff (min 0)
    // Optional future: FilesChanged int `json:"files_changed"` // Count of changed files
}