package cmd

import (
    "bytes"
    "crypto/sha256"
    "encoding/hex"
    "encoding/json"
    "fmt"
    "net/http"
    "time"

    "github.com/go-git/go-git/v5"
    "github.com/google/uuid"
    "github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
    Use:     "gitmetrics",
    Short:   "GitMetrics CLI for submitting events",
    Version: "0.1.0",  // You can change this version later
    RunE: func(cmd *cobra.Command, args []string) error {
        // This is your original code from main.go—copied here so 'gitmetrics' still works the same
        repo, err := git.PlainOpenWithOptions(".", &git.PlainOpenOptions{
            DetectDotGit: true,
        })
        if err != nil {
            return fmt.Errorf("not a git repo: %w", err)
        }

        head, err := repo.Head()
        if err != nil {
            return err
        }
        commitSHA := head.Hash().String()  // Changed to full SHA to match schema

        remotes, err := repo.Remotes()
        if err != nil {
            return err
        }
        var url string
        if len(remotes) > 0 && len(remotes[0].Config().URLs) > 0 {
            url = remotes[0].Config().URLs[0]
        }
        hash := sha256.Sum256([]byte(url))
        repoHash := hex.EncodeToString(hash[:])

        _, offset := time.Now().Zone()
        event := struct {
            Version     int    `json:"version"`
            ClientID    string `json:"client_id"`
            RepoHash    string `json:"repo_hash"`
            CommitSHA   string `json:"commit_sha"`
            Timestamp   string `json:"timestamp"`
            TZOffsetMin int    `json:"tz_offset_min"`
        }{
            Version:     1,
            ClientID:    uuid.NewString(),
            RepoHash:    repoHash,
            CommitSHA:   commitSHA,
            Timestamp:   time.Now().UTC().Format(time.RFC3339),
            TZOffsetMin: offset / 60,
        }

        body, err := json.Marshal(event)
        if err != nil {
            return err
        }
        resp, err := http.Post("http://localhost:8000/events", "application/json", bytes.NewReader(body))
        if err != nil {
            return fmt.Errorf("POST failed: %w", err)
        }
        defer resp.Body.Close()

        fmt.Println("server response:", resp.Status)
        return nil
    },
}

func Execute() error {
    return rootCmd.Execute()
}