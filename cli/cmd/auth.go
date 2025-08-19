package cmd

import (
    "encoding/json"
    "fmt"
    "net/http"
    "net/url"

    "github.com/google/uuid"
    "github.com/spf13/cobra"
    "github.com/zalando/go-keyring"
)

var (
    serverURL string
)

var authCmd = &cobra.Command{
    Use:   "auth <email> <password>",
    Short: "Authenticate and store JWT token",
    Args:  cobra.ExactArgs(2),
    RunE: func(cmd *cobra.Command, args []string) error {
        email := args[0]
        password := args[1]

        // POST form to /auth/login
        data := url.Values{}
        data.Set("username", email)
        data.Set("password", password)
        resp, err := http.PostForm(serverURL+"/auth/login", data)
        if err != nil {
            return fmt.Errorf("login failed: %w", err)
        }
        defer resp.Body.Close()

        if resp.StatusCode != http.StatusOK {
            return fmt.Errorf("login error: %s", resp.Status)
        }

        // Parse token
        var tokenResp struct {
            AccessToken string `json:"access_token"`
            TokenType   string `json:"token_type"`
        }
        if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
            return fmt.Errorf("parse token failed: %w", err)
        }

        // Store token and URL
        err = keyring.Set("gitmetrics", "api_token", tokenResp.AccessToken)
        if err != nil {
            return fmt.Errorf("store token failed: %w", err)
        }
        err = keyring.Set("gitmetrics", "server_url", serverURL)
        if err != nil {
            return fmt.Errorf("store url failed: %w", err)
        }

        // Generate/persist client_id if not exists
        clientID, err := keyring.Get("gitmetrics", "client_id")
        if err == keyring.ErrNotFound {
            clientID = uuid.NewString()
            err = keyring.Set("gitmetrics", "client_id", clientID)
            if err != nil {
                return fmt.Errorf("store client_id failed: %w", err)
            }
        } else if err != nil {
            return fmt.Errorf("get client_id failed: %w", err)
        }

        fmt.Println("Auth successful. Token and client_id stored.")
        return nil
    },
}

func init() {
    authCmd.Flags().StringVar(&serverURL, "server-url", "http://localhost:8000", "GitMetrics server URL")
    rootCmd.AddCommand(authCmd)
}