# typescript-actions-learning

Following along with <https://dev.to/balastrong/create-a-custom-github-action-in-typescript-21ad>

_Hey, ts actions might be cool!_

## Dev Worklow Notes

### Changes require builds

When you make changes to the action, you need to rebuild it.

```bash
npm run package

# you'll be doing this a lot, so i recommend an alias:
alias nrp='npm run package'

# For permanence, set aliases in your ~/.bashrc or wherever your profile is.
```

> Note! The `package` script is defined in the `package.json` file. It runs a `build` script with several options. You may need to adjust based on your build process.

## Testing with ACT

## Install into the GitHub cli

`act` is a tool that allows you to run GitHub actions locally. It's a great way to test your actions before you push them to GitHub.

```bash
# obviously requires the gh cli to be installed:
brew install gh

# then install the act extension
gh extension install act

# you can also install act directly with homebrew:
# brew install act
# I don't know why, it just feels more 'right' to install it and have it coexist with gh
```

## Run the action

```bash
# The container arch param quiets a warning about the architecture of the act container on MacOS.
# The token param is automatically provided when running on GitHub, but you need to provide it locally.
# The gh cli is used to get the token.

gh act --container-architecture=linux/amd64 -s GITHUB_TOKEN="$(gh auth token)"

# I recommend you make an alias for this:
alias act='gh act --container-architecture=linux/amd64 -s GITHUB_TOKEN="$(gh auth token)"'
```

## Configure local environment for testing events

For testing PRs and other events, we have to provide a payload file. This is a JSON file that contains the event data that would be sent to the action by GitHub.

In this example, we're testing a PR event. The payload file looks like this. I just picked the top two commits and set the PR number to 1:

```json
{
  "pull_request": {
    "head": {
      "ref": "db1d7aa0d264edc6a44652b684685170097491ce"
    },
    "base": {
      "ref": "4aa71d7cd863bbc0941a79f64e3b1bfcb91e904b"
    },
    "number": 1
  }
}
```

Then, you can run the action with the event data:

```bash
# using the alias from above
# don't forget to rebuild after any .ts changes
act -e event.json
```
