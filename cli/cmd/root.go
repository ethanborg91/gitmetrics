package cmd

import (
    "github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
    Use:     "gitmetrics",
    Short:   "GitMetrics CLI for submitting events",
    Version: "0.1.0",  // You can change this version later
    RunE: func(cmd *cobra.Command, args []string) error {
        return submitCmd.RunE(cmd, args)
    },
}

func Execute() error {
    return rootCmd.Execute()
}