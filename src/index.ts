import { getInput, setFailed } from '@actions/core';
import { context, getOctokit } from '@actions/github';

async function run() {
  const name = getInput('name');
  console.log(`Hello ${name}!`);

  const token = getInput('gh-token');
  const label = getInput('label');

  const octokit = getOctokit(token);
  const pullRequest = context.payload.pull_request;

  try {
    if (!pullRequest) {
      console.log('This action can only be run on Pull Requests');
      throw new Error('This action can only be run on Pull Requests');
    }
    else {
      console.log(`Adding label "${label}" to PR #${pullRequest.number}`);
    }

    await octokit.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pullRequest.number,
      labels: [label],
    });
  } catch (error) {
    setFailed((error as Error)?.message ?? 'Unknown error');
  }
}

run();