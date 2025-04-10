import Joi from "joi";
import { GithubError } from "../errors/githubError";

// Define the schema for GithubUser
const GithubUserSchema = Joi.object({
    login: Joi.string().required(),
    id: Joi.number().integer().required(),
    node_id: Joi.string().required(),
    avatar_url: Joi.string().required(),
    gravatar_id: Joi.string().allow(''),
    url: Joi.string().required(),
    html_url: Joi.string().required(),
    followers_url: Joi.string().required(),
    following_url: Joi.string().required(),
    gists_url: Joi.string().required(),
    starred_url: Joi.string().required(),
    subscriptions_url: Joi.string().required(),
    organizations_url: Joi.string().required(),
    repos_url: Joi.string().required(),
    events_url: Joi.string().required(),
    received_events_url: Joi.string().required(),
    type: Joi.string().valid('User', 'Organization').required(),
    user_view_type: Joi.string().required(),
    site_admin: Joi.boolean().required(),
});

// Define the schema for GithubLabel
const GithubLabelSchema = Joi.object({
    id: Joi.number().integer().required(),
    node_id: Joi.string().required(),
    url: Joi.string().required(),
    name: Joi.string().required(),
    color: Joi.string().length(7).pattern(/^#([0-9A-F]{6})$/).required(), // Hex color code
});

// Define the schema for GithubMilestone
const GithubMilestoneSchema = Joi.object({
    url: Joi.string().required(),
    html_url: Joi.string().required(),
    labels_url: Joi.string().required(),
    id: Joi.number().integer().required(),
    node_id: Joi.string().required(),
    number: Joi.number().integer().required(),
    state: Joi.string().valid('open', 'closed').required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    creator: GithubUserSchema.required(),
    open_issues: Joi.number().integer().required(),
    closed_issues: Joi.number().integer().required(),
    created_at: Joi.string().isoDate().required(),
    updated_at: Joi.string().isoDate().required(),
    closed_at: Joi.string().isoDate().allow(null),
    due_on: Joi.string().isoDate().allow(null),
});

// Define the schema for GithubSubIssuesSummary
const GithubSubIssuesSummarySchema = Joi.object({
    total: Joi.number().integer().required(),
    completed: Joi.number().integer().required(),
    percent_completed: Joi.number().precision(2).required(),
});

// Define the schema for GithubPullRequestDetails
const GithubPullRequestDetailsSchema = Joi.object({
    url: Joi.string().required(),
    html_url: Joi.string().required(),
    diff_url: Joi.string().required(),
    patch_url: Joi.string().required(),
    merged_at: Joi.string().isoDate().allow(null),
});

// Define the schema for GithubReactions
const GithubReactionsSchema = Joi.object({
    url: Joi.string().required(),
    total_count: Joi.number().integer().required(),
    "+1": Joi.number().integer().required(),
    "-1": Joi.number().integer().required(),
    laugh: Joi.number().integer().required(),
    hooray: Joi.number().integer().required(),
    confused: Joi.number().integer().required(),
    heart: Joi.number().integer().required(),
    rocket: Joi.number().integer().required(),
    eyes: Joi.number().integer().required(),
});

// Define the schema for GithubSearchItem
const GithubSearchItemSchema = Joi.object({
    url: Joi.string().required(),
    repository_url: Joi.string().required(),
    labels_url: Joi.string().required(),
    comments_url: Joi.string().required(),
    events_url: Joi.string().required(),
    html_url: Joi.string().required(),
    id: Joi.number().integer().required(),
    node_id: Joi.string().required(),
    number: Joi.number().integer().required(),
    title: Joi.string().required(),
    user: GithubUserSchema.required(),
    labels: Joi.array().items(GithubLabelSchema).required(),
    state: Joi.string().valid('open', 'closed').required(),
    locked: Joi.boolean().required(),
    assignee: GithubUserSchema.allow(null),
    assignees: Joi.array().items(GithubUserSchema).required(),
    milestone: GithubMilestoneSchema.allow(null),
    comments: Joi.number().integer().required(),
    created_at: Joi.string().isoDate().required(),
    updated_at: Joi.string().isoDate().required(),
    closed_at: Joi.string().isoDate().allow(null),
    author_association: Joi.string().valid('OWNER', 'COLLABORATOR', 'CONTRIBUTOR', 'FIRST_TIME_CONTRIBUTOR', 'MEMBER').required(),
    sub_issues_summary: GithubSubIssuesSummarySchema.required(),
    active_lock_reason: Joi.string().allow(null),
    draft: Joi.boolean().required(),
    pull_request: GithubPullRequestDetailsSchema.required(),
    body: Joi.string().allow(null),
    reactions: GithubReactionsSchema.required(),
    timeline_url: Joi.string().required(),
    performed_via_github_app: Joi.string().allow(null),
    state_reason: Joi.string().allow(null),
    score: Joi.number().required(),
});

// Define the schema for GithubSearchResponse
const GithubSearchResponseSchema = Joi.object({
    total_count: Joi.number().integer().required(),
    incomplete_results: Joi.boolean().required(),
    items: Joi.array().items(GithubSearchItemSchema).required(),
});


// Example of validating a response
export const validateGithubSearchResponse = (response: any) => {
    const { error, value } = GithubSearchResponseSchema.validate(response);
    if (error) {
        console.log(`error :::`, error);
        throw new GithubError("400", "Invalid response structure for github seach API", "");
    }
    // You can also return the validated response if you want
    return value;
};