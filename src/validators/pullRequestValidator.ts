import {
  objectSchema,
  arrItemSchema,
  arrItemReqSchema,
  _stringSchema,
  _stringReqSchema,
  _numReqSchema,
  _boolReqSchema,
  _isoDateReqSchema,
  _stringNullSchema,
  _stringOptSchema,
  _boolOptSchema,
  _numOptSchema,
  _boolNullSchema,
} from "./schema";
import { GithubError } from "../errors/githubError";

// Define the Joi schema for each inner object

const UserSchema = objectSchema({
  login: _stringReqSchema,
  id: _numReqSchema,
  node_id: _stringReqSchema,
  avatar_url: _stringReqSchema,
  gravatar_id: _stringReqSchema.allow(""),
  url: _stringReqSchema,
  html_url: _stringReqSchema,
  followers_url: _stringReqSchema,
  following_url: _stringReqSchema,
  gists_url: _stringReqSchema,
  starred_url: _stringReqSchema,
  subscriptions_url: _stringReqSchema,
  organizations_url: _stringReqSchema,
  repos_url: _stringReqSchema,
  events_url: _stringReqSchema,
  received_events_url: _stringReqSchema,
  type: _stringReqSchema,
  site_admin: _boolReqSchema,
  user_view_type: _stringReqSchema
});

const LabelSchema = objectSchema({
  id: _numReqSchema,
  node_id: _stringReqSchema,
  url: _stringReqSchema,
  name: _stringReqSchema,
  description: _stringReqSchema,
  color: _stringReqSchema,
  default: _boolReqSchema,
});

const MilestoneSchema = objectSchema({
  url: _stringReqSchema,
  html_url: _stringReqSchema,
  labels_url: _stringReqSchema,
  id: _numReqSchema,
  node_id: _stringReqSchema,
  number: _numReqSchema,
  state: _stringReqSchema,
  title: _stringReqSchema,
  description: _stringReqSchema,
  creator: UserSchema.required(),
  open_issues: _numReqSchema,
  closed_issues: _numReqSchema,
  created_at: _isoDateReqSchema,
  updated_at: _isoDateReqSchema,
  closed_at: _isoDateReqSchema.allow(null),
  due_on: _isoDateReqSchema.allow(null),
});

const TeamSchema = objectSchema({
  id: _numReqSchema,
  node_id: _stringReqSchema,
  url: _stringReqSchema,
  html_url: _stringReqSchema,
  name: _stringReqSchema,
  slug: _stringReqSchema,
  description: _stringReqSchema,
  privacy: _stringReqSchema,
  permission: _stringReqSchema,
  notification_setting: _stringReqSchema,
  members_url: _stringReqSchema,
  repositories_url: _stringReqSchema,
  parent: _stringSchema.allow(null),
});

// Define the License schema
const LicenseSchema = objectSchema({
  key: _stringReqSchema,
  name: _stringReqSchema,
  url: _stringReqSchema,
  spdx_id: _stringReqSchema,
  node_id: _stringReqSchema,
  html_url: _stringOptSchema,
});

// Define the Permissions schema
const PermissionsSchema = objectSchema({
  admin: _boolReqSchema,
  push: _boolReqSchema,
  pull: _boolReqSchema,
});

// Define the Repo schema
const RepoSchema = objectSchema({
  id: _numReqSchema,
  node_id: _stringReqSchema,
  name: _stringReqSchema,
  full_name: _stringReqSchema,
  owner: UserSchema.required(),
  private: _boolReqSchema,
  html_url: _stringReqSchema,
  description: _stringReqSchema,
  fork: _boolReqSchema,
  url: _stringReqSchema,
  archive_url: _stringReqSchema,
  assignees_url: _stringReqSchema,
  blobs_url: _stringReqSchema,
  branches_url: _stringReqSchema,
  collaborators_url: _stringReqSchema,
  comments_url: _stringReqSchema,
  commits_url: _stringReqSchema,
  compare_url: _stringReqSchema,
  contents_url: _stringReqSchema,
  contributors_url: _stringReqSchema,
  deployments_url: _stringReqSchema,
  downloads_url: _stringReqSchema,
  events_url: _stringReqSchema,
  forks_url: _stringReqSchema,
  git_commits_url: _stringReqSchema,
  git_refs_url: _stringReqSchema,
  git_tags_url: _stringReqSchema,
  git_url: _stringReqSchema,
  issue_comment_url: _stringReqSchema,
  issue_events_url: _stringReqSchema,
  issues_url: _stringReqSchema,
  keys_url: _stringReqSchema,
  labels_url: _stringReqSchema,
  languages_url: _stringReqSchema,
  merges_url: _stringReqSchema,
  milestones_url: _stringReqSchema,
  notifications_url: _stringReqSchema,
  pulls_url: _stringReqSchema,
  releases_url: _stringReqSchema,
  ssh_url: _stringReqSchema,
  stargazers_url: _stringReqSchema,
  statuses_url: _stringReqSchema,
  subscribers_url: _stringReqSchema,
  subscription_url: _stringReqSchema,
  tags_url: _stringReqSchema,
  teams_url: _stringReqSchema,
  trees_url: _stringReqSchema,
  clone_url: _stringReqSchema,
  mirror_url: _stringNullSchema,
  hooks_url: _stringReqSchema,
  svn_url: _stringReqSchema,
  homepage: _stringSchema.allow(null),
  language: _stringSchema.allow(null),
  forks_count: _numReqSchema,
  stargazers_count: _numReqSchema,
  watchers_count: _numReqSchema,
  size: _numReqSchema,
  default_branch: _stringReqSchema,
  open_issues_count: _numReqSchema,
  is_template: _boolReqSchema,
  topics: arrItemReqSchema(_stringSchema),
  has_issues: _boolReqSchema,
  has_projects: _boolReqSchema,
  has_wiki: _boolReqSchema,
  has_pages: _boolReqSchema,
  has_downloads: _boolReqSchema,
  has_discussions: _boolReqSchema,
  archived: _boolReqSchema,
  disabled: _boolReqSchema,
  visibility: _stringReqSchema.valid("public", "private", "internal"),
  pushed_at: _isoDateReqSchema,
  created_at: _isoDateReqSchema,
  updated_at: _isoDateReqSchema,
  permissions: PermissionsSchema.optional(),
  allow_rebase_merge: _boolOptSchema,
  template_repository: _stringOptSchema,
  temp_clone_token: _stringOptSchema,
  allow_squash_merge: _boolOptSchema,
  allow_auto_merge: _boolOptSchema,
  delete_branch_on_merge: _boolOptSchema,
  allow_merge_commit: _boolOptSchema,
  subscribers_count: _numOptSchema,
  network_count: _numOptSchema,
  license: LicenseSchema.required(),
  allow_forking: _boolReqSchema,
  forks: _numReqSchema,
  web_commit_signoff_required: _boolReqSchema,
  open_issues: _numReqSchema,
  watchers: _numReqSchema,
});

