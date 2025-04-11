interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
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
  site_admin: boolean;
  user_view_type: string;
}
interface Label {
  id: number;
  node_id: string;
  url: string;
  name: string;
  description: string;
  color: string;
  default: boolean;
}
interface Milestone {
  url: string;
  html_url: string;
  labels_url: string;
  id: number;
  node_id: string;
  number: number;
  state: string;
  title: string;
  description: string;
  creator: User;
  open_issues: number;
  closed_issues: number;
  created_at: string;
  updated_at: string;
  closed_at: string;
  due_on: string;
}
interface Team {
  id: number;
  node_id: string;
  url: string;
  html_url: string;
  name: string;
  slug: string;
  description: string;
  privacy: string;
  permission: string;
  notification_setting: string;
  members_url: string;
  repositories_url: string;
  parent: string | null;
}
interface License {
  key: string;
  name: string;
  url: string;
  spdx_id: string;
  node_id: string;
  html_url?: string;
}
interface Permissions {
  admin: boolean;
  push: boolean;
  pull: boolean;
}
interface Repo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: User;
  private: boolean;
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  archive_url: string;
  assignees_url: string;
  blobs_url: string;
  branches_url: string;
  collaborators_url: string;
  comments_url: string;
  commits_url: string;
  compare_url: string;
  contents_url: string;
  contributors_url: string;
  deployments_url: string;
  downloads_url: string;
  events_url: string;
  forks_url: string;
  git_commits_url: string;
  git_refs_url: string;
  git_tags_url: string;
  git_url: string;
  issue_comment_url: string;
  issue_events_url: string;
  issues_url: string;
  keys_url: string;
  labels_url: string;
  languages_url: string;
  merges_url: string;
  milestones_url: string;
  notifications_url: string;
  pulls_url: string;
  releases_url: string;
  ssh_url: string;
  stargazers_url: string;
  statuses_url: string;
  subscribers_url: string;
  subscription_url: string;
  tags_url: string;
  teams_url: string;
  trees_url: string;
  clone_url: string;
  mirror_url: string | null;
  hooks_url: string;
  svn_url: string;
  homepage: string;
  language: string | null;
  forks_count: number;
  stargazers_count: number;
  watchers_count: number;
  size: number;
  default_branch: string;
  open_issues_count: number;
  is_template: boolean;
  topics: string[];
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_downloads: boolean;
  has_discussions: boolean;
  archived: boolean;
  disabled: boolean;
  visibility: string;
  pushed_at: string;
  created_at: string;
  updated_at: string;
  permissions?: Permissions;
  allow_rebase_merge?: boolean;
  template_repository?: string;
  temp_clone_token?: string;
  allow_squash_merge?: boolean;
  allow_auto_merge?: boolean;
  delete_branch_on_merge?: boolean;
  allow_merge_commit?: boolean;
  subscribers_count?: number;
  network_count?: number;
  license: License;
  allow_forking: boolean;
  forks: number;
  web_commit_signoff_required: boolean;
  open_issues: number;
  watchers: number;
}
interface PullRequest {
  label: string;
  ref: string;
  sha: string;
  user: User;
  repo: Repo;
}
interface PullRequestLinks {
  self: Link;
  html: Link;
  issue: Link;
  comments: Link;
  review_comments: Link;
  review_comment: Link;
  commits: Link;
  statuses: Link;
}
interface Link {
  href: string;
}
export interface PullRequestData {
  url: string;
  id: number;
  node_id: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  issue_url: string;
  commits_url: string;
  review_comments_url: string;
  review_comment_url: string;
  comments_url: string;
  statuses_url: string;
  number: number;
  state: "open" | "closed" | "merged"; // Depending on the state of the PR
  locked: boolean;
  title: string;
  user: User;
  body: string | null;
  labels: Label[];
  milestone: Milestone | null;
  active_lock_reason: "too heated" | "other" | null;
  created_at: string;
  updated_at: string;
  closed_at: string;
  merged_at: string;
  merged: boolean;
  merge_commit_sha: string;
  mergeable: boolean | null;
  rebaseable: boolean | null;
  mergeable_state: string;
  merged_by: User | null;
  assignee:  User | null;
  comments: number;
  review_comments: number;
  maintainer_can_modify: boolean;
  assignees: User[];
  requested_reviewers: User[];
  requested_teams: Team[];
  head: PullRequest;
  base: PullRequest;
  _links: PullRequestLinks;
  author_association: "OWNER" | "COLLABORATOR" | "CONTRIBUTOR" | "NONE"; // Assuming these are the possible values
  auto_merge: boolean | null;
  draft: boolean;
  reactions?: GithubReactions;
  sub_issues_summary?: GithubSubIssuesSummary
  commits: number,
  additions: number,
  deletions: number,
  changed_files: number,
}

interface UrlSha {
  url: string;
  sha: string;
}

interface CommitVerification {
  verified: boolean;
  reason: string;
  signature: string | null;
  payload: string | null;
  verified_at: string | null;
}

interface UserData {
  name: string;
  email: string;
  date: string;
}

interface Commit {
  url: string;
  author: UserData;
  committer: UserData;
  message: string;
  tree: UrlSha;
  comment_count: number;
  verification: CommitVerification;
}

export interface CommitData {
  url: string;
  sha: string;
  node_id: string;
  html_url: string;
  comments_url: string;
  commit: Commit;
  author: User;
  committer: User;
  parents: UrlSha[];
}

interface GithubSubIssuesSummary {
  total: number;
  completed: number;
  percent_completed: number;
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
