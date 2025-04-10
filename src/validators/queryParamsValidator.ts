import {
  objectSchema,
  _stateOptSchema,
  _stringOptSchema,
  _sortOptSchema,
  _headOptSchema,
  _perPageOptSchema,
  _integerOptSchema,
  _directionOptSchema,
} from "./schema";
import { GithubError } from "../errors/githubError";
import { logger } from "../wlogger";

// Create a schema for query parameters
const githubQuerySchema = objectSchema({
  per_page: _perPageOptSchema,
  page: _integerOptSchema,
  direction: _directionOptSchema,
  sort: _sortOptSchema,
  head: _headOptSchema, // Pattern matching for head (e.g., github:new-script-format)
  state: _stateOptSchema,
  base: _stringOptSchema,
});

// Function to validate the response
export function validateGithubQueryParams(response: any) {
  const { error, value } = githubQuerySchema.validate(response);
  if (error) {
    logger.error(`Invalid query parameters ${error.message}`);
    throw new GithubError("400", `Invalid query params:: ${error.message}`, "");
  }
  // You can also return the validated response if you want
  return value;
}
