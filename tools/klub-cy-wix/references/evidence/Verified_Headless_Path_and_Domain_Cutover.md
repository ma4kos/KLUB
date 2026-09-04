# Verified Wix Headless Path for KLUB-CY

**Verified:** 2026-09-03

## Supported architecture

KLUB-CY is an existing Premium Classic Editor site. Wix’s official documentation says an editor-built site can use its existing project, dashboard, data, business logic, automations, payment processing, and Premium plan as the backend of a **self-managed Headless** project while an externally hosted frontend replaces the editor-built public pages. The frontend may remain on Netlify and connect to the existing site using a Wix Headless client and Wix APIs.

Wix-managed Headless is the preferred option for new Headless projects and can link an existing Astro repository, but an existing editor-built site is specifically routed through the self-managed path when the custom frontend must replace that site’s current frontend. Creating a managed Headless project creates a distinct project/site; retaining the existing KLUB-CY project, plan, data, and dashboard therefore favors self-managed Headless.

## What remains unchanged

According to the official migration article, the existing project and its catalog, bookings, courses, forms, members, orders, custom backend code, automations, Premium plan, payment processing, and domain email remain in place. Email continues if the migration changes only web-routing `A`/`CNAME` records and leaves `MX`, `SPF`, `DKIM`, and `DMARC` records unchanged.

## Required domain model

The externally hosted frontend eventually serves the main public domain. A new subdomain such as `checkout.example.com` becomes the Wix project’s primary domain and the Wix pages domain for Wix-hosted checkout/login/member flows. The frontend link points to the public frontend domain. Allowed redirect domains and exact authorization redirect URIs must include preview and production URLs before cutover.

Wix documents the live cutover as one coordinated manual step: point the public domain at the external host; connect and make the Wix subdomain primary; unassign the public domain from the Wix project; configure canonical and old-path redirects on the external host; then set the Wix pages domain to the subdomain. Wix cautions not to begin this step until the production frontend is deployed and verified.

## Pre-cutover sequence

1. Add a Headless client to the existing KLUB-CY project.
2. Build and test the frontend against the same Wix project at the Netlify preview address.
3. Add the preview domain and login callback to the client’s allowed domains/redirect URIs.
4. Set the frontend link to the preview URL.
5. Verify Wix API reads/writes and Wix-hosted flows without changing the public site.
6. Deploy and verify the production frontend on the external host.
7. Add production domains and exact callback URIs; set the frontend link to the production URL.
8. Lower DNS TTL 24–48 hours before launch.
9. Perform the coordinated domain switch only after an explicit launch approval.
10. Verify public routes, canonical redirects, old-path redirects, login, checkout/member flows, backend URLs, email, and certificates; monitor for 24–48 hours; restore TTL.

## Source URLs

- https://dev.wix.com/docs/go-headless/self-managed-headless/get-started/migrate-from-an-existing-wix-site/about-wix-site-migration-to-a-headless-project
- https://dev.wix.com/docs/go-headless/self-managed-headless/get-started/migrate-from-an-existing-wix-site/migrate-a-wix-site-to-a-headless-project
- https://dev.wix.com/docs/go-headless/get-started/choose-your-development-path
- https://dev.wix.com/docs/go-headless/wix-managed-headless/about-supported-frameworks
- https://dev.wix.com/docs/go-headless/self-managed-headless/get-started/add-a-frontend-to-an-existing-wix-site
- https://dev.wix.com/docs/go-headless/authentication/setup/set-up-a-headless-client
- https://dev.wix.com/docs/go-headless/authentication/setup/allow-redirect-uris-and-domains
- https://dev.wix.com/docs/go-headless/project-management/add-a-frontend-link
- https://dev.wix.com/docs/go-headless/business-solutions/wix-hosted-pages/set-a-domain-for-wix-hosted-pages

## Verified duplicate-site safeguard

The live Wix REST documentation search returned **Duplicate Site** with public endpoint `POST https://www.wixapis.com/site-actions/v1/sites/duplicate`, docs URL `https://dev.wix.com/docs/api-reference/account-level/sites/site-actions/duplicate-site`, request fields `sourceSiteId` and `siteDisplayName`, response field `newSiteId`, and account-level permission `my-account.duplicate-site`. Wix states that store orders, contacts, invoices, and third-party app settings are not included; the duplicate receives no domain or Premium capabilities, and Premium-only apps are copied inactive. This is a design/code rollback aid, not a complete business-data backup.

## Verified Headless client and redirect setup

The existing KLUB-CY project must have a Headless client before the Netlify frontend calls visitor/member APIs. Wix documents dashboard creation under **Settings → Development & integrations → Headless Settings → Create New Client**. The created client ID is safe for browser/frontend use and belongs in the Netlify environment as a public application identifier, not as an admin secret.

Allowed authorization redirect URIs require an **exact URI match** for login callbacks. Allowed redirect domains authorize every path under the specified hostname for non-authorization returns such as Wix-hosted checkout. Wix documents programmatic redirect-domain management with **Update OAuth App**, SDK `oAuthApps.updateOAuthApp()` from `@wix/auth-management`, or REST `PATCH https://www.wixapis.com/oauth-app/v1/oauth-apps/{OAUTH_APP_ID}` using an account API key, `wix-account-id`, and permission `SCOPE.OAUTH_APP.MANAGE`; the required update mask is `mask.paths`. Existing domains must be retrieved and merged before update because the submitted array replaces the targeted field.

The frontend link is configured in Wix Headless Settings and is used in Wix emails, notifications, and as a return destination after managed flows. The setup page can set the frontend link and allowed redirect domain together. For KLUB-CY, the safe pre-cutover value is the verified Netlify preview/production URL; the production custom-domain value is set only after the custom domain is known and the frontend is ready.

Sources:
- https://dev.wix.com/docs/go-headless/authentication/setup/set-up-a-headless-client
- https://dev.wix.com/docs/go-headless/authentication/setup/allow-redirect-uris-and-domains
- https://dev.wix.com/docs/go-headless/project-management/add-a-frontend-link
- https://dev.wix.com/docs/api-reference/business-management/headless/oauth-apps/update-oauth-app

## Verified self-managed SDK authentication pattern

Wix’s current self-managed Headless SDK setup requires Node.js 18 or later and installs `@wix/sdk` plus domain packages such as `@wix/bookings`. The frontend imports `createClient` and `OAuthStrategy` from `@wix/sdk`; OAuth for visitors and members requires the Headless client ID but no client secret. The current constructor is `OAuthStrategy({ clientId, tokens?, siteId? })`. For KLUB-CY, `siteId` is pinned to `20f11f6f-6ce3-469d-b44c-df397c750848` and the client ID must be loaded from a public frontend environment variable created during Headless client setup.

Visitor tokens are generated or renewed with `wixClient.auth.generateVisitorTokens(existingTokens?)`, retrieved with `getTokens()`, and restored with `setTokens()`. Member login using Wix-hosted UI uses `generateOAuthData()`, `getAuthUrl()`, `parseFromUrl()`, and `getMemberTokens()`. Exact login callback URIs must already be allowed in Headless Settings. The admin API key is restricted to trusted backend/migration scripts and must never be imported into browser code or committed to the repository.

Sources:
- https://dev.wix.com/docs/go-headless/authentication/setup/create-an-sdk-client-with-oauth
- https://dev.wix.com/docs/sdk/core-modules/sdk/oauth-strategy
- https://dev.wix.com/docs/go-headless/authentication/visitors/authenticate-visitors-js-sdk
- https://dev.wix.com/docs/go-headless/authentication/members/about-member-login
