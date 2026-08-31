---
applyTo: "core/**", "business/**", "test/**", "data/**", "schemas/**", "config/**", "reports/**", "playwright.config.ts", "tsconfig.json", "package.json"
---

# Test automation conventions

These apply only when Copilot (any agent, any chat request) is working with
files under `core/`, `business/`, `test/`, `config/`, or the root
`playwright.config.ts` / `package.json`. They do not apply elsewhere in the
repo — do not treat these as general project-wide rules.

## Language
TypeScript for all test automation code in this repo. `@types/node` is a
required devDependency, not optional — without it, Node built-ins (`node:fs`,
`node:path`, etc.) fail to type-check, not just show an editor warning.

## Test framework
Playwright (`@playwright/test`) for both API and UI scripts. API scripts use
Playwright's `request` context; UI scripts use `page`.

## Design principles
- SOLID and DRY apply to all generated business/page-object code.
- Modular design: one class per file, one file per screen (Page Object) or
  business operation (Business Model).

## Patterns
- **Logger: Winston, never `console.log`.** A `console.log`-based logger has
  no levels, no structured output, and nothing to plug into log aggregation
  later — not acceptable for a production-grade framework. Use Winston,
  wrapped in a Singleton (one instance per process, not re-instantiated per
  test), with structured JSON output. Log level is environment-driven — read
  from `config/<env>.json` (e.g. `debug` in `qa`, `warn`/`error` only in
  `uat`), not hardcoded.
- Other shared services (e.g. DB client, HTTP client) follow the same
  Singleton pattern as the logger.
- Manage connection lifecycles explicitly (open/close symmetrically) rather
  than relying on garbage collection; prefer a wrapper that guarantees cleanup
  even on failure (try/finally, or Node's `using` declarations where
  available).
- **Generated test data that creates records (a transfer, a user) must be
  unique per run**, not a fixed value reused every time — parallel execution
  against shared UAT/QA data will otherwise collide across runs. Use
  `core/date-utils.ts` (a timestamp/random-suffix helper) for this; Business
  Model classes call it when building a payload that creates data, they
  don't generate their own ad hoc uniqueness logic per flow.

## Folder structure
```
core/               # config loader, logger, http/browser clients, connection
                      #   helpers, fixtures.ts, endpoints.ts,
                      #   api-response-handler.ts, csv-loader.ts,
                      #   schema-validator.ts, date-utils.ts (test-data uniqueness)
business/
  api/               # Business Model classes, e.g. TransferApi.ts
  pages/             # Page Object classes, e.g. LoginPage.ts, plus BasePage.ts
                      #   (shared cross-cutting Page Object behavior)
test/
  <flowName>/        # grouped by flow, not flat — e.g. test/login/login.spec.ts,
                      #   test/login/login-negative.spec.ts
data/                # CSVs: API_<flow>.csv, UI_<flow>.csv — this is the one,
                      #   locked-down location; never tests/data/ or any other path
schemas/             # JSON Schema per API flow: schemas/API_<flow>.schema.json
config/
  .env.qa, .env.uat, .env.prod  # secrets only — gitignored, never committed
  qa.json, uat.json, prod.json  # non-secret values: baseURL, retry defaults
reports/
  html-report/       # HTML reporter output
  allure-results/    # Allure raw results (report generation is a human/CI step)
playwright.config.ts # master config entry point, reads config/<env>.json, sets
                      #   use.baseURL; prod requires an explicit confirm flag
tsconfig.json         # TypeScript compiler config
package.json         # test:api / test:ui scripts + @types/node, ajv,
                      #   allure-playwright, dotenv
```

## Output Allow-list
A spec file under `test/` may contain **only**: a `test.describe` block, a
loop over already-loaded data, calls to fixture-provided objects/methods,
and the `test()` calls themselves. Treat this as an allow-list, not a
checklist of things to avoid — anything not on this list doesn't belong in a
spec, regardless of whether it happens to match a previously-known bad
pattern. Each of these has a designated home instead:

| Found in a spec file | Belongs in |
|---|---|
| `page.locator(...)` | The relevant Page Object |
| Hardcoded `http://`/`https://` | `playwright.config.ts` (`use.baseURL`) + relative paths |
| `new Ajv(...)` or any validator setup | `core/schema-validator.ts` |
| CSV parsing / row-mapping | `core/csv-loader.ts` |
| `if` statements deciding pass/fail | `core/api-response-handler.ts` |
| `import ... from '@playwright/test'` | `core/fixtures.ts` instead |

