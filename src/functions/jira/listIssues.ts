import axios from "axios";
import { HttpRequest, HttpResponseInit } from "@azure/functions";
import { locals } from "../../helpers/locals";
import { GithubError } from "../../errors/githubError";
import {
  getJiraIssueGithubPullRequest,
  getGithubPullRequestCommits,
} from "../../services/githubService";
import wLogger from "../../wlogger";
import {
  storeCommits,
  storeGithubPullRequest,
  storeJiraIssues,
} from "../../storage/fileSystem";
import { JiraIssue } from "../../interface/jira";

const {
  JIRA_DOMAIN = "",
  JIRA_USERNAME = "",
  JIRA_API_TOKEN = "",
  JIRA_PROJECT_ID = "",
} = process.env;

export const jiraLogger = wLogger({ logName: "jira", level: "silly" });

export async function listIssues(
  request: HttpRequest
): Promise<HttpResponseInit> {
  try {
    let whileHasMoreIssues = true;
    const issues: JiraIssue[] = [];
    let maxResults = 1;
    let nextPageToken: string | null = null;
    jiraLogger.info(`Request URL: ${locals.request_url} ${request.url}`);
    const url = `https://${JIRA_DOMAIN}/rest/api/3/search/jql`;
    const auth = {
      username: JIRA_USERNAME,
      password: JIRA_API_TOKEN,
    };
    const encodedAuth = Buffer.from(`${auth.username}:${auth.password}`).toString('base64');
    
    while (whileHasMoreIssues) {
      const response: any = await axios.get(url, {
        params: {
          jql: `project=${JIRA_PROJECT_ID}`,
          nextPageToken,
          maxResults,
          fields: "*all"
        },
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${encodedAuth}`,
        },
      });
      console.log(`response:::::::::::`, response);

      console.log(`response Status:::::::::::`, response.message);
      issues.push(...response.data.issues);
      //console.log(`response.data.issues ==>`,response.data);
      // Check if we have more results
      if (!response.data.nextPageToken) {
        whileHasMoreIssues = false; // No more results, exit the loop
      }
      nextPageToken = response.data.nextPageToken;
    }

    for (const issue of issues) {
      console.log(`issue.key   =>`, issue.key);
      await storeJiraIssues(issue);
      const jiraIssueId = issue.key;
      const githubPullRequests = await getJiraIssueGithubPullRequest(
        jiraIssueId
      );
      for (const githubPullRequest of githubPullRequests) {
        await storeGithubPullRequest(jiraIssueId, githubPullRequest);
        //console.log(`pull_request ==>`, githubPullRequest.pull_request.url);
        const commits = await getGithubPullRequestCommits(githubPullRequest);
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
    if (error instanceof GithubError) {
      jiraLogger.error(`[${error.status}] ${error.message} ${error.url}`);
    } else {
      jiraLogger.error("An unknown error occurred");
    }
    return {
      status: error.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: error.status, message: error.message }),
    };
  }
}
