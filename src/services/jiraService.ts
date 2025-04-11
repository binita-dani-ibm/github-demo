import axios from "axios";
import { JiraIssue } from "../interface/jira";
import config from "../config";
import { getJiraRequest } from "../helpers/common";
import dotenv from 'dotenv';
import { JiraError } from "../errors/jiraError";
import { validateJiraIssue } from "../validators/jiraIssueValidator";
dotenv.config();
const {
  JIRA_USERNAME = "",
  JIRA_API_TOKEN = "",
  JIRA_DOMAIN = "",
  JIRA_PROJECT_ID = "",
} = process.env;

export async function getAuthorizationToken(): Promise<string> {
  const encodedAuth = Buffer.from(
    `${JIRA_USERNAME}:${JIRA_API_TOKEN}`
  ).toString("base64");
  return encodedAuth;
}

export async function getJiraIssues(): Promise<JiraIssue[]> {
  try {
    let whileHasMoreIssues = true;
    const issues: JiraIssue[] = [];
    const { JIRA_PR_PARAMS } = config;
    let nextPageToken: string | null = JIRA_PR_PARAMS.nextPageToken;
    const url = `${JIRA_DOMAIN}${config.JIRA_SEARCH_URL}`;
    const token = await getAuthorizationToken();
    while (whileHasMoreIssues) {
      if (!JIRA_PROJECT_ID) {
        throw new Error("JIRA_PROJECT_ID is not defined");
      }
      const request = await getJiraRequest(token, JIRA_PROJECT_ID, nextPageToken);

      const response: any = await axios.get(url, request);
      const responseData = response.data;
      console.log(`responseData:::::::::::::::::::`, JSON.stringify(responseData));
      validateJiraIssue(responseData);
      issues.push(...response.data.issues);
      // Check if we have more results
      if (!response.data.nextPageToken) {
        whileHasMoreIssues = false; // No more results, exit the loop
      }
      nextPageToken = response.data.nextPageToken;
    }

    return issues;
  }
  catch (error: any) {
    throw new JiraError(error?.status, error?.message);
  }
}
