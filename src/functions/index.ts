import { app } from "@azure/functions";
import { listPullRequest } from "./github/listPullRequest";

// Github: List of pull request
app.http('github-listPullRequest', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'github/listPullRequest',
    handler: listPullRequest
});
