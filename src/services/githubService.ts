import axios from "axios";
import { GithubError } from "../errors/githubError";
import { logger } from "../wlogger";
import config from "../config";
import { getGithubCommitsQueryRequest, getGithubHeaders, getGithubRequestQueryParams } from "../helpers/common";
import dotenv from "dotenv";
import { CommitData, PullRequestData } from "../interface/github";
import { validateGithubPullRequestResponse, validateResponse } from "../validators/pullRequestValidator";
import { validateGithubSearchResponse } from "../validators/pullRequestSearchValidator";
import { validateCommitData } from "../validators/commitDataValidator";
dotenv.config();
const { GITHUB_REPO_NAME = "", GITHUB_TOKEN = "" } = process.env;


export async function getGithubPullRequestWithSearch(key: string): Promise<PullRequestData[]> {
  try {
    const { GITHUB_PR_PARAMS, GITHUB_SEARCH_URL, GITHUB_API_URL } = config;
    let allResults: any[] = [];
    let hasMore = true;
    let currentPage = GITHUB_PR_PARAMS.startFromPageNo;
    while (hasMore) {
      let request = await getGithubRequestQueryParams(
        GITHUB_REPO_NAME,
        key,
        GITHUB_TOKEN,
        currentPage
      );
      const url = `${GITHUB_API_URL}${GITHUB_SEARCH_URL}`;
      // Make the API request with the token in the Authorization header
      const response = await axios.get(url, request);
      logger.info(
        `Fetched response pull requests for Repo name ${GITHUB_REPO_NAME}`
      );
      const responseData: GithubSearchResponse = response.data;
      console.log("Search Pull Request Response:::::::", JSON.stringify(responseData));
      validateGithubSearchResponse(responseData);
      if (responseData?.items?.length > 0) {
        const searchPRItems = responseData.items;
        
        for (let searchPRItem of searchPRItems) {
          if (searchPRItem?.pull_request?.url) {
            const pullReqResponse : PullRequestData = await getGithubPullRequest(
              searchPRItem?.pull_request?.url
            );

            validateGithubPullRequestResponse(pullReqResponse);
            console.log(`pullReqResponse::::::::::::::::::`, JSON.stringify(pullReqResponse));
            pullReqResponse.reactions = searchPRItem.reactions;
            pullReqResponse.sub_issues_summary =
              searchPRItem.sub_issues_summary;
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
    throw new GithubError(error?.status, error?.message, error?.url);
  }
}

export async function getGithubPullRequestCommits(commitsUrl: string): Promise<CommitData[]> {
  try {
    let hasMore = true;
    const { GITHUB_COMMITS_PARAMS } = config;
    let currentPage = GITHUB_COMMITS_PARAMS.startFromPageNo;
    let allResults: any[] = [];
    while (hasMore) {

      const request = await getGithubCommitsQueryRequest(GITHUB_TOKEN, currentPage)
      // Make the API request with the token in the Authorization header
      const response = await axios.get(`${commitsUrl}`, request);
      //console.log(`Response data COMMITS::::::::::`, response.data);
      const commitsData: CommitData = response.data;

      validateCommitData(commitsData);

      allResults.push(commitsData);
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
    throw new GithubError(error?.status, error?.message, error?.url);
  }
}

export async function getGithubPullRequest(prUrl: string): Promise<PullRequestData> {
  try {
    logger.warn(`Github Pull Request URL :: ${prUrl}`);
    const headers = await getGithubHeaders(GITHUB_TOKEN);
    // Make the API request with the token in the Authorization header
    const response = await axios.get(prUrl, headers);
    logger.info(`Fetched Github pull request from ${prUrl}`);
    return response.data;
  } catch (error: any) {
    throw new GithubError(error?.status, error?.message, error?.url);
  }
}
