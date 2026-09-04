# Existing-Site-to-Wix Migration and Replatforming

**Purpose:** Provide authoritative, RAG-ready guidance for migrating existing websites to Wix (Managed Headless or Native), covering architecture mapping, evidence collection, and deployment.
**Audience:** Claude Code, Manus agents, and technical replatforming teams.
**Last Researched:** 2026-09-02
**Retrieval Keywords:** wix migration, replatform, KLUB case study, headless migration, wix mcp, replatforming playbook, site architecture mapping, wix site import, gap loops, managed headless.

## 1. First Principles of Wix Replatforming

Migrating an existing website to Wix is not a superficial copy-paste operation; it requires a structural mapping of the source's content models, business logic, URLs, and visual fidelity to Wix's native or headless capabilities. The official Wix Headless replatform skill requires browser-backed evidence, a frozen extraction manifest, a real Wix CLI scaffold, source asset preservation, and post-build visual review rather than build-only completion [1].

When undertaking a replatforming project, the initial decision involves selecting the appropriate architectural paradigm. Replatforming to Wix typically follows one of two primary paths:

- **Wix-Managed Headless:** In this paradigm, Wix takes on the responsibility of building, deploying, and serving the project on a global Content Delivery Network (CDN). This approach includes automatic SSL certificates, deploy previews, secrets management for environment variables, and automatic SEO tags injected directly into the HTML [2]. It is ideal for teams that want to maintain a custom frontend (such as React, Astro, or Vue) while offloading infrastructure management to Wix.
- **Self-Managed Headless:** This path provides maximum flexibility but requires the developer to assume full responsibility for the project's lifecycle. This includes provisioning hosting, configuring CI/CD pipelines, managing SSL certificates, scaling infrastructure to meet traffic demands, and manually implementing all SEO tags, sitemaps, and consent management logic [3].

Understanding these foundational principles is critical for AI agents and human developers alike. Failure to respect the structural differences between the source and target platforms often results in data loss, degraded SEO performance, and broken business workflows.

## 2. Source Discovery and Browser Evidence

A successful migration begins with comprehensive source discovery. Do not rely solely on static code analysis, as dynamic behaviors, third-party integrations, and rendering artifacts are often only visible in the browser.

### Evidence Collection Requirements

1. **Repository and Configuration Analysis:** Thoroughly analyze the source repository, build commands, CMS configurations (e.g., Decap CMS, Sanity, or WordPress), and environment variables. Document all dependencies and external API calls [4].
2. **Visual Fidelity Baselines:** Capture the source site at specific, agreed-upon breakpoints (e.g., 320, 360, 375, 390, 412, 768, 1024, 1099, 1100, 1101, 1280, 1440, and 1920 pixels) to establish strict visual expectations. This includes capturing hover states, focus states, and navigation transitions [4].
3. **SEO and Accessibility State:** Record existing SEO metadata, including titles, descriptions, canonical URLs, Open Graph data, sitemap structures, `robots.txt` rules, and schema markup. Additionally, capture WCAG A/AA compliance states using tools like axe-core to ensure accessibility is not degraded during the migration [4].
4. **Business Logic and Operations:** Identify all interactive elements, such as forms, CRM integrations, booking widgets, e-commerce checkouts, and third-party tracking scripts. Document the expected behavior and data flow for each [5].

## 3. Mapping and Architecture

Before any Wix API calls are made or any Wix projects are scaffolded, map the source architecture to Wix target components. This mapping must be explicit, documented, and approved by the project owner.

### Decision Table: Source to Target Mapping

| Source Component Type | Wix Target Component | Architectural Justification |
| :--- | :--- | :--- |
| Structured JSON/Markdown (e.g., `classes.json`, `products.md`) | Wix CMS Collection | Requires relational data, searchability, and dynamic routing capabilities. Essential for managing large datasets [5]. |
| One-off Page Copy (e.g., `home.json`, `about.md`) | Wix Page Content | Avoids unnecessary CMS complexity. Static or infrequently updated content should reside directly on the page [5]. |
| Dynamic Routes (e.g., `/classes/[slug]`, `/blog/[id]`) | Wix CMS Dynamic Page | Preserves the dynamic routing contract and ensures SEO continuity for templated content [5]. |
| Third-Party Forms (e.g., Netlify Forms, Typeform) | Wix Forms | Provides native CRM integration, automated email responses, and built-in spam protection [5]. |
| External Booking Widget (e.g., Bsport, Mindbody) | Wix Bookings or Custom HTML Embed | Depends on business retention of third-party systems. Migrating to Wix Bookings unifies data; embedding retains existing contracts [5]. |
| Static Routes (e.g., `/contact`, `/terms`) | Wix Static Pages | Direct 1:1 mapping for pages that do not rely on dynamic data injection [5]. |

## 4. Destination Setup and Media/Data Import

No Wix writes, site creation, or data mutation should occur until the user explicitly approves the destination and the execution plan [4].

### Controlled Setup Sequence

