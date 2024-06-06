import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";

async function run() {
  const name = core.getInput("name");
  console.log(`Hello ${name}!`);

  const token = core.getInput("gh-token");
  const label = core.getInput("label");

  const octokit = getOctokit(token);
  const pullRequest = context.payload.pull_request;

  console.log("Pull Request:", pullRequest);

  try {
    if (!pullRequest) {
      core.info("This action can only be run on Pull Requests");
      throw new Error("This action can only be run on Pull Requests");
    } else {
      core.info(`Adding label "${label}" to PR #${pullRequest.number}`);
    }

    await octokit.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pullRequest.number,
      labels: [label],
    });
  } catch (error) {
    core.setFailed((error as Error)?.message ?? "Unknown error");
  }
}

run();
