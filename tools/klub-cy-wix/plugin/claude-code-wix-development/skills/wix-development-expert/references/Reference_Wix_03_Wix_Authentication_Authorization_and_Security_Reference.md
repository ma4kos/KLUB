# Wix Authentication, Authorization, and Security Reference

**Purpose.** This chapter is the operational reference for choosing a Wix identity, authentication method, SDK strategy, permission model, and request-verification approach. It is written for AI coding agents, backend integrations, Wix Headless projects, Wix apps, and site code. Recheck the linked Wix documentation before production implementation because token lifetimes, supported grant types, preview features, and extension contracts can change.

## 1. The Wix Access Model

Wix access control has four separate questions. **Identity** answers who or what is calling. **Authentication** proves that identity. **Authorization** decides whether the identity may perform the operation. **Context** determines which account, site, app installation, visitor session, or member session the call targets. A correct access token can still receive `403 Forbidden` if its identity lacks the method's required permission, and a powerful API key can still fail if the request specifies the wrong site or account.

> Do not select authentication from the programming language alone. Select it from the caller’s identity, execution environment, target scope, and least-privilege requirement.

Wix currently documents five API identities: visitor, member, Wix user, Wix app, and API key admin.[1] The same human can appear as different identities in different contexts. A site collaborator working in a dashboard is a Wix user; the same person browsing the live site is a member, potentially with an additional admin role. Contacts and members are also distinct: contacts support CRM operations, while members are authenticated site identities.[1]

## 2. Identity Reference

| Identity | Typical context | Appropriate work | Important boundary |
|---|---|---|---|
| Visitor | Anonymous site or Headless session | Public content, visitor cart, login initiation | Session-bound and least privileged |
| Member | Logged-in site or Headless session | Profile, orders, bookings, member-only content | Acts only for that member unless a documented role grants more |
| Wix user | Dashboard or editor host | Administrative site and business management | Role-sensitive; REST does not provide a generic on-behalf-of-Wix-user flow |
| Wix app | Installed Wix app or a Headless OAuth client acting as itself | Backend app logic and permitted site data | Limited by installation and app scopes |
| API key admin | Trusted server-to-server integration | Site- or account-level administration | Long-lived credential; requires explicit site or account target |

A Headless OAuth client is itself a private app installed on a site. A token minted with visitor/member flows carries a visitor or member identity; a client-credentials token carries the Headless OAuth client's Wix-app identity.[1] This distinction matters because methods can authorize those identities differently.

## 3. Authentication Methods

Wix groups authentication into **OAuth**, **API keys**, and **host authentication**.[2] Some systems use more than one. For example, a Wix app can use host authentication in a dashboard extension and app OAuth credentials in its self-managed backend.

| Authentication method | Use when | Avoid when |
|---|---|---|
| OAuth visitor/member | A self-managed Headless frontend needs visitor state or member login | A privileged unattended administrator is required |
| OAuth client credentials / app strategy | A Wix app or Headless OAuth client acts as its installed app instance | The operation must administer unrelated sites or an account |
| API key | A trusted backend, partner workflow, automation, or AI connector needs site/account admin access | Browser code, third-party Wix app authentication, or user-session semantics |
| Host authentication | Code runs inside a Wix site, dashboard, editor, managed app, or supported managed-Headless host | Code runs outside Wix without host context |

OAuth supports visitor, member, and Wix-app identities through different grants.[2] The JavaScript SDK abstracts token acquisition and renewal through strategies such as `OAuthStrategy` and `AppStrategy`; REST callers manage the relevant tokens themselves.[2] API keys remain valid until revoked or rotated and combine operation scopes with site-access restrictions. Account owners and co-owners can create them.[2] Host authentication means Wix provides the identity and token context; extension code should use the host module or the platform-provided environment instead of inventing a second credential flow.[2]

## 4. Decision Matrix by Development Path

