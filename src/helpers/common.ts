import config from "../config";
import * as qs from "qs";

function getQueryString(url: string): string {
  // Find the start of the query string (after '?')
  const queryStart = url.indexOf("?");
  if (queryStart === -1) return ""; // No query string in URL
  // Extract and return the query string (substring after '?')
  return url.substring(queryStart + 1);
}

export async function getJiraRequest(
  token: string,
  projectId: string,
  nextPageToken: string | null
) {
  const { JIRA_PR_PARAMS } = config;
  const request = {
    headers: {
      Authorization: `Basic ${token}`,
    },
    params: {
      jql: `${JIRA_PR_PARAMS.jql}${projectId}`,
      nextPageToken,
      maxResults: JIRA_PR_PARAMS.maxResults,
      fields: JIRA_PR_PARAMS.fields,
    },
  };
  return request;
}

export async function getGithubHeaders(token: string) {
  return {
    headers: {
      Authorization: `token ${token}`,
    }
  }
}

export async function getGithubRequestQueryParams(
  repoName: string,
  jiraKey: string,
  token: string,
  currentPage: number
) {
  const { GITHUB_PR_PARAMS } = config;
  const query = `repo:${repoName} type:pr in:title,body ${jiraKey}`;
  const headers = await getGithubHeaders(token);
  const request = {
    ...headers,
    params: {
      q: query,
      per_page: GITHUB_PR_PARAMS.per_page,
      page: currentPage,
      state: GITHUB_PR_PARAMS.state,
      sort: GITHUB_PR_PARAMS.sort,
      direction: GITHUB_PR_PARAMS.direction,
    },
    paramsSerializer: (params: any) => {
      return qs.stringify(params, { indices: false });
    }
  };
  return request;
}


export async function getGithubCommitsQueryRequest(token: string, currentPage: number) {
  const { GITHUB_COMMITS_PARAMS } = config;

  const headers = await getGithubHeaders(token);
  const request = {
    ...headers,
    params: {
      per_page: GITHUB_COMMITS_PARAMS.per_page,
      page: currentPage,
    },
    paramsSerializer: (params: any) => {
      return qs.stringify(params, { indices: false });
    },
  }

  return request;
}

export { getQueryString };
