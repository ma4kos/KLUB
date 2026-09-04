# Wix Development: CMS, Data, Media, Forms, CRM, Members, and Migrations

**Purpose:** Provide authoritative, RAG-ready patterns and API boundaries for Wix CMS, Data, Media, Forms, CRM, Members, and migration strategies.
**Audience:** Claude Code, Manus agents, and AI development systems orchestrating Wix tasks.
**Last-Researched Date:** 2026-09-02
**Retrieval Keywords:** Wix CMS, Wix Data, Wix Media, Wix Forms, Wix CRM, Wix Members, Wix Migrations, Headless, Astro, replatform, idempotent import, crosswalk, collections, permissions.

## 1. Core Architecture and Context Boundaries

Wix separates administrative site management (admin context) from storefront/visitor operations (visitor/member context). Development can occur within three primary environments, each dictating specific responsibilities for the developer and the platform.

### Native Wix Studio
The native Wix Studio environment offers a visual editor-first approach. Developers use Velo (the `$w` API) to implement full-stack logic, interact with site elements, and add custom behaviors. In this environment, Wix completely manages the infrastructure, hosting, and scaling. Developers can write server-side code in web modules and call them directly from the frontend, ensuring a seamless integration between the visual UI and complex backend workflows [1].

### Wix-Managed Headless
Wix-managed Headless is the recommended path for new code-first projects. It is a paradigm where the source is already a code-first frontend, high visual fidelity matters, and the goal is to move hosting plus business services into Wix. When a project is scaffolded using the Wix CLI, it defaults to using Astro. The Wix Astro integration automatically configures authentication, visitor sessions, member logins, and built-in SEO support. Wix manages the build, release, hosting on a global CDN, automatic SSL certificates, deploy previews, and secrets management. This significantly reduces the initial setup overhead while preserving the existing frontend mental model [2] [3].

### Self-Managed Headless
Self-managed Headless is designed for developers who require full control over their framework, hosting, and infrastructure, or when an existing Wix site must remain the backend while the frontend stays on external hosting. In this architecture, the developer assumes full responsibility for the project's lifecycle, including provisioning hosting, configuring CI/CD pipelines, scaling infrastructure, and implementing analytics. Furthermore, the developer must explicitly choose and implement an authorization strategy (OAuth for visitors/members or API keys for admin access) and manually implement all SEO tags, sitemaps, and consent management logic [4] [5].

### Agent Context Verification
Before executing writes or assuming the availability of specific business solutions, an AI agent should retrieve the current Dynamic Site Context when its identity and access permit. The structured response can include installed apps, site status, URL, locale, editor metadata, and selected CMS schemas. Treat it as sensitive discovery data, not authorization, and page the response when an account-wide inventory is required.

```bash
curl -sS -X POST 'https://www.wixapis.com/_api/dynamic-context/v1/dynamic-context' \
  -H 'Authorization: <AUTH>' \
  -H 'Content-Type: application/json' \
  --data-raw '{"siteId": "<site-guid>"}' | jq
```

## 2. Content Management and Data Operations

Manage structured content with the Wix CMS, allowing you to store, query, and display data programmatically or using no-code features. The Wix ecosystem distinguishes between the user-facing CMS and the programmatic Data API.

### Wix CMS vs. Wix Data API
- **Wix CMS:** The Content Management System is where site owners manage content such as text, media, videos, products, and booking services. It seamlessly integrates with Wix's site-building tools, providing a user-friendly interface for creating and editing content.
- **Data API:** The Data API allows developers to access and manipulate CMS and external content programmatically. It enables the creation, reading, updating, and deletion of data directly from code.

### Collection Design and Relations
When designing CMS collections, it is crucial to use explicit field types and preserve relations through reference fields. This ensures data integrity and allows for complex querying.

- **Pagination:** Wix APIs primarily use two pagination strategies: Cursor-based pagination and Offset/Limit pagination. Always prefer cursor-based pagination for large datasets, Search methods, and V3 APIs. Relying on `offset` or `skip` for deep pagination on large datasets is considered a fragile pattern and should be avoided [6].
- **Quotas and Limits:** Each Wix site can have a maximum of 1,000 collections and 10 million collection items. These items can take up no more than 100 GB of storage space. Note that these quotas apply to CMS collection storage; Wix Media has separate storage considerations [7].
- **External Databases:** Wix allows connection to external databases (e.g., MySQL, Google Cloud, AWS), enabling the integration of data from other sources using the same APIs and no-code features used with native Wix data [1].

### Performance and Optimization
To avoid RPM (Requests Per Minute) throttling when interacting with the Data API, developers should implement request batching and add delays between rapid requests. During client-side rendering, utilize the Warmup Data API to pass the results of server operations to the client-side code, preventing the client from performing the same expensive operations again [1].

## 3. Media, Forms, CRM, and Members

### Wix Media
Media assets, including images and videos, must be handled correctly during migrations and content creation. Assets must be uploaded to the Wix Media Manager to obtain a new, internal URL format (e.g., `wix:image://...`). This upload process is a prerequisite; media must be imported and URLs generated before importing CMS content that references those media assets [8].

