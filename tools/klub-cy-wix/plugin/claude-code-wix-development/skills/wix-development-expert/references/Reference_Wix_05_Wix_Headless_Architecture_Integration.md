# Wix Headless Architecture and Integration

**Purpose.** This chapter guides architecture selection and implementation for Wix-managed Headless with Astro, Wix-managed Headless with another supported framework, and self-managed Headless. It covers hosting, authentication, SDK/REST boundaries, routing, SEO, extensions, members, commerce, deployment, operations, and migration.

**Freshness rule.** Supported frameworks, CLI commands, integration packages, hosting features, preview/release behavior, and business-solution capabilities are date-sensitive. Verify the current Wix Headless and CLI documentation before implementation. This chapter was verified on **2026-09-02**.

## 1. Mental Model

Wix Headless separates a custom frontend from Wix’s business-management platform. The frontend can present CMS content and connect to Wix solutions such as Stores, Bookings, Events, Members, Forms, CRM, and Pricing Plans through the Wix JavaScript SDK or REST APIs.[1] “Headless” does not mean “backendless”: the Wix site or Headless project remains the container for business data, installed solutions, identities, permissions, and configuration.

Wix currently defines two main hosting paths, with a significant distinction inside Wix-managed Headless:[2]

| Path | Frontend hosting | Framework | Authentication | Wix integration depth |
|---|---|---|---|---|
| Wix-managed Headless with Astro | Wix | Astro with optional React islands | Automatic visitor/member session handling | Full: managed hosting, built-in SEO support, secrets, monitoring, analytics, extensions, CLI |
| Wix-managed Headless with another supported framework | Wix | A currently supported framework | Developer configures Wix client/auth | Limited: managed hosting and Wix APIs; no Astro extensions or built-in SEO integration |
| Self-managed Headless | Developer-selected | Any framework | Developer configures and operates auth | Wix backend APIs; developer owns hosting, deployment, SEO, monitoring, and infrastructure |

Wix recommends Wix-managed Headless for new Headless projects and Astro for the fullest integration.[2] Self-managed Headless is appropriate when the framework is unsupported by Wix hosting, a different hosting provider is mandatory, or an existing Wix site is being used as the backend for one or more external frontends.[2] [3]

> **Wix-managed Headless is not a synonym for Wix Vibe.** Wix Vibe is an AI-oriented site-building product surface. A Headless architecture decision must be based on the current Headless hosting and integration documentation, not on the presence of “Vibe” in a site editor-type field.[4]

## 2. Architecture Decision

Choose the path by responsibility, not by fashion.

| Requirement | Recommended starting point | Reason |
|---|---|---|
| Existing Astro site should move to Wix hosting and use Wix business APIs | Wix-managed Headless with Astro | Preserves Astro while adding the full Wix integration |
| New code-first site with least infrastructure/auth work | Wix-managed Headless with Astro | Wix supplies the most managed capabilities |
| Existing supported non-Astro frontend should move to Wix hosting unchanged | Wix-managed Headless with another framework | Wix hosts the build, but the team retains its framework and configures auth |
| Existing frontend must remain on Vercel, Netlify, AWS, Cloudflare, or another provider | Self-managed Headless | Hosting remains under developer control |
| Existing Wix site should supply CMS/business data to a custom frontend | Self-managed Headless client attached to the existing Wix site | No second Wix backend is necessarily required |
| Multiple independent frontends use one Wix backend | Self-managed or mixed | Each client needs an approved auth and data boundary |
| Custom Wix-hosted backend events or dashboard extensions are needed beside the frontend | Wix-managed Headless with Astro | Astro integration supports extensions |
| Arbitrary visual editing by nondevelopers is the dominant requirement | Consider editor-native Wix/Studio rather than Headless | A code-first frontend may not supply the required canvas workflow |

Do not choose Wix-managed Headless solely because Wix can host the site. Confirm build compatibility, runtime/server requirements, filesystem behavior, supported Node version, environment variables, redirects, server rendering, image processing, third-party integrations, and test tooling.[5]

## 3. Wix-Managed Headless with Astro

Every Wix-managed Headless project receives Wix hosting, global CDN delivery, automatic SSL, deploy previews, scaling, Wix business APIs, and Wix CLI management.[5] Astro projects receive an additional integration layer for automatic authentication and extensions.[6]

