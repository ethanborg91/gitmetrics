package cmd

import (
	"encoding/json"
    "testing"

    "github.com/spf13/cobra"
)

func TestSubmitCmd_NotGitRepo(t *testing.T) {
    cmd := &cobra.Command{}
    err := submitCmd.RunE(cmd, nil)
    if err == nil {
        t.Error("expected error in non-repo dir, got nil")
    }
}

// Add more tests (mock keyring/go-git with interfaces if needed; basic for now)
func TestEventBuild(t *testing.T) {
    // Example: Test event JSON
    event := Event{Version: 1, ClientID: "test", RepoHash: "hash", CommitSHA: "sha", Timestamp: "time", TZOffsetMin: 0, LinesAdded: 5, LinesDeleted: 3, FilesChanged: 2}
    _, err := json.Marshal(event)
    if err != nil {
        t.Errorf("marshal failed: %v", err)
    }
}