1. **Wix Project Scaffold:** Use the Wix CLI (`create-wix-project.mjs` or similar commands) to provision the backend or scaffold a native Wix Studio build. Ensure the project is linked to the correct, pinned Wix account and site ID [5].
2. **Business Solution Installation:** Install necessary business solutions (e.g., Wix CMS, Wix Bookings, Wix Forms, Wix Stores) via the Wix dashboard or programmatically via the Wix MCP. Verify that all required permissions and scopes are granted [4].
3. **Media Import and Deduplication:** Upload all public assets (images, videos, documents) to the Wix Media Manager using the Wix SDK or REST API. Persist crosswalks (mappings between source URLs and Wix Media URLs) to ensure idempotent writes and prevent duplicate uploads during iterative testing [4].
4. **Data Import and Schema Provisioning:** Ingest structured content into the Wix CMS via the Wix Data API. Always upsert records by their source identity (e.g., `sourceId: "klub:class:yoga-basics"`). Record counts, hashes, and any validation errors in a persistent log for reconciliation [4].

## 5. Managed Headless Frontend Continuation

For Wix-Managed Headless projects, developers can maintain a custom frontend (e.g., Astro, Next.js, React) while utilizing Wix for backend services. This approach offers the best of both worlds: frontend flexibility and robust backend infrastructure.

- **Data Fetching:** Modify the frontend application to pull data from the Wix SDK or REST API instead of local files or legacy databases. Ensure that API calls are optimized, paginated, and cached appropriately [5].
- **SEO Management:** Main pages in Wix-managed Astro projects receive dashboard-managed SEO tags automatically injected into the HTML. The platform also automatically serves the `robots.txt` and `sitemap.xml` files, reducing manual configuration overhead [2].
- **Authentication and Routing:** Use the Wix Redirect Session API to securely route users to Wix-hosted checkout or member authentication pages. After the transaction or login is complete, the API routes the user back to the custom frontend, maintaining a seamless user experience [6].

## 6. Gap Loops and Validation Gates

A rigorous, iterative gap loop is required to ensure absolute parity between the source and the Wix destination. This loop must be executed before any public release.

### Validation Requirements

- **Visual Acceptance:** Compare the source and Wix previews at identical breakpoints. Require correct first-viewport hierarchy, typography, navigation transitions, class cards, image crops, video masks/controls, hover/focus states, announcement behavior, and mobile sticky actions. Any discrepancy must be logged and resolved [4].
- **Functional Acceptance:** Ensure every public route and asset resolves correctly. Verify that every internal link works, every Call to Action (CTA) retains a unique event identity, forms create the intended Wix/CRM state, booking CTAs reach the approved system, and CMS content matches the approved source hash and count [4].
- **Accessibility Acceptance:** Retain existing axe-core checks for WCAG A/AA issues on critical pages (e.g., home, pricing, classes) at desktop and phone widths. Preserve keyboard operation of the mobile menu, Escape behavior where applicable, visible focus, pause controls for motion content, alt text, landmarks, status announcements, and semantic structured content [4].

## 7. URLs, SEO, and Rollback

Preserving search engine visibility and providing a safe, reliable rollback mechanism are critical components of any replatforming effort.

- **URL Preservation:** Preserve all existing routes exactly as they appear on the source site. If URL structures must change due to platform constraints, implement 301 redirects immediately. Validate titles, descriptions, canonical URLs, Open Graph data, and structured data (e.g., Schema.org types like `OfferCatalog`, `FAQPage`, `Organization`) [5].
- **Rollback Strategy:** Keep the existing deployment (e.g., Astro/Netlify, WordPress) completely unchanged until Wix preview approval and post-cutover validation are complete. The primary release rollback mechanism is a DNS reversion to the existing deployment. Data and setup rollback relies on the persisted crosswalks and operation logs, with deletion or restoration only occurring where the corresponding Wix operation is explicitly safe and approved [4].

## 8. Completion Evidence

Do not declare the migration complete until all evidence is gathered and verified.

Declare completion only when:
1. The Wix project reuses one pinned destination, avoiding fragmented data [4].
2. Imported entities perfectly reconcile to source counts or explicitly documented exclusions [4].
3. All critical and high-severity visual and functional gaps are resolved and verified by the gap loop [4].
4. Route, SEO, accessibility, and business tests pass successfully against the production deployment [4].
5. Release evidence exists, and the final migration report records any accepted lower-severity gaps with clear ownership [4].

## 9. Anti-Patterns and Failure Modes

Agents and developers must actively avoid these common replatforming anti-patterns.