### 3.1 Project Shape and Packages

An official Wix CMS catalogue template acquired for this corpus uses Astro 5, React islands, `@wix/astro`, `@wix/astro-pages`, `@wix/data`, `@wix/essentials`, `@wix/sdk`, the Wix hosting adapter, and `@wix/cli`. Its scripts route development, build, preview, release, environment, generation, and skills operations through the Wix CLI.

A representative manifest pattern is:

```json
{
  "scripts": {
    "dev": "wix dev",
    "build": "wix build",
    "preview": "wix preview",
    "release": "wix release",
    "generate": "wix generate",
    "env": "wix env"
  },
  "dependencies": {
    "@wix/astro": "<current-version>",
    "@wix/data": "<current-version>",
    "@wix/essentials": "<current-version>",
    "@wix/sdk": "<current-version>",
    "astro": "<supported-version>"
  },
  "devDependencies": {
    "@wix/astro-wix-hosting-adapter": "<current-version>",
    "@wix/cli": "<current-version>"
  }
}
```

Do not copy the versions from a corpus snapshot blindly. Use the current Wix scaffold or template, then keep related Wix packages aligned.

### 3.2 Automatic Authentication

The Astro integration configures a private Wix app for the project. Wix stores its credentials as project environment variables and uses hosting middleware to manage API authentication. The developer does not create a Wix client, mint and refresh tokens, or implement baseline visitor-session storage.[6]

Anonymous visitors receive visitor-level sessions persisted through cookies. This supports flows such as carts and multi-page bookings without custom token state. Built-in login routes handle member redirection, token exchange, and session continuity.[6]

Direct SDK calls therefore look like normal module calls:

```ts
import { items } from '@wix/data';

const result = await items
  .query('catalog-items')
  .ascending('category')
  .limit(50)
  .find();
```

This pattern is verified by the official CMS catalogue template. Trim server-fetched objects to the fields the client needs before serializing them into a hydrated island. Do not leak owner fields, internal timestamps, permission-sensitive values, or large unused payloads.

### 3.3 Identity and Elevation

Automatic authentication does not make every call administrative. Code normally executes with the current visitor or member identity. A method requiring app permissions can return `403` even when called on the server because identity—not simply execution location—controls access.[6]

For a narrowly defined server-side call, Wix documents `auth.elevate()` to execute with the project private app’s permissions.[7] Elevation must remain on the server and should wrap the smallest operation possible. Verify the method supports the relevant identity and that the private app has the needed permission.

```ts
import { auth } from '@wix/essentials';
import { items } from '@wix/data';

const elevatedQuery = auth.elevate(items.query);
```

The exact call shape must be retrieved from the current SDK method schema. Do not export an elevated function to arbitrary client input or use elevation to bypass collection permissions without a business authorization check.

### 3.4 Extensions

Astro integration projects can register Wix-hosted extensions for backend logic and dashboard UIs. Extensions belong to the project’s private app. The private app acts as the OAuth handler and extension container, is tied to the project, and cannot be shared with other projects or published to the App Market.[6]

Use extensions for documented events, HTTP endpoints, and supported dashboard surfaces. Do not assume editor-canvas automation is available merely because dashboard extensions exist.

### 3.5 SEO and Rendering

Wix’s Astro integration supplies built-in SEO support, while the application still owns page content, route composition, canonical choices, and semantic markup.[2] [8] Define metadata from verified CMS or business data and render crawlable HTML. For dynamic routes, ensure build-time or request-time generation covers every canonical URL.

A complete SEO migration validates:

| Surface | Evidence |
|---|---|
| Status and route | Correct final URL and HTTP behavior |
| Title and description | Rendered values match approved source mapping |
| Canonical | Self-referential or approved replacement |
| Robots | Correct index/follow behavior by environment |
| Sitemap | Includes all canonical public pages |
| Structured data | Valid type and source-backed values |
| Social metadata | Open Graph/Twitter fields and accessible image |
| Redirects | Explicit one-to-one source mapping; no chains |
| Internal links | Resolve to the final canonical form |

## 4. Wix-Managed Headless with Another Framework

