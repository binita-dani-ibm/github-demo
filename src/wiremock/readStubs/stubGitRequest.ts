import config from '../../config';
import axios from 'axios';
import { CommitData, PullRequestData } from '../../interface/github';
import { GithubError } from '../../errors/githubError';
import { logger } from '../../functions/github/listPullRequest';

const defaultHeaders = {
  headers: {
    Authorization: `Bearer ${config.GITHUB.TOKEN}`,
  },
};

async function stubPullRequests(owner: string, repo: string, queryString: string): Promise<PullRequestData[]> {
    const pullRequests = [];
    try {
        const url = `${config.WIREMOCK_API_URL}/repos/${owner}/${repo}/pulls?${queryString}`;
        logger.warn(`WireMock Pull Requtest URL :: ${url}`);
        const response: any = await axios.get(url, defaultHeaders);
        logger.info(`Fetched response pull requests from ${owner}/${repo}`);
        if (response.data.length > 0) {
            pullRequests.push(...response.data);
        }
    } catch (error: any) {
        const errorResponse = error.response.data;
        throw new GithubError(error.status, errorResponse.message, errorResponse.documentation_url);
    }
    return pullRequests;
}

async function stubPullRequestCommits(owner: string, repo: string, pullNumber: number, queryString: string): Promise<CommitData[]> {
    const commits = [];
    try {
        const url = `${config.WIREMOCK_API_URL}/repos/${owner}/${repo}/pulls/${pullNumber}/commits?${queryString}`;      
        logger.warn(`WireMock Commit URL :: ${url}`);
        const response: any = await axios.get(url, defaultHeaders);
        logger.info(`Fetched commits of pull requests from ${owner}/${repo} (pullNumber ${pullNumber})`);
        if (response.data.length > 0) {
            commits.push(...response.data);
        }
    } catch (error: any) {
        logger.error(`Error fetching commits for pull request #${pullNumber} in ${owner}/${repo} :: ${error}`);
        throw new GithubError(error.status, error.message, error.documentation_url);
    }
    return commits;
}

export {
    stubPullRequests,
    stubPullRequestCommits,
}
