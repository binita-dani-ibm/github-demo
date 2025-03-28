import { WireMockRestClient } from "wiremock-rest-client";
import prMapping from "../mappings/git_pr_mapping";
import commitMapping from "../mappings/git_commits";
import jiraListIssueMapping from "../mappings/jira_list_issues";
import { searchIssuesMapping } from '../mappings/git_search_issues';
import config from "../../config";

const { WIREMOCK_URL, WIREMOCK_TOKEN, WIREMOCK_JIRA_DETAILS } = config;

const encodedAuth = Buffer.from(`${WIREMOCK_JIRA_DETAILS.USERNAME}:${WIREMOCK_JIRA_DETAILS.PASSWORD}`).toString('base64');
if (!WIREMOCK_URL) {
  throw new Error("WIREMOCK_URL is not defined");
}
const wireMock = new WireMockRestClient(WIREMOCK_URL, {
  headers: {
    Authorization: `Token ${WIREMOCK_TOKEN}`,
  },
  continueOnFailure: true,
});

const githubUrlPatterns = [
  "/repos/[^/]+/[^/]+/pulls/([0-9]+)",
  "/repos/[^/]+/[^/]+/pulls/[^/]+/commits",
  "/search/issues",
]
const jiraUrlPatterns = [
  "/rest/api/3/search/jql"
];


const searchIssuesRequest = {
  method: "GET",
  urlPathPattern: githubUrlPatterns[2],
  queryParameters: {
    q: {
      matches: ".*"  // Matches any string for the q parameter
    },
    order: {
      or: [
        {
          matches: "desc|asc",
        },
        {
          absent: true,
        },
      ],
    },
    sort: {
      or: [
        {
          matches: "created|updated",
        },
        {
          absent: true,
        },
      ],
    },
    direction: {
      or: [
        {
          matches: "asc|desc",
        },
        {
          absent: true,
        },
      ],
    },
    per_page: {
      or: [
        {
          matches: "^(?:[1-9][0-9]?|100)$", //Allow 1-100 only
        },
        {
          absent: true,
        },
      ],
    },
    page: {
      or: [
        {
          matches: "\\d+",
        },
        {
          absent: true,
        },
      ],
    },
  },
  headers: {
    Authorization: {
      equalTo: "Bearer 1234567890",
    },
  },
};

const githubPullRequestWithOwnerAndRepo = {
  method: "GET",
  urlPathPattern: githubUrlPatterns[0],
  queryParameters: {
    state: {
      or: [
        {
          matches: "open|closed|all",
        },
        {
          absent: true,
        },
      ],
    },
    head: {
      or: [
        {
          matches: "^[^:]+:[^:]+$",
        },
        {
          absent: true,
        },
      ],
    },
    base: {
      or: [
        {
          matches: ".*",
        },
        {
          absent: true,
        },
      ],
    },
    sort: {
      or: [
        {
          matches: "created|updated|popularity|long-running",
        },
        {
          absent: true,
        },
      ],
    },
    direction: {
      or: [
        {
          matches: "asc|desc",
        },
        {
          absent: true,
        },
      ],
    },
    per_page: {
      or: [
        {
          matches: "^(?:[1-9][0-9]?|100)$", //Allow 1-100 only
        },
        {
          absent: true,
        },
      ],
    },
    page: {
      or: [
        {
          matches: "\\d+",
        },
        {
          absent: true,
        },
      ],
    },
  },
  headers: {
    Authorization: {
      equalTo: "Bearer 1234567890",
    },
  },
};


const githubPullRequest = {
  method: "GET",
  urlPathPattern: githubUrlPatterns[0],
  headers: {
    Authorization: {
      equalTo: "Bearer 1234567890",
    },
  },
};


const authGithubRequest = {
  method: "GET",
  headers: {
    Authorization: {
      equalTo: "Bearer 1234567890",
    },
  },
};


const authJiraRequest = {
  method: "GET",
  headers: {
    Authorization: {
      equalTo: `Basic ${encodedAuth}`,
    },
  },
};

const jiraListIssueRequest = {
  method: "GET",
  urlPathPattern: jiraUrlPatterns[0],
  queryParameters: {
    jql: {
      or: [
        {
          matches: "project=[a-zA-Z0-9_-]+",
        },
        {
          absent: false,
        },
      ],
    },
    nextPageToken: {
      or: [
        {
          matches: "\\S*",
        },
        {
          absent: false,
        },
      ],
    },
    maxResults: {
      or: [
        {
          matches: "^[1-9][0-9]{0,3}$|^5000$",  // Match numbers from 1 to 5000
        },
        {
          absent: false,
        },
      ],
    },
  },
  headers: {
    Authorization: {
      equalTo: `Basic ${encodedAuth}`,
    },
  },
};
const jiraListIssues = async () => {
  try {
    const stubMapping = {
      priority: 1,
      request: jiraListIssueRequest,
      response: {
        status: 200,
        jsonBody: jiraListIssueMapping,
        headers: {
          "Content-Type": "application/json",
        },
      },
    };

    //Pull Request 200 response stub mapping
    await wireMock.mappings.createMapping(stubMapping);
    console.log("Wiremock stub registered for Jira List Issues");
  } catch (error: any) {
    console.error("Error registering mocks:", error);
  }
};

