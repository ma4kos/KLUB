# Wix Business and Account APIs: Reference Guide

**Purpose**: Provide an authoritative, RAG-ready reference for integrating and managing Wix Business and Account APIs across various architectures.
**Audience**: AI Agents (Claude Code, Manus), Wix Developers, System Architects
**Last Researched**: 2026-09-02
**Retrieval Keywords**: Wix Business APIs, eCommerce, Stores, Bookings, Pricing Plans, Events, Blog, Restaurants, Payments, Coupons, Account, Sites, Domains, Users, REST, SDK, Headless.

---

## 1. Introduction to Wix Business and Account APIs

Wix provides a comprehensive, enterprise-grade suite of Business and Account APIs that allow developers to manage eCommerce operations, scheduling, content, and user accounts. These APIs are accessible via multiple paradigms, including the modern Wix SDK for frontend and Node.js environments, REST APIs for language-agnostic integrations, and CLI tools for local development.

The APIs are divided into two main categories:
1.  **Business APIs**: Manage the core functional and transactional operations of a Wix site, such as Stores (eCommerce), Bookings, Events, and Payments. These APIs handle the business logic and data models that drive revenue and customer interaction.
2.  **Account APIs**: Manage site infrastructure, domains, user permissions, and overarching account settings. These APIs are essential for platform administration, programmatic site generation, and security management.

This document serves as a foundational guide for understanding the boundaries, capabilities, and operational patterns required to build robust applications on top of the Wix ecosystem.

---

## 2. Scope Boundaries and Authentication

Understanding scope and authentication is critical for successful integration. Wix uses standard OAuth 2.0 protocols for API authentication, ensuring secure and scoped access to resources.

### 2.1 Authentication Methods

The choice of authentication method depends entirely on the architectural context of the integration.

| Method | Context | Use Case | Security Implication |
| :--- | :--- | :--- | :--- |
| **API Keys** | Server-to-Server | Accessing APIs from a secure backend (e.g., Node.js, Python, Java). Requires careful scope configuration within the Wix Developer Console. | Keys must be stored securely (e.g., AWS Secrets Manager, HashiCorp Vault) and never exposed to the client. |
| **OAuth (App)** | Third-Party Apps | Building applications for the Wix App Market that will be installed by multiple Wix users. Involves a user consent flow (OAuth dance). | Requires managing refresh tokens and handling token expiration gracefully. |
| **Visitor Auth** | Frontend | Authenticating site visitors (members or guests) to access personalized data directly from the browser using the Wix SDK. | Tokens are short-lived and tied to the user's session. |

### 2.2 Scope Boundaries

Scopes define the exact permissions granted to an API Key or OAuth App. They act as the primary security boundary.

*   **Granularity**: Scopes are highly granular to adhere to the principle of least privilege. For example, `WixStores.Products.Read` allows reading product data, while `WixStores.Products.Modify` is required to update or create products.
*   **Validation Gate**: If an API call fails with an HTTP `403 Forbidden` status code, the primary and most common cause is missing or incorrect scopes associated with the authentication token.

> **Agent Instruction**: Always verify the required scopes in the official documentation before generating code that makes API calls. When debugging a 403 error, the first step is to audit the configured scopes against the endpoint requirements.

---

## 3. Core Business APIs

### 3.1 Wix Stores (eCommerce)

The Stores API manages the complete eCommerce lifecycle, from product catalog management to order fulfillment.

*   **Capabilities**: Manage products (including variants and options), inventory levels, orders, and checkout flows. It also supports complex tax and shipping configurations.
*   **Working Pattern**: A typical headless checkout flow involves:
    1.  Querying products and displaying them.
    2.  Creating a cart session.
    3.  Adding items to the cart.
    4.  Generating a secure checkout URL or handling payment directly via the Payments API (if compliant).
*   **Migration Caveat**: When migrating from another platform (e.g., KLUB, Shopify, Magento), ensure product variants and SKUs are mapped correctly to Wix's hierarchical structure. Wix handles variants differently than some legacy systems, requiring careful payload construction during data ingestion.
*   **Failure Mode**: Attempting to update inventory for a product that has inventory tracking disabled will result in an error. Always check the `inventoryStatus` flag before attempting updates.

