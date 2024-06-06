import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";

async function run() {
  const name = core.getInput("name");
  console.log(`Hello ${name}!`);

  const token = core.getInput("gh-token");
  core.info(`Token: ${token}`);
  const label = core.getInput("label");
  core.info(`Label: ${label}`);

  const octokit = getOctokit(token);
  const pullRequest = context.payload.pull_request;

  // action shouldn't run on anything other than PRs
  // bail early if this is not a pull request and somehow got here
  if (!pullRequest) {
    core.setFailed("No pull request found in the context.");
    return;
  }

  const pr_type = pullRequest.action;

  console.log("Pull Request:", pullRequest);
  core.info(`PR Type: ${pr_type}`);

  try {
    let action: 'addLabels' | 'removeLabel';

    // Use 'any' type for 'values' to allow flexible property assignment
    const values: any = {
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pullRequest.number
    }

    switch (pr_type) {
      case "opened":
        core.info(`Adding label "${label}" to PR #${pullRequest.number}`);
        action = 'addLabels';
        values.labels = [label];
        break;
      case "closed":
        core.info(`Removing label "${label}" from PR #${pullRequest.number}`);
        action = 'removeLabel';
        values.name = label;
        break;
      default:
        core.info("This action can only be run on Pull Requests");
        throw new Error("This action can only be run on Pull Requests");
    }

    await octokit.rest.issues[action](values)

  } catch (error) {
    core.setFailed((error as Error)?.message ?? "Unknown error");
  }
}

run();
