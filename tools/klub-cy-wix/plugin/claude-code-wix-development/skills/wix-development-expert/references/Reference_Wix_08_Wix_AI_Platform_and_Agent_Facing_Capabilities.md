# Wix AI Platform and Agent-Facing Capabilities

**Purpose.** This chapter explains the Wix features that help AI agents build or manage Wix projects and the Wix APIs that add AI functionality to a site or app. These are different layers. The **Wix MCP, Wix plugin, and Wix Skills** help an external AI client work with Wix. The **Wix AI APIs** let application code call supported AI models through Wix. The **AI Credits API** reports the credit wallet that funds eligible Wix AI use. **Semantic Search** and **Dynamic Site Context** expose documentation and site/account context to tools. **AI Site-Chat** is a visitor-facing business solution with its own APIs.[1]

**Freshness rule.** Model lists, plugin commands, tool names, AI-credit costs, quotas, plan entitlements, preview status, and product availability are date-sensitive. Retrieve the current official page or method schema before implementation. This chapter was verified on **2026-09-02**.

## 1. Capability Map

| Layer | Primary consumer | What it does | What it does not guarantee |
|---|---|---|---|
| Wix MCP | Claude, Claude Code, Cursor, Copilot, Windsurf, n8n, and other MCP clients | Searches Wix docs, retrieves schemas, guides code, calls Wix APIs, and manages supported site/account operations | It does not remove authentication, permissions, approvals, or method-specific limits |
| Wix plugin | Supported AI clients | Bundles Wix Skills and Wix MCP | It is not a separate Wix site runtime |
| Wix Skills | AI coding agents | Supplies workflow instructions for Wix apps, Headless, design, management, and docs | Instructions alone do not grant live Wix access |
| Machine-readable docs and Semantic Search | AI assistants and developer tools | Provides current documentation indexes, Markdown pages, and ranked search results | Search snippets are not full method schemas |
| Dynamic Site Context | Authenticated agent or integration | Returns aggregated account/site discovery context | Context is not authorization and can contain sensitive information |
| Wix AI APIs | Wix site/app code | Provides Wix-authenticated, Wix-billed access to supported text, embeddings, and image-generation paths | Preview APIs and supported model IDs can change |
| AI Credits API | Apps, account owners, dashboards, control logic | Reads recurring and top-up credit balances and breakdowns | It does not purchase credits or guarantee a requested AI action will succeed |
| AI Site-Chat APIs | Wix sites using the AI Site-Chat app | Configures chat, retrieves conversations/messages, and reports statistics | It requires the relevant app and method-specific identity/context |

Wix’s AI tools overview is the canonical entry point for these distinctions.[1]

## 2. Wix MCP

The Wix MCP is Wix’s Model Context Protocol server. Once configured in a compatible AI client, it can search Wix documentation, retrieve full articles and API schemas, generate or guide Wix code, call supported Wix APIs on a selected site, and perform supported account/site-management actions.[2]

### 2.1 Remote Configuration

For clients that support remote HTTP MCP, Wix documents this basic configuration:[2]

```json
{
  "mcpServers": {
    "wix-mcp": {
      "type": "http",
      "url": "https://mcp.wix.com/mcp"
    }
  }
}
```

The official Wix Claude Code plugin can provide the server automatically. A direct Claude Code configuration can also be added through the current CLI command documented by Wix.[2] The bundled skill package includes `.mcp.json` and example connector configurations under `templates/examples/mcp/`.

An API-key configuration is possible for clients and automation contexts that support custom headers. Treat that as a privileged server-side integration. Store the key in the client’s secret facility or environment; do not hardcode it into a repository. Confirm the account ID, site access, scopes, and whether the MCP operation will be read-only or mutating before use.[2]

### 2.2 Tool Families and Routing

Current Wix MCP documentation describes four broad capabilities: documentation search/read, Wix code guidance, site API calls, and account/site management.[2] The connected client may expose more specific tool names, such as documentation search, full-article retrieval, full-method-schema retrieval, site listing, site API calls, site management, media upload, or support/feedback. Tool names and schemas can change; ask the client to list the connected tools or use the server’s routing/readme method before assuming a name.

Use this operating sequence:

1. Identify the requested business outcome and Wix development path.
2. Search the correct documentation family: REST, SDK, Velo, Wix Design System, Build Apps, Wix Headless, CLI, business solutions, overview, or skills.
3. Read the full concept article when architecture or prerequisites matter.
4. Retrieve the full method schema when an API call is required.
5. Resolve account, site, environment, installed apps, identity, and permissions.
6. Execute reads and report scope plus pagination.
7. For writes, prepare a dry-run approval packet containing target, method, data count, idempotency, validation, and rollback limitation.
8. Execute only after the required approval and read back the changed state.

