import { HttpRequest, HttpResponseInit } from "@azure/functions";
import { GithubError } from "../../errors/githubError";
import config from '../../config';
import wLogger from "../../wlogger";
import {
  storeCommits,
  storeGithubPullRequest,
  storeJiraIssues,
} from "../../storage/fileSystem";
import { stubGithubSearchIssuesRequests, stubJiraIssues, stubPullRequestCommits } from "../../wiremock/readStubs";

export const wireMockLogger = wLogger({ logName: "wiremock", level: "silly" });

export async function wmListIssues(
  request: HttpRequest
): Promise<HttpResponseInit> {
  try {
    const queryString = "project=SCRUM&startAt=1&maxResults=1";
    const issues = await stubJiraIssues(queryString);
    for (const issue of issues) {
      console.log(`issue.key   =>`, issue.key);
      await storeJiraIssues(issue);
      const jiraIssueId = issue.key;
      const githubPullRequests = await stubGithubSearchIssuesRequests(
        jiraIssueId
      );
      //console.log(`Github Response ==>`, githubPullRequests);
      for (const githubPullRequest of githubPullRequests) {
        await storeGithubPullRequest(jiraIssueId, githubPullRequest);

        if (config.ENABLE_COMMITS) {
          const commits = await stubPullRequestCommits(
            githubPullRequest.commits_url
          );
          await storeCommits(githubPullRequest.number, commits);

        }
      }
    }
    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: issues }),
    };
  } catch (error: any) {
    console.error(`Error::::::::::`, error);
    if (error instanceof GithubError) {
      wireMockLogger.error(`[${error.status}] ${error.message} ${error.url}`);
    } else {
      wireMockLogger.error("An unknown error occurred");
    }
    return {
      status: error.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: error.status, message: error.message }),
    };
  }
}
