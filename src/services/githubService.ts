import axios from "axios";
import { GithubError } from "../errors/githubError";
import * as qs from "qs";
import dotenv from 'dotenv';
import { ghLogger } from "../wlogger";
import config from "../config";
dotenv.config();
const { GITHUB_REPO_NAME = "", GITHUB_TOKEN = "" } = process.env;
const githubParams = config.GITHUB_PR_PARAMS;
export async function getJiraIssueGithubPullRequest(key: string): Promise<any> {
  try {
    const repoFormatted = `repo:${GITHUB_REPO_NAME}`;
    // Construct the GitHub API query string with the repository and issue key
    const query = `${repoFormatted} type:pr in:title,body ${key}`;
    let allResults: any[] = [];
    //console.log('GitHub search query:', query);  // For debugging
    let hasMore = true;
    let currentPage = githubParams.startFromPageNo;
    while (hasMore) {
      // Make the API request with the token in the Authorization header
      const response = await axios.get("https://api.github.com/search/issues", {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
        params: {
          q: query,
          per_page: githubParams.per_page,
          page: currentPage,
          state: githubParams.state,
          sort: githubParams.sort,
          direction: githubParams.direction,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { indices: false });
        },
      });

      if (response?.data?.items?.length > 0) {
        const searchPRItems = response.data.items;
        for (let searchPRItem of searchPRItems) {
          if (searchPRItem?.pull_request?.url) {
            const pullReqResponse = await getGithubPullRequest(searchPRItem?.pull_request?.url);
            pullReqResponse.reactions = searchPRItem.reactions;
            pullReqResponse.sub_issues_summary = searchPRItem.sub_issues_summary;
            allResults.push(pullReqResponse);
          }
        }
      }
      if (
        !response.headers.link ||
        !response.headers.link.includes('rel="next"')
      ) {
        hasMore = false;
      }


      // Increment the page number for the next API request
      currentPage++;
    }
    return allResults;
  } catch (error: any) {
    if (error instanceof GithubError) {
      ghLogger.error(`[${error.status}] ${error.message} ${error.url}`);
    } else {
      ghLogger.error("An unknown error occurred");
    }
    return {
      status: error.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: error.status, message: error.message }),
    };
  }
}

export async function getGithubPullRequestCommits(githubPR: any): Promise<any> {
  try {
    const prUrl = githubPR?.url || "";
    let hasMore = true;
    const perPage = 1;
    let currentPage = 1;
    let allResults: any[] = [];
    while (hasMore) {
      // Make the API request with the token in the Authorization header
      const response = await axios.get(`${prUrl}/commits`, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
        params: {
          per_page: perPage,
          page: currentPage,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { indices: false });
        },
      });
      //console.log(`Response data COMMITS::::::::::`, response.data);
      allResults = [...allResults, ...response.data];
      if (
        !response.headers.link ||
        !response.headers.link.includes('rel="next"')
      ) {
        hasMore = false;
      }
      // Increment the page number for the next API request
      currentPage++;
    }
    return allResults;
  } catch (error: any) {
    if (error instanceof GithubError) {
      ghLogger.error(`[${error.status}] ${error.message} ${error.url}`);
    } else {
      ghLogger.error("An unknown error occurred");
    }
    return {
      status: error.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: error.status, message: error.message }),
    };
  }
}


export async function getGithubPullRequest(prUrl: string): Promise<any> {
  try {

    // Make the API request with the token in the Authorization header
    const response = await axios.get(prUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      }
    });
    return response.data;
  } catch (error: any) {
    if (error instanceof GithubError) {
      ghLogger.error(`[${error.status}] ${error.message} ${error.url}`);
    } else {
      ghLogger.error("An unknown error occurred");
    }
    return {
      status: error.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: error.status, message: error.message }),
    };
  }
}
