# Wix Development Examples Library

This library contains validated configuration, TypeScript, REST, migration, CI, and prompt examples for Claude Code and Manus agents. Every example is designed to be copied and adapted only after the current Wix documentation or MCP method schema confirms the target operation.

| Area | Files | Purpose |
|---|---|---|
| MCP | `mcp/*.json`, `mcp/Tool_Routing.md` | Connect Claude Code or another MCP-compatible client and select the correct Wix tool class |
| SDK | `sdk/src/*.ts` | OAuth, API-key, and Wix-managed Headless CMS patterns |
| REST | `rest/src/*.ts` | A scope-aware Wix REST wrapper and cursor-pagination helper |
| Migration | `migration/src/build-klub-payloads.mjs` and manifests | Convert the KLUB JSON source into deterministic, idempotent import candidates without performing writes |
| CI | `ci/wix-preview.yml` | Install, validate, and build a Wix-managed Headless project; release remains approval-gated |
| Prompts | `prompts/Prompt_Library.md` | Schema-first Claude Code/Wix MCP workflows |
| Validation | `validation/validate_examples.py` | JSON, path, secret-placeholder, and migration-output checks |

## Safety Rule

These examples do not create a Wix site, publish, change DNS, process payment, or perform bulk writes. Keep Wix credentials in environment variables or the agent/MCP secret store. Retrieve the exact method schema before adapting a business API call.