### 3.2 Wix Bookings

The Bookings API handles complex scheduling for services, classes, and courses.

*   **Capabilities**: Manage services (1-on-1 or group), staff schedules, availability, and the booking lifecycle.
*   **Operational Sequencing**: The critical sequence for a successful booking is:
    1.  Query availability for a specific service and time range.
    2.  Reserve the slot (optional but recommended for high-concurrency scenarios).
    3.  Create a booking record.
    4.  Handle payment (if the service is not free).
*   **Anti-Pattern**: Attempting to book a slot without first checking real-time availability. This leads to double-bookings and data inconsistency. Always rely on the `queryAvailability` endpoint immediately before confirming a booking.

### 3.3 Wix Pricing Plans

Manage recurring subscriptions and one-time purchases for digital or physical access.

*   **Capabilities**: Define pricing plans (monthly, annual, lifetime), manage user subscriptions, handle upgrades/downgrades, and process cancellations.
*   **Integration Point**: Often used in conjunction with the Members API to grant access to restricted content based on an active subscription.
*   **Validation Gate**: Ensure that webhooks are properly configured to handle subscription lifecycle events (e.g., payment failed, subscription canceled) to keep local databases in sync with Wix.

### 3.4 Wix Events

Manage event ticketing, RSVPs, and guest lists for in-person or virtual events.

*   **Capabilities**: Create events, manage ticket types (free, paid, VIP), track RSVPs, and handle capacity limits.
*   **Operational Sequencing**: When selling tickets, the flow involves creating a ticket reservation, processing the payment, and then confirming the ticket issuance.
*   **Failure Mode**: Exceeding the capacity limit for an event or specific ticket type will result in a validation error. The API handles concurrent booking attempts, but the frontend must gracefully handle "sold out" responses.

### 3.5 Wix Blog

A robust Headless CMS tailored for blog posts, categories, and tags.

*   **Capabilities**: Create, read, update, and delete posts. Manage authors, categories, and tags. Retrieve rich text content for rendering on custom frontends.
*   **Working Pattern**: When building a headless blog, use the `queryPosts` endpoint with pagination and filtering to build index pages, and `getPost` to fetch the full content for individual article pages.
*   **Migration Caveat**: Migrating rich text content from other CMS platforms (like WordPress) requires careful transformation into Wix's specific rich text format (often a structured JSON representation) to preserve formatting.

### 3.6 Wix Restaurants

Manage menus, online ordering, and table reservations for the restaurant vertical.

*   **Capabilities**: Define complex menus (categories, items, modifiers), handle incoming online orders, and manage table reservations.
*   **Anti-Pattern**: Polling the orders endpoint too frequently. Use Webhooks to receive real-time notifications of new orders to reduce API load and improve responsiveness.

### 3.7 Wix Payments

Process transactions securely across various payment methods.

*   **Capabilities**: Initiate payments, handle refunds, and retrieve transaction details.
*   **Scope Boundaries**: The Payments API has the strictest security requirements. Access to sensitive payment data is highly restricted.
*   **Date-Sensitive Topic**: Ensure compliance with the latest SCA (Strong Customer Authentication) requirements when handling recurring payments or high-value transactions.

### 3.8 Wix Coupons

Create and validate discount codes for marketing campaigns.

*   **Capabilities**: Create fixed amount, percentage, or free shipping coupons. Set usage limits and expiration dates.
*   **Working Pattern**: Coupons must be validated and applied during the checkout process (via the Stores or Bookings API) to recalculate the final total.

---

## 4. Account and Infrastructure APIs

### 4.1 Sites and Domains

Manage the foundational infrastructure of Wix accounts.

*   **Capabilities**: Programmatically create sites from templates, manage domain connections, handle SSL certificates, and retrieve site metadata.
*   **Failure Mode**: Domain connection failures often stem from incorrect DNS records (A or CNAME) at the registrar. The API provides endpoints to verify DNS configuration before attempting to finalize the connection.
*   **Working Pattern**: When building agency tools, use the Sites API to automate the provisioning of new client sites, ensuring a consistent starting configuration.