| Development path | Frontend/user calls | Trusted backend/admin calls | Primary reference |
|---|---|---|---|
| Wix site / Velo | Automatic host authentication | Backend web methods, Wix Secrets Manager, narrow elevation where documented | Auth quick reference[3] |
| Wix-managed Headless with supported Astro integration | Managed integration provides visitor/member exchange | Managed server context or documented app/admin pattern | Managed Headless authentication docs[4] |
| Self-managed Headless | OAuth visitor/member flows | OAuth client credentials for the project's site or API key for suitable site/account admin work | REST authentication and Headless admin docs[5] [6] |
| Wix-managed app | Host authentication in frontend extensions; Wix manages app-instance context | Wix-managed app backend context | About app authentication[7] |
| Self-managed app | Host-provided SDK client in supported frontend extensions | App OAuth and `AppStrategy`/REST token flow tied to the installation | About app access[8] |
| Blocks app | Host authentication | Velo/backend mechanisms provided by the Blocks environment | App authentication docs[7] |
| External automation or connector | Not normally applicable | API key with minimum scopes and site access, or an app flow if distributed as an app | API key docs[9] |

Do not impose the rule “all backend code uses API keys.” A self-managed Wix app must use the app/OAuth model; a self-managed Headless project can use a client-credentials token for admin work on its own site; Wix-hosted code often receives host or app context automatically. Use API keys only where the method and development path permit them.[2] [5]

## 5. JavaScript SDK Setup

Use `createClient()` from `@wix/sdk` with only the modules needed by the integration. Select the authorization strategy before importing business logic. Current compile-checked examples are bundled under `templates/examples/sdk/`; recompile them after updating Wix packages.

### 5.1 API Key Strategy

A trusted backend can construct an API-key client with an explicit site or account context. Keep site-scoped and account-scoped constructors separate in application code so both identifiers cannot be supplied accidentally.

```ts
import { ApiKeyStrategy, createClient } from '@wix/sdk';
import { items } from '@wix/data';

const wix = createClient({
  auth: ApiKeyStrategy({
    apiKey: process.env.WIX_API_KEY!,
    siteId: process.env.WIX_SITE_ID!,
  }),
  modules: { items },
});
```

The API key must belong to the account that owns the target site, include the operation's required scopes, and have access to that site.[2] [9] Never serialize this client into browser code or expose the key through public environment-variable prefixes.

### 5.2 OAuth Strategy

Use `OAuthStrategy` for visitor and member behavior in self-managed Headless applications. Persist the returned token set using secure, server-aware storage appropriate to the framework. Visitor sessions need continuity if carts or similar visitor state must survive requests. Member login ends with Wix-issued member tokens through a Wix-hosted login page, custom login implementation, or supported external identity-provider flow.[5]

```ts
import { createClient, OAuthStrategy } from '@wix/sdk';

const wix = createClient({
  auth: OAuthStrategy({ clientId: process.env.PUBLIC_WIX_CLIENT_ID! }),
  modules: {},
});
```

A client ID is public; client secrets, app secrets, API keys, and privileged token sets are not. The exact login, callback, token-restoration, and logout implementation is framework-specific. Retrieve the current `OAuthStrategy` schema before generating those calls.[10]

### 5.3 App and Host Strategies

Use `AppStrategy` in the documented self-managed app context, where calls act with the installed app's scopes.[11] For dashboard, editor, and site extensions, use the appropriate host module and the identity supplied by the Wix host. A dashboard call can run as a Wix user; site extension calls commonly run as visitor or member. Do not replace host authentication with an API key merely to bypass a permission failure.[2]

## 6. REST Authentication

REST requests send the relevant token directly in the `Authorization` header. Wix's REST authentication reference documents which token corresponds to each identity.[5]

```http
Authorization: <token>
Content-Type: application/json
```

For an API-key call, also identify exactly one target:

```http
Authorization: <api-key>
wix-site-id: <site-id>
```

or:

```http
Authorization: <api-key>
wix-account-id: <account-id>
```

