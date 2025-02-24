import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import config from "../../config";
import { stubPullRequests, stubPullRequestCommits } from "../../wiremock/readStubs/stubGitRequest";
import { storePullRequest, storeCommits } from "../../storage/fileSystem";
import { getQueryString } from "../../helpers/common";
import { locals } from "../../helpers/locals";
import { PullRequestResponse } from "../../interface/github";

const prQs: string = 'state=all&sort=updated&direction=desc&page=1&per_page=10';
const commitQs: string = 'page=1&per_page=10';

export async function listPullRequest(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`${locals.request_url} ${request.url}`);
    let queryString = getQueryString(request.url);
    if (queryString === "") {
        queryString = prQs;
    }
    for (const { owner, name } of config.GITHUB.REPOS) {
        await processPullRequest(owner, name, queryString);
    }
    return {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: locals.response_str }),
    };
};

async function processPullRequest(owner: string, name: string, queryString: string) : Promise<PullRequestResponse[]> {
    const pullRequests = await stubPullRequests(owner, name, queryString);
    for (const pr of pullRequests) {
        await storePullRequest(pr);
        if (config.ENABLE_COMMITS) {
            const commits = await stubPullRequestCommits(owner, name, pr.number, commitQs);
            await storeCommits(pr.number, commits);
        }
    }
    return pullRequests;
}
