interface GithubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GithubSearchItem[];
}

interface GithubSearchItem {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: GithubUser;
  labels: GithubLabel[];
  state: string;
  locked: boolean;
  assignee: GithubUser | null;
  assignees: GithubUser[];
  milestone: GithubMilestone | null;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  author_association: string;
  sub_issues_summary: GithubSubIssuesSummary;
  active_lock_reason: string | null;
  draft: boolean;
  pull_request: GithubPullRequestDetails;
  body: string | null;
  reactions: GithubReactions;
  timeline_url: string;
  state_reason: string | null;
  score: number;
  performed_via_github_app: string | null;
}

interface GithubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id?: string| "";
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
}

interface GithubLabel {
  // Assuming labels are an array of objects, as seen in the response
  id: number;
  node_id: string;
  url: string;
  name: string;
  color: string;
}

interface GithubMilestone {
  url: string;
  html_url: string;
  labels_url: string;
  id: number;
  node_id: string;
  number: number;
  state: string;
  title: string;
  description: string;
  creator: GithubUser;
  open_issues: number;
  closed_issues: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  due_on: string | null;
}

interface GithubSubIssuesSummary {
  total: number;
  completed: number;
  percent_completed: number;
}

interface GithubPullRequestDetails {
  url: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  merged_at: string | null;
}

interface GithubReactions {
  url: string;
  total_count: number;
  "+1": number;
  "-1": number;
  laugh: number;
  hooray: number;
  confused: number;
  heart: number;
  rocket: number;
  eyes: number;
}