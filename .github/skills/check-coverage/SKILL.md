---
name: check-coverage
description: Checks whether a test flow (by name and CSV column set), a reusable code capability (e.g. HTTP client, auth handling, a page object), or a JSON Schema file already exists in the framework's manifest, before test-generator creates new files. Use before generating any script, class, helper, or payload-validation logic, to decide reuse vs. creation vs. asking the user.
disable-model-invocation: false
user-invocable: true
---

# Purpose

Answer one of three questions for the calling agent, without ever requiring a
live scan of the codebase:
1. Is this **flow** already covered, and if so, exactly or partially?
2. Does a **reusable utility/helper** already exist that covers a capability
   the new code needs (HTTP client, auth header builder, logger, a specific
   page's Page Object, etc.)?
3. Does a **JSON Schema** already exist for this flow, for payload validation?

All three answers come from the manifest file, not from searching files. The
manifest is the maintained context — reading it is a fixed, small cost no
matter how many runs have happened before this one; re-scanning `core/` or
`business/` on every run is not, and this skill exists specifically so the
calling agent never has to.

# Procedure — Flow Coverage

1. Read `.github/skills/check-coverage/manifest.json`.
2. Look up the incoming flow name in `manifest.flows`.
3. If found, compare the manifest's recorded column list against the incoming
   CSV's columns:
   - Identical sets → `matchType: "exact"`.
   - Overlapping but not identical → `matchType: "partial"`, list the
     differences.
4. If not found by exact flow name, do a light search for a similarly-named
   existing script or class (same underlying screen/endpoint, different flow
   label) before concluding it's genuinely new. Only fall back to a broader
   repository search if the manifest itself looks stale — e.g. a listed file
   path no longer exists.
5. Return the result in the Flow Output Contract below. Do not return prose.

# Procedure — Utility Overlap

1. Read `.github/skills/check-coverage/manifest.json`.
2. Look up the incoming capability description against `manifest.utilities`
   entries' `purpose` field (e.g. incoming: "needs an HTTP client with auth
   headers" → look for a utility whose purpose says the same thing).
3. If a clear match exists, return it as reusable.
4. If nothing in the manifest matches, only then is a targeted search
   justified — and it should be targeted (e.g. check the one file a matched
   utility claims to live at, to confirm it's still there), not an open-ended
   scan of `core/`/`business/`. If still nothing found, report `create-new`.
5. Return the result in the Utility Output Contract below.

# Procedure — Schema Existence

This answers *only* "does a schema exist for this flow" — a lookup, not a
judgment. It never determines whether a payload is valid; that's a separate,
deterministic check the generated test itself performs at run time (see
`test-generator.agent.md`).

1. Read `.github/skills/check-coverage/manifest.json`.
2. Look up the incoming flow name in `manifest.schemas`.
3. If found, return its path as reusable.
4. If not found, do not infer or fabricate a schema from the CSV's column
   names — a schema built that way is just an assumption wearing a schema's
   shape, not a real contract. Report `found: false` and let the calling
   agent decide whether to ask the user (see test-generator's procedure).
5. Return the result in the Schema Output Contract below.

# Flow Output Contract

```json
{
  "checkType": "flow",
  "covered": true,
  "matchType": "exact",
  "existingFile": "business/TransferService.js",
  "existingFlow": "API_Transfer",
  "diff": {
    "newColumns": [],
    "missingColumns": []
  },
  "recommendation": "reuse"
}
```

`recommendation` is one of: `"reuse"`, `"reuse-with-modification"`,
`"create-new"`.

If nothing is found:
```json
{
  "checkType": "flow",
  "covered": false,
  "matchType": null,
  "existingFile": null,
  "existingFlow": null,
  "diff": null,
  "recommendation": "create-new"
}
```

# Utility Output Contract

```json
{
  "checkType": "utility",
  "found": true,
  "name": "HttpClient",
  "path": "core/http-client.js",
  "purpose": "shared HTTP client with auth header injection",
  "recommendation": "reuse"
}
```

If nothing is found:
```json
{
  "checkType": "utility",
  "found": false,
  "name": null,
  "path": null,
  "purpose": null,
  "recommendation": "create-new"
}
```

# Schema Output Contract

```json
{
  "checkType": "schema",
  "found": true,
  "flow": "API_Transfer",
  "path": "schemas/API_Transfer.schema.json"
}
```

If nothing is found:
```json
{
  "checkType": "schema",
  "found": false,
  "flow": "API_Transfer",
  "path": null
}
```

# Notes

- This is a lookup skill, not a generator. It never writes or modifies files
  — only reads the manifest and reports.
- The manifest is the source of truth for flows, utilities, and schemas. Keep
  it accurate: the calling agent (`test-generator`) is responsible for
  updating it after generation — the `flows` entry, any new `utilities`
  entry, and any new `schemas` entry — in the same action as writing the
  code, never as a follow-up.
- The `utilities` list is expected to stay small even at high run counts: it
  grows with the number of distinct reusable pieces in the codebase, not
  with the number of times this agent has been invoked. If it's growing
  roughly as fast as your run count, that's a signal reuse isn't actually
  happening and is worth investigating on its own.
