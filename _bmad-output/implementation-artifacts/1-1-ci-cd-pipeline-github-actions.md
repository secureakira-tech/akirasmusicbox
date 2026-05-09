# Story 1.1: CI/CD Pipeline (GitHub Actions)

Status: ready-for-dev

## Story

As the author,
I want a GitHub Actions CI workflow that runs on every push and pull request to main,
so that broken builds are caught before they reach the main branch and no bad code ships.

## Acceptance Criteria

1. `.github/workflows/ci.yml` exists at the repo root and is valid YAML.
2. Workflow triggers on `push` to main AND `pull_request` targeting main.
3. Workflow runs `npm ci`, `npx astro check`, `tsc --noEmit`, and `npm run build` — in that order.
4. Any failing step causes the entire workflow to fail (no `continue-on-error` anywhere in the file).
5. Workflow does NOT contain any deployment step (Vercel deploys independently via its GitHub App integration).
6. Node.js version is pinned to **20** (LTS, compatible with Astro 6 which requires Node 18+).
7. Workflow uses `actions/checkout@v4` and `actions/setup-node@v4`.
8. `setup-node` step enables npm caching (`cache: 'npm'`) to speed up runs.
9. No secrets, environment variables, or GitHub repository settings are required for the workflow to run.

## Tasks / Subtasks

- [ ] Task 1 — Create `.github/workflows/` directory structure (AC: 1)
  - [ ] Create directory: `.github/workflows/` at the repo root
  - [ ] Confirm no `.github/` directory already exists (fresh repo — it should not)

- [ ] Task 2 — Write `ci.yml` from the exact template in Dev Notes (AC: 1–9)
  - [ ] Copy the YAML content from the "ci.yml Content" section below verbatim
  - [ ] Confirm no `continue-on-error` key appears anywhere in the file
  - [ ] Confirm no `deploy`, `vercel`, or secret references appear anywhere in the file

- [ ] Task 3 — Validate YAML syntax locally (AC: 1)
  - [ ] Run: `python3 -m py_compile /dev/null && python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))" && echo "YAML OK"`
  - [ ] Alternatively: `npx js-yaml .github/workflows/ci.yml` (if Node is available)
  - [ ] Accept either: zero errors from a YAML linter, OR a successful GitHub Actions run on the next push

- [ ] Task 4 — Commit the workflow file (AC: 1–9)
  - [ ] Stage only `.github/workflows/ci.yml`
  - [ ] Write a signed commit (GPG signing is active after Story 1.0): `git commit -S -m "feat: add GitHub Actions CI workflow"`
  - [ ] Push to main (or open a PR — note: first CI run will fail because Astro is not yet initialized; this is expected and documented)

## Dev Notes

### Expected CI Failure Until Story 1.2

The Astro project has not been initialized yet (`src/`, `package.json`, `astro.config.mjs` do not exist). When this workflow runs after commit, the `npm ci` step will fail with "missing package.json". **This is intentional and expected.** The workflow is structural scaffolding. It becomes fully green after Story 1.2+ (Astro project initialization) creates `package.json` and the lockfile.

Do not attempt to make CI pass in this story. The goal is to have the workflow file in place so that the moment Astro is initialized, CI is already active.

### ci.yml Content

Create `.github/workflows/ci.yml` with exactly this content:

```yaml
name: CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Astro type check
        run: npx astro check

      - name: TypeScript type check
        run: npx tsc --noEmit

      - name: Build
        run: npm run build
```

### Why These Exact Choices

| Decision | Reason |
|---|---|
| `actions/checkout@v4` | Current stable major version as of 2025–2026 |
| `actions/setup-node@v4` | Current stable major version; supports `cache: 'npm'` |
| `node-version: '20'` | Astro 6 requires Node 18+; Node 20 is the current LTS with longer support window |
| `cache: 'npm'` | Caches `~/.npm` between runs; significantly faster CI on repeated pushes |
| `npx astro check` | Astro CLI is a local devDependency; `npx` resolves it from `node_modules/.bin` after `npm ci` |
| `npx tsc --noEmit` | TypeScript is a local devDependency installed by `npm create astro@latest --typescript strict`; `--noEmit` checks types without writing output files |
| `npm run build` | Runs `astro build` via the script defined in `package.json`; catches build-time errors |
| No `concurrency` group | Workflow is simple enough that concurrent runs are not a problem; don't add complexity without need |
| No `continue-on-error` | Any check failure must block merge — this is the entire purpose of CI |
| No deployment step | Vercel deploys via its own GitHub App integration; the CI workflow must not duplicate or conflict with it |
| No secrets | The build is fully static and public; no API keys, tokens, or environment variables are needed to run `npm ci` + type checks + `astro build` |

### What Each Step Catches

- **`npm ci`** — lockfile integrity; ensures `package-lock.json` is present and consistent with `package.json`; fails if someone forgot to commit the lockfile after adding a dependency
- **`npx astro check`** — type errors in `.astro` files, including frontmatter and template expressions; Astro's own type checker runs on top of TypeScript
- **`npx tsc --noEmit`** — TypeScript strict-mode errors in `.ts` and `.tsx` files; catches type errors in utilities, Content Collections schema, and component logic
- **`npm run build`** — full Astro static build; catches runtime errors that pass type checking but fail at build time (e.g., missing content, broken imports, MDX rendering errors)

### Step Ordering Rationale

`npm ci` must come first (installs everything). `astro check` before `tsc --noEmit` because Astro generates types (`.astro-sync` / `src/env.d.ts`) during its check pass; running `tsc` before Astro check can produce phantom errors on generated types. `npm run build` last because it is the most expensive step and only runs if all checks pass.

### Project Structure Notes

Files created in this story (relative to repo root):
```
.github/
  workflows/
    ci.yml              # GitHub Actions CI workflow
```

Files NOT created in this story:
- `package.json` — added in Story 1.2 (Astro project initialization)
- `package-lock.json` — generated by `npm create astro@latest` in Story 1.2
- `astro.config.mjs` — added in Story 1.2
- `tsconfig.json` — added in Story 1.2
- `src/` — added in Story 1.2
- Any deployment configuration — Vercel uses its own GitHub App, no file needed

### References

- Epic 1 story definition: `_bmad-output/planning-artifacts/epics.md` → E1-S1
- Architecture: `_bmad-output/planning-artifacts/architecture.md` → Build pipeline section
- NFR15: No broken builds reach main
- AR1: Project initialized correctly
- Astro 6 Node.js requirement: Node 18+ minimum; [Astro docs](https://docs.astro.build/en/install-and-setup/)
- `actions/checkout` latest: v4 — [github.com/actions/checkout](https://github.com/actions/checkout)
- `actions/setup-node` latest: v4 — [github.com/actions/setup-node](https://github.com/actions/setup-node)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List