A search result is a discovery artifact, not authority to generate a request. Pagination helpers do not waive rate limits. A successful API response does not prove a rendered site, booking, checkout, or migration is complete.

## 3. Wix Plugin and Wix Skills

The official Wix plugin adds both Wix Skills and the Wix MCP to supported AI clients.[3] This pairing combines durable instructions with live documentation and API access. The plugin is therefore the preferred ongoing setup in a supported coding client, while a direct Wix MCP configuration is useful when plugin support is unavailable or only live docs/APIs are needed.[4]

Wix Skills are self-contained instruction sets for Wix development workflows.[5] The official Wix repository includes skill areas for Wix app development, Wix design system work, site management, Wix docs, Wix Headless, and related replatforming workflows. Skills should be treated as workflow contracts, not static API references. A method name in a skill still needs verification against the current API schema.

The Headless AI toolkit distinguishes four acquisition paths:[4]

| Option | Best use |
|---|---|
| Reference the Wix Headless skill URL | Start a one-off Wix-managed Headless build without installing a plugin |
| Install the Wix plugin | Ongoing work that needs both skills and live MCP access |
| Install Wix Skills only | Use official workflow instructions without connecting live Wix tools |
| Configure Wix MCP only | Use live docs/APIs in a client without plugin support |

Installation syntax can change across Claude Code, Cursor, Codex, and VS Code. Use the current client-specific instructions on the Headless AI toolkit or Wix plugin page instead of relying on an old screenshot or cached command.[4]

## 4. AI-Friendly Documentation and Semantic Search

Wix documents a machine-readable index at `dev.wix.com/docs/llms.txt`, a concatenated corpus at `dev.wix.com/docs/llms-full.txt`, and Markdown versions of documentation pages by appending `.md` to the page URL.[1] [6] These are high-value acquisition paths for corpus construction and agent retrieval because they avoid scraping presentation markup; obtain them through the current documented export path rather than assuming ordinary browser navigation will render them.

The Docs Search API provides semantic search across Wix REST, SDK, Velo, Wix Design System, Build Apps, Headless, CLI, and business-solution documentation.[7] It offers structured JSON results and a Markdown result designed for direct LLM input. The Markdown method can limit lines per result; truncated results include a hint to the full content.[8]

Use structured JSON when a program must rank, filter, or display results. Use the Markdown response when passing compact context to a model. In both cases, follow the returned full-article or full-schema link before implementation.

```http
POST https://www.wixapis.com/mcp-docs-search/v1/docs/search/markdown
Authorization: <AUTH>
Content-Type: application/json

{
  "search_term": "create booking",
  "document_type": "REST",
  "maximum_results": 6,
  "lines_in_each_result": 20
}
```

The current schema supports document-type scoping and bounded result sizes.[8] Do not infer that all results share the same runtime, identity, maturity, or package.

## 5. Dynamic Site Context

Dynamic Site Context retrieves aggregated context for the caller’s account and sites. Current fields can include site IDs and display names, publication and premium status, editor type, namespace, installed apps, Velo status, locale/time zone/currency, selected CMS collection schemas, and Headless OAuth apps. Results use cursor pagination and can be filtered by one site ID or exact display name.[9]

This API is valuable for an AI agent’s discovery phase: it can distinguish Studio, classic Editor, Vibe, Headless, development, or editorless sites; see whether relevant apps are installed; understand CMS field shapes; and avoid asking for IDs that are already available.

> Dynamic Site Context is discovery, not permission. The response can include account display names, contact email, phone, URLs, CMS schemas, and other sensitive operational data.[9]

Minimize requested scope, do not persist the response by default, redact PII from logs, and never expose it to untrusted prompts. Resolve duplicate site names with IDs. Page through all results only when the task genuinely needs an account-wide inventory.

## 6. Wix AI APIs

The Wix AI APIs provide access to supported provider APIs while Wix handles Wix-side authentication and billing. The official overview currently marks the capability as **Developer Preview**.[10] For app development, the Wix app needs the relevant AI-model invocation permission; the caller also needs a supported Wix identity.[10]

Current documentation describes text generation, embeddings, and image generation, with SDK integration built on the Vercel AI SDK and REST base URLs under `www.wixapis.com`.[10] Provider and model support changes. List models through the documented provider endpoint and use the exact returned model ID. Do not preserve a static model recommendation as if it were permanent.

### 6.1 SDK Shape

A current SDK flow installs the Vercel `ai` package and `@wix/ai`, imports the required provider module, then calls a Vercel AI SDK method such as `generateText()`, `streamText()`, `embed()`, `embedMany()`, or `generateImage()`.[10] [11]