| Anti-pattern | Failure Mode / Why it fails | Corrective Rule |
| :--- | :--- | :--- |
| Copying visible text and images only | Loses critical data relationships, SEO metadata, behaviors, operations, and quality contracts [1]. | Perform deep repository and browser-backed discovery to capture all underlying logic [1]. |
| Generating API code from memory | Wix APIs, previews, deprecations, and schemas change frequently. Code will fail [1]. | Retrieve current documentation and exact method schemas via the Wix MCP before writing code [1]. |
| Creating a second Wix site mid-run | Fragments data, configuration, and release authority across multiple instances [1]. | Pin and reuse one destination site for the entire migration lifecycle [1]. |
| Re-running imports without crosswalks | Duplicates media, contacts, CMS content, or products, corrupting the database [1]. | Upsert records by source identity and persist mappings (crosswalks) for every entity [1]. |
| Treating an API response as frontend completion | Does not prove rendering, accessibility, URLs, or actual business behavior [1]. | Require post-build, end-to-end validation in the browser [1]. |
| Forcing all source content into the CMS | Creates unnecessary editorial complexity and degrades performance [1]. | Use the CMS only for repeated, relational, searchable, or frequently edited content [1]. |
| Publishing before preview approval | Increases business, SEO, and data-loss risk significantly [1]. | Preserve explicit approval and rollback gates before any DNS cutover [1]. |

## 10. KLUB Case-Study Lessons

The KLUB Astro/Decap CMS migration provides several key lessons that should be applied to all future replatforming efforts:

- **Idempotent Scripts:** The KLUB migration utilized scripts like `build-klub-payloads.mjs` to generate JSON payloads with source hashes before making any API calls. This ensured safe, repeatable imports and prevented data duplication during iterative testing [7].
- **Visual Gating:** The execution plan mandated running automated visual QA scripts (`visual-qa.mjs`) to compare the Astro build output against the Wix staging site, ensuring absolute visual parity before client approval [5].
- **Test Parity:** The migration required ensuring all 862 existing Playwright tests passed against the new Wix environment. Selectors had to be adjusted for Wix's DOM, but the underlying business logic tests remained the ultimate source of truth [5].
- **Automation vs. Manual Execution:** While asset extraction, CMS schema creation, and JSON data ingestion were fully automated, the project explicitly required human decisions for approving mappings, deciding on third-party integrations (Bsport vs. Wix Bookings), and final visual sign-off [5].

## 11. Agent Operating Instructions and Retrieval Checklist

When operating as an AI agent (such as Claude Code or Manus) via the Wix MCP, strict adherence to these operating instructions is required.

1. **Tool Routing:** Use the `WixREADME` tool first for ordinary Wix management requests. Use documentation tools for read-only research and exact-schema confirmation [8].
2. **Schema Confirmation:** Call `ReadFullDocsMethodSchema` or the REST spec search tool before generating code or executing writes. Never infer a method contract from a documentation-search summary [8].
3. **Scope Discipline:** Resolve the target account, site, and installed-app context before executing a site-scoped write. Never use account-level site management tools (`ManageWixSite`) for per-site business data operations (`CallWixSiteAPI` or `ExecuteWixAPI`) [8].
4. **Approval and Dry Runs:** Generate a dry-run plan with counts and validation rules. Present the exact action, target account/site, affected entity count, rollback ability, and unresolved risk. Require explicit write approval before proceeding [1].
5. **Security:** Use least privilege. Keep Wix API keys and client secrets outside repositories. Never place administrative credentials in browser-delivered code [1].

### Agent Retrieval Checklist

Before executing any replatforming task, an AI agent must verify the following:

- [ ] Has the source architecture been fully mapped and explicitly approved by the user?
- [ ] Is the Wix destination site pinned, verified, and recorded in the project state?
- [ ] Have the exact method schemas for all planned API calls been retrieved from current documentation?
- [ ] Are crosswalks (mappings) established and persisted for all media and data imports to ensure idempotency?
- [ ] Has the user explicitly approved the execution plan, including any destructive or bulk write operations?
- [ ] Are rollback procedures documented and ready to execute if validation fails?

## Date-Sensitive Topics

The Wix ecosystem evolves rapidly. As of September 2026, the `.jsw` file extension for web modules is deprecated in favor of `.web.js`, and static event handlers are deprecated for dynamic ones. Always verify current quota limits, pricing, and exact method schemas via the Wix MCP or official documentation before execution, as API contracts and managed headless deployment capabilities are subject to change.

## References

[1]: https://github.com/wix/skills/blob/main/wix-replatform/SKILL.md "Wix replatform supervisor"
[2]: https://dev.wix.com/docs/go-headless/wix-managed-headless/about-wix-managed-headless.md "About Wix-Managed Headless"
[3]: https://dev.wix.com/docs/go-headless/self-managed-headless/about-self-managed-headless.md "About Self-Managed Headless"
[4]: https://github.com/wix/skills/blob/main/wix-headless-replatform/SKILL.md "Wix Headless replatform skill"
[5]: Strategy_KLUB_to_Wix_Implementation_Blueprint.md "Bundled KLUB migration blueprint and controlled execution sequence"
[6]: https://dev.wix.com/docs/go-headless/self-managed-headless/self-managed-tutorials/other-tutorials/create-a-word-press-plugin.md "Create a WordPress Plugin"
[7]: templates/examples/migration/src/build-klub-payloads.mjs "Bundled read-only KLUB payload transformer"
[8]: Reference_Wix_07_Wix_MCP_Claude_Code_and_Official_Wix_Skills.md "Bundled Wix MCP and tool-routing reference"
