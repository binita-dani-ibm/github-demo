interface AvatarUrls {
  "16x16": string;
  "24x24": string;
  "32x32": string;
  "48x48": string;
}
interface Author {
  accountId: string;
  accountType?: string;
  active: boolean;
  avatarUrls: AvatarUrls;
  displayName: string;
  key?: string;
  name?: string;
  self: string;
}
interface Attachment {
  author: Author;
  content: string;
  created: string;
  filename: string;
  id: number;
  mimeType: string;
  self: string;
  size: number;
}
interface SubTask {
  id: string;
  outwardIssue: {
    fields: {
      status: {
        iconUrl: string;
        name: string;
      };
    };
    id: string;
    key: string;
    self: string;
  };
  type: {
    id: string;
    inward: string;
    name: string;
    outward: string;
  };
}
interface ProjectCategory {
  description: string;
  id: string;
  name: string;
  self: string;
}
interface Project {
  avatarUrls: AvatarUrls;
  id: string;
  insight: {
    lastIssueUpdateTime: string;
    totalIssueCount: number;
  };
  key: string;
  name: string;
  projectCategory: ProjectCategory;
  self: string;
  simplified: boolean;
  style: string;
}
interface Comment {
  author: Author;
  body: string;
  created: string;
  id: string;
  self: string;
  updateAuthor: Author;
  updated: string;
  visibility: {
    identifier: string;
    type: string;
    value: string;
  };
}
interface IssueLink {
  id: string;
  inwardIssue?: {
    fields: {
      status: {
        iconUrl: string;
        name: string;
      };
    };
    id: string;
    key: string;
    self: string;
  };
  outwardIssue?: {
    fields: {
      status: {
        iconUrl: string;
        name: string;
      };
    };
    id: string;
    key: string;
    self: string;
  };
  type: {
    id: string;
    inward: string;
    name: string;
    outward: string;
  };
}
interface Worklog {
  author: Author;
  comment: string;
  id: string;
  issueId: string;
  self: string;
  started: string;
  timeSpent: string;
  timeSpentSeconds: number;
  updateAuthor: Author;
  updated: string;
  visibility: {
    identifier: string;
    type: string;
    value: string;
  };
}
interface TimeTracking {
  originalEstimate: string;
  originalEstimateSeconds: number;
  remainingEstimate: string;
  remainingEstimateSeconds: number;
  timeSpent: string;
  timeSpentSeconds: number;
}
export interface JiraIssue {
  id: string;
  key: string;
  self: string;
  fields: {
    watcher: {
      isWatching: boolean;
      self: string;
      watchCount: number;
    };
    attachment: Attachment[];
    subTasks: SubTask[];
    description: string;
    project: Project;
    comment: Comment[];
    issuelinks: IssueLink[];
    worklog: Worklog[];
    updated: number;
    timetracking: TimeTracking;
  };
}
export interface JiraIssueResponse {
  issues: JiraIssue[];
}
