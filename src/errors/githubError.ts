export class GithubError extends Error {
    status: string;
    url: string;
  
    constructor(status: string, message: string, url: string) {
      super(message);
      this.status = status;
      this.url = url;
      this.name = "GithubError";
    }
  }
  