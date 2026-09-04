# Manual Steps Before Running the KLUB-CY One-Shot Prompt

**Author:** Manus AI

Complete these steps in the same local `ma4kos/KLUB` working copy that Claude Code has already used. The ZIP contains no API key or password.

## 1. Back Up the Local Working Copy

Open a terminal at the KLUB repository and inspect the current state:

```bash
cd /absolute/path/to/KLUB
git status --short --branch
git rev-parse HEAD
git remote -v
```

Do not discard uncommitted work. Commit it if it is ready, or leave it in place; the one-shot prompt is instructed to preserve it.

## 2. Extract the Kit into the Repository

The release archive contains one top-level folder named `klub-cy-wix`.

### macOS or Linux

```bash
cd /absolute/path/to/KLUB
mkdir -p tools
unzip -q /absolute/path/to/KLUB_CY_Claude_Code_One_Shot_Migration_Kit.zip -d tools
chmod +x tools/klub-cy-wix/scripts/*.sh
```

### Windows PowerShell

```powershell
Set-Location C:\absolute\path\to\KLUB
New-Item -ItemType Directory -Force tools | Out-Null
Expand-Archive -Path C:\absolute\path\to\KLUB_CY_Claude_Code_One_Shot_Migration_Kit.zip -DestinationPath tools -Force
```

Verify this exact path exists:

```text
tools/klub-cy-wix/plugin/claude-code-wix-development/.claude-plugin/plugin.json
```

## 3. Store Secrets Outside Git

Create an ignored secret directory and copy the attached Wix key file into it.

### macOS or Linux

```bash
mkdir -p .secrets
cp /absolute/path/to/WixAPIKey.txt .secrets/WixAPIKey.txt
chmod 600 .secrets/WixAPIKey.txt
cp tools/klub-cy-wix/config/.env.klub-cy.example .env.klub-cy.local
printf '\n.env.klub-cy.local\n.secrets/\n.klub-wix-migration/\n' >> .git/info/exclude
```

### Windows PowerShell

```powershell
New-Item -ItemType Directory -Force .secrets | Out-Null
Copy-Item C:\absolute\path\to\WixAPIKey.txt .secrets\WixAPIKey.txt
Copy-Item tools\klub-cy-wix\config\.env.klub-cy.example .env.klub-cy.local
Add-Content .git\info\exclude "`n.env.klub-cy.local`n.secrets/`n.klub-wix-migration/"
```

Confirm that Git does not see the secret files:

```bash
git status --short --ignored
```

The key and environment file should be ignored. Never paste the key into the prompt.

## 4. Fill `.env.klub-cy.local`

Open the local environment file in a text editor and fill these values:

```dotenv
KLUB_NETLIFY_PASSWORD=<the protected-site password you supplied>
WIX_MAIN_DOMAIN=<the exact custom domain currently attached to KLUB-CY>
WIX_BACKEND_SUBDOMAIN=checkout.<the-main-domain>
```

Do not add quotes unless the value contains leading or trailing whitespace. The password may contain punctuation; the supplied scripts parse the file directly rather than sourcing it through a shell.

### Find the exact main domain

The supplied API key successfully accessed KLUB-CY but Wix rejected `List Connected Domains` with `403 DOMAINS_PERMISSION_DENIED`. Find the domain manually in Wix:

1. Open the **KLUB-CY** dashboard.
2. Go to **Settings → Domains**.
3. Copy the exact currently connected primary domain into `WIX_MAIN_DOMAIN`.
4. Choose an unused Wix-hosted-flow subdomain such as `checkout.<main-domain>` and place it in `WIX_BACKEND_SUBDOMAIN`. Do not connect or switch it yet.

Alternatively, edit or regenerate the Wix API key and add **Read Connected Domains** (`DOMAINS.READ_CONNECTED_DOMAINS`), then replace `.secrets/WixAPIKey.txt`.

## 5. Check the Wix API Key Permissions

The live read-only checks passed for site discovery, CMS collection listing, CMS backup listing, OAuth app query, and Wix Forms query. For an automated migration run, the key must also include the write permissions used by the stages you enable.

| Capability | Required permission from live Wix schemas |
|---|---|
| Resolve account sites | `SITE_LIST.READ` |
| Read connected domains | `DOMAINS.READ_CONNECTED_DOMAINS` |
| Duplicate the Wix site, optional | `my-account.duplicate-site` |
| List/create native CMS collections | `WIX_DATA.LIST_COLLECTIONS`, `WIX_DATA.CREATE_COLLECTION` |
| Save/query CMS records | `WIX_DATA.BULK_SAVE`, `WIX_DATA.QUERY` |
| Create/list CMS backups | `WIX_DATA.CREATE_BACKUP`, `WIX_DATA.LIST_BACKUPS` |
| Read/create/update Headless clients | `OAUTH_APP.APP_READ`, `OAUTH_APP.APP_CREATE`, `OAUTH_APP.APP_UPDATE` |
| Query/create Forms | `forms:v4:form:query_forms`, `forms:v4:form:create_form` |
| Create Form submissions | `forms:v4:submission:create_submission` |
| Read/upload Media Manager files, optional | Manage Media Manager / the live Media permissions retrieved by the prompt |
| Create or update CRM contacts, if used | `CONTACTS.MODIFY` plus the applicable read/query permission |

If Wix does not allow editing the existing key, create a replacement account API key with the permissions above. Store it in the same ignored key file. Do not delete the old key until the run is complete and verified.

## 6. Select the Execution Mode

The recommended first run performs real Wix backend provisioning while preserving the live domain and avoiding a production Netlify deployment:

```dotenv
KLUB_ALLOW_WIX_WRITES=true
KLUB_ALLOW_NETLIFY_PRODUCTION_DEPLOY=false
KLUB_ALLOW_DOMAIN_CUTOVER=false
KLUB_CREATE_WIX_SITE_DUPLICATE=false
KLUB_CREATE_CMS_BACKUP=true
KLUB_PROVISION_HEADLESS_CLIENT=true
KLUB_PROVISION_CMS=true
KLUB_MIGRATE_FORMS=true
KLUB_MIGRATE_MEDIA=false
```

This mode creates the Headless client, native KLUB CMS collections/items, and Forms if their live schemas and permissions validate. It builds and tests the integrated frontend and may create a Netlify deploy preview. It does not change the current Wix domain, remove the editor site, or publish a production Netlify deployment.

For an evaluation-only run, set `KLUB_ALLOW_WIX_WRITES=false`. Claude will still validate the plugin/MCP, inspect both sites, build all exact request bodies, modify code on its migration branch, and run local tests, but it will not provision Wix.

Do not set `KLUB_ALLOW_DOMAIN_CUTOVER=true` on the first run. Even when enabled later, the prompt requires one final confirmation after printing the exact DNS before/after plan.

## 7. Authenticate Netlify in the Terminal

The one-shot run can build locally without Netlify authentication. A deploy preview requires a logged-in Netlify CLI session.

```bash
npx netlify-cli login
npx netlify-cli status
```

If the repository is not linked to the existing KLUB Netlify site, run:

```bash
npx netlify-cli link
```

Choose the existing site that serves `https://klub-cy.netlify.app/`. Do not create a second Netlify site. The CLI stores its link outside committed source in `.netlify/`; confirm that directory is ignored.

