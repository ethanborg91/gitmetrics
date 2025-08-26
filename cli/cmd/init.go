package cmd

import (
    "fmt"

    "github.com/spf13/cobra"
    "github.com/zalando/go-keyring"
    "github.com/google/uuid"
)

var initCmd = &cobra.Command{
    Use:   "init <token> [--server-url]",
    Short: "Initialize CLI with token and setup hooks",
    Args:  cobra.ExactArgs(1),
    RunE: func(cmd *cobra.Command, args []string) error {
        token := args[0]

        // Store token and URL
        err := keyring.Set("gitmetrics", "api_token", token)
        if err != nil {
            return fmt.Errorf("store token failed: %w", err)
        }
        storedURL, _ := cmd.Flags().GetString("server-url")
        err = keyring.Set("gitmetrics", "server_url", storedURL)
        if err != nil {
            return fmt.Errorf("store url failed: %w", err)
        }

        // Generate/persist client_id
        clientID, err := keyring.Get("gitmetrics", "client_id")
        if err == keyring.ErrNotFound {
            clientID = uuid.NewString()
            err = keyring.Set("gitmetrics", "client_id", clientID)
        }
        if err != nil {
            return err
        }

        // Auto setup hooks
        if err := setupHooksCmd.RunE(cmd, nil); err != nil {
            return err
        }

        fmt.Println("Init complete: Auth linked, hooks setup.")
        return nil
    },
}

func init() {
    initCmd.Flags().String("server-url", "http://localhost:8000", "GitMetrics server URL")
    rootCmd.AddCommand(initCmd)
}