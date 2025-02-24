import { WireMockRestClient } from "wiremock-rest-client";
import prMapping from '../mappings/git_pr_mapping';
import commitMapping from '../mappings/git_commits';

const WIREMOCK_BASE_URL = "https://vmgithub.wiremockapi.cloud/";
const API_CLIENT_TOKEN = "wmcp_r986l_5efdd47851c069c9a4544f784d4332bf_cd5e85e1";

const wireMock = new WireMockRestClient(WIREMOCK_BASE_URL, {
    headers: {
        Authorization: `Token ${API_CLIENT_TOKEN}`,
    },
});

const writePullRequests = async () => {
    try {
        const authPullRequest = {
            method: "GET",
            urlPathPattern: "/repos/.*",
            queryParameters: {
                state:
                {
                    or: [
                        {
                            matches: "open|closed|all",
                        },
                        {
                            absent: true
                        }]
                },
                head: {
                    or: [
                        {
                            matches: "^[^:]+:[^:]+$",
                        },
                        {
                            absent: true
                        }]
                },
                base: {
                    or: [
                        {
                            matches: ".*",
                        },
                        {
                            absent: true
                        }]
                },
                sort: {
                    or: [
                        {
                            matches: "created|updated|popularity|long-running",
                        },
                        {
                            absent: true
                        }]
                },
                direction: {
                    or: [
                        {
                            matches: "asc|desc",
                        },
                        {
                            absent: true
                        }]
                },
                per_page: {
                    or: [
                        {
                            matches: "^(?:[1-9][0-9]?|100)$",//Allow 1-100 only
                        },
                        {
                            absent: true
                        }
                    ]
                },
                page: {
                    or: [
                        {
                            matches: "^[1-9][0-9]*$",//Allow 1-100 only
                        },
                        {
                            absent: true
                        }
                    ]
                }
            },
            headers: {
                "Content-Type": {
                    equalTo: "application/json"
                },
                Authorization: {
                    equalTo: "Bearer 1234567890"
                }
            }
        };
        const stubMapping = {
            "request": authPullRequest,
            "response": {
                "status": 200,
                "jsonBody": prMapping,
                "headers": {
                    "Content-Type": "application/json"
                }
            }
        };


        await wireMock.mappings.createMapping(stubMapping);

        const missAuthPullReq = {
            ...authPullRequest, headers: {
                "Content-Type": {
                    "equalTo": "application/json"
                },
                "Authorization": {
                    doesNotMatch: "Bearer 1234567890"
                }
            }
        }

        const missAuthStubMapping = {
            "request": missAuthPullReq,
            "response": {
                "status": 401,
                "jsonBody": { error: "Unauthorized: Invalid or missing credentials" },
                "headers": {
                    "Content-Type": "application/json"
                }
            }
        };

        await wireMock.mappings.createMapping(missAuthStubMapping);

        console.log("Wiremock stub registered for Pull Requests");
    } catch (error) {
        console.error("Error registering mocks:", error);
    }
};

const writeCommitsOfPR = async () => {
    try {
        const stubMapping = {
            "request": {
                "method": "GET",
                "urlPathPattern": "/repos/[^/]+/[^/]+/pulls/[^/]+/commits",
                "queryParameters": {
                    per_page: {
                        "or": [
                            {
                                matches: "^(?:[1-9][0-9]?|100)$",//Allow 1-100 only
                            },
                            {
                                absent: true
                            }
                        ]
                    },
                    page: {
                        "or": [
                            {
                                matches: "^[1-9][0-9]*$",//Allow 1-100 only
                            },
                            {
                                absent: true
                            }
                        ]
                    }
                },
                "headers": {
                    "Content-Type": {
                        "equalTo": "application/json"
                    },
                    "Authorization": {
                        "equalTo": "Bearer 1234567890"
                    }
                }
            },
            "response": {
                "status": 200,
                "jsonBody": commitMapping,
                "headers": {
                    "Content-Type": "application/json"
                }
            }
        };
        await wireMock.mappings.createMapping(stubMapping);
        console.log("Wiremock stub registered for Commits");
    } catch (error) {
        console.error("Error registering mocks:", error);
    }
};

writePullRequests();
writeCommitsOfPR();
