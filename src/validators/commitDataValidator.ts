import Joi from "joi";
import { GithubError } from "../errors/githubError";
import { arrItemSchema } from "./schema";

// Define validation for UrlSha
const UrlShaSchema = Joi.object({
    url: Joi.string().uri().required(),
    sha: Joi.string().required(),
    html_url: Joi.string().optional()
});

// Define validation for CommitVerification
const CommitVerificationSchema = Joi.object({
    verified: Joi.boolean().required(),
    reason: Joi.string().required(),
    signature: Joi.string().allow(null),
    payload: Joi.string().allow(null),
    verified_at: Joi.string().isoDate().allow(null),
});

// Define validation for UserData
const UserDataSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    date: Joi.string().isoDate().required(),
});

// Define validation for Commit
const CommitSchema = Joi.object({
    url: Joi.string().uri().required(),
    author: UserDataSchema.required(),
    committer: UserDataSchema.required(),
    message: Joi.string().required(),
    tree: UrlShaSchema.required(),
    comment_count: Joi.number().integer().required(),
    verification: CommitVerificationSchema.required(),
});

// Define validation for User
const UserSchema = Joi.object({
    login: Joi.string().required(),
    id: Joi.number().integer().required(),
    node_id: Joi.string().required(),
    avatar_url: Joi.string().required(),
    gravatar_id: Joi.string().allow('').allow(null), // Allows empty string or null
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
    site_admin: Joi.boolean().required(),
    user_view_type: Joi.string().required(),
});

// Define validation for CommitData
const CommitDataSchema = Joi.object({
    url: Joi.string().required(),
    sha: Joi.string().required(),
    node_id: Joi.string().required(),
    html_url: Joi.string().required(),
    comments_url: Joi.string().required(),
    commit: CommitSchema.required(),
    author: UserSchema.required(),
    committer: UserSchema.required(),
    parents: Joi.array().items(UrlShaSchema).required(),
});

// Define the schema for the entire response, which is an array of PullRequestData
const CommitsDataSchema = arrItemSchema(CommitDataSchema);

// Example of how to validate an object with the CommitData schema
export const validateCommitData = (response: any) => {
    const { error, value } = CommitsDataSchema.validate(response);
    if (error) {
        console.log(`error :::`, error);
        throw new GithubError("400", "Invalid response structure for github commits API", "");
    }
    // You can also return the validated response if you want
    return value;
};

