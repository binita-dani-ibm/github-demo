import Joi from "joi";
import { JiraError } from "../errors/jiraError";

// AvatarUrls schema
const avatarUrlsSchema = Joi.object({
  "16x16": Joi.string().uri().required(),
  "24x24": Joi.string().uri().required(),
  "32x32": Joi.string().uri().required(),
  "48x48": Joi.string().uri().required(),
});

// Define the schema for the 'priority' object
const prioritySchema = Joi.object({
  self: Joi.string().uri().required(),  // Validates that 'self' is a valid URL
  iconUrl: Joi.string().uri().required(),  // Validates that 'iconUrl' is a valid URL
  name: Joi.string().required(),  // Validates that 'name' is a non-empty string
  id: Joi.alternatives().try(Joi.string(), Joi.number()).required()  // 'id' can be a string or number
});


// Author schema
const authorSchema = Joi.object({
  accountId: Joi.string().required(),
  accountType: Joi.string().optional(),
  active: Joi.boolean().required(),
  avatarUrls: avatarUrlsSchema.required(),
  displayName: Joi.string().required(),
  key: Joi.string().optional(),
  name: Joi.string().optional(),
  self: Joi.string().uri().required(),
});

// Attachment schema
const attachmentSchema = Joi.object({
  author: authorSchema.required(),
  content: Joi.string().required(),
  created: Joi.string().isoDate().required(),
  filename: Joi.string().required(),
  id: Joi.number().required(),
  mimeType: Joi.string().required(),
  self: Joi.string().uri().required(),
  size: Joi.number().required(),
});

// SubTask schema
const subTaskSchema = Joi.object({
  id: Joi.string().required(),
  outwardIssue: Joi.object({
    fields: Joi.object({
      status: Joi.object({
        iconUrl: Joi.string().uri().required(),
        name: Joi.string().required(),
      }).required(),
    }).required(),
    id: Joi.string().required(),
    key: Joi.string().required(),
    self: Joi.string().uri().required(),
  }).required(),
  type: Joi.object({
    id: Joi.string().required(),
    inward: Joi.string().required(),
    name: Joi.string().required(),
    outward: Joi.string().required(),
  }).required(),
});

// ProjectCategory schema
const projectCategorySchema = Joi.object({
  description: Joi.string().allow(""),
  id: Joi.string().required(),
  name: Joi.string().required(),
  self: Joi.string().uri().required(),
});

// Project schema
const projectSchema = Joi.object({
  avatarUrls: avatarUrlsSchema.required(),
  id: Joi.string().required(),
  insight: Joi.object({
    lastIssueUpdateTime: Joi.string().isoDate().required(),
    totalIssueCount: Joi.number().required(),
  }).optional(),
  key: Joi.string().required(),
  name: Joi.string().required(),
  projectCategory: projectCategorySchema.optional(),
  self: Joi.string().uri().required(),
  simplified: Joi.boolean().required(),
  style: Joi.string().optional(),
  projectTypeKey: Joi.string().required()
});

// Comment schema
const commentSchema = Joi.object({
  author: authorSchema.optional(),
  body: Joi.string().optional(),
  created: Joi.string().isoDate().optional(),
  id: Joi.string().optional(),
  self: Joi.string().uri().required(),
  maxResults: Joi.number().required(),
  total: Joi.number().required(),
  startAt: Joi.number().required(),
  updateAuthor: authorSchema.optional(),
  updated: Joi.string().isoDate().optional(),
  visibility: Joi.object({
    identifier: Joi.string().required(),
    type: Joi.string().required(),
    value: Joi.string().required(),
  }).optional(),
  comments: Joi.array().items().optional(),
});

const statusCategorySchema = Joi.object({
  self: Joi.string().uri().optional(),
  id: Joi.number().optional(),
  key: Joi.string().optional(),
  colorName: Joi.string().optional(),
  name: Joi.string().optional(),
});

