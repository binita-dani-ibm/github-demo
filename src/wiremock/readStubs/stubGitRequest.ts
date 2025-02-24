import config from '../../config';
import axios from 'axios';
import { CommitData, PullRequestData } from '../../interface/github';
import { GithubError } from '../../errors/githubError';

async function stubPullRequests(owner: string, repo: string, queryString: string) : Promise<PullRequestData[]> {
    const pullRequests = [];
    try {
        const url = `${config.WIREMOCK_API_URL}/repos/${owner}/${repo}/pulls?${queryString}`;
        console.warn(`WireMock PR URL :: `, url);
        const response: any = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${config.GITHUB.TOKEN}`
            }
        });
        console.warn(`Fetched response pull requests from ${owner}/${repo}`); // Add this line
        if (response.data.length > 0) {
            pullRequests.push(...response.data);            
        }
    } catch (error) {
        console.error(`Error Status =============`, error.status, error.response.data);
        const errorResponse =  error.response.data;
        //process.exit(1);
        throw new GithubError(error.status, errorResponse.message, errorResponse.documentation_url);
        
    }
    return pullRequests;
}

async function stubPullRequestCommits(owner: string, repo: string, pullNumber: number, queryString: string): Promise<CommitData[]> {
    const commits = [];
    try {
        const url = `${config.WIREMOCK_API_URL}/repos/${owner}/${repo}/pulls/${pullNumber}/commits?${queryString}`;
        console.warn(`WireMock Commit URL :: `, url);
        const response: any = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${config.GITHUB.TOKEN}`
            }
        });
        console.warn(`Fetched commits of pull requests from ${owner}/${repo} (pullNumber ${pullNumber})`); // Add this line   
        if (response.data.length > 0) {
            commits.push(...response.data);            
        }
    } catch (error) {
        console.error(`Error fetching commits for pull request #${pullNumber} in ${owner}/${repo}:`, error);
        throw new GithubError(error.status, error.message, error.documentation_url);      
    }
    return commits;
}

export {
    stubPullRequests,
    stubPullRequestCommits,
}
