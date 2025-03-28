import { HttpRequest, HttpResponseInit } from "@azure/functions";
import qs from "qs";
import config from "../../config";
import {
  stubPullRequestCommitsForOwnerAndRepo,
  stubPullRequestsWithOwnerandRepo,
} from "../../wiremock/readStubs";
import { storePullRequest, storeCommits } from "../../storage/fileSystem";
import { getQueryString } from "../../helpers/common";
import { locals } from "../../helpers/locals";
import { PullRequestData } from "../../interface/github";
import { GithubError } from "../../errors/githubError";
import { validateResponse } from "../../validators/pullRequestValidator";
import { validateGithubQueryParams } from "../../validators/queryParamsValidator";
import { ghLogger } from "../../wlogger";

const prQs: string = "state=all&sort=updated&direction=desc&page=1&per_page=10";
const commitQs: string = "page=1&per_page=10";

export async function listPullRequest(
  request: HttpRequest
): Promise<HttpResponseInit> {
  try {
    ghLogger.info(`Request URL: ${locals.request_url} ${request.url}`);
    let queryString = getQueryString(request.url);
    if (queryString === "") {
      queryString = prQs;
    }
    const queryParams = qs.parse(queryString);
    console.log("queryParams:::::::::::", queryParams);
    validateGithubQueryParams(queryParams);
    //console.log("Page :::",request.query.get('page111'));
    for (const { owner, name } of config.GITHUB.REPOS) {
      await processPullRequest(owner, name, queryString);
    }
    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: locals.response_str }),
    };
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

async function processPullRequest(
  owner: string,
  name: string,
  queryString: string
): Promise<PullRequestData[]> {
  const pullRequests = await stubPullRequestsWithOwnerandRepo(owner, name, queryString);
  validateResponse(pullRequests);
  for (const pr of pullRequests) {
    await storePullRequest(pr);
    if (config.ENABLE_COMMITS) {
      const commits = await stubPullRequestCommitsForOwnerAndRepo(
        owner,
        name,
        pr.number,
        commitQs
      );
      await storeCommits(pr.number, commits);
    }
  }
  return pullRequests;
}
