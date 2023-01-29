# Filter explain

The filter syntax grammar is:
  - This would be one `query`: `[name] [operator] [value]`
  - You can combine logic of multiple `query` via `&&`, `||`, `and`, `or`. You can also use parentheses, for example: `query_1 && (query_2 || query_3) && query_4`.
  - `[name]` is auto-suggested when you're typing like the below image
  <img src="/docs/filter-explain.png">
  
  - `[operator]` is: `==`, `!=`, `<`, `>`, `<=`, `>=`, `matches`, `not_matches`, `contains`, `not_contains`.
  - `[value]` can be anything: number, string, regex, null, etc.
  - However, `body` uses different engine than MongoDB because request and response body is too large to store in DB, so when querying `body`, `requestBody` and `responseBody`, you can only specify 1 type of body only.

Example queries:
  - `origin not_matches "split.io|sentry|googleapis" and path != "/api/v1/profile/user-notifications" and path != "/api/v1/notifications/count" and reflectedParameters != null`
  - `origin contains "facebook"`
  - `responseStatus != 200`
