const config = {
  GITHUB: {
    TOKEN: "1234567890",
    API_URL: "https://api.github.com",
    REPOS: [{ owner: "owner1", name: "repo1" }],
  },
  ADO: {
    TOKEN: "1234567890",
    ORG: "virginmoneyuk",
    PROJECT: "DigitalMobile",
    REPOS: [{ name: "mobile_dependency_report" }],
  },
  WIREMOCK_JIRA_DETAILS: {
    USERNAME: "1234567890",
    PASSWORD: "P@ssword!",
    JIRA_PROJECT_ID: "jiraproject",
  },
  MONGO_URI: "mongodb://localhost:27017",
  DATABASE_NAME: "devexp5",
  COLLECTION_NAME: "master",
  STORAGE_TYPE: "filesystem", // or 'cosmosdb'
  ENABLE_COMMITS: true,
  GITHUB_PR_PARAMS: {
    per_page: 5,
    startFromPageNo: 1,
    state: "all",
    sort: "updated",
    direction: "desc",
  },
  GITHUB_COMMITS_PARAMS: {
    per_page: 5,
    startFromPageNo: 1
  },
  JIRA_PR_PARAMS: {
    jql: `project=`,
    nextPageToken: null,
    maxResults: 1,
    fields: "*all"
  },
  GITHUB_API_URL: "https://api.github.com",
  WIREMOCK_URL: "https://vm-github.wiremockapi.cloud",
  WIREMOCK_TOKEN: "wmcp_2v6gq_bd790d1ba0d367ddc9ff009051329f6f_613452f1",
  GITHUB_REPO_NAME: "wiremock-repo",
  JIRA_SEARCH_URL: "/rest/api/3/search/jql",
  GITHUB_SEARCH_URL: "/search/issues"
};
export default config;