## 8. Validate and Start the Bundled Plugin

### macOS or Linux

```bash
claude plugin validate tools/klub-cy-wix/plugin/claude-code-wix-development --strict
bash tools/klub-cy-wix/scripts/launch-claude-with-wix-plugin.sh .
```

### Windows PowerShell

```powershell
claude plugin validate tools\klub-cy-wix\plugin\claude-code-wix-development --strict
PowerShell -ExecutionPolicy Bypass -File tools\klub-cy-wix\scripts\launch-claude-with-wix-plugin.ps1 -RepoRoot .
```

If your installed Claude Code version does not support `plugin validate`, skip only that command. The launcher still loads the plugin with `--plugin-dir`.

## 9. Connect the Wix MCP

When Claude Code opens, check `/plugin` and confirm the local Wix Development Expert plugin is enabled. If the Wix MCP requests OAuth authorization, complete the Wix sign-in in the browser and authorize the official connector for the account containing KLUB-CY.

Do not paste the API key into Claude chat. The prompt uses the official Wix MCP for schemas/context and the ignored local key file for server-side REST validation and approved writes.

## 10. Paste the One-Shot Prompt

Open `tools/klub-cy-wix/ONE_SHOT_PROMPT.md` and paste the entire fenced prompt into Claude Code. Keep the session open while Claude works. It should ask no routine questions because the target and architecture are locked.

It may legitimately stop for one of four reasons:

| Stop condition | Required action |
|---|---|
| A required key permission is missing | Add the named permission or run the affected step manually |
| Netlify CLI is not authenticated or linked | Run `npx netlify-cli login` or `link` and tell Claude to resume |
| A form/business mapping is materially ambiguous | Approve the printed mapping without changing the target |
| Domain cutover is enabled | Review and confirm the exact DNS/domain before-and-after plan |

## 11. Expected First-Run Result

A successful recommended first run ends with **preview migration complete; production deploy/domain cutover pending**. It should leave:

- a working Wix-connected Astro branch;
- one public Headless client ID and no client secret in the browser;
- six native KLUB CMS collections with 65 reconciled records;
- two Wix form schemas or a documented, tested server-side fallback;
- the source Netlify site unchanged and still password-protected;
- a tested deploy preview when Netlify access is available;
- `.klub-wix-migration/completion.json` and `MIGRATION_REPORT.md` containing redacted evidence and rollback steps.

## 12. Production and Domain Follow-Up

After accepting the preview, set `KLUB_ALLOW_NETLIFY_PRODUCTION_DEPLOY=true` and rerun the same prompt; it will resume from durable state. Only after the production frontend is verified should you set `KLUB_ALLOW_DOMAIN_CUTOVER=true`. Wix’s official sequence requires the main domain to point at Netlify while a separate Wix subdomain becomes the Wix project’s primary and hosted-pages domain. Preserve mail DNS records and follow the exact printed runbook.[1]

## References

[1]: https://dev.wix.com/docs/go-headless/self-managed-headless/get-started/migrate-from-an-existing-wix-site/migrate-a-wix-site-to-a-headless-project "Migrate a Wix Site to a Self-Managed Headless Project"