### Forms and CRM Integration
Wix provides a robust, native integration between its Forms app and the Wix CRM, facilitating seamless lead capture and contact management.

- **Wix Forms:** The Wix Forms app allows for the quick setup of various form types, including contact, payment, multi-step, and subscription forms. It includes built-in GDPR compliance tools (consent fields) and native CAPTCHA for spam protection. Forms automatically connect to dedicated collections for storing submission data [9] [10].
- **Wix CRM:** Submissions through Wix Forms automatically create or update contacts within the Wix CRM (Inbox). The CRM centralizes contact management and deduplicates contacts based on email addresses [10].
- **Automations:** Form submissions can trigger Wix Automations, replacing custom notification scripts. These automations can send notifications to site admins or confirmation emails to users [10].
- **Custom Forms:** In scenarios where native Wix Forms lack required fields, success-state parity, or specific consent workflows, developers may use a custom headless form handler using Wix APIs. However, this custom handler MUST ensure it creates the intended Wix CRM state and respects the underlying business contracts [11].

### Members and Authentication
Authentication strategies differ significantly between the managed and self-managed paths, impacting how member data is handled.

- **Wix-Managed Headless:** When utilizing the Astro integration, visitor sessions, member logins, and token management are handled automatically behind the scenes. Developers can call Wix SDK methods directly without client-side setup [3].
- **Self-Managed Headless:** Developers must explicitly implement an authorization strategy. For customer-facing applications utilized by anonymous visitors and logged-in members, the OAuth strategy is required. A Headless Client must be set up in the site's dashboard to obtain a client ID. **Crucially**, if the frontend redirects visitors to Wix-hosted pages (e.g., for login), the frontend's domain must be explicitly added to the allowed redirect domains and authorization redirect URIs in the Headless Settings to prevent blocked redirects [4].
- **Member Approval:** Site owners can configure member creation to require manual approval. In this state, a newly created member receives a `PENDING` status and cannot log in until their status is changed to `APPROVED` [12].

## 4. Migration Patterns and Execution

Migrating an existing website or platform to Wix requires a structured, rigorous approach. Wix’s replatform supervisor encodes this as a resumable pipeline with authoritative artifacts, idempotent writes, source-identity deduplication, approval gates, and aggregate completion evidence rather than relying on chat history or a single completion claim [13].

### The End-to-End Migration Pipeline

1. **Intake and Destination Pinning:** The first phase involves resolving the source URL, intended delivery mode, migration scope, and destination ownership. The delivery mode must be classified (e.g., frontend only, backend only, or integrated). Exactly one destination must be pinned once approved. Creating a second destination because context was lost is strictly forbidden [13].
2. **Read-Only Source Discovery:** Capture the source through both repository analysis and browser-backed evidence. Browser-backed extraction is mandatory because HTML-only acquisition cannot reliably capture responsive layouts, interactions, lazy assets, or rendered content. The discovery phase must produce a frozen manifest hash covering routes, content, visual systems, assets, interactions, business workflows, and SEO [13].
3. **Wix Capability Mapping:** Map each source entity to one explicit Wix target and justify the choice. For example, Decap CMS classes might map to Wix Bookings Services, while instructors map to Staff in Bookings and additional rich text to a linked Wix CMS Collection. Use exact current Wix documentation and method schemas to define the mapping [8] [13].
4. **Mapping Review and Execution Approval:** Complete read-only discovery, mapping, setup verification, code generation, and dry-run validation before executing any writes. The Wix migration supervisor preserves a mandatory execution-plan approval gate. This approval must be a durable state, summarizing counts, exclusions, rate/limit risks, and rollback plans [13].
5. **Destination Setup:** Create or adopt the Wix destination, install required business solutions, provision CMS collections, configure permissions, and establish secrets. Use account-level operations only for account/site management; use site-scoped operations for business data [13].
6. **Media and Data Import (Idempotent Operations):** Import dependencies before dependents. A typical order is: media, taxonomy, CMS records, contacts, products, inventory, pricing, posts, orders, relations, then frontend bindings. **Every write must be idempotent.** Use unique identifiers (e.g., an original slug in a custom `importId` field) to prevent duplicate entries during multiple import runs. Persist source-to-Wix IDs in a `crosswalks/` directory immediately and reuse them on resume [8] [13].
7. **Frontend Implementation:** For Wix-managed Headless, scaffold a real Wix CLI project. Implement from a frozen build plan that covers the route shell, shared chrome, design tokens, content bindings, interactive islands, SEO, and accessibility [13].
8. **Verification and Gap Loop:** A successful build does not equal completion. Post-build visual review and a bounded gap loop are required. Compare the source and destination at agreed breakpoints, validating routes, links, assets, forms, business operations, and SEO. Classify discrepancies by severity and resolve them [13].
9. **Preview, Release, and Rollback:** Release only after the approved preview passes. Record the Wix release identifier, destination URL, mapping/crosswalk hashes, unresolved non-critical gaps, and rollback steps [13].