const statusSchema = Joi.object({
  self: Joi.string().uri().optional(),  // 'self' must be a valid URL
  description: Joi.string().allow("").optional(), // 'description' is optional, empty string is valid
  iconUrl: Joi.string().uri().optional(),  // 'iconUrl' must be a valid URL
  name: Joi.string().optional(),        // 'name' must be a string
  id: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),  // 'id' can be a string or number
  statusCategory: statusCategorySchema // The 'statusCategory' must follow the defined schema
}).required();


// Define the content structure (recursive if needed)
const contentSchema = Joi.array().items(
  Joi.object({
    type: Joi.string().valid("paragraph").required(),
    content: Joi.array().items(
      Joi.object({
        type: Joi.string().valid("text").required(),
        text: Joi.string().required()
      })
    ).required()
  })
);

// Define the schema for 'description'
const descriptionSchema = Joi.object({
  type: Joi.string().valid("doc").required(),
  version: Joi.number().valid(1).required(),  // Assuming version 1 is the only valid version
  content: contentSchema.required()
}).allow(null); 

const issueTypeSchema = Joi.object({
  self: Joi.string().uri().required(),
  id: Joi.string().required(),
  description: Joi.string().allow(""),
  iconUrl: Joi.string().uri().required(),
  name: Joi.string().required(),
  subtask: Joi.boolean().required(),
  avatarId: Joi.number().integer().required(),
  entityId: Joi.string().uuid().required(),
  hierarchyLevel: Joi.number().required()
});

// IssueLink schema
const issueLinkSchema = Joi.object({
  id: Joi.string().required(),
  self: Joi.string().uri().required(),
  inwardIssue: Joi.object({
    fields: Joi.object({
      summary: Joi.string().required(),
      status: Joi.object({
        self: Joi.string().uri().required(),
        description: Joi.string().allow(""),
        id: Joi.string().required(),
        iconUrl: Joi.string().uri().required(),
        name: Joi.string().required(),
        statusCategory: statusCategorySchema.required()
      }).required(),
      priority: {
        self: Joi.string().uri().required(),
        id: Joi.string().required(),
        iconUrl: Joi.string().uri().required(),
        name: Joi.string().required(),
      },
      issuetype: issueTypeSchema.required()
    }).required(),
    id: Joi.string().required(),
    key: Joi.string().required(),
    self: Joi.string().uri().required(),

  }).optional(),
  outwardIssue: Joi.object({
    fields: Joi.object({
      status: statusSchema,
      summary: Joi.string().optional(),
      priority: prioritySchema.optional(),
      issuetype: issueTypeSchema.required()
    }).required(),
    id: Joi.string().required(),
    key: Joi.string().required(),
    self: Joi.string().uri().required(),
  }).optional(),
  type: Joi.object({
    id: Joi.string().required(),
    inward: Joi.string().required(),
    name: Joi.string().required(),
    outward: Joi.string().required(),
    self: Joi.string().uri().required(),
  }).required(),
});

// Worklog schema
const worklogSchema = Joi.object({
  startAt: Joi.number().required(), // integer, minimum value 0
  maxResults: Joi.number().required(), // integer, minimum value 1
  total: Joi.number().required(), // integer, minimum value 0
  worklogs: Joi.array().items(Joi.object()).required() // array of objects (can be empty)
}).required() // The 'worklog' object is required

// TimeTracking schema
const timeTrackingSchema = Joi.object({
  originalEstimate: Joi.string().optional(),
  originalEstimateSeconds: Joi.number().optional(),
  remainingEstimate: Joi.string().optional(),
  remainingEstimateSeconds: Joi.number().optional(),
  timeSpent: Joi.string().optional(),
  timeSpentSeconds: Joi.number().optional(),
}).optional();


