# Unified Wix API Reference

**Purpose:** Provide a definitive guide on the Unified Wix API, clarifying the boundaries between REST APIs, the JavaScript/TypeScript SDK, Velo-only APIs, and how AI agents should interact with them.
**Audience:** Claude Code, Manus agents, and expert developers.
**Last-Researched Date:** 2026-09-02
**Retrieval Keywords:** Wix Unified API, REST, JavaScript SDK, TypeScript SDK, Velo, site development, headless, authentication, pagination, errors, preview, deprecation, schemas.

## 1. Scope and Mental Model

The Wix development platform provides two primary interfaces for interacting with its backend services [1]:
- **REST APIs:** Language-agnostic HTTP endpoints designed for server-to-server communication, backend integrations, and external applications.
- **JavaScript/TypeScript SDK:** A typed programmatic wrapper around the REST APIs, providing a native developer experience for Wix sites, Wix-managed Headless apps, and Node.js environments.

The **Unified API Reference** contains comprehensive documentation for nearly all backend APIs and service plugins [1]. It covers both REST and SDK implementations. However, it is crucial to understand that **REST APIs are not intended for use in Wix site development** [2]. Site development must rely on the SDK and, where necessary, legacy Velo APIs.

## 2. Interface Boundaries: REST vs. SDK vs. Velo

Understanding where each API type applies is critical for correct implementation.

| Environment / Context | Recommended API Interface | Notes |
| :--- | :--- | :--- |
| **Wix Site (Frontend/Backend)** | SDK & Velo | Authentication is handled automatically [3]. REST is prohibited [2]. |
| **Wix-Managed App (CLI)** | SDK | Authentication is handled automatically [4]. |
| **Self-Managed Headless (Frontend)** | SDK (OAuth) | Use visitor/member tokens. Do not expose API keys [5]. |
| **Self-Managed Headless (Backend)** | SDK (API Key/OAuth) or REST | SDK provides type safety; REST allows language-agnostic integration [6] [7]. |
| **External Server Integration** | REST or SDK (API Key) | Use Account-scoped or Site-scoped API keys [6] [7]. |

### 2.1. What Remains SDK-Only

Frontend-specific and SDK-only functionality remain in the separate SDK reference [1]. This includes:
- **Core modules:** Authentication and client setup (`@wix/sdk`).
- **Host modules:** APIs for frontend environments like the dashboard, editor, and site.
- **Frontend modules:** Browser-specific APIs (`wix-window-frontend`, `wix-location-frontend`).
- **Business solutions:** Dashboard plugins, custom dashboard pages, and SDK-specific implementations of select backend APIs (e.g., Data Items).

### 2.2. What Remains Velo-Only

Wix's transition to the SDK is gradual. The SDK does not currently support all functionality required for site development or app creation with Blocks [2]. The following must still use Velo APIs and conventions:
- **Velo-Only APIs:** APIs explicitly marked as Velo-only in the documentation [8].
- **Backend Event Handlers:** Must be placed in `events.js` using Velo naming conventions [2].
- **Service Plugins (SPIs):** Must use the Velo configuration (`-config.js`) and implementation (`.js`) file structure [2].
- **Data Hooks:** Must be placed in `data.js` using Velo naming conventions [2].
- **Routers:** Must be placed in `routers.js` using Velo naming conventions [2].

## 3. Using Method Schemas and the SDK

The SDK provides typed methods that abstract away manual HTTP request construction and token management.

### 3.1. Client Setup and Authentication

SDK usage requires initializing a client with an appropriate authorization strategy [5].

**API Key Strategy (Backend/Admin Context):**
```typescript
import { createClient, ApiKeyStrategy } from '@wix/sdk';
import { productsV3 } from '@wix/stores';

const client = createClient({
  modules: { productsV3 },
  auth: ApiKeyStrategy({
    apiKey: 'YOUR_API_KEY',
    siteId: 'YOUR_SITE_ID' // Or accountId for account-scoped operations
  })
});
```

**OAuth Strategy (Frontend/Visitor Context):**
```typescript
import { createClient, OAuthStrategy } from '@wix/sdk';
import { productsV3 } from '@wix/stores';

const client = createClient({
  modules: { productsV3 },
  auth: OAuthStrategy({ clientId: 'YOUR_CLIENT_ID' })
});
```

*Note: In Wix Sites and Wix CLI app projects, authentication is handled automatically. You do not need to create a Wix client. Simply import the module and call the method [3] [4].*

### 3.2. Scope: Site vs. Account

Wix APIs operate across different scopes:
- **Site-scoped:** Operations affecting a specific site (e.g., managing products). Requires a `siteId` or site-specific token [7].
- **Account-scoped:** Operations affecting the user's entire account (e.g., billing). Requires an `accountId` or account-level authorization [7].

