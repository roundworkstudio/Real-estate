# GitHub Issues Guide

Read this at the start of every chat. It defines how work on this project is tracked in GitHub Issues and Milestones. Follow it exactly; do not improvise a different system.

- **Repository:** `roundworkstudio/Real-estate`
- **Project:** Property with Janvi — website for Janvi, property consultant in Abu Dhabi and Dubai
- **Tooling:** GitHub MCP server (`user-github` namespace) for issues and comments; GitHub CLI (`gh`, signed in as `roundworkstudio`) for labels and milestones, which the MCP tools can't create. Commits and pushes go through `git` in the terminal.

---

## 1. Core rules

1. **No work without an issue.** Every change to the code or content belongs to an open issue. If none exists, create it before writing code.
2. **One issue = one outcome.** An issue describes one result a reviewer can verify (e.g. "WhatsApp hover fill covers full-width buttons"). Split anything with two unrelated outcomes.
3. **Every issue has a milestone, one type label, one area label and one priority label.** No exceptions.
4. **Search before creating.** Run `search_issues` / `list_issues` for the topic first. Update an existing issue rather than creating a duplicate.
5. **Keep issues current, not historical.** When scope changes, edit the issue body and acceptance criteria; explain the change in a comment.
6. **Never invent facts.** Anything about Janvi, prices, licences, sales figures or legal text that isn't confirmed goes into an issue labelled `blocked: client` with the exact question to ask.
7. **No secrets.** Never put tokens, passwords, personal phone numbers of buyers or private client data in issues or comments.
8. **The human decides commits and pushes.** Only commit or push when asked. Reference the issue in every commit message (see section 6).

---

## 2. Start-of-chat routine

Do this before any other work:

1. `list_issues` with `state: OPEN` and `fields: [number, title, labels]` to see open work.
2. `ui_get` with `method: milestones` to see milestone names, numbers and progress.
3. Identify which issue(s) today's request belongs to. Tell the human, in one line, which issue you are working on, e.g. "Working on #14 (Projects collage on desktop), milestone Design consistency."
4. If the request has no issue, create it (section 4) and say so.

---

## 3. Milestones

Milestones are phases of the project, worked through roughly in this order. An issue belongs to exactly one.

| # | Milestone | Done when |
|---|-----------|-----------|
| 1 | **Launch blockers** | No fake or placeholder content is visible, every button and form does what it says, legal details (BRN, ORN, address, privacy policy) are real. |
| 2 | **Client content** | Real bio, portrait, track record, sold homes, testimonials, listing descriptions and neighbourhood notes are in place. Mostly `blocked: client` until Janvi supplies them. |
| 3 | **Design consistency** | Spacing, containers, buttons, hovers and the liquid-glass style are consistent across every page, mobile and desktop. |
| 4 | **SEO & performance** | Every page has its own title, description and share image; one `h1` per page; images optimised. |
| 5 | **Launch** | Domain connected, final QA passed, site live. |
| 6 | **Post-launch** | Ongoing improvements, e.g. WhatsApp broadcast list, new listings, Insights updates. |

Rules:

- The `#` column is the milestone **number** to pass to `issue_write`. Confirm with `ui_get` (`method: milestones`) if in doubt; never guess.
- Don't create new milestones without the human's approval. When approved: `gh api repos/roundworkstudio/Real-estate/milestones -f title="…" -f description="…"`.
- When the last open issue in a milestone is closed, tell the human, and with their approval close it: `gh api -X PATCH repos/roundworkstudio/Real-estate/milestones/<number> -f state=closed`.

---

## 4. Labels

Each issue gets **one type, one area and one priority** label. Status labels are added only when they apply.

**Type**

| Label | Use for |
|-------|---------|
| `bug` | Something is broken or behaves incorrectly |
| `enhancement` | New feature or capability |
| `design` | Visual, layout, spacing or motion change |
| `copy` | Wording change with no new facts |
| `content` | Real information from the client (bio, prices, photos, licences) |
| `chore` | Cleanup, refactor, dependencies, config |
| `documentation` | Docs and guides like this one |

**Area**

`area: home` · `area: properties` · `area: projects` · `area: insights` · `area: about` · `area: contact` · `area: sitewide`

**Priority**

| Label | Meaning |
|-------|---------|
| `P0` | Blocks launch or misleads buyers. Do first. |
| `P1` | Clearly hurts quality or conversion. Do this milestone. |
| `P2` | Polish. Do when P0/P1 are clear. |

**Status (optional)**

| Label | Meaning |
|-------|---------|
| `blocked: client` | Waiting on information from Janvi. The issue body must list the exact questions. |
| `needs decision` | Waiting on a design or product decision from the human. |

All labels above already exist in the repo. Use only these; don't invent new ones. If a genuinely new label is needed, ask the human first, then create it with `gh label create "<name>" --color <hex> --description "<text>" -R roundworkstudio/Real-estate`.

---

## 5. Writing an issue

