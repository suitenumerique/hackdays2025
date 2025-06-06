# hack-day-all-in-one
## Getting started 🔧
## Step 2
### Test it

You can test Docs on your browser by visiting this [demo document](https://impress-preprod.beta.numerique.gouv.fr/docs/6ee5aac4-4fb9-457d-95bf-bb56c2467713/)

### Run Docs locally

> ⚠️ The methods described below for running Docs locally is **for testing purposes only**. It is based on building Docs using [Minio](https://min.io/) as an S3-compatible storage solution. Of course you can choose any S3-compatible storage solution.

**Prerequisite**

Make sure you have a recent version of Docker and [Docker Compose](https://docs.docker.com/compose/install) installed on your laptop, then type:

```shellscript
$ docker -v

Docker version 20.10.2, build 2291f61

$ docker compose version

Docker Compose version v2.32.4
```

> ⚠️ You may need to run the following commands with `sudo`, but this can be avoided by adding your user to the local `docker` group.

**Project bootstrap**

The easiest way to start working on the project is to use [GNU Make](https://www.gnu.org/software/make/):

```shellscript
$ make bootstrap FLUSH_ARGS='--no-input'
```

This command builds the `app` container, installs dependencies, performs database migrations and compiles translations. It's a good idea to use this command each time you are pulling code from the project repository to avoid dependency-related or migration-related issues.

Your Docker services should now be up and running 🎉

You can access to the project by going to <http://localhost:3000>.

You will be prompted to log in. The default credentials are:

```
username: impress
password: impress
```

📝 Note that if you need to run them afterwards, you can use the eponym Make rule:

```shellscript
$ make run
```

⚠️ For the frontend developer, it is often better to run the frontend in development mode locally.

To do so, install the frontend dependencies with the following command:

```shellscript
$ make frontend-development-install
```

And run the frontend locally in development mode with the following command:

```shellscript
$ make run-frontend-development
```

To start all the services, except the frontend container, you can use the following command:

```shellscript
$ make run-backend
```
## Step 2

## Prerequisites
- Python 3.8+
- pip

## Installation

1. After cloning the repository
```bash
cd hack-day-all-in-one/backend
```

2. Create and activate virtual environment
```bash
python -m venv venv
venv\Scripts\activate
```

3. Install dependencies
```bash
cd ..
pip install -r requirements.txt
```


## Launch

1. Run the application
```bash
python api.py
```
