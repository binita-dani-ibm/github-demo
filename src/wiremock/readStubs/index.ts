import config from "../../config";
import axios from "axios";
import { CommitData, PullRequestData } from "../../interface/github";
import { GithubError } from "../../errors/githubError";
import { ghLogger, jLogger } from "../../wlogger";
import { getAuthorizationToken } from "../../services/wiremockService";

const githubParams = config.GITHUB_PR_PARAMS;
const jiraDetails = config.WIREMOCK_JIRA_DETAILS;
const defaultHeaders = {
  headers: {
    Authorization: `Bearer ${config.GITHUB.TOKEN}`,
  },
};


export async function stubPullRequests(
  prUrl: string
): Promise<any> {
  try {
    ghLogger.warn(`WireMock Pull Request URL :: ${prUrl}`);
    const response: any = await axios.get(prUrl, defaultHeaders);
    ghLogger.info(`Fetched response pull requests from ${prUrl}`);
    //console.log(`Response Data::::::::`, response);
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
    ghLogger.warn(`WireMock Pull Requtest URL :: ${url}`);
    const response: any = await axios.get(url, defaultHeaders);
    ghLogger.info(`Fetched response pull requests from ${owner}/${repo}`);
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


export async function stubGithubSearchIssuesRequests(
  key: string
): Promise<PullRequestData[]> {
  try {
    const repoFormatted = `repo:${config.WIREMOCK_REPO_NAME}`;
    const query = `${repoFormatted} type:pr in:title,body ${key}`;

    const url = `${config.WIREMOCK_URL}/search/issues`;
    ghLogger.warn(`WireMock Pull Request URL :: ${url}`);
    const response: any = await axios.get(url, {
      headers: defaultHeaders.headers,
      params: {
        q: query,
        per_page: githubParams.per_page,
        page: githubParams.startFromPageNo,
        state: githubParams.state,
        sort: githubParams.sort,
        direction: githubParams.direction,
      }
    });
    ghLogger.info(`Fetched response pull requests for queryString ${query}`);
    let allResults: any[] = [];
    if (response.data?.items?.length > 0) {
      const searchPRItems = response.data.items;
      //console.log(`searchPRItems ::::`, searchPRItems);
      for (let searchPRItem of searchPRItems) {
        if (searchPRItem?.pull_request?.url) {
          console.log(`searchPRItem?.pull_request?.url ::::::`, searchPRItem?.pull_request?.url);
          const pullReqResponse = await stubPullRequests(searchPRItem?.pull_request?.url);
          pullReqResponse.reactions = searchPRItem.reactions;
          pullReqResponse.sub_issues_summary = searchPRItem.sub_issues_summary;
          allResults.push(pullReqResponse);
        }
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
    ghLogger.warn(`WireMock Commit URL :: ${url}`);
    const response: any = await axios.get(url, defaultHeaders);
    ghLogger.info(
      `Fetched commits of pull requests from ${owner}/${repo} (pullNumber ${pullNumber})`
    );
    if (response.data.length > 0) {
      commits.push(...response.data);
    }
  } catch (error: any) {
    ghLogger.error(
      `Error fetching commits for pull request #${pullNumber} in ${owner}/${repo} :: ${error}`
    );
    throw new GithubError(error.status, error.message, error.documentation_url);
  }
  return commits;
}



export async function stubPullRequestCommits(
  url: string
): Promise<CommitData[]> {
  const commits = [];
  try {
    ghLogger.warn(`WireMock Commit URL :: ${url}`);
    const response: any = await axios.get(url, defaultHeaders);
    ghLogger.info(
      `Fetched commits of pull requests for URL ${url}`
    );
    if (response.data.length > 0) {
      commits.push(...response.data);
    }
  } catch (error: any) {
    ghLogger.error(
      `Error fetching commits for pull request #${url} :: ${error}`
    );
    throw new GithubError(error.status, error.message, error.documentation_url);
  }
  return commits;
}

export async function stubJiraIssues(queryString: string): Promise<any[]> {
  const pullRequests = [];
  try {
    const url = `${config.WIREMOCK_URL}/rest/api/3/search/jql`;
    const nextPageToken = null;
    const maxResults = 1;
    jLogger.warn(`WireMock Jira Issue URL :: ${url}`);
    const token = await getAuthorizationToken();
    const response: any = await axios.get(url, {

      headers: {
        Authorization: `Basic ${token}`,
      },
      params: {
        jql: `project=${jiraDetails.JIRA_PROJECT_ID}`,
        nextPageToken,
        maxResults,
        fields: "*all"
      }
    });
    jLogger.info("Fetched Jira Issue requests::::::::::::", response.data);
    if (response.data.issues.length > 0) {
      pullRequests.push(...response.data.issues);
    }
    //console.log(`pullRequests :::::::`, pullRequests);
    return pullRequests;
  } catch (error: any) {
    console.log(`JIRA Errrorr:::::::`, error);
    const errorResponse = error.response.data;
    throw new GithubError(
      error.status,
      errorResponse.message,
      errorResponse.documentation_url
    );
  }

}