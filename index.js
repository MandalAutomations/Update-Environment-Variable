import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";

const repoId = getInput("RepoId");
const environmentName = getInput("EnvironmentName");
const name = getInput("Name").replace(/\s/g, '_');;
const value = getInput("Value");
const token = getInput("Token");

const octokit = getOctokit(token);

const getEnvironmentVariable = async () => {

    let url = `GET /repositories/${repoId}/environments/${environmentName}/variables/${name}`

    return octokit.request(url, {
        name: name
    })
}

const updateEnvironmentVariable = async (value) => {

    let url = `PATCH /repositories/${repoId}/environments/${environmentName}/variables/${name}`

    return octokit.request(url, {
        name: name,
        value: value
    })
}

const createEnvironmentVariable = async (value) => {

    let url = `POST /repositories/${repoId}/environments/${environmentName}/variables`

    return octokit.request(url, {
        name: name,
        value: value
    })
}

const existsEnvironmentVariable = async () => {
    let exists = false;

    try {
        const response = await getEnvironmentVariable()
        exists = (response.status === 200) ? true : false
    } catch (error) {
        exists = false
    }

    return exists
}

const run = async () => {
    try {
        const exists = await existsEnvironmentVariable();

        if (exists) {
            await updateEnvironmentVariable(value);
        } else {
            await createEnvironmentVariable((1).toString())
        }
    } catch (error) {
        setFailed(error.message);
    }
}

run();