```ts
import { generateText } from 'ai';
import { openai } from '@wix/ai';

const { text } = await generateText({
  model: openai.responses(process.env.WIX_AI_MODEL_ID!),
  prompt: 'Summarize the supplied product facts without inventing claims.',
});
```

Treat this as a pattern, not a pinned model selection. Validate the provider method and model ID live. Apply application-level controls for prompt injection, data minimization, output validation, cost ceilings, abuse prevention, timeouts, retries, and observability.

### 6.2 Billing and AI-Credit Caution

Wix states that each AI API method call uses **approximately one AI credit**.[10] “Approximately” is not a fixed pricing contract. Check the current AI API page, account plan, support documentation, and credit balance before enabling a costly feature. Do not promise a per-image, per-token, or per-message price unless the current official source explicitly provides it.

When extending a site, Wix billing reflects eligible usage by the site’s owner, collaborators, members, and visitors. When building a Wix app, Wix describes billing the Wix users who install the app rather than requiring the app developer to implement separate AI billing.[10] Confirm the live commercial terms before launch.

## 7. AI Credits API

The AI Credits API reads an account’s AI credit wallet. The wallet can include recurring credits that replenish according to a period and one-time top-up credits that do not reset.[12] The current API is accessed with an API key. Response scope depends on access: account-level access covers the account, while site-level access can return the site-context credit/subscription view; when both exist, the account-level balance is returned.[12]

The `getBalance()` response can include:[13]

| Field | Meaning |
|---|---|
| `periodicCredits.balance` | Remaining recurring credits |
| `periodicCredits.cap` | Maximum recurring credits per relevant period |
| `topUpCredits.balance` | Remaining one-time top-up credits |
| `topUpCredits.cap` | Maximum top-up allocation represented |
| `creditBalanceBreakdown[]` | Per-source allocations and usage rules; not additional credits |
| `usageRules[].period` | Replenishment period or no period |
| `usageRules[].resetDate` | Next reset where applicable |
| Plan/subscription metadata | Plan name, tier, renewal, and allocation association where returned |

Use the balance to display account state or gate a nonessential AI action. Do not assume a missing field equals zero without checking the schema. Do not subtract the aggregate and breakdown as if they were separate wallets. The breakdown represents detail for the same aggregate balances.[13]

```ts
import { aiCredits } from '@wix/ai-credits';

const balance = await aiCredits.getBalance();
```

Self-hosted SDK use requires a Wix client configured with the applicable API-key strategy and account or site context.[13] A balance check is read-only; purchasing top-ups, changing a plan, or accepting a charge is a separate sensitive operation and requires explicit user action through the appropriate Wix flow.

## 8. AI Site-Chat APIs

Wix AI Site-Chat is a visitor-facing chatbot business solution. Its API family currently combines four services:[14]

| Service | Role |
|---|---|
| Widget Settings | Configures availability, behavior, welcome/suggested content, contact forms, avatar, and presentation |
| Conversations | Retrieves visitor conversation state and IDs |
| Messages | Creates and retrieves messages, including bulk operations where supported |
| Statistics | Reports aggregate chat KPIs and comparison periods |

A site must have the Wix AI Site-Chat app installed. Current documentation states that the app is available only in the Wix Editor; verify this limitation at implementation time.[14] Conversations and Messages depend on visitor or member identity because the caller’s site visitor must be identified. Statistics are read-only and site-scoped.[14]

Do not confuse AI Site-Chat with the general Wix AI APIs. Site-Chat has its own app, settings, conversations, quotas, messages, analytics, and availability rules. General AI API text generation does not automatically create or configure a Site-Chat experience.

## 9. Claude Code and Agent Workflow

For Claude Code, the strongest setup is the official Wix plugin or the packaged Wix development plugin supplied with this corpus. The official Wix plugin can add Wix Skills and the Wix MCP, while this custom package adds a larger reference corpus, schema-first guardrails, compile-checked examples, and the KLUB migration workflow.[3] [4]

Use this prompt structure for reliable Wix agent work:

```text
Goal: <business outcome>
Target: <account/site/project and environment>
Context: <site, app, managed Headless, self-managed Headless>
Interface: <MCP, SDK, REST, CLI, browser>
Discovery: read-only until the method and schema are confirmed
Output: architecture/code/dry-run/validation evidence
Write gate: stop before <site creation, import, publish, domain, billing>
```

For API work, instruct the agent to retrieve the full method schema, not merely search. For a migration, require a frozen source inventory, source-to-Wix map, deterministic payloads, approval packet, idempotent writes, read-back, rendered parity tests, and rollback.

## 10. Security, Privacy, and Cost Controls

