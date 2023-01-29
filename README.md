# Shadeless centre

The data centre that store all web traffic under mongodb

More documentation can be found at:

- What is Shadeless: https://gist.github.com/phvietan/3f3507311436218b95dbbeee045daf9e
- How to use filter in Shadeless app: https://gist.github.com/phvietan/db95dbda1bb7ebb7dc15efae70905658

## How to run (for dev only)

- 1: Check file docker-compose.yml
- 2: Change the username and password for admin and operator. You can also change the `DATABASE_URL` to another existed mongoDB.
- 3: run:

```sh
bash run.prod.sh
```