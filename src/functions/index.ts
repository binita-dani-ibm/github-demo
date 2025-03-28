import { app } from "@azure/functions";
import { listPullRequest } from "./github/listPullRequest";
import { listJiraPullRequest } from "./github/listJiraPullRequest";
import { listIssues } from "./jira/listIssues";
import { wmListIssues } from "./wiremock/wmListIssues";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * Github: List of pull request
 */
app.http('github-listPullRequest', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'github/listPullRequest',
    handler: listPullRequest
});
/**
 * Github: List of Jira pull request
 */
app.http("github-listJiraPullRequest", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "github/listJiraPullRequest",
  handler: listJiraPullRequest,
});
/**
 * Jira: List of issues
 */
app.http("jira-listIssues", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "jira/listIssues",
  handler: listIssues,
});
/**
 * Wiremock - List of issues
 */
app.http("wiremock-listIssues", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "wiremock/listIssues",
  handler: wmListIssues,
});
