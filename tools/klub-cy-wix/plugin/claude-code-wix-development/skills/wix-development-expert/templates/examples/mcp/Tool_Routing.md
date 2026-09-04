# Wix MCP Tool Routing

Use `WixREADME` first for ordinary Wix management requests. Use documentation tools for read-only research and exact-schema confirmation. Resolve the account, site, and installed-app context before a site-scoped write.

| Intent | Preferred tool class | Required gate |
|---|---|---|
| Understand a workflow | `WixREADME` or business-flow documentation | None; read only |
| Find SDK/REST/Headless/app/WDS guidance | Matching documentation search tool | None; read only |
| Read a full article | `ReadFullDocsArticle` | None; read only |
| Confirm request/response fields | `ReadFullDocsMethodSchema` or REST spec search | Required before code or writes |
| Choose a site | `ListWixSites`, then site-context lookup | Confirm the selected site |
| Read or change site business data | `CallWixSiteAPI` for one request; `ExecuteWixAPI` for loops/pagination/chains | Present plan and obtain write approval |
| Create, update, publish, or otherwise manage a site at account scope | `ManageWixSite` | Sensitive-action confirmation |
| Upload media | Media upload tool | Confirm destination site, file count, and deduplication rule |

Never use account-level site management for per-site business data. Never infer a method contract from a documentation-search summary. Never send administrative credentials to frontend code.
