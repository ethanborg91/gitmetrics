package cmd

import (
    "fmt"

    "github.com/spf13/cobra"
)

var versionCmd = &cobra.Command{
    Use:   "version",
    Short: "Print the version number of GitMetrics CLI",
    Run: func(cmd *cobra.Command, args []string) {
        fmt.Println("GitMetrics CLI v" + cmd.Parent().Version)
    },
}

func init() {
    rootCmd.AddCommand(versionCmd)
}