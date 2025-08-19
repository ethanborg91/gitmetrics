package cmd

import (
    "bytes"
    "crypto/sha256"
    "encoding/hex"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "time"

    "github.com/go-git/go-git/v5"
    "github.com/spf13/cobra"
    "github.com/zalando/go-keyring"
)

type Event struct {
    Version      int    `json:"version"`
    ClientID     string `json:"client_id"`
    RepoHash     string `json:"repo_hash"`
    CommitSHA    string `json:"commit_sha"`
    Timestamp    string `json:"timestamp"`
    TZOffsetMin  int    `json:"tz_offset_min"`
    LinesAdded   int    `json:"lines_added"`
    LinesDeleted int    `json:"lines_deleted"`
	FilesChanged int `json:"files_changed"`
}

var submitCmd = &cobra.Command{
    Use:   "submit",
    Short: "Collect and submit metrics",
    RunE: func(cmd *cobra.Command, args []string) error {
        repo, err := git.PlainOpenWithOptions(".", &git.PlainOpenOptions{
            DetectDotGit: true,
        })
        if err != nil {
            return fmt.Errorf("not a git repo: %w", err)
        }

        // Repo hash with fallback
        var repoHash string
        remotes, err := repo.Remotes()
        var url string
        if err == nil && len(remotes) > 0 && len(remotes[0].Config().URLs) > 0 {
            url = remotes[0].Config().URLs[0]
            hash := sha256.Sum256([]byte(url))
            repoHash = hex.EncodeToString(hash[:])
        } else {
            // Fallback to hash worktree path
            wt, err := repo.Worktree()
            if err != nil {
                return fmt.Errorf("get worktree failed: %w", err)
            }
            hash := sha256.Sum256([]byte(wt.Filesystem.Root()))
            repoHash = hex.EncodeToString(hash[:])
        }

        // Get HEAD commit
        head, err := repo.Head()
        if err != nil {
            return err
        }
        commitSHA := head.Hash().String()

        // Diff stats
        commit, err := repo.CommitObject(head.Hash())
        if err != nil {
            return fmt.Errorf("get commit failed: %w", err)
        }
        linesAdded, linesDeleted, filesChanged := 0, 0, 0
        parentIter := commit.Parents()
        parent, err := parentIter.Next()
        if err == nil && parent != nil {
            patch, err := commit.Patch(parent)
            if err == nil && patch != nil {
				filesChanged = len(patch.FilePatches())
                stats := patch.Stats()
                for _, stat := range stats {
                    linesAdded += stat.Addition
                    linesDeleted += stat.Deletion
                }
            }
        }  // Initial commit: 0

        // Get auth and client_id
        token, err := keyring.Get("gitmetrics", "api_token")
        if err != nil {
            return fmt.Errorf("get token failed: %w (run 'gitmetrics auth' first)", err)
        }
        storedURL, err := keyring.Get("gitmetrics", "server_url")
        if err != nil {
            return fmt.Errorf("get url failed: %w", err)
        }
        clientID, err := keyring.Get("gitmetrics", "client_id")
        if err != nil {
            return fmt.Errorf("get client_id failed: %w (run 'gitmetrics auth' first)", err)
        }

        // Build event
        _, offset := time.Now().Zone()
        event := Event{
            Version:      1,
            ClientID:     clientID,
            RepoHash:     repoHash,
            CommitSHA:    commitSHA,
            Timestamp:    time.Now().UTC().Format(time.RFC3339),
            TZOffsetMin:  offset / 60,
            LinesAdded:   linesAdded,
            LinesDeleted: linesDeleted,
			FilesChanged: filesChanged
        }

        // Submit
        body, err := json.Marshal(event)
        if err != nil {
            return err
        }
        req, err := http.NewRequest("POST", storedURL+"/events", bytes.NewBuffer(body))
        if err != nil {
            return err
        }
        req.Header.Set("Content-Type", "application/json")
        req.Header.Set("Authorization", "Bearer "+token)
        client := &http.Client{}
        resp, err := client.Do(req)
        if err != nil {
            return fmt.Errorf("POST failed: %w", err)
        }
        defer resp.Body.Close()

        if resp.StatusCode != http.StatusOK {
            bodyBytes, _ := io.ReadAll(resp.Body)
            return fmt.Errorf("submission error: %s - %s", resp.Status, string(bodyBytes))
        }

        fmt.Println("server response:", resp.Status)
        return nil
    },
}

func init() {
    rootCmd.AddCommand(submitCmd)
}