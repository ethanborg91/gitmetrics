package cmd

import (
    "fmt"
    "os"
    "path/filepath"

    "github.com/spf13/cobra"
)

var setupHooksCmd = &cobra.Command{
    Use:   "setup-hooks",
    Short: "Setup Git hooks for auto-submit on commits",
    RunE: func(cmd *cobra.Command, args []string) error {
        hookDir := filepath.Join(".git", "hooks")
        hookPath := filepath.Join(hookDir, "post-commit")

        // Create hooks dir if not exists
        if err := os.MkdirAll(hookDir, 0755); err != nil {
            return fmt.Errorf("create hooks dir failed: %w", err)

			//commetn
        }

        // Write shell script to call cli submit
        content := "#!/bin/sh\ncli submit\n"
        if err := os.WriteFile(hookPath, []byte(content), 0755); err != nil {
            return fmt.Errorf("write hook file failed: %w", err)
        }

        fmt.Println("Git post-commit hook setup complete. Submissions will auto-run on commits.")
        return nil
    },
}

func init() {
    rootCmd.AddCommand(setupHooksCmd)
}