In the SDK, scope is configured within the authorization strategy. In REST, scope is passed via HTTP headers (`wix-site-id` or `wix-account-id`) [6].

### 3.3. Pagination

Wix APIs typically use cursor-based or offset-based pagination [5].

**Cursor Pagination Example (SDK):**
```typescript
const response = await client.productsV3.queryProducts()
  .limit(10)
  .find();

// To get the next page, use the cursor from the response
// const nextCursor = response.cursors.next;
```

### 3.4. Error Handling

SDK errors are instances of specific error classes providing detailed information. REST callers must handle raw HTTP errors and parse the serialized JSON body [5] [6].

## 4. API Lifecycle: Versions, Previews, and Deprecations

### 4.1. Versions

New API versions are released at the module level (e.g., `wix-bookings` v3, `wix-crm` v2), not for the entire platform. Older versions remain available, but upgrading is recommended. Version 2 modules typically include `.v2` at the end of their names [9].

### 4.2. Developer Previews

APIs marked as **Developer Preview** are subject to change at any time based on feedback [10].
- **Breaking Changes:** Wix may introduce breaking changes without direct notification. Check the changelog and API reference.
- **Production Use:** Do not use preview APIs on live sites.
- **Time Limit:** APIs remain in preview for a maximum of 6 months before full release.

### 4.3. Deprecations

Wix provides notice before removing APIs. Modules like `sdk-react` and `dashboard-react` are deprecated in favor of the standard `@wix/sdk` [5].

## 5. Agent Operating Instructions and Anti-Patterns

### 5.1. Schema-First Development

Agents must practice schema-first development. **Never invent methods, quotas, prices, credit costs, tool names, or capabilities.** Always instruct the agent to retrieve the current method schema from the official documentation before writing code.

### 5.2. Anti-Patterns

- **Using REST in Wix Sites:** Prohibited. Use the SDK or Velo [2].
- **Hardcoding Secrets:** Never expose API keys or client secrets in frontend code [5].
- **Mixing Scopes:** Do not pass both `siteId` and `accountId` in a REST request; use exactly one [6].
- **Ignoring Velo Boundaries:** Do not attempt to use the SDK for backend event handlers, service plugins, data hooks, or routers in site development [2].

## 6. Date-Sensitive Topics

The transition from Velo to the SDK is an ongoing, gradual process. As of late 2026, certain features like backend event handlers, service plugins, data hooks, and routers still require Velo conventions for site development and Blocks apps. Developer Preview APIs are subject to breaking changes at any time and have a maximum preview lifespan of 6 months before full release. Always verify the current support status and API maturity in the live documentation before implementation.

## 7. Agent Retrieval Checklist

Before executing tasks related to Wix APIs, the agent must verify:
1. [ ] **Environment Context:** Is this a Wix Site, Wix CLI App, or Headless integration?
2. [ ] **API Boundary:** Does the required functionality fall under the Unified API, SDK-only, or Velo-only?
3. [ ] **Authentication Strategy:** Is automatic authentication available, or is manual client setup required (API Key vs. OAuth)?
4. [ ] **Scope:** Is the operation site-scoped or account-scoped?
5. [ ] **Lifecycle Status:** Is the API in Developer Preview or deprecated?
6. [ ] **Schema Verification:** Has the exact method schema been retrieved from the official documentation?

## References

[1]: https://dev.wix.com/docs/api-reference/articles/platform-overview/about-the-unified-api-reference.md "About the Unified API Reference"
[2]: https://dev.wix.com/docs/api-reference/articles/platform-overview/about-wix-site-development.md "About Wix Site Development"
[3]: https://dev.wix.com/docs/api-reference/articles/sdk-setup-and-usage/set-up-a-wix-client.md "Set Up a Wix Client"
[4]: https://dev.wix.com/docs/api-reference/articles/platform-overview/about-wix-site-development.md "About Wix Site Development"
[5]: https://dev.wix.com/docs/sdk "Wix SDK: JavaScript and TypeScript Reference"
[6]: templates/examples/rest/src/wix-rest-client.ts "Bundled REST client example"
[7]: templates/examples/sdk/src/api-key-client.ts "Bundled SDK API-key client example"
[8]: https://dev.wix.com/docs/velo/articles/api-overview/api-versions.md "API Versions (Velo to SDK Mapping)"
[9]: https://dev.wix.com/docs/velo/articles/api-overview/api-versions.md "API Versions"
[10]: https://dev.wix.com/docs/api-reference/articles/work-with-wix-apis/platform/about-developer-preview.md "About Developer Preview"

## 8. Detailed Workflows and Decision Tables

### 8.1. Choosing the Right Development Path

