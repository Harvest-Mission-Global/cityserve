# Cityserve website

To run the website locally make sure you have `yarn` installed.

## Locally Run The Site

First time setup:

1. Run `yarn install` in the root directory of the project

To run the site locally do:

```
yarn start

```

Before you open a pull request, run `yarn verify`. It must print `VERIFY PASSED`.

## Working with AI coding agents

Agent rules are in `AGENTS.md`. Skills, sub-agents, and docs are in `.agents/`. OpenCode, Codex, and Claude Code find them automatically; any other tool should be told to read `AGENTS.md` first.

## Deployment

The site autodeploys whatever you push to GitHub.