## CSV Loading
- CSVs live at `data/API_<flow>.csv` or `data/UI_<flow>.csv` — this is the
  one, locked-down location. Never `tests/data/`, never any other path; two
  different generated specs have already used two different paths for the
  same purpose, which is exactly the kind of drift this rule exists to stop.
- `core/csv-loader.ts` is **generic** — it reads a CSV path and returns
  `Record<string, string>[]`, built dynamically from whatever header row the
  file has. It must never hardcode a specific flow's field names.
- Flow-specific typing (a `GameListRequest` interface, parsing `"1"`/`"0"`
  into a boolean, etc.) lives in the Business Model that consumes the
  loader's output — one layer up, not inside the loader. Moving
  flow-specific parsing into its own file doesn't make it generic; only
  removing the flow-specific knowledge does.

## Page Objects
- Live in `business/pages/`. Page Objects encapsulate **actions**, not just
  locators. A `login(username, password)` method performs the whole
  fill/fill/click sequence internally — a spec calling `.fill()` through
  exposed locators three times is still the spec doing the orchestration,
  just with the locators relocated. The method is the unit a spec calls, not
  the individual element interactions.
- `business/pages/BasePage.ts` holds cross-cutting Page Object behavior
  (e.g. a shared wait-for-load helper, a shared screenshot-on-demand method)
  — anything genuinely common to every screen, not duplicated into each
  Page Object individually. Every specific Page Object extends it.
- Generated specs live in `test/<flowName>/`, grouped by flow — not flat in
  `test/`. Separate scenario types get separate files within that folder
  (e.g. `test/login/login.spec.ts`, `test/login/login-negative.spec.ts`),
  matching the flow/scenario-type naming convention the CSV files already
  follow.

## Fixtures
- `core/fixtures.ts` defines a custom `test`/`expect` (via Playwright's
  `test.extend()`) that auto-injects Business Model/Page Object instances,
  `core/api-response-handler.ts`, `core/schema-validator.ts`, config, and
  logger as ready-to-use parameters. Every generated spec imports from here,
  never directly from `@playwright/test` — this is what stops each test from
  manually constructing its own copy of everything it needs, and what gives
  each test its own instance instead of sharing one module-scope instance
  across an entire `describe` block (a real test-isolation risk once tests
  run in parallel).

## Assertion Architecture
- **Test spec files call handlers; they never contain the correctness logic
  themselves.** A spec should read like "call the API/page action, then ask
  the handler if the result was correct" — not a series of `if` statements
  deciding pass/fail inline.
- `core/api-response-handler.ts` is generic and shared across all API flows
  — status-code success/failure checking, error-message-expectation
  checking, and content-type/body validation are the same questions
  regardless of which flow is being tested, so this logic is written once
  and reused, not reinvented per flow.
- `core/schema-validator.ts` is the same idea for schema checking: a shared
  class wrapping Ajv (schema path + payload in, validation result out). No
  spec file ever calls `new Ajv()` or `ajv.compile()` directly.
- **Never hardcode a per-test-case exception by ID** (e.g. `if
  (data.TestCaseID === 'TC006')`) inside a spec or a handler. If a row
  genuinely needs different expected behavior, that belongs in the CSV as
  an explicit column (e.g. `ExpectedStatusCodes`) that the handler reads —
  not a fact hidden inside code that only works because of one specific ID
  string.
- Expected-outcome comparisons use a named constant/enum (e.g.
  `ExpectedResult.PASS`), never a raw string literal like `'pass'` compared
  ad hoc in generated code.

## Config
- `playwright.config.ts` is the actual master config entry point (Playwright's
  native mechanism — `baseURL`, `projects`, `retries`, `reporter`, etc.). It
  reads its environment-specific values from `config/<env>.json` rather than
  hardcoding them, and sets `use: { baseURL }` from that environment's value.
- **UI navigation uses relative paths only** — `page.goto('/')`,
  `page.goto('/inventory')` — never a hardcoded `https://...` string
  anywhere in `business/` or `test/`. Playwright resolves relative paths
  against `use.baseURL` automatically; a hardcoded absolute URL bypasses
  that mechanism entirely and is the same category of problem as a
  duplicated endpoint path (see below), just for UI instead of API.
- **Secrets vs. non-secret config are split across two file types, never
  mixed:**
  - `config/.env.<env>` (`.env.qa`, `.env.uat`, `.env.prod`) — service
    account credentials and any other secret, loaded via `dotenv`. These
    files are gitignored; never committed, never in plaintext in a file
    that reaches version control.
  - `config/<env>.json` (`qa.json`, `uat.json`, `prod.json`) — non-secret,
    structured values only: base URL, default retry count, etc.
    **Endpoint paths never live here** — a path like `/api/transfer` is
    identical in every environment, so it belongs once in
    `core/endpoints.ts`, referenced by Business Model classes, not
    duplicated into every environment's config file (duplication here means
    every path change requires touching every environment file, and risks
    them silently drifting apart).