Do not send both target headers. A visitor or member REST flow uses its OAuth access token; an app uses an app token. REST does not provide a generic way to impersonate a Wix user. In dashboard/editor contexts, use the SDK and host authentication instead.[5]

Every REST implementation must retrieve the full method schema and confirm method-specific authentication, permissions, pagination, idempotency, preview status, and error definitions. Do not infer support for API-key, app, member, or visitor identities from neighboring methods.

## 7. Permissions, Scopes, and Elevation

Authentication never replaces authorization. Wix permissions are attached to identities through roles, app scopes, API-key scopes, and site-access boundaries.[12] The required permission belongs to the exact method schema. If a method fails, compare the actual identity and granted permissions with that schema before changing credentials.

**Elevation** permits supported backend code to run a specific function with broader authorization.[13] Treat elevation as a narrow capability boundary, not a blanket administrator mode. Validate every user-controlled argument before the elevated call, expose only the smallest operation, and never elevate a general query or arbitrary method dispatcher.

A secure frontend-to-backend pattern is:

```text
browser input → authenticated backend boundary → schema validation
→ authorization/business-rule check → narrow privileged Wix call
→ minimal response → audit/logging
```

Do not trust a browser-supplied member ID, site ID, price, role, or ownership assertion. Derive identity from the authenticated context and re-read authoritative records before privileged changes.

## 8. Credential and Token Security

Store API keys, app secrets, client secrets, webhook public keys, and privileged tokens in an approved secrets store or server environment variables. Keep development and production credentials separate. Restrict every key to the smallest scopes and site set, and rotate or revoke it when exposure is suspected.[2] [5]

| Credential | Browser-safe? | Storage guidance |
|---|---:|---|
| OAuth client ID | Usually yes | Public configuration is acceptable |
| Visitor/member access and refresh tokens | Sensitive session data | Secure cookies or protected server/session storage; avoid logs and analytics |
| Headless/app client secret | No | Backend secret store only |
| Wix API key | No | Backend secret store only; never commit |
| Wix app secret | No | Backend secret store only |
| Webhook verification public key | Public by design, but integrity-sensitive | Configuration with controlled updates |

Mask credentials in logs, test fixtures, screenshots, support bundles, and error telemetry. Do not return Wix tokens from a backend API unless the documented client flow requires it. Validate that framework build tooling does not bundle server environment variables into client assets.

## 9. Wix App Requests and Webhooks

Requests from Wix to a self-managed app can include signed data. Use Wix's documented request-verification flow rather than trusting query parameters or decoded-but-unverified JWT content.[14] For webhook events, Wix sends event data as a signed JWT in the request body. Verify and decode it with the Wix client processing method or the documented public-key procedure.[15]

Webhook processing must assume duplicates, delays, and out-of-order delivery.[15] A robust handler acknowledges quickly, persists a stable event identity, prevents duplicate side effects, and performs slow work asynchronously. Some Wix-managed contexts use Velo backend events or Wix CLI event extensions instead of self-managed webhook endpoints.[15]

```text
receive raw body → verify signature/JWT → reject invalid request
→ parse event → deduplicate → return success promptly
→ process idempotently → reconcile with a GET when event data is partial
```

Do not use the obsolete assumption that every Wix webhook is verified through an `x-wix-signature` HMAC header. Follow the event type and current Wix documentation; self-managed app webhook bodies are documented as signed JWTs.[15]

## 10. Error Diagnosis

| Symptom | Likely causes | Correct next step |
|---|---|---|
| `401 Unauthorized` | Missing, malformed, expired, or revoked token/key | Confirm auth method; renew OAuth/app token; verify header format |
| `403 Forbidden` | Correct identity lacks permission, role, app scope, key scope, or site access | Inspect method schema and actual identity; do not broaden access blindly |
| Wrong or empty data | Incorrect site/account context, sandbox/live mismatch, member/visitor context | Log non-secret context IDs and verify target environment |
| Call works in dashboard but not live site | Wix-user versus member identity difference | Use the method appropriate to the runtime identity |
| App works on one installation only | Wrong instance/site mapping or missing scopes/version | Resolve installation and app version; inspect granted scopes |
| Duplicate webhook effects | Non-idempotent handler or resend/out-of-order delivery | Persist event identity and reconcile state |
| OAuth loop or lost cart | Callback/token persistence/session-cookie problem | Trace state, callback URL, cookie policy, and token restoration |

