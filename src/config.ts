const config = {
    GITHUB: {
        TOKEN: '1234567890',
        API_URL: 'https://api.github.com',
        REPOS: [
            { owner: 'nationwide-building-society', name: 'sl-lib-shared' }
        ]
    },
    ADO: {
        TOKEN: '1234567890',
        ORG: 'virginmoneyuk',
        PROJECT: 'DigitalMobile',
        REPOS: [
            { name: 'mobile_dependency_report' }
        ]
    },
    MONGO_URI: 'mongodb://localhost:27017',
    DATABASE_NAME: 'devexp5',
    COLLECTION_NAME: 'master',
    STORAGE_TYPE: 'filesystem', // or 'cosmosdb'
    ENABLE_COMMITS: true,
    WIREMOCK_API_URL: 'https://vmgithub.wiremockapi.cloud'
};
export default config;