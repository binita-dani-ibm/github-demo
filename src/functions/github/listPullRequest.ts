import { HttpRequest, HttpResponseInit } from "@azure/functions";
import config from "../../config";
import { stubPullRequests, stubPullRequestCommits } from "../../wiremock/readStubs/stubGitRequest";
import { storePullRequest, storeCommits } from "../../storage/fileSystem";
import { getQueryString } from "../../helpers/common";
import { locals } from "../../helpers/locals";
import { PullRequestData } from "../../interface/github";
import { GithubError } from "../../errors/githubError";
import { validateResponse } from "../../validators/pullRequestValidator";
import wLogger from "../../wlogger";
import { validateGithubQueryParams } from "../../validators/queryParamsValidator";
import qs from 'qs';

const prQs: string = 'state=all&sort=updated&direction=desc&page=1&per_page=10';
const commitQs: string = 'page=1&per_page=10';

export const logger = wLogger({ logName: 'github', level: 'silly' })

export async function listPullRequest(request: HttpRequest): Promise<HttpResponseInit> {
    try {
        logger.info(`Request URL: ${locals.request_url} ${request.url}`);
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
    }
    catch (error: any) {
        if (error instanceof GithubError) {
            logger.error(`[${error.status}] ${error.message} ${error.url}`);
        } else {
            logger.error('An unknown error occurred');
        }
        return {
            status: error.status,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: error.status, message: error.message }),
        };
    }
};

async function processPullRequest(owner: string, name: string, queryString: string): Promise<PullRequestData[]> {
    const pullRequests = await stubPullRequests(owner, name, queryString);
    validateResponse(pullRequests);
    for (const pr of pullRequests) {
        await storePullRequest(pr);
        if (config.ENABLE_COMMITS) {
            const commits = await stubPullRequestCommits(owner, name, pr.number, commitQs);
            await storeCommits(pr.number, commits);
        }
    }
    return pullRequests;

}
