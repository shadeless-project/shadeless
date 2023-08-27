# Shadeless

Shadeless is a visualization tool that takes data from a Burp Extension called [Shadeless-Burp](https://github.com/shadeless-project/shadeless-burp), with included the following features:
- UI & main purpose of Shadeless is to support blackbox testing / bug bounty hunters
- Multiple collaboration between bug bounty hunters at ease
- Query past HTTP req/res via understandable english grammar: `origin contains "viettel" and responseHeader contains "Set-Cookie"`, or `origin not_matches "gstatic|hotjar|cdn" and responseBody contains "e8c402ce81f5bce65d4799646d3485dc"`
- Able to delete undesirable req/res at ease.
- After queried at desired req/res, you can view req/res around that particular time (I call this feature as "time travel")
- By viewing the content of req/res, there's a button that generate `ffuf` command to fuzz that endpoint.
- CAUTION: Because multiple hackers are storing data in the same place, their credentials may get leaked to each other. There's also a feature to "CENSOR" the req/res of AUTHENTICATION. However the credentials are still stored on Shadeless Database, which is inevitable :) 
- And much more !

Demo hosted at: https://demo.shadeless.app/
Documentation hosted at: https://docs.shadeless.app/

Below is architecture of Shadeless

![shadeless drawio](https://user-images.githubusercontent.com/25105395/215317587-4a1b32b0-486b-46e0-8276-bfa9b75f4690.png)

Youtube tutorial: to be updated

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
