import { WireMockRestClient } from "wiremock-rest-client";
import prMapping from '../mappings/git_pr_mapping';
import commitMapping from '../mappings/git_commits';

import config from '../../config';

const wireMock = new WireMockRestClient(config.WIREMOCK_API_URL, {
    headers: {
        Authorization: `Token ${config.WIREMOCK_API_TOKEN}`,
    },
});

const urlPatterns = ["/repos/[^/]+/[^/]+/pulls", "/repos/[^/]+/[^/]+/pulls/[^/]+/commits"];

const authPullRequest = {
    method: "GET",
    urlPathPattern: "/repos/[^/]+/[^/]+/pulls",
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
        Authorization: {
            equalTo: "Bearer 1234567890"
        }
    }
};

const writePullRequests = async () => {
    try {
       
        const stubMapping = {
            priority: 1,
            request: authPullRequest,
            response: {
                status: 200,
                jsonBody: prMapping,
                headers: {
                    "Content-Type": "application/json"
                }
            }
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
                headers: {
                    Authorization: {
                        equalTo: "Bearer 1234567890"
                    }
                }
            },
            response: {
                status: 200,
                jsonBody: commitMapping,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        };
        await wireMock.mappings.createMapping(stubMapping);
        console.log("Wiremock stub registered for Commits");
    } catch (error: any) {
        console.error("Error registering mocks:", error);
    }
};

const absentStub = async () => {
    const absentAuthStubMapping = {
        priority: 3,
        request: {
            ...authPullRequest, headers: {
                Authorization: {
                    absent: true
                }
            }
        },
        response: {
            status: 404,
            headers: {
                "Content-Type": "application/json"
            },
            jsonBody: {
                message: "Not Found",
                documentation_url: "https://docs.github.com/rest/pulls/pulls#list-pull-requests"
            }

        }
    };

    //Pull Request 404 error stub mapping
    await wireMock.mappings.createMapping(absentAuthStubMapping);

}

const mismatchRequest = async() => {
    let priority = 4;
    //Authorization changes
    for (const urlPattern of urlPatterns) {
        
        const mismatchAuthStubMapping = {
            priority,
            request: {
                ...authPullRequest,
                urlPathPattern: urlPattern,
                queryParameters: {},
                headers: {
                    Authorization: {
                        matches: "^Bearer\\s+.+$"
                    }
                }
            },
            response: {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                },
                jsonBody: {
                    message: "Bad credentials",
                    documentation_url: "https://docs.github.com/rest/"
                }
            }
        };

        //Pull Request 401 error stub mapping
        await wireMock.mappings.createMapping(mismatchAuthStubMapping);
        priority++;
    }

}
writePullRequests();
writeCommitsOfPR();
absentStub();
mismatchRequest();
