import config from '../config';;


const { WIREMOCK_JIRA_DETAILS } = config;

export async function getAuthorizationToken(): Promise<string> {
  const encodedAuth = Buffer.from(`${WIREMOCK_JIRA_DETAILS.USERNAME}:${WIREMOCK_JIRA_DETAILS.PASSWORD}`).toString('base64');
  return encodedAuth;
}