import config from "../../config";
import axios from "axios";
import { CommitData, PullRequestData } from "../../interface/github";
import { GithubError } from "../../errors/githubError";
import { logger } from "../../wlogger";
import { getAuthorizationToken } from "../../services/wiremockService";
import { JiraIssue } from "../../interface/jira";
import {
  getGithubCommitsQueryRequest,
  getGithubRequestQueryParams,
  getJiraRequest,
} from "../../helpers/common";
import { validateGithubPullRequestResponse } from "../../validators/pullRequestValidator";
import { validateGithubSearchResponse } from "../../validators/pullRequestSearchValidator";
import { validateCommitData } from "../../validators/commitDataValidator";

const { GITHUB, WIREMOCK_URL } = config;
const defaultHeaders = {
  headers: {
    Authorization: `token ${config.GITHUB.TOKEN}`,
  },
};

export async function getGithubPullRequest(prUrl: string): Promise<PullRequestData> {
  try {
    logger.warn(`WireMock Pull Request URL :: ${prUrl}`);
    const response: any = await axios.get(prUrl, defaultHeaders);
    logger.info(`Fetched WireMock pull request from ${prUrl}`);
    return response.data;
  } catch (error: any) {
    console.log(`error:::::::::::`, error);
    const errorResponse = error.response.data;
    throw new GithubError(
      error.status,
      errorResponse.message,
      errorResponse.documentation_url
    );
  }
}

export async function stubPullRequestsWithOwnerandRepo(
  owner: string,
  repo: string,
  queryString: string
): Promise<PullRequestData[]> {
  const pullRequests = [];
  try {
    const url = `${config.WIREMOCK_URL}/repos/${owner}/${repo}/pulls?${queryString}`;
    logger.warn(`WireMock Pull Requtest URL :: ${url}`);
    const response: any = await axios.get(url, defaultHeaders);
    logger.info(`Fetched response pull requests from ${owner}/${repo}`);
    if (response.data.length > 0) {
      pullRequests.push(...response.data);
    }
  } catch (error: any) {
    const errorResponse = error.response.data;
    throw new GithubError(
      error.status,
      errorResponse.message,
      errorResponse.documentation_url
    );
  }
  return pullRequests;
}

export async function getGithubPullRequestWithSearch(
  key: string
): Promise<PullRequestData[]> {
  try {
    const { GITHUB_REPO_NAME, GITHUB_PR_PARAMS, WIREMOCK_URL, GITHUB_SEARCH_URL } = config;

    let allResults: any[] = [];
    let hasMore = true;
    let currentPage = GITHUB_PR_PARAMS.startFromPageNo;
    while (hasMore) {
      const url = `${WIREMOCK_URL}${GITHUB_SEARCH_URL}`;
      logger.warn(`WireMock Pull Request URL :: ${url}`);
      const request = await getGithubRequestQueryParams(
        GITHUB_REPO_NAME,
        key,
        GITHUB.TOKEN,
        currentPage
      );
      const response: any = await axios.get(url, request);
      logger.info(
        `Fetched response pull requests for Repo name ${GITHUB_REPO_NAME}`
      );
      const responseData: GithubSearchResponse = response.data;
      validateGithubSearchResponse(responseData);
      if (responseData?.items?.length > 0) {
        const searchPRItems = responseData.items;
        for (let searchPRItem of searchPRItems) {
          const prUrl = searchPRItem?.pull_request?.url;
          if (prUrl) {
            const pullReqResponse: PullRequestData = await getGithubPullRequest(prUrl);
            validateGithubPullRequestResponse(pullReqResponse);
            pullReqResponse.reactions = searchPRItem.reactions;
            pullReqResponse.sub_issues_summary = searchPRItem.sub_issues_summary;
            allResults.push(pullReqResponse);
          }
        }

        if (
          !response.headers.link ||
          !response.headers.link.includes('rel="next"') ||
          currentPage == 2
        ) {
          hasMore = false;
        }
        currentPage++;
      }
    }
    return allResults;
  } catch (error: any) {
    const errorResponse = error.response.data;
    throw new GithubError(
      error.status,
      errorResponse.message,
      errorResponse.documentation_url
    );
  }
}

export async function stubPullRequestCommitsForOwnerAndRepo(
  owner: string,
  repo: string,
  pullNumber: number,
  queryString: string
): Promise<CommitData[]> {
  const commits = [];
  try {
    const url = `${config.WIREMOCK_URL}/repos/${owner}/${repo}/pulls/${pullNumber}/commits?${queryString}`;
    logger.warn(`WireMock Commit URL :: ${url}`);
    const response: any = await axios.get(url, defaultHeaders);
    logger.info(
      `Fetched commits of pull requests from ${owner}/${repo} (pullNumber ${pullNumber})`
    );
    if (response.data.length > 0) {
      commits.push(...response.data);
    }
  } catch (error: any) {
    logger.error(
      `Error fetching commits for pull request #${pullNumber} in ${owner}/${repo} :: ${error}`
    );
    throw new GithubError(error.status, error.message, error.documentation_url);
  }
  return commits;
}

export async function getGithubPullRequestCommits(
  commitsUrl: string
): Promise<CommitData[]> {
  try {
    let hasMore = true;
    const { GITHUB, GITHUB_COMMITS_PARAMS } = config;
    let currentPage = GITHUB_COMMITS_PARAMS.startFromPageNo;
    let allResults: any[] = [];
    while (hasMore) {
      logger.warn(`WireMock Commit URL :: ${commitsUrl}`);
      const request = await getGithubCommitsQueryRequest(GITHUB.TOKEN, currentPage);
      const response: any = await axios.get(commitsUrl, request);
      logger.info(`Fetched commits of pull requests for URL ${commitsUrl}`);
      const commitsData: CommitData = response.data;
      validateCommitData(commitsData);
      allResults.push(commitsData);
      if (
        !response.headers.link ||
        !response.headers.link.includes('rel="next"') ||
        currentPage == 2
      ) {
        hasMore = false;
      }
      // Increment the page number for the next API request
      currentPage++;
    }
    return allResults;
  } catch (error: any) {
    logger.error(
      `Error fetching commits for pull request #${commitsUrl} :: ${error}`
    );
    throw new GithubError(error.status, error.message, error.documentation_url);
  }
}

export async function getJiraIssues(): Promise<any[]> {
  const issues: JiraIssue[] = [];
  const { JIRA_PR_PARAMS, WIREMOCK_JIRA_DETAILS, JIRA_SEARCH_URL } = config;
  const url = `${WIREMOCK_URL}${JIRA_SEARCH_URL}`;

  logger.warn(`WireMock Jira Issue URL :: ${url}`);
  const token = await getAuthorizationToken();
  let whileHasMoreIssues = true;
  let nextPageToken: string | null = JIRA_PR_PARAMS.nextPageToken;
  let currentPage = 0; //Manually break the pagination
  while (whileHasMoreIssues) {
    const request = await getJiraRequest(
      token,
      WIREMOCK_JIRA_DETAILS.JIRA_PROJECT_ID,
      nextPageToken
    );
    const response: any = await axios.get(url, request);
    issues.push(...response.data.issues);
    // Check if we have more results
    if (!response.data.nextPageToken || currentPage == 2) {
      whileHasMoreIssues = false; // No more results, exit the loop
    }
    nextPageToken = response.data.nextPageToken;

    currentPage++;
  }

  return issues;
}
