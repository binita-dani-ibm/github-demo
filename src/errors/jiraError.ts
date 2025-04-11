export class JiraError extends Error {
    status: string
  
    constructor(status: string, message: string) {
      super(message);
      this.status = status;
      this.name = "JiraError";
    }
  }
  