Wix can host a frontend built with another currently supported framework. This path receives managed hosting, CDN, SSL, deploy previews, Wix business APIs, analytics, and limited Wix CLI operations, but the developer configures the Wix client and authentication.[2] The Astro integration’s automatic authentication, built-in SEO support, secrets management, monitoring, and extensions are not automatically available in the same way.[2]

Before selecting this path, read the current supported-framework matrix.[9] “Any framework” in a product overview means any framework may be possible in self-managed Headless; it does not mean every framework can be deployed through Wix-managed hosting.

Treat the project as a custom frontend whose build artifact is hosted by Wix:

1. Confirm the framework and build output are supported.
2. Identify server-side versus browser-side execution.
3. Create the Wix client with OAuth for visitor/member work.
4. Keep API-key administration in trusted server code only.
5. Implement session, login, logout, callback, and token persistence correctly.
6. Implement metadata, sitemap, robots, redirects, consent, and observability.
7. Use the Wix CLI only for operations documented for this integration tier.

## 5. Self-Managed Headless

Self-managed Headless supports any framework and hosting provider. The team owns configuration, authentication, hosting, release, scaling, monitoring, logs, secrets, security headers, caching, backups, and incident response.[3]

There are two ways to start:

- Create a new self-managed Headless project and connect a frontend.
- Configure a Headless client for an existing Wix site, making that site the backend for one or more external frontends.[3]

Self-managed Headless is not intrinsically better for an existing codebase. If an Astro repository can meet Wix-managed constraints, Wix-managed Astro usually removes more operational work. Choose self-managed when the repository needs an unsupported runtime, existing infrastructure cannot move, organizational controls require a specific host, or one Wix backend serves multiple external channels.

## 6. Authentication Strategies

### 6.1 Visitor and Member OAuth

Use `OAuthStrategy` for browser-facing Headless experiences that operate as an anonymous visitor or logged-in member.[10] The client ID identifies the Headless OAuth app. The application must manage tokens, cookies/storage, callbacks, login/logout, refresh, and session continuity unless the Wix Astro integration is doing that work.

Visitor/member tokens authorize only what that identity may do. Typical visitor state includes a current cart or pre-login journey. Reuse the same session across steps. Do not substitute an API key for a method that must operate as the current visitor or member.

### 6.2 API Keys

Use `ApiKeyStrategy` only in trusted backend code for permitted administrative operations.[11] A Wix API key can be scoped to an account or site context and restricted to selected Wix API permissions and sites. It is not a general visitor session and is not the correct credential for a third-party Wix app.

Never embed an API key in browser JavaScript, a public build variable, static HTML, a mobile binary without a protected backend, source control, logs, screenshots, or prompt history.

### 6.3 App Credentials

Public or distributed Wix apps use the Wix app/OAuth lifecycle and app-instance context rather than a site owner’s API key.[12] A private Astro integration app is managed for that project; it is not a reusable marketplace app.[6]

### 6.4 Server Trust Boundary

All elevation, API-key operations, webhooks, secrets, payment-side actions, and privileged CMS/business writes belong behind a trusted server boundary. A Headless frontend must still implement application authorization. “Logged in” does not imply the user may update every record.

## 7. SDK and REST Boundaries

Use the JavaScript SDK in JavaScript or TypeScript projects when the supported module and method fit the runtime. It supplies types, fluent query builders where applicable, date conversions, and Wix client integration.[13]

Use REST for non-JavaScript backends, language-neutral services, and endpoints whose REST integration is the appropriate documented surface.[14] REST callers must construct headers and JSON, serialize dates, distinguish account and site context, parse errors, and implement pagination.

| Context | Preferred pattern |
|---|---|
| Wix-managed Astro | Direct SDK module imports; no manual client for ordinary calls |
| Wix-managed other framework | Explicit Wix client and auth strategy; SDK for JS/TS |
| Self-managed browser | SDK with OAuth visitor/member strategy |
| Self-managed trusted Node backend | SDK with OAuth/app/API-key strategy as appropriate |
| Self-managed non-JS backend | REST with documented identity and scope headers |
| Wix site code | Wix site SDK/Velo conventions; do not call external REST back into the same site by default |

Retrieve the full current method schema before writing a call. Query methods may use cursor or offset pagination, one-of fields, field masks, and documented consistency rules. Do not infer method names from REST nouns or older Velo APIs.