const creatorSchema = Joi.object({
  self: Joi.string().uri().required(),  // Must be a valid URL
  accountId: Joi.string().required(),   // 'accountId' must be a string
  emailAddress: Joi.string().email().required(),  // 'emailAddress' must be a valid email
  avatarUrls: avatarUrlsSchema,  // Validate avatarUrls using the avatarUrlsSchema
  displayName: Joi.string().required(),  // 'displayName' must be a string
  active: Joi.boolean().required(),  // 'active' must be a boolean (true/false)
  timeZone: Joi.string().valid("Asia/Calcutta").required(), // Optional: You can adjust the time zone validation
  accountType: Joi.string().valid("atlassian").required()  // 'accountType' must be 'atlassian'
}).required();

const progressSchema = Joi.object({
  progress: Joi.number().min(0).required(),  // 'progress' must be a number >= 0
  total: Joi.number().min(0).required()      // 'total' must be a number >= 0
});

const votesSchema = Joi.object({
  self: Joi.string().uri().required(),  // 'self' must be a valid URL
  votes: Joi.number().integer().min(0).required(),  // 'votes' must be a non-negative integer
  hasVoted: Joi.boolean().required()  // 'hasVoted' must be a boolean value (true/false)
}).required();

// JiraIssue schema
const jiraIssueSchema = Joi.object({
  id: Joi.string().required(),
  key: Joi.string().required(),
  self: Joi.string().uri().required(),
  expand: Joi.string().required(),
  fields: Joi.object({
    statuscategorychangedate: Joi.string().isoDate().required(),
    issuetype: issueTypeSchema.required(),
    fixVersions: Joi.array().items().optional(),
    timespent: Joi.string().allow(null),
    aggregatetimespent: Joi.string().allow(null),
    resolution: Joi.string().allow(null),
    resolutiondate: Joi.string().allow(null),
    created: Joi.string().allow(null),
    workratio: Joi.number().required(),
    issuerestriction: Joi.object({
      issuerestrictions: Joi.object(), // Empty object validation
      shouldDisplay: Joi.boolean().required() // shouldDisplay must be a boolean
    }).required(),
    lastViewed: Joi.string().allow(null),
    statusCategory: statusCategorySchema.required(),
    priority: prioritySchema.required(),
    labels: Joi.array(),
    status: statusSchema,
    components: Joi.array(),
    timeoriginalestimate: Joi.valid(null),
    aggregatetimeestimate: Joi.valid(null),
    security: Joi.valid(null),
    summary: Joi.string().required(),
    creator: creatorSchema,
    reporter: creatorSchema,
    watches: Joi.object({
      isWatching: Joi.boolean().required(),
      self: Joi.string().uri().required(),
      watchCount: Joi.number().required(),
    }).required(),
    attachment: Joi.array().items(attachmentSchema).required(),
    subtasks: Joi.array().items(subTaskSchema).required(),
    description: descriptionSchema,
    project: projectSchema.required(),
    comment: commentSchema.required(),
    issuelinks: Joi.array().items(issueLinkSchema).required(),
    worklog: worklogSchema.required(),
    updated: Joi.string().required(),
    timetracking: timeTrackingSchema.optional(),
    timeestimate: Joi.valid(null),
    aggregatetimeoriginalestimate: Joi.valid(null),
    versions: Joi.array(),
    assignee: Joi.valid(null),
    aggregateprogress: progressSchema,
    progress: progressSchema,
    environment: Joi.valid(null),
    duedate:  Joi.valid(null),
    votes: votesSchema,
    
  }).pattern(
    /^customfield_\d+$/,  // Pattern to match keys like 'customfield_1000001', etc.
    Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean(), Joi.valid(null), Joi.object(), Joi.array()) // Allowing string, number, or boolean values
  ),
});

// JiraIssueResponse schema
const jiraIssueResponseSchema = Joi.object({
  issues: Joi.array().items(jiraIssueSchema).required(),
  nextPageToken: Joi.string().allow(null),
});

// Example of how to validate an object with the CommitData schema
export const validateJiraIssue = (response: any) => {
  const { error, value } = jiraIssueResponseSchema.validate(response);
  if (error) {
    console.log(`error :::`, error);
    throw new JiraError("400", "Invalid response structure for Jira Issue API");
  }
  // You can also return the validated response if you want
  return value;
};