### Anti-Patterns and Failure Modes

- **Fabricating API Details:** Never invent methods, quotas, prices, credit costs, tool names, or capabilities. Always perform a lookup (`curl` or MCP) before writing API calls [14].
- **Ignoring Expiration:** Storing access tokens without checking expiration is an unsafe pattern. Always implement the `renewToken` flow in middleware or client wrappers [6].
- **Bypassing Approvals:** Proceeding with UI implementation before the extraction manifest is validated and frozen, or bypassing manual approval gates during CLI publishing without explicit instruction, are unsafe patterns [14].
- **Using Deprecated Extensions:** The `.jsw` file extension for web modules is deprecated. Developers must use the `.web.js` extension for new backend code. Static event handlers are also deprecated in favor of dynamic event handlers [15].

## 5. Agent Retrieval Checklist

Before acting on tasks within the Wix CMS, Data, Media, Forms, CRM, Members, or Migration domains, an AI agent MUST verify the following:

- [ ] **Determine Architecture:** Explicitly confirm the deployment architecture (Native Wix Studio, Wix-Managed Headless, or Self-Managed Headless) as this dictates authentication and hosting responsibilities.
- [ ] **Resolve Identity and Authentication:** Use host authentication in Wix-managed contexts, OAuth visitor/member flows for self-managed user sessions, app credentials for installed-app context, or a narrowly scoped API key for permitted trusted backend administration. Do not assume a generic CLI-minted admin token exists.
- [ ] **Fetch Dynamic Context:** Call the current `POST /_api/dynamic-context/v1/dynamic-context` method and page its structured response to verify installed apps, CMS collections, editor type, and site status before assuming availability.
- [ ] **Verify Method Schemas:** Search the Wix MCP or use `curl` against `wixapis.com` to retrieve the exact, current method schemas for any Forms, CRM, or Data API operations. Do not rely on memory.
- [ ] **Enforce Idempotency:** Ensure any data import or migration plan includes idempotent keys (`importId`), crosswalk persistence, and explicit, durable approval gates before executing writes.
- [ ] **Check Quotas:** Verify that planned CMS imports do not exceed the 1,000 collection, 10 million item, or 100 GB storage limits.

## 6. Date-Sensitive Topics

**[Date-Sensitive: 2026-09-02]** AI Agents must re-verify the current limits for CMS collections (currently capped at 1,000 collections, 10 million items, and 100 GB), as these infrastructure quotas are subject to change. The status of the V3 API migration, specifically the strict requirements for cursor-based pagination over offset/limit, must be checked for newly released endpoints. Additionally, review any recent updates to the Astro integration package features, particularly regarding automated SEO and consent management. Re-check the deprecation status of `.jsw` files and static event handlers to ensure new backend code complies with current standards (using `.web.js`). Finally, verify if the Wix CLI preview approval flag (`--approve-preview`) behavior has been modified in recent CLI versions.

## References

[1]: https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/backend-code/web-modules/call-backend-code-from-the-frontend.md "Wix Full-Stack Development (Velo) Documentation"
[2]: https://dev.wix.com/docs/go-headless/wix-managed-headless/about-wix-managed-headless.md "About Wix-Managed Headless"
[3]: https://dev.wix.com/docs/go-headless/wix-managed-headless/about-wix-managed-headless.md "Wix Headless and Astro Integration"
[4]: https://dev.wix.com/docs/go-headless/self-managed-headless/about-self-managed-headless.md "About Self-Managed Headless"
[5]: https://dev.wix.com/docs/go-headless/get-started/quick-starts/self-managed-headless/quick-start-from-an-existing-wix-site.md "Quick Start from an Existing Wix Site"
[6]: templates/examples/README.md "Bundled Wix API and SDK example library"
[7]: https://dev.wix.com/docs/develop-websites/articles/workspace-tools/testing-monitoring/monitoring-your-published-site/working-with-the-monitoring-dashboard "Velo: Working with the Monitoring Dashboard"
[8]: Strategy_KLUB_to_Wix_Implementation_Blueprint.md "Bundled KLUB migration strategy"
[9]: https://dev.wix.com/docs/api-reference/business-solutions/bookings/wix-forms-integration.md "Wix Forms API Documentation"
[10]: Strategy_KLUB_to_Wix_Implementation_Blueprint.md "Bundled KLUB forms, CRM, and booking decisions"
[11]: Strategy_KLUB_to_Wix_Implementation_Blueprint.md "Bundled implementation blueprint"
[12]: https://dev.wix.com/docs/go-headless/authentication/members.md "Members Authentication"
[13]: Strategy_Existing_Website_to_Wix_Migration_Playbook.md "Bundled migration playbook"
[14]: https://github.com/wix/skills "Official Wix Skills repository"
[15]: https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/backend-code/web-modules/call-backend-code-from-the-frontend.md "Call Backend Code from the Frontend"
