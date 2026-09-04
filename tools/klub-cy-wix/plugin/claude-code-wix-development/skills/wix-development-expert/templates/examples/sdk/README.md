# Wix SDK Examples

`oauth-client.ts` follows Wix's visitor/member Headless client pattern. Persist refreshed tokens securely and reuse the client to maintain the session. `api-key-client.ts` is a trusted-backend/admin example and must never be bundled into browser code. `managed-headless-cms.ts` follows the direct module pattern used by official Wix-managed Astro templates, where the managed environment supplies authorization.

Install and type-check with `npm install && npm run typecheck`. Package versions are pinned to the official Wix Headless template baseline where possible; verify current versions before production use.
