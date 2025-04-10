import { HttpRequest, HttpResponseInit } from "@azure/functions";
import { GithubError } from "../../errors/githubError";
import { logger } from "../../wlogger";
import {
  storeCommits,
  storeGithubPullRequest,
  storeJiraIssues,
} from "../../storage/fileSystem";
import {
  getGithubPullRequestWithSearch,
  getJiraIssues,
  getGithubPullRequestCommits,
} from "../../wiremock/readStubs";
import { JiraError } from "../../errors/jiraError";
import { locals } from "../../helpers/locals";

export async function wmListIssues(
  request: HttpRequest
): Promise<HttpResponseInit> {
  try {
    logger.info(`Request URL: ${locals.request_url} ${request.url}`);
    const issues = await getJiraIssues();
    if (!issues.length) {
      throw new JiraError(
        "404",
        "Jira Issues Not Found. Check the credentials and request params are correct."
      );
    }
    for (const issue of issues) {
      await storeJiraIssues(issue);
      const jiraIssueId = issue.key;
      logger.info(`Jira issues #${jiraIssueId} reading.`);
      const githubPullRequests = await getGithubPullRequestWithSearch(
        jiraIssueId
      );
      for (const githubPullRequest of githubPullRequests) {
        await storeGithubPullRequest(jiraIssueId, githubPullRequest);
        const commits = await getGithubPullRequestCommits(
          githubPullRequest.commits_url
        );
        await storeCommits(githubPullRequest.number, commits);
      }
    }
    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: issues }),
    };
  } catch (error: any) {
    console.error(`Error::::::::::`, error);
    if (error instanceof JiraError) {
      logger.error(`[${error.status}] ${error.message}`);
    } else if (error instanceof GithubError) {
      logger.error(`[${error.status}] ${error.message} ${error.url}`);
    } else {
      logger.error("An unknown error occurred");
    }
    return {
      status: error.status || "500",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: error.status, message: error.message }),
    };
  }
}
