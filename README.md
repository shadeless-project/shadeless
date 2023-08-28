# Shadeless

Shadeless takes data from a Burp Extension called [Shadeless-Burp](https://github.com/shadeless-project/shadeless-burp), then visualize and allow users to query for intesting request/response that mainly support bug bounty hunters & blackbox testing, below are some features that Shadeless support:
- Multiple hunters can collaborate with each other.
- Query past HTTP req/res via understandable english grammar, for example:
    - Finding APIs that set cookie: `origin contains "<target_origin>" and responseHeader contains "Set-Cookie"`
    - Search for unrelated request: `origin not_matches "gstatic|hotjar|cdn"`
    - Simple stored xss check: `origin contains "<target_origin>" and reflectedParameters != null and responseHeader contains "text/html"`
- Able to delete undesirable req/res at ease.
- After queried at desired req/res, you can view req/res around that particular time (I call this feature as "time travel")
- By viewing the content of req/res, there's a button that generate `ffuf` command to fuzz that endpoint.
- By clicking on generating `ffuf` command, the server automatically acknowledge that we've tried fuzz that endpoint so it +1 to the `fuzzCnt` attribute of the api endpoint. => We can write query for non-fuzzed endpoint for example: `origin contains "<target_origin>" and fuzzCnt == 0`
- CAUTION: Because multiple hackers are storing data in the same place, their credentials may get leaked to each other. There's also a feature to "CENSOR" the req/res of AUTHENTICATION. However the credentials are still stored on Shadeless Database, which is inevitable :) 

- Demo hosted at: https://demo.shadeless.app/
- Documentation hosted at: https://docs.shadeless.app/
- Youtube tutorial: `to be updated`

Below is architecture of Shadeless

![shadeless drawio](https://user-images.githubusercontent.com/25105395/215317587-4a1b32b0-486b-46e0-8276-bfa9b75f4690.png)

## How to run (for dev only)

- 1: Check file docker-compose.yml
- 2: You can change the `DATABASE_URL` to another existed mongoDB.
- 3: run:

```sh
bash run.prod.sh
```

## Configure server's account

```
bash config_account.sh
```
