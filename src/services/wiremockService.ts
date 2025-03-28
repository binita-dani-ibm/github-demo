import axios from "axios";
import { GithubError } from "../errors/githubError";
import * as qs from "qs";
import config from '../config';
import { ghLogger } from "../wlogger";


const {WIREMOCK_JIRA_DETAILS} = config;
export async function getAuthorizationToken(): Promise<string>{
  const encodedAuth = Buffer.from(`${WIREMOCK_JIRA_DETAILS.USERNAME}:${WIREMOCK_JIRA_DETAILS.PASSWORD}`).toString('base64');
  return encodedAuth;
}