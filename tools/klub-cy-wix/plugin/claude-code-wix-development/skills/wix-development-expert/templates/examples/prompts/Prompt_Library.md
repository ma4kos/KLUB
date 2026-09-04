# Claude Code and Wix MCP Prompt Library

## Schema-First SDK Task

> Use the installed Wix plugin and MCP. Identify the relevant Wix skill, search the SDK documentation, retrieve the full method schema, and cite the source URL. Then propose TypeScript code. Do not write or run it until you have shown the target account/site scope, permissions, inputs, pagination behavior, error cases, and validation plan.

## Site-Scoped Read

> Call the Wix routing/readme tool, list available sites, resolve the selected site's context and installed apps, retrieve the exact REST method schema, and execute a read-only query. Return the site ID/name, method, request, result count, paging state, and source documentation.

## Controlled Write

> Prepare a dry-run plan for this Wix write. Resolve the account and site, retrieve the exact method schema, validate every field, calculate the affected record count, define the source-identity deduplication rule, read-back verification, and rollback. Stop and ask for explicit approval before calling the write tool.

## Existing-Site Migration Discovery

> Analyze the supplied repository and public website using browser-backed evidence. Produce routes, content types, assets with hashes/dimensions, design tokens, components, forms, integrations, SEO, structured data, tests, and business workflows. Freeze a source manifest. Do not create a Wix site or import anything.

## Migration Mapping

> Using the frozen source manifest, map each entity and route to Wix-managed Headless, CMS, Media Manager, Forms/CRM, Bookings, Stores/eCommerce, Blog, Events, Members, SEO, or retained custom code. Include account/site scope, interface, prerequisites, crosswalk key, write semantics, validation, and rollback. Highlight every uncertain mapping.

## KLUB Payload Generation

> Run the read-only KLUB payload builder. Compare output counts and hashes to the source inventory. Propose exact Wix CMS schemas only after retrieving the current collection and data-item method schemas. Do not make API calls.

## MCP Tool Contract Audit

> Read the current Wix MCP documentation and repository. Produce a table of every tool, its intent, read/write nature, scope, required context, and confirmation gate. Flag differences from any screenshots or prior documentation as date-sensitive changes.

## Error Recovery

> Classify the failure as authentication, permission, account/site scope, missing app, schema validation, pagination/rate limit, CLI environment, stale artifact, or service error. Retrieve the relevant current documentation, preserve the operation state, attempt at most two distinct targeted recoveries, and record an actionable blocker if the problem persists.

## Preview and Release

> Build the Wix-managed Headless project and produce a preview. Run route, link, asset, accessibility, SEO, structured-data, form, booking, analytics, and visual-parity checks. Summarize unresolved gaps by severity. Stop before release and request explicit approval with rollback instructions.
