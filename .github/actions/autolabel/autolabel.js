const core = require('@actions/core');
const github = require('@actions/github');

try {
    const token = core.getInput("repo-token", { required: true });

    const client: ClientType = github.getOctokit(token);

    const pullRequest = github.context.payload.pull_request;

    const { data: pullRequest } = await client.rest.pulls.get({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: pullRequest.number,
    });

    await client.rest.issues.addLabels({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: pullRequest.number,
        labels: labels,
    });

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}