When starting a new Wix project, developers must decide on the architectural approach based on the project requirements. The following decision table outlines the recommended paths:

| Requirement | Recommended Path | Key Technologies |
| :--- | :--- | :--- |
| **Visual editing with custom logic** | Wix Site Development | Wix Editor/Studio, Velo, SDK, Wix CLI for Sites |
| **Custom dashboard or backend extension** | Wix CLI App | Astro, React, `@wix/sdk`, Wix CLI |
| **Full control over frontend hosting** | Self-Managed Headless | Any frontend framework (Next.js, Nuxt), `@wix/sdk` |
| **Custom frontend with Wix hosting** | Wix-Managed Headless | Astro, `@wix/sdk`, Wix CLI |
| **Server-to-server integration** | Backend Integration | REST APIs, `@wix/sdk` (Node.js) |

### 8.2. Headless Authentication Workflows

Headless applications require explicit authentication handling, unlike Wix Sites or CLI Apps where authentication is implicit.

**Visitor/Member Authentication (Frontend Headless):**
1. Initialize the SDK client with `OAuthStrategy`.
2. Use `client.auth.generateOAuthData()` to start the OAuth flow.
3. Redirect the user to the Wix login page.
4. Handle the callback and exchange the authorization code for tokens using `client.auth.getMemberTokens()`.
5. Store the tokens securely (e.g., in HttpOnly cookies) and pass them to the `OAuthStrategy` on subsequent requests.

**Service-to-Service Authentication (Backend Headless):**
1. Generate an API Key in the Wix Developer Center.
2. Assign appropriate permissions to the API Key.
3. Initialize the SDK client with `ApiKeyStrategy`, providing the API Key and the target `siteId` or `accountId`.
4. Make API calls securely from the backend server.

### 8.3. Working with Service Plugins (SPIs)

Service Plugins allow developers to inject custom logic into standard Wix business flows. While the SDK provides interfaces for some plugins, many still require Velo conventions when used within a Wix Site.

**General Workflow:**
1. Identify the relevant Service Plugin (e.g., Custom Shipping Rates).
2. Implement the required interface according to the documentation.
3. For Wix Sites, create a `-config.js` file to define the plugin configuration and a `.js` file for the implementation in the backend code.
4. For Wix CLI Apps, use `wix generate` to scaffold the plugin extension and implement the logic in the generated files.
5. Deploy and test the plugin within the target site or app.

### 8.4. Handling Webhooks and Real-time Events

Wix provides mechanisms for applications to react to events occurring within the platform.

**Webhooks (Server-to-Server):**
1. Register a webhook endpoint URL in the Wix Developer Center.
2. Select the specific events to subscribe to (e.g., Order Created, Contact Updated).
3. Implement an endpoint on your server to receive POST requests from Wix.
4. Verify the webhook signature to ensure the request originated from Wix.
5. Process the event payload and respond with a 200 OK status.

**Real-time Events (Client-Side):**
1. Use the `@wix/realtime` (or `site-realtime` for frontend) module in the SDK.
2. Subscribe to a specific event channel.
3. Provide a callback function to handle incoming events.
4. Ensure the client maintains an active connection to receive real-time updates.

### 8.5. Advanced Pagination Techniques

While basic cursor pagination is straightforward, handling large datasets efficiently requires advanced techniques.

**Parallel Fetching (Offset Pagination):**
If an API supports offset pagination and the total count is known, you can fetch multiple pages in parallel to reduce overall retrieval time. Note that cursor pagination generally requires sequential fetching.

**Handling Rate Limits during Pagination:**
When paginating through extensive collections, it is crucial to implement rate-limiting logic (e.g., exponential backoff) to avoid hitting API quotas. The SDK may handle some retries automatically, but application-level throttling is recommended for robust integrations.

### 8.6. Debugging and Troubleshooting

When encountering issues with Wix APIs, follow these troubleshooting steps:

1. **Verify Authentication:** Ensure the client is initialized with the correct strategy and valid credentials (API Key, OAuth tokens).
2. **Check Permissions:** Confirm that the identity making the call has the necessary permissions for the requested operation. Use elevation (`auth.elevate`) if required in backend code.
3. **Inspect the Payload:** Validate that the request payload strictly conforms to the method schema defined in the official documentation.
4. **Review Error Codes:** Analyze the specific error code returned by the SDK or REST API. Wix error codes (e.g., `WDE0073`) often provide precise details about validation failures or missing requirements.
5. **Consult the Logs:** For Wix Sites, check the Site Monitor logs. For Wix CLI Apps, review the local development server output or production logs.

By adhering to these workflows and troubleshooting techniques, developers and AI agents can build robust, scalable integrations with the Wix platform.