Attempt targeted recovery, not random credential substitution. Record the failing method, identity, target, granted permissions, status code, request ID, and sanitized response. If a write partially succeeded, read back the Wix entity before retrying.

## 11. Agent Operating Rules

An AI agent must retrieve the current method schema before generating a call. It must state the caller identity, authentication strategy, site/account context, permissions, and credential location. It must not request or print secrets in chat when a secure connector or environment-variable path exists.

For read operations, report scope and pagination. For writes, prepare a dry-run request, impact count, idempotency key or source identity, validation query, and rollback limitation. Require explicit approval before site creation, publication, bulk import, destructive changes, domain/DNS changes, payment/billing operations, or other material side effects.

When an authentication failure occurs, preserve the selected destination and artifact state. Check, in order: current method schema, identity support, token/key type, target site/account, installed app, scopes/roles/site access, expiry, environment, and request shape. Do not solve a permission failure by exposing an API key to the frontend or elevating a broad function.

## 12. Agent Retrieval Checklist

| Check | Evidence to capture |
|---|---|
| Exact operation | Service, method, API version, REST/SDK choice |
| Runtime context | Site, dashboard, editor, app, managed Headless, self-managed Headless, backend |
| Identity | Visitor, member, Wix user, Wix app, or API key admin |
| Authentication | OAuth, API key, host auth, and specific SDK strategy/grant |
| Target | Account ID or site ID; never an ambiguous site name alone |
| Authorization | Method permission plus role, app scope, key scope, and site access |
| Secret boundary | Which values are public, server-only, stored, rotated, and masked |
| Write safety | Dry run, approval, idempotency, read-back, rollback |
| Event safety | Verification, deduplication, ordering, acknowledgement, reconciliation |
| Freshness | Links and schemas rechecked for date-sensitive behavior |

## References

[1]: https://dev.wix.com/docs/api-reference/articles/authentication/about-identities "Wix identities"
[2]: https://dev.wix.com/docs/overview/auth-permissions/authentication-methods "Authentication methods"
[3]: https://dev.wix.com/docs/overview/auth-permissions/auth-quick-reference "Auth quick reference"
[4]: https://dev.wix.com/docs/go-headless/wix-managed-headless/authentication/about-the-astro-integration "Wix-managed Headless Astro authentication"
[5]: https://dev.wix.com/docs/api-reference/articles/authentication/rest-api-authentication "REST API authentication"
[6]: https://dev.wix.com/docs/go-headless/authentication/admin/about-admin-operations "Headless admin operations"
[7]: https://dev.wix.com/docs/build-apps/develop-your-app/access/authentication/about-authentication "Wix app authentication"
[8]: https://dev.wix.com/docs/build-apps/develop-your-app/access/authentication/about-authentication.md "Authentication for Wix apps"
[9]: https://dev.wix.com/docs/api-reference/articles/authentication/api-keys/generate-an-api-key "Generate an API key"
[10]: https://dev.wix.com/docs/sdk/core-modules/sdk/oauth-strategy "OAuthStrategy"
[11]: https://dev.wix.com/docs/sdk/core-modules/sdk/app-strategy "AppStrategy"
[12]: https://dev.wix.com/docs/overview/auth-permissions/permissions "Permissions"
[13]: https://dev.wix.com/docs/overview/auth-permissions/elevation "Elevation"
[14]: https://dev.wix.com/docs/build-apps/develop-your-app/access/authentication/verify-requests-received-from-wix "Verify requests received from Wix"
[15]: https://dev.wix.com/docs/build-apps/develop-your-app/api-integrations/events-and-webhooks/about-webhooks "About webhooks"
