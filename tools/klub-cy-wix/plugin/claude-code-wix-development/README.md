# Wix Development Expert for Claude Code

This package installs a Claude Code skill, the official remote Wix MCP endpoint, a 14-chapter Wix development corpus, compile-checked SDK and REST examples, a deterministic KLUB migration transformer, a detailed KLUB case study, and version-pinned official Wix replatform resources.

## Package Contents

| Component | Location | Purpose |
|---|---|---|
| Plugin manifest | `.claude-plugin/plugin.json` | Plugin identity and version |
| Local marketplace | `.claude-plugin/marketplace.json` | Local or Git-hosted installation catalogue |
| Wix MCP | `.mcp.json` | Connects the plugin to `https://mcp.wix.com/mcp` |
| Skill | `skills/wix-development-expert/SKILL.md` | Workflow router and operational guardrails |
| Corpus | `skills/wix-development-expert/references/` | RAG-ready Wix platform, API, CLI, Headless, app, MCP, AI, CMS, business, design, and migration references |
| Examples | `skills/wix-development-expert/templates/examples/` | MCP, SDK, REST, CI, prompt, and KLUB migration examples |
| Official Wix resources | `skills/wix-development-expert/templates/official-wix-replatform/` | Version-pinned official replatform skills, scripts, schemas, tests, license, and provenance |
| KLUB case study | `skills/wix-development-expert/templates/klub-case-study/` | Detailed source architecture, route/CMS/forms/design/execution analyses, analyzer, and structured evidence |
| Validation | `skills/wix-development-expert/scripts/` | Example validation scripts |

The plugin intentionally has no root `package.json`: the official Claude Code plugin contract requires a self-contained plugin directory and discovers skills, MCP configuration, and the optional `.claude-plugin/plugin.json` manifest directly.[1] A root Node package is needed only when the plugin itself has Node dependencies or build scripts. The isolated SDK, REST, and migration examples retain their own package manifests.

## Test Locally

Claude Code accepts either the plugin directory or its ZIP archive with `--plugin-dir`.[1] Run the following from the parent directory that contains `claude-code-wix-development`, or replace the relative path with an absolute path.

```bash
claude --plugin-dir ./claude-code-wix-development
# Equivalent from any working directory:
claude --plugin-dir /absolute/path/to/claude-code-wix-development
```

After Claude Code starts, invoke the skill explicitly if desired:

```text
/wix-development-expert:wix-development-expert
```

The skill is also model-invoked automatically when the request matches its description.

## Install from the Included Local Marketplace

From Claude Code, add the directory containing `.claude-plugin/marketplace.json`, then install the plugin from the `markos-wix-development` marketplace.[2] The relative command assumes Claude Code’s current working directory is the parent of `claude-code-wix-development`; otherwise use the absolute package path.

```text
/plugin marketplace add ./claude-code-wix-development
# Or: /plugin marketplace add /absolute/path/to/claude-code-wix-development
/plugin install wix-development-expert@markos-wix-development
```

If the installation summary asks for a reload, run:

```text
/reload-plugins
```

## Install from GitHub

Place this package at the root of a Git repository or adapt the marketplace `source` to the plugin’s subdirectory. Then run:

```text
/plugin marketplace add OWNER/REPOSITORY
/plugin install wix-development-expert@markos-wix-development
```

Claude Code copies installed marketplace plugins into its cache. Keep every referenced file inside this plugin directory; do not add dependencies on parent-directory files.[2]

## Validate

Use Claude Code’s current plugin validator before distribution:[1]

```bash
claude plugin validate ./claude-code-wix-development --strict
```

Validate the bundled examples without contacting Wix:

```bash
python3 skills/wix-development-expert/scripts/validate_examples.py
```

To compile-check the TypeScript examples, run `npm install && npm run typecheck` inside the bundled `templates/examples/sdk` and `templates/examples/rest` directories. The official replatform resources are supplied as pinned reference implementations; inspect their `SOURCE.json`, `LICENSE`, local skill instructions, dependencies, and script side effects before execution.

## Recommended First Tasks

```text
Use the Wix development expert skill. Compare Wix-managed Headless, self-managed Headless, and native Wix Studio for this repository. Do read-only discovery only.
```

```text
Use the Wix MCP to identify the correct API and retrieve its full method schema. Show the site/account scope, permissions, dry-run request, validation, and rollback. Stop before any write.
```

```text
Analyze this existing website and repository for migration to Wix-managed Headless. Produce a frozen source inventory, source-to-Wix mapping, and execution approval packet. Do not create a Wix site.
```

## Security

The plugin configures Wix’s official remote MCP endpoint but does not contain Wix credentials. Review and trust any connector before authentication. Confirm site creation, publication, bulk writes, destructive actions, domain changes, payment/billing operations, and other sensitive operations.

## References

[1]: https://code.claude.com/docs/en/plugins "Create plugins — Claude Code Docs"
[2]: https://code.claude.com/docs/en/plugin-marketplaces "Create and distribute a plugin marketplace — Claude Code Docs"