## 8. Routing, Data Fetching, and Caching

The custom frontend owns its route tree. Map stable Wix IDs to source URLs and preserve public slugs where possible. A CMS dynamic page should keep a durable `sourceId` and slug while recording the Wix record ID separately.

Choose rendering per route:

| Page type | Typical rendering | Risk to manage |
|---|---|---|
| Static marketing content | Static generation | Content freshness and rebuild trigger |
| CMS detail/listing | Static, SSR, or hybrid | Pagination, stale content, route generation |
| Member account | Server/dynamic plus client islands | Private caching and identity |
| Cart/booking interaction | Client island with server support | Session continuity |
| Checkout/payment | Wix-hosted page where documented | Return URL, domain, locale, consent |

Cache public data only when permitted and invalidate on content changes. Never cache private visitor/member responses in a shared public cache. Trim SDK results before serialization and enforce a maximum page size.

## 9. Members, Commerce, and Hosted Pages

Member login is built into the Astro integration through provided routes; self-managed projects must configure the OAuth member flow.[6] [10] Validate login, callback, logout, session refresh, protected routes, authorization, and account-deletion/privacy flows.

Wix Hosted Pages can provide selected Wix-managed experiences, including business-flow pages documented for Headless projects.[15] A common commerce pattern builds or retrieves visitor state through APIs and sends the browser to a Wix-hosted checkout URL. Do not invent the checkout endpoint or assume a URL field name; retrieve the current eCommerce method and hosted-page flow.

End-to-end tests must verify cart continuity, currency, taxes, shipping, discounts, inventory, authentication transitions, return URLs, consent, cancellation, and mobile behavior. API success alone is insufficient.

## 10. Secrets, Operations, and Delivery

Wix-managed Astro provides Wix-managed secrets, logs/monitoring, analytics, hosting, and deploy previews as part of the integrated path.[2] Self-managed teams must supply equivalents.

A safe delivery pipeline separates:

1. dependency installation and lockfile validation;
2. type checking and linting;
3. unit and transformation tests;
4. production build;
5. browser tests at representative viewports;
6. preview deployment;
7. human review of routes, SEO, accessibility, and business flows;
8. explicit release approval;
9. release/read-back evidence;
10. rollback or prior-release restoration.

Do not run `wix release` merely because `wix build` passes. Release changes an external environment and requires an approved target and production validation plan.

## 11. Existing-Site Migration

A Headless migration is a reimplementation backed by Wix services, not an automatic theme conversion. Preserve the source as evidence until cutover is complete.

```text
source crawl + repository inventory + browser captures
→ route/content/asset/interaction contracts
→ Wix-managed Astro vs managed-other vs self-managed decision
→ destination site/app/CMS/business-solution discovery
→ frozen mapping and import schemas
→ read-only payload generation
→ approved data/media writes
→ frontend implementation
→ functional, visual, accessibility, SEO, and business-flow validation
→ preview approval
→ release/domain/redirect cutover
→ monitoring and rollback
```

For an existing Astro site such as KLUB, Wix-managed Astro is the leading candidate because it preserves the route/component model while adding automatic Headless auth, hosting, and Wix APIs. It is not automatically the final choice. Validate Astro/package compatibility, static assets, adapters, third-party embeds, forms, analytics, redirects, image behavior, and the expected content/business ownership model.

Do not force editorial page data into an operational Wix solution. For example, retain a CMS `Classes` record for descriptive and SEO content even if a linked Wix Bookings service becomes the operational schedule/capacity authority.

## 12. Agent Execution Workflow

| Phase | Required artifact |
|---|---|
| Classify | Managed Astro, managed other framework, self-managed, or editor-native alternative |
| Discover | Current docs, destination site/project, installed apps, auth model, framework support |
| Map | Routes, data, media, identities, permissions, extensions, hosted pages, redirects |
| Plan | Dependency order, dry-run counts, approval gates, rollback |
| Implement | Typed code and deterministic transforms; no hidden live writes |
| Validate | Type/build, unit, browser, SEO, accessibility, auth, business flows |
| Preview | Stable preview URL and evidence report |
| Release | Explicit confirmation, target IDs, version, monitoring, rollback |

