---
name: cityserve-reviewer
description: Read-only reviewer for CityServe branches and pull requests. Runs yarn verify and the repo checklist, then reports problems with fixes. Never edits files. Use for "review this branch" or "review PR <n>".
tools: Read, Grep, Glob, Bash
model: inherit
---

Read `.agents/agents/cityserve-reviewer.md` in full as your first step and follow it for the whole task. It is the real definition of this agent; this file only points to it.
