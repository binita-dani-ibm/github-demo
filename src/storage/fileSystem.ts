import * as fs from "fs";
import * as path from "path";
import { locals } from "../helpers/locals";
import { CommitData, PullRequestData } from "../interface/github";
import { logger } from "../wlogger";

const ghDir = path.join(__dirname, "../../../stubs/github");
const jiraDir = path.join(__dirname, "../../../stubs/jira");
const UTF8 = "utf8";

function createDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export async function storePullRequest(pullRequest: PullRequestData) {
  createDir(ghDir);
  const filePath = path.join(ghDir, locals.pr_filename);
  let pullRequests = [];
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, UTF8);
    pullRequests = fileData ? JSON.parse(fs.readFileSync(filePath, UTF8)) : [];
  }
  pullRequests.push({ type: "pull_request", data: pullRequest });
  fs.writeFileSync(filePath, JSON.stringify(pullRequests, null, 2));
  logger.info(`Pull request #${pullRequest.number} stored.`);
}

export async function storeGithubPullRequest(
  jiraIssueId: string,
  pullRequest: PullRequestData
) {
  createDir(ghDir);
  const filePath = path.join(ghDir, locals.github_pr_filename);
  let pullRequests = [];
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, UTF8);
    pullRequests = fileData ? JSON.parse(fs.readFileSync(filePath, UTF8)) : [];
  }
  pullRequests.push({
    type: "pull_request",
    jira_issue_id: jiraIssueId,
    data: pullRequest,
  });
  fs.writeFileSync(filePath, JSON.stringify(pullRequests, null, 2));
  logger.info(
    `Pull request #${pullRequest.number} for Jira Issue Id #${jiraIssueId}stored.`
  );
}

export async function storeJiraIssues(jiraReuest: any) {
  createDir(jiraDir);
  const filePath = path.join(jiraDir, locals.jira_issues_filename);
  let pullRequests = [];
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, UTF8);
    pullRequests = fileData ? JSON.parse(fs.readFileSync(filePath, UTF8)) : [];
  }
  pullRequests.push({ type: "jira_issues", data: jiraReuest });
  fs.writeFileSync(filePath, JSON.stringify(pullRequests, null, 2));
  logger.info(`Jira issues #${jiraReuest.key} stored.`);
}

export async function storeCommits(prNumber: number, commits: CommitData[]) {
  createDir(ghDir);
  const filePath = path.join(ghDir, locals.commits_filename);
  let allCommits = [];
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, UTF8);
    allCommits = fileData ? JSON.parse(fs.readFileSync(filePath, UTF8)) : [];
  }
  allCommits.push({ type: "commits", pr: prNumber, data: commits });
  fs.writeFileSync(filePath, JSON.stringify(allCommits, null, 2));
  logger.info(`Commits for pull request #${prNumber} stored.`);
}
