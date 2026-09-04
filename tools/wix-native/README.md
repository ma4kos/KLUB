# Native Wix rebuild

Specification and build sequence for rebuilding KLUB as a **native Wix site** — one Alex can restructure in the Wix editor without a developer.

| File | What it is |
|---|---|
| `build-wix-site-spec.mjs` | Generates the spec from `src/content/*.json`. Run it; don't hand-edit the output. |
| `klub-wix-site-spec.json` | The generated specification: theme, navigation, 8 homepage sections, 15 pages, 2 integrations, 24 media files. |
| `BUILD_SEQUENCE.md` | The ordered stages a Wix-connected agent executes, with an acceptance check per stage. |
| `verify-wix-site.mjs` | Read-only check of a built site against the spec. `node verify-wix-site.mjs <siteId>` — exits non-zero on any blocking failure. |

**Not to be confused with `tools/klub-cy-wix/`** — that is the older self-managed-headless migration kit, which targets a different site and a different architecture, and which this repository does not use.

Regenerate after any content change:

```bash
node tools/wix-native/build-wix-site-spec.mjs
```
