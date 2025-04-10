import { HttpRequest, HttpResponseInit } from "@azure/functions";
import { locals } from "../../helpers/locals";
import { GithubError } from "../../errors/githubError";
import { logger } from "../../wlogger";
import axios from "axios";
import * as qs from "qs";

const {
  JIRA_REPO_NAME = "",
  GITHUB_TOKEN = "",
} = process.env;

export async function listJiraPullRequest(
  request: HttpRequest
): Promise<HttpResponseInit> {
  try {
    logger.info(`Request URL123234: ${locals.request_url} ${request.url}`);
    // Ensure the repository format is "owner/repository-name"
    const repoFormatted = `repo:${JIRA_REPO_NAME}`;
    // Construct the GitHub API query string with the repository and issue key
    const query = `${repoFormatted} type:pr in:title,body SCRUM-1`;
    console.log("GitHub search query:", query); // For debugging
    // Make the API request with the token in the Authorization header
    const response = await axios.get("https://api.github.com/search/issues", {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
      params: {
        q: query, // Search query
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { indices: false });
      },
    });

    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: response.data }),
    };
  } catch (error: any) {
    if (error instanceof GithubError) {
      logger.error(`[${error.status}] ${error.message} ${error.url}`);
    } else {
      logger.error("An unknown error occurred");
    }
    return {
      status: error.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: error.status, message: error.message }),
    };
  }
}