const writeStubPullRequests = async () => {
  try {
    const stubMapping = {
      priority: 1,
      request: searchIssuesRequest,
      response: {
        status: 200,
        jsonBody: searchIssuesMapping,
        headers: {
          "Content-Type": "application/json",
        },
      },
    };

    //Pull Request 200 response stub mapping
    await wireMock.mappings.createMapping(stubMapping);
    console.log("Wiremock stub registered for Pull Requests");
  } catch (error: any) {
    console.error("Error registering mocks:", error);
  }
};

const writePullRequests = async () => {
  try {
    const stubMapping = {
      priority: 1,
      request: githubPullRequest,
      response: {
        status: 200,
        jsonBody: prMapping,
        headers: {
          "Content-Type": "application/json",
        },
      },
    };

    //Pull Request 200 response stub mapping
    await wireMock.mappings.createMapping(stubMapping);
    console.log("Wiremock stub registered for Pull Requests");
  } catch (error: any) {
    console.error("Error registering mocks:", error);
  }
};
const writeCommitsOfPR = async () => {
  try {
    const stubMapping = {
      priority: 2,
      request: {
        method: "GET",
        urlPathPattern: "/repos/[^/]+/[^/]+/pulls/[^/]+/commits",
        queryParameters: {
          per_page: {
            or: [
              {
                matches: "^(?:[1-9][0-9]?|100)$", //Allow 1-100 only
              },
              {
                absent: true,
              },
            ],
          },
          page: {
            or: [
              {
                matches: "^[1-9][0-9]*$", //Allow 1-100 only
              },
              {
                absent: true,
              },
            ],
          },
        },
        headers: {
          Authorization: {
            equalTo: "Bearer 1234567890",
          },
        },
      },
      response: {
        status: 200,
        jsonBody: commitMapping,
        headers: {
          "Content-Type": "application/json",
        },
      },
    };
    await wireMock.mappings.createMapping(stubMapping);
    console.log("Wiremock stub registered for Commits");
  } catch (error: any) {
    console.error("Error registering mocks:", error);
  }
};
const absentStub = async () => {
  let priority = 3;
  for (const githubUrlPattern of githubUrlPatterns) {
    const absentAuthStubMapping = {
      priority,
      request: {
        ...authGithubRequest,
        urlPathPattern: githubUrlPattern,
        headers: {
          Authorization: {
            absent: true,
          },
        },
      },
      response: {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
        jsonBody: {
          message: "Not Found",
          documentation_url:
            "https://docs.github.com/rest/pulls/pulls#list-pull-requests",
        },
      },
    };
    //Pull Request 404 error stub mapping
    await wireMock.mappings.createMapping(absentAuthStubMapping);
    priority++;
  }
};
const mismatchRequest = async () => {
  let priority = 6;
  //Authorization changes
  for (const githubUrlPattern of githubUrlPatterns) {
    const mismatchAuthStubMapping = {
      priority,
      request: {
        ...authGithubRequest,
        urlPathPattern: githubUrlPattern,
        headers: {
          Authorization: {
            matches: "^Bearer\\s+.+$",
          },
        },
      },
      response: {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
        jsonBody: {
          message: "Bad credentials",
          documentation_url: "https://docs.github.com/rest/",
        },
      },
    };
    //Pull Request 401 error stub mapping
    await wireMock.mappings.createMapping(mismatchAuthStubMapping);
    priority++;
  }
};


const absentJiraHeader = async () => {
  let priority = 9;
  for (const jiraUrlPattern of jiraUrlPatterns) {
    const absentAuthStubMapping = {
      priority,
      request: {
        ...authJiraRequest,
        urlPathPattern: jiraUrlPattern,
        headers: {
          Authorization: {
            absent: true,
          },
        },
      },
      response: {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        jsonBody: {
          issues: []
        },
      },
    };
    //Pull Request 200 error stub mapping
    await wireMock.mappings.createMapping(absentAuthStubMapping);
    priority++;
  }
};


const mismatchJiraRequest = async () => {
  let priority = 10;
  //Authorization changes
  for (const jiraUrlPattern of jiraUrlPatterns) {
    const mismatchAuthStubMapping = {
      priority,
      request: {
        ...authJiraRequest,
        urlPathPattern: jiraUrlPattern,
        headers: {
          Authorization: {
            matches: "^Basic\\s+.+$",
          },
        },
      },
      response: {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        jsonBody: {
          issues: []
        },
      },
    };
    //Pull Request 401 error stub mapping
    await wireMock.mappings.createMapping(mismatchAuthStubMapping);
    priority++;
  }
};

jiraListIssues();
writePullRequests();
writeCommitsOfPR();
absentStub();
mismatchRequest();
writeStubPullRequests();
absentJiraHeader();
mismatchJiraRequest();