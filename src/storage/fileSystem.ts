import * as fs from 'fs';
import * as path from 'path';
import { locals } from '../helpers/locals';

const dataDir = path.join(__dirname, '../../../stub/github');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

async function storePullRequest(pullRequest: any) {
    const filePath = path.join(dataDir, locals.pr_filename);
    let pullRequests = [];
    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        pullRequests = fileData ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
    }
    pullRequests.push({ type: 'pull_request', data: pullRequest });
    fs.writeFileSync(filePath, JSON.stringify(pullRequests, null, 2));
    console.warn(`Pull request #${pullRequest.number} stored.`);
}

async function storeCommits(prNumber: number, commits: any) {
    const filePath = path.join(dataDir, locals.commits_filename);
    let allCommits = [];
    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        allCommits = fileData ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
    }
    commits.forEach(commit => {
        allCommits.push({ type: 'commits', pr: prNumber, data: commit });
    });
    fs.writeFileSync(filePath, JSON.stringify(allCommits, null, 2));
    console.log(`Commits for pull request #${prNumber} stored.`);
}

export {
    storePullRequest,
    storeCommits,
}