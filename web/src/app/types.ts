export interface EventMetrics {
  total_commits: number;
  repos: number;
  commits_by_day: { date: string; count: number }[];
}
