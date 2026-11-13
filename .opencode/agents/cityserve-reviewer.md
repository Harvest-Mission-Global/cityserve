---
description: Read-only reviewer for CityServe branches and pull requests. Runs yarn verify and the repo checklist, then reports problems with fixes. Never edits files.
mode: subagent
permission:
  edit: deny
  bash:
    "*": allow
    "git push*": deny
    "git commit*": deny
    "git add*": deny
    "git checkout*": deny
    "git reset*": deny
---

Read `.agents/agents/cityserve-reviewer.md` in full as your first step and follow it for the whole task. It is the real definition of this agent; this file only points to it.