For any API method, read the full SDK or REST schema. For any Wix CLI command, check `wix --help` and the current CLI documentation. For any visual migration, compare browser renders rather than source markup alone.

## 13. Troubleshooting

| Symptom | Investigation |
|---|---|
| `403` in managed Astro backend code | Confirm current identity, method permission, private-app permissions, and whether server-only `auth.elevate()` is appropriate |
| Visitor cart disappears | Verify Astro middleware or self-managed OAuth token/session continuity and cookie configuration |
| Member login loops | Check allowed domains, callback URL, login route, token storage, and environment/domain mismatch |
| Build works locally but not on Wix | Compare supported Node/framework versions, adapter, filesystem assumptions, environment variables, and server dependencies |
| Dynamic pages missing | Confirm slug inventory, route generation, CMS query paging, and publication state |
| Hydrated island leaks data | Trim server objects before passing props and inspect the client bundle/network response |
| SEO differs in preview/live | Check environment-specific base URL, canonical, robots, sitemap, and integration support tier |
| Business API returns empty/forbidden | Verify installed solution, site ID, identity, permissions, data state, and pagination |
| Existing frontend cannot use full Astro integration | Confirm whether it is truly Astro-compatible; otherwise use managed-other-framework or self-managed |

After two distinct targeted recovery attempts, preserve the exact sanitized error, request ID, command, package versions, Wix project/site ID, and environment. Do not broaden permissions or switch architecture blindly.

## 14. Retrieval Checklist

| Check | Evidence |
|---|---|
| Hosting path | Managed Astro, managed other framework, or self-managed |
| Framework support | Current supported-framework documentation and versions |
| Project/site | Immutable Wix IDs and development/live environment |
| Authentication | Automatic Astro integration, OAuth, app credentials, or API key |
| Identity | Visitor, member, Wix app/private app, Wix user, or API-key admin |
| API surface | Current SDK module or REST method schema |
| Installed business solutions | Stores, Bookings, CMS, Members, Forms, Site-Chat, etc. |
| Rendering/SEO | SSR/SSG strategy, metadata, canonical, sitemap, robots, redirects |
| Security | Server boundary, elevation scope, secrets, PII, cache behavior |
| Operations | Build, preview, release, logs, analytics, monitoring, rollback |
| Migration | Source inventory, crosswalks, idempotent import, parity evidence |

## References

[1]: https://dev.wix.com/docs/go-headless/get-started/about-wix-headless "About Wix Headless"
[2]: https://dev.wix.com/docs/go-headless/get-started/choose-your-development-path "Choose Your Headless Development Path"
[3]: https://dev.wix.com/docs/go-headless/self-managed-headless/about-self-managed-headless "About Self-Managed Headless"
[4]: https://support.wix.com/en/article/wix-vibe-an-overview "Wix Vibe overview"
[5]: https://dev.wix.com/docs/go-headless/wix-managed-headless/about-wix-managed-headless "About Wix-Managed Headless"
[6]: https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/about-the-astro-integration "About the Astro Integration"
[7]: https://dev.wix.com/docs/api-reference/articles/authentication/about-elevated-permissions "Elevated SDK permissions"
[8]: https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/feature-guides/seo/about-seo-support "Wix-managed Astro SEO support"
[9]: https://dev.wix.com/docs/go-headless/wix-managed-headless/about-supported-frameworks "Supported Wix-managed frameworks"
[10]: https://dev.wix.com/docs/sdk/core-modules/sdk/oauth-strategy "Wix SDK OAuthStrategy"
[11]: https://dev.wix.com/docs/sdk/core-modules/sdk/api-key-strategy "Wix SDK ApiKeyStrategy"
[12]: https://dev.wix.com/docs/build-apps/develop-your-app/access/authentication/about-authentication "Authentication for Wix apps"
[13]: https://dev.wix.com/docs/sdk "Wix JavaScript SDK"
[14]: https://dev.wix.com/docs/rest "Wix REST API"
[15]: https://dev.wix.com/docs/go-headless/business-solutions/wix-hosted-pages/about-wix-hosted-pages "Wix Hosted Pages"
[16]: https://dev.wix.com/docs/go-headless/get-started/headless-ai-toolkit "Headless AI Toolkit"
