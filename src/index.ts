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

  const pr_type = pullRequest.state;
  const pr_number = pullRequest.number;

  // console.log("Pull Request:", pullRequest);
  core.info(`PR Type: ${pr_type}`);
  core.info(`PR Number: ${pr_number}`);

  try {
    let action: 'addLabels' | 'removeLabel';

    // Use 'any' type for 'values' to allow flexible property assignment
    const values: any = {
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pr_number
    }

    switch (pr_type) {
      case "open":
        action = 'addLabels';
        values.labels = [label];
        break;
      case "closed":
        action = 'removeLabel';
        values.name = label;
        break;
      default:
        core.info("This action can only be run on Pull Requests");
        throw new Error("This action can only be run on Pull Requests");
    }

    core.info(`Running "${action}" on label "${label}" on PR #${pr_number}`);
    await octokit.rest.issues[action](values)

  } catch (error) {
    core.setFailed((error as Error)?.message ?? "Unknown error");
  }
}

run();