// Define the PullRequest schema
const PullRequestSchema = objectSchema({
  label: _stringReqSchema,
  ref: _stringReqSchema,
  sha: _stringReqSchema,
  user: UserSchema.required(),
  repo: RepoSchema.required(),
});
const LinksSchema = objectSchema({
  self: objectSchema({
    href: _stringReqSchema,
  }).required(),
  html: objectSchema({
    href: _stringReqSchema,
  }).required(),
  issue: objectSchema({
    href: _stringReqSchema,
  }).required(),
  comments: objectSchema({
    href: _stringReqSchema,
  }).required(),
  review_comments: objectSchema({
    href: _stringReqSchema,
  }).required(),
  review_comment: objectSchema({
    href: _stringReqSchema,
  }).required(),
  commits: objectSchema({
    href: _stringReqSchema,
  }).required(),
  statuses: objectSchema({
    href: _stringReqSchema,
  }).required(),
});

const PullRequestDataSchema = objectSchema({
  url: _stringReqSchema,
  id: _numReqSchema,
  node_id: _stringReqSchema,
  html_url: _stringReqSchema,
  diff_url: _stringReqSchema,
  patch_url: _stringReqSchema,
  issue_url: _stringReqSchema,
  commits_url: _stringReqSchema,
  review_comments_url: _stringReqSchema,
  review_comment_url: _stringReqSchema,
  comments_url: _stringReqSchema,
  statuses_url: _stringReqSchema,
  number: _numReqSchema,
  state: _stringReqSchema.valid("open", "closed", "merged"),
  locked: _boolReqSchema,
  title: _stringReqSchema,
  user: UserSchema.required(),
  body: _stringNullSchema,
  labels: arrItemReqSchema(LabelSchema),
  milestone: MilestoneSchema.allow(null),
  active_lock_reason: _stringReqSchema
    .valid("too heated", "other", null)
    .allow(null),
  created_at: _isoDateReqSchema,
  updated_at: _isoDateReqSchema,
  closed_at: _isoDateReqSchema.allow(null),
  merged_at: _isoDateReqSchema.allow(null),
  merged: _boolReqSchema,
  merge_commit_sha: _stringReqSchema,
  mergeable: _boolNullSchema,
  rebaseable: _boolNullSchema,
  mergeable_state: _stringReqSchema,
  merged_by: UserSchema.allow(null),
  assignee: UserSchema.allow(null),
  comments: _numReqSchema,
  review_comments: _numReqSchema,
  maintainer_can_modify: _boolReqSchema,
  commits: _numReqSchema,
  additions: _numReqSchema,
  deletions: _numReqSchema,
  changed_files: _numReqSchema,
  assignees: arrItemReqSchema(UserSchema),
  requested_reviewers: arrItemReqSchema(UserSchema),
  requested_teams: arrItemReqSchema(TeamSchema),
  head: PullRequestSchema.required(),
  base: PullRequestSchema.required(),
  _links: LinksSchema.required(), // You can define this further if needed
  author_association: _stringReqSchema.valid(
    "OWNER",
    "COLLABORATOR",
    "CONTRIBUTOR",
    "NONE"
  ),
  auto_merge: _boolReqSchema.allow(null),
  draft: _boolReqSchema,
});

// Define the schema for the entire response, which is an array of PullRequestData
const PullRequestArraySchema = arrItemSchema(PullRequestDataSchema);

// Function to validate the response
export function validateResponse(response: any) {
  const { error, value } = PullRequestArraySchema.validate(response);
  if (error) {
    throw new GithubError("400", "Invalid response structure", "");
  }
  // You can also return the validated response if you want
  return value;
}


// Function to validate the response
export function validateGithubPullRequestResponse(response: any) {
  const { error, value } = PullRequestDataSchema.validate(response);
  if (error) {
    console.log(`error :::`, error);
    throw new GithubError("400", "Invalid response structure", "");
  }
  // You can also return the validated response if you want
  return value;
}