**Title:** short, specific, imperative. Describe the outcome, not the activity.

- Good: `Make WhatsApp hover fill cover full-width buttons`
- Good: `Show photo collage beside project details on desktop`
- Bad: `Fix buttons` · `Projects page` · `Hover stuff`

**Body template** (use these headings, omit any that are empty):

```markdown
## Problem
What is wrong or missing, where, and who it affects (mobile/desktop, page).

## Goal
The result we want, in one or two sentences.

## Acceptance criteria
- [ ] Specific, checkable condition
- [ ] Another condition (include mobile and desktop where relevant)

## Out of scope
What this issue deliberately does not cover.

## Questions for Janvi
(Only for `blocked: client`.) Numbered, plain-English questions ready to send.

## Notes
Files, links, screenshots, related issues (#12).
```

**Creating:** `issue_write` with `method: create`, `owner: roundworkstudio`, `repo: Real-estate`, `title`, `body`, `labels`, `milestone`, and `assignees: ["roundworkstudio"]`.

**Large pieces of work:** create a parent issue for the overall goal and attach child issues with `parent_issue_number` (or `sub_issue_write`). Each child still follows every rule above.

---

## 6. Working an issue

**When you start**

- Add a comment with `add_issue_comment`: `Started. Plan: …` (one to three lines).

**While working**

- Tick acceptance criteria in the body as they are met (`issue_write`, `method: update`, edited `body`).
- If scope changes, update the body and add a comment saying what changed and why.
- If you discover a separate problem, create a new issue for it instead of expanding the current one. Mention it in a comment: `Found #23 while working on this.`
- If blocked, add the right status label and a comment with the exact blocker.

**Commit messages** (only when the human asks for a commit)

- Reference the issue: `Make WhatsApp hover fill cover wide buttons (#14)`.
- Use `Fixes #14` in the commit message only when the commit fully completes the issue. GitHub then closes it automatically when pushed to `main`.
- One commit may reference several issues: `… (#14, #15)`.

---

## 7. Closing an issue

Close only when every acceptance criterion is met and the change has been verified. Before closing, add a final comment:

```markdown
Done.
- What changed: one or two lines, plain English
- Files: `src/app/developments/page.tsx`, `src/app/globals.css`
- Verified: how (typecheck, lint, browser check on mobile/desktop, measurements)
- Commit: abc1234 (or "not committed yet")
```

Then `issue_write` with `method: update`, `state: closed`, `state_reason: completed`.

Other closures:

- Won't do: `state_reason: not_planned`, with a comment explaining why.
- Duplicate: `state_reason: duplicate` and `duplicate_of: <number>`.

If work is finished but not yet committed, leave the issue open with the "Done" comment and say "awaiting commit". Close it once the commit exists.

---

## 8. End-of-chat routine

Before the final reply of every chat:

1. Every issue touched today has an up-to-date body, ticked criteria and a progress or closing comment.
2. Any new problems found today have their own issues.
3. Report to the human in a short list: issues created, updated and closed (with numbers and links), and milestone progress (e.g. "Launch blockers: 6 of 9 closed").

---

## 9. Tool reference (`user-github`)

| Task | Tool | Key arguments |
|------|------|---------------|
| List open issues | `list_issues` | `state: OPEN`, `labels`, `fields` |
| Find by topic | `search_issues` | natural-language query |
| Read one issue | `issue_read` | `issue_number` |
| Create / update / close | `issue_write` | `method`, `title`, `body`, `labels`, `milestone`, `state`, `state_reason` |
| Comment | `add_issue_comment` | `issue_number`, `body` |
| Edit a comment | `update_issue_comment` | comment id, `body` |
| Child issues | `sub_issue_write` | parent and child numbers |
| Milestones / labels (read) | `ui_get` | `method: milestones` or `labels` |
| Link to code | `list_commits`, `get_commit` | branch or SHA |

Always pass `owner: roundworkstudio` and `repo: Real-estate`. If a tool call fails because of authentication, call `mcp_auth` for `user-github` once, then retry.

**GitHub CLI (`gh`)**, for what the MCP tools can't do. Only with the human's approval:

| Task | Command |
|------|---------|
| Create a label | `gh label create "<name>" --color <hex> --description "<text>" -R roundworkstudio/Real-estate` |
| Create a milestone | `gh api repos/roundworkstudio/Real-estate/milestones -f title="…" -f description="…"` |
| Set a milestone due date | `gh api -X PATCH repos/roundworkstudio/Real-estate/milestones/<n> -f due_on=2026-11-30T00:00:00Z` |
| Close a milestone | `gh api -X PATCH repos/roundworkstudio/Real-estate/milestones/<n> -f state=closed` |
| Milestone progress | `gh api repos/roundworkstudio/Real-estate/milestones --jq '.[] \| "\(.number) \(.title): \(.closed_issues)/\(.open_issues + .closed_issues) closed"'` |

If `gh` reports it isn't logged in, ask the human to run `gh auth login`; never ask for or handle a token.
