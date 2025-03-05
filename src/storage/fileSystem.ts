import * as fs from 'fs';
import * as path from 'path';
import { locals } from '../helpers/locals';
import { CommitData, PullRequestData } from '../interface/github';
import { logger } from '../functions/github/listPullRequest';

const dataDir = path.join(__dirname, '../../../stubs/github');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

async function storePullRequest(pullRequest: PullRequestData) {
    const filePath = path.join(dataDir, locals.pr_filename);
    let pullRequests = [];
    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        pullRequests = fileData ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
    }
    pullRequests.push({ type: 'pull_request', data: pullRequest });
    fs.writeFileSync(filePath, JSON.stringify(pullRequests, null, 2));
    logger.info(`Pull request #${pullRequest.number} stored.`);
}

async function storeCommits(prNumber: number, commits: CommitData[]) {
    const filePath = path.join(dataDir, locals.commits_filename);
    let allCommits = [];
    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        allCommits = fileData ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
    }    
    allCommits.push({ type: 'commits', pr: prNumber, data: commits });
    fs.writeFileSync(filePath, JSON.stringify(allCommits, null, 2));
    logger.info(`Commits for pull request #${prNumber} stored.`);
}

export {
    storePullRequest,
    storeCommits,
}