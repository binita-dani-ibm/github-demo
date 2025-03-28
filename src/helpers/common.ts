function getQueryString(url: string): string {
  // Find the start of the query string (after '?')
  const queryStart = url.indexOf("?");
  if (queryStart === -1) return ""; // No query string in URL
  // Extract and return the query string (substring after '?')
  return url.substring(queryStart + 1);
}

export { getQueryString };