- **`prod` is a supported environment, but not an equal-footing one.**
  `qa` and `uat` run with a plain `--project=<env>` flag. Running against
  `prod` additionally requires an explicit confirmation flag (e.g.
  `--project=prod --confirm-prod`) — `playwright.config.ts` should refuse to
  resolve a prod run without it. This isn't about distrust of any one
  person; it's a guard against a copy-pasted command or an unset default
  accidentally targeting production at a bank.
- **Default run configuration:** if the user runs the suite with no CLI
  arguments at all, the framework must still run using sane defaults — a
  default environment (e.g. `qa`, never `prod`), default browser/project,
  and default retry count. Define these explicitly in `playwright.config.ts`;
  don't leave "no args passed" as an undefined/crash state, and never let
  the no-args default resolve to `prod`.
- Run-time CLI flags (e.g. `--project=uat`) override the active environment's
  config values for that run — never edit config files at run time to change
  environment.
- **The generated framework must remain manually runnable from the command
  line** (e.g. `npx playwright test`, or an `npm run test:api` / `npm run
  test:ui` script) — this is a framework requirement, not something the
  generation agent itself does. The agent authors these commands into
  `package.json` but never executes them (see the agent's own
  no-execution constraint). These exact commands and config file references
  are what later get lifted, unchanged, into the GitHub Actions / Jenkins
  pipeline once the deployment phase happens — so name and structure them
  as if a pipeline will reference them verbatim, not as scratch commands.

## Reporting
- `playwright.config.ts` must configure reporters — without this, no report
  exists after any run, which is the exact gap that leaves a tester with
  nothing to review. Reporter output goes to `reports/`, not the tool
  defaults scattered at the repo root.
- **HTML reporter** → `reports/html-report/`, for human review, with
  `screenshot: 'only-on-failure'` and `trace: 'retain-on-failure'` — a
  failing case needs to come with actual evidence (screenshot/trace), not
  just a red line with no context.
- **JUnit XML reporter**, for later CI pickup (GitHub Actions/Jenkins both
  read this format natively for PR-level pass/fail reporting).
- **Allure reporter** (`allure-playwright`) → `reports/allure-results/` (raw
  results). Generating the browsable Allure report from those results
  (`allure generate`) typically requires a Java runtime via the
  `allure-commandline` package — this is an execution step, so it's
  something a human or CI runs, never the agent itself. Worth confirming
  Java availability in whatever environment will actually generate the
  report before this becomes a blocker later.
- Reports and logs must never contain sensitive data in plaintext — mask or
  omit account numbers, auth tokens, and other PII from both the log output
  and anything written into a report or trace.

## Schema Validation
- **API payloads are validated against a real JSON Schema at test-run time —
  never approved by agent judgment at generation time.** Validation goes
  through `core/schema-validator.ts` (see Assertion Architecture) — a spec
  never instantiates Ajv directly; it calls
  `schemaValidator.validate(schemaPath, payload)` and asserts on the result.
- Schemas live in `schemas/`, one file per API flow:
  `schemas/API_<flowName>.schema.json`.
- **Never generate a schema from a CSV's column names.** A schema inferred
  from column headers only encodes "these fields exist," not the actual
  contract (types, required fields, enums, nesting) — it would validate
  against itself and catch nothing real. If no schema exists for a flow, that
  is a stop-and-ask case, not a generate-one-anyway case.
- UI flows do not have a payload schema in this sense — schema validation
  applies to API flows only.

## Data-driven rules
- CSV column headers map 1:1 to payload/data keys.
- Every column must have an explicit value in generated code — no dropped or
  implicitly-undefined fields. Use `null` or `"NA"` for intentionally absent
  values.
- A row needing non-default expected behavior (e.g. an unusual expected
  status code) gets an explicit column for it (e.g. `ExpectedStatusCodes`) —
  never a hardcoded per-row exception in generated code (see Assertion
  Architecture above).

## Naming
- Classes: `PascalCase`
- Filenames: `kebab-case.ts`
- CSV files: `API_<flowName>.csv` or `UI_<flowName>.csv` (prefix or suffix
  determines script type)

## Note
This is an early iteration phase. Keep implementations basic and readable —
favor clarity over premature abstraction. The patterns above are directional
and expected to be revised as the framework matures.