### 4.2 Users and Permissions

Manage site members, assign roles, and handle custom authentication flows.

*   **Capabilities**: Create and manage members, assign custom roles, handle login/registration flows, and manage member badges.
*   **Scope Rules**: Accessing user Personally Identifiable Information (PII) requires explicit user consent or high-level administrative scopes. Always adhere to GDPR and CCPA guidelines when handling user data.
*   **Integration Point**: Use the Members API in conjunction with external Identity Providers (IdPs) like Auth0 or Okta for SSO (Single Sign-On) implementations.

---

## 5. Architectural Contexts

Wix APIs can be consumed in various architectural patterns, depending on the project requirements.

### 5.1 Wix Headless (Managed vs. Self-Managed)

| Context | Description | Best For |
| :--- | :--- | :--- |
| **Managed Headless** | Wix hosts the custom frontend (e.g., React, Astro, Next.js) and handles CDN, SSL, and deployment pipelines. | Rapid deployment, simplified infrastructure, projects that want to leverage Wix's global edge network without managing servers. |
| **Self-Managed** | Developer hosts the frontend on third-party platforms (Vercel, Netlify, AWS, GCP) and calls Wix APIs remotely. | Maximum control, integrating with complex existing backend systems, or adhering to strict corporate infrastructure policies. |

### 5.2 Integration Patterns

*   **Wix SDK**: The recommended approach for JavaScript/TypeScript environments. Use `@wix/sdk` along with specific domain modules (e.g., `@wix/stores`, `@wix/bookings`). The SDK handles authentication, retries, and provides strong typing.
*   **REST APIs**: Use standard HTTP requests for non-JS environments (Python, Go, Java) or when the SDK is not suitable. Requires manual handling of authentication headers and pagination.
*   **Wix CLI**: Used for local development, syncing code to Wix, and managing app extensions.

---

## 6. Date-Sensitive Topics and Caveats

The Wix API ecosystem is actively evolving. Developers and agents must be aware of the following:

**Date-Sensitive Topics**: As of September 2026, the transition from older V1 REST endpoints to the newer V2/V3 APIs (which are strictly aligned with the modern SDK structure) is ongoing. Certain features, particularly in the advanced Headless CMS areas and specialized Payments routing, may be in preview or subject to rate limit changes. Always verify current quotas, pricing for premium API access, and deprecation notices in the official Wix Developer Portal before finalizing an architecture. Capabilities, limits, and tool contracts require periodic rechecking to ensure continued compatibility.

---

## 7. Agent Retrieval Checklist

Before generating code, formulating an architecture, or executing configuration for Wix Business and Account APIs, the AI agent MUST verify the following:

1.  **Authentication Context**: Is this a server-side (API Key), client-side (Visitor), or App (OAuth) integration? This determines the initialization of the SDK or the headers for REST calls.
2.  **Scope Requirements**: What specific scopes are needed for the requested operation? Have they been explicitly requested or configured?
3.  **API Version**: Are we using the latest stable SDK module or REST endpoint? Check for V2/V3 availability.
4.  **Payload Structure**: Does the data payload match the exact schema required by Wix? Pay special attention to nested objects and enum values.
5.  **Error Handling**: Is there logic to handle rate limits (HTTP 429) and permission errors (HTTP 403)? Implement exponential backoff for retries.
6.  **Idempotency**: For financial or critical operations (e.g., creating an order), are idempotency keys being used to prevent duplicate transactions?

---

## References

[1]: https://dev.wix.com/docs/api-reference "Wix Developer Documentation"
[2]: https://dev.wix.com/docs/go-headless.md "Wix Headless Integration Guide"
[3]: https://dev.wix.com/docs/sdk "Wix SDK Reference"
[4]: https://dev.wix.com/docs/rest "Wix REST API Reference"
[5]: https://dev.wix.com/docs/velo "Wix Velo Documentation"
