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
  WIREMOCK_URL: "https://vmgithub.wiremockapi.cloud",
  WIREMOCK_TOKEN: "wmcp_eyg49_b004d468310322df0163f060d54c7bb5_9e7f31f0",
  WIREMOCK_REPO_NAME: "wiremock-repo"
};
export default config;
