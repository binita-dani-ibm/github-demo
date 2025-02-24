import config from '../../config';
import axios from 'axios';
import { PullRequestResponse } from '../../interface/github';

async function stubPullRequests(owner: string, repo: string, queryString: string) : Promise<PullRequestResponse[]> {
    const pullRequests = [];
    try {
        const url = `${config.WIREMOCK_API_URL}/repos/${owner}/${repo}/pulls?${queryString}`;
        console.warn(`WireMock PR URL :: `, url);
        const response: any = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer dwedwqewq`
            }
        });
        console.warn(`Fetched response pull requests from ${owner}/${repo}`); // Add this line
        if (response.data.length > 0) {
            pullRequests.push(...response.data);            
        }
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            console.error(`ECONNABORTED error fetching pull requests for ${owner}/${repo}:`, error);
        } else {
            console.error(`Error fetching pull requests for ${owner}/${repo}:`, error);
        }
    }
    return pullRequests;
}

async function stubPullRequestCommits(owner: string, repo: string, pullNumber: number, queryString: string) {
    const commits = [];
    try {
        const url = `${config.WIREMOCK_API_URL}/repos/${owner}/${repo}/pulls/${pullNumber}/commits?${queryString}`;
        console.warn(`WireMock Commit URL :: `, url);
        const response: any = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.GITHUB.TOKEN}`
            }
        });
        console.warn(`Fetched commits of pull requests from ${owner}/${repo} (pullNumber ${pullNumber})`); // Add this line   
        if (response.data.length > 0) {
            commits.push(...response.data);            
        }
    } catch (error) {
        console.error(`Error fetching commits for pull request #${pullNumber} in ${owner}/${repo}:`, error);        
    }
    return commits;
}

export {
    stubPullRequests,
    stubPullRequestCommits,
}
