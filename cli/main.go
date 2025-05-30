package main

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	git "github.com/go-git/go-git/v5"
	"github.com/google/uuid"
)

type Event struct {
	Version      int    `json:"version"`
	ClientID     string `json:"client_id"`
	RepoHash     string `json:"repo_hash"`
	CommitSHA    string `json:"commit_sha"`
	Timestamp    string `json:"timestamp"`
	TZOffsetMin  int    `json:"tz_offset_min"`
}

func main() {
	// open the current repo
	repo, err := git.PlainOpenWithOptions(".", &git.PlainOpenOptions{
		DetectDotGit: true,
	})
	if err != nil {
		fmt.Println("not a git repo:", err)
		os.Exit(1)
	}

	// get HEAD commit SHA
	head, _ := repo.Head()
	commitSHA := head.Hash().String()[:7]

	// hash the remote URL
	remotes, _ := repo.Remotes()
	var url string
	if len(remotes) > 0 && len(remotes[0].Config().URLs) > 0 {
		url = remotes[0].Config().URLs[0]
	}
	hash := sha256.Sum256([]byte(url))
	repoHash := hex.EncodeToString(hash[:])

	// build event struct
	_, offset := time.Now().Zone()
	event := Event{
		Version:     1,
		ClientID:    uuid.NewString(),
		RepoHash:    repoHash,
		CommitSHA:   commitSHA,
		Timestamp:   time.Now().UTC().Format(time.RFC3339),
		TZOffsetMin: offset / 60,
	}

	// POST to API
	body, _ := json.Marshal(event)
	resp, err := http.Post("http://localhost:8000/events", "application/json", bytes.NewReader(body))
	if err != nil {
		fmt.Println("POST failed:", err)
		os.Exit(1)
	}
	defer resp.Body.Close()

	fmt.Println("server response:", resp.Status)
}