| Risk | Required control |
|---|---|
| Wrong site/account | Resolve and display immutable IDs before writes |
| Overprivileged connector | Minimum scopes and site access; separate read and write identities where practical |
| Prompt injection from site/docs/user content | Treat retrieved content as data; enforce an operation allowlist and independent approval |
| PII leakage from Dynamic Site Context or chat | Minimize fields, redact logs, restrict retention, and apply access controls |
| Unexpected AI credit use | Check live balance, apply per-action limits, require confirmation for material usage |
| Model drift | List supported models and pin an approved exact ID with a review date |
| Hallucinated Wix methods | Full schema retrieval, typed code, and read-only validation |
| Destructive MCP action | Dry-run impact, explicit confirmation, idempotency, read-back, and rollback limitation |
| Site-Chat identity error | Use visitor/member context as required; do not substitute API-key admin blindly |

An MCP connection is equivalent to giving an AI client tools. Review the server, authentication method, and scopes. Require confirmation before site creation, publication, bulk writes, destructive changes, domains/DNS, payment/billing, or other material external effects.

## 11. Operational Troubleshooting

| Problem | Diagnosis |
|---|---|
| Wix MCP tools are absent | Confirm the plugin/MCP is enabled, reload the client, and list connected tools |
| MCP authentication opens the wrong account | Log out/reconnect according to the current Wix troubleshooting instructions, then verify account/site IDs |
| Documentation search gives the wrong runtime | Set the document type and read the full result |
| AI method returns unsupported model | Call the current model-list method and use the exact returned ID |
| AI call is forbidden | Check identity, app `INVOKE AI MODELS` permission where applicable, site/account context, and preview access |
| Credit balance is missing or partial | Check API-key access and whether the call is account- or site-scoped |
| Dynamic context is incomplete | Page with the returned cursor; confirm filters and permissions |
| Site-Chat calls fail | Verify app installation, product availability, required visitor/member identity, quota, and method schema |

After two distinct targeted recovery attempts, preserve the exact sanitized error, request ID, method, identity, target, and attempted fixes. Do not cycle credentials or broaden permissions randomly.

## 12. Agent Retrieval Checklist

| Check | Required evidence |
|---|---|
| Tool layer | MCP/plugin/skill versus runtime AI API/business API |
| Current documentation | Live article or full method schema and verification date |
| Target | Immutable Wix account/site/app/project identifiers |
| Identity and auth | Visitor, member, Wix user, Wix app, or API-key admin; OAuth/API key/host auth |
| Installed prerequisites | Wix app, plugin, skill, CLI, SDK packages, or Site-Chat app |
| Read/write class | Read-only discovery or mutating operation with approval |
| AI economics | Current credit rule, balance, plan/entitlement, and action ceiling |
| Privacy | PII fields requested, logging, retention, and redaction |
| Model status | Provider, exact current model ID, preview/deprecation state |
| Validation | Type checks, API read-back, rendered/business-flow tests, and recorded limitations |

## References

[1]: https://dev.wix.com/docs/api-reference/articles/ai-tools/about-ai-tools "About AI Tools for Wix Developers"
[2]: https://dev.wix.com/docs/api-reference/articles/ai-tools/wix-mcp/about-the-wix-mcp "About the Wix MCP"
[3]: https://dev.wix.com/docs/api-reference/articles/ai-tools/about-the-wix-plugin "About the Wix Plugin"
[4]: https://dev.wix.com/docs/go-headless/get-started/headless-ai-toolkit "Headless AI Toolkit"
[5]: https://dev.wix.com/docs/api-reference/articles/ai-tools/about-wix-skills "About Wix Skills"
[6]: https://dev.wix.com/docs/api-reference/articles/ai-tools/about-ai-tools#machine-readable-documentation "Wix machine-readable documentation guidance"
[7]: https://dev.wix.com/docs/api-reference/tools/semantic-search/introduction "Wix Docs Semantic Search introduction"
[8]: https://dev.wix.com/docs/api-reference/tools/semantic-search/search-documents-markdown "Search Wix documentation as Markdown"
[9]: https://dev.wix.com/docs/api-reference/tools/dynamic-site-context/get-dynamic-context "Get Dynamic Context"
[10]: https://dev.wix.com/docs/api-reference/articles/ai-tools/ai-apis/about-the-wix-ai-apis "About the Wix AI APIs"
[11]: https://dev.wix.com/docs/api-reference/articles/ai-tools/ai-apis/set-up-the-wix-ai-sdk "Set up the Wix AI SDK"
[12]: https://dev.wix.com/docs/api-reference/account-level/ai-credits/introduction "About the AI Credits API"
[13]: https://dev.wix.com/docs/api-reference/account-level/ai-credits/get-balance "Get AI credit balance"
[14]: https://dev.wix.com/docs/api-reference/business-management/ai-site-chat/introduction "About the AI Site-Chat APIs"
