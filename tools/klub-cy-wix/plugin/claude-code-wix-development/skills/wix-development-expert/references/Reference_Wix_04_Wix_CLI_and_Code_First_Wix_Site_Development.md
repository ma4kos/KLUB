# Wix CLI and Code-First Wix Site Development

**Purpose:** Provide a comprehensive, RAG-ready reference for developing with Wix CLI, including site development, headless projects, apps, environment variables, CI/CD, troubleshooting, and agent instructions.
**Audience:** Claude Code, Manus agents, and developers automating Wix CLI workflows.
**Last-Researched Date:** 2026-09-02
**Retrieval Keywords:** wix cli, wix cli for sites, wix headless, wix app development, astro, github integration, ci/cd, wix preview, wix release, wix.config.json, extensions.ts

## Introduction

Wix provides two primary paths for code-first development using a local integrated development environment and command-line tools. The first path is the **Wix CLI for Sites**, which utilizes Git integration to connect standard Wix sites to a repository. The second path is the **Unified Wix CLI**, which manages modern applications and Wix-managed headless projects based on the Astro framework. This chapter details the setup, project structures, development lifecycles, and troubleshooting for both approaches, serving as a definitive guide for automated agents and developers.

## 1. Site Development: Git Integration & Wix CLI for Sites

This workflow connects a standard Wix site to a GitHub repository. By establishing this connection, developers can replace the built-in cloud code editor with their preferred local integrated development environment, enabling standard version control and concurrent editing [1].

### Setup and Connection

To initiate the integration, navigate to Wix Studio or the Wix Editor and select the option to connect to GitHub [2]. This process requires authenticating and authorizing the Velo GitHub App to create a repository on your behalf.

It is crucial to understand the rules governing this integration. Once the connection is established, the Wix cloud code editor enters a strict read-only mode [2]. Furthermore, Velo Packages cannot be utilized within this integration, although standard npm packages remain fully supported [2]. Finally, if a site is disconnected from its repository, it cannot be reconnected to the same repository later [2].

### Local Environment Setup

After the repository is generated, clone it to your local machine. Install the necessary dependencies by running standard package manager commands such as `npm install` or `yarn install`. Subsequently, install the command-line interface globally using the command `npm install -g @wix/cli` to enable local development commands [2].

### Repository Structure

The site repository is structured to mimic the code sidebar found within the Wix Editor. Understanding this structure is essential for navigating the codebase.

| Path/File | Description |
| :--- | :--- |
| `wix.config.json` | Associates code with the site and UI version. **Do not edit manually** [3]. |
| `src/pages/` | Frontend code. File names must match the Editor's format (e.g., `pageName.id.js`). **Do not rename** [3]. |
| `src/backend/*.web.js` | Web modules exposed to the frontend [3]. |
| `src/backend/data.js` | Data hooks [3]. |
| `src/backend/routers.js` | Routing and sitemaps [3]. |
| `src/backend/events.js` | Backend event handlers [3]. |
| `src/backend/http-functions.js` | Exposed HTTP endpoints [3]. |
| `src/backend/jobs.config` | Scheduled recurring jobs [3]. |
| `src/public/` | Public code files [3]. |
| `src/velo.dependencies.json` | Tracks installed npm packages. **Do not edit manually** [3]. |

### Development Lifecycle

The development lifecycle relies on specific command-line operations to test and deploy code. Executing `wix dev` opens a specialized local version of the Wix Editor, allowing developers to test code changes in real time [4]. Within this local editor, code files remain read-only; all modifications must occur within the local integrated development environment.

To generate a shareable preview URL of the built project, developers use the `wix preview` command. It is important to note that HTTP functions utilize live versions during preview, requiring functional testing within the Editor for accurate assessment [4].

Finally, the `wix publish` command deploys the site. Developers have the option to publish the latest commit from the default branch or to publish local code directly. Publishing local code is generally discouraged, as it leaves the live site out of sync with the GitHub repository [4].

## 2. Unified Wix CLI (Apps & Headless)

The modern unified Wix CLI is designed to manage self-contained applications and Wix-managed headless projects using an Astro-based framework [5]. It is important to note that the legacy tooling, known as the "Legacy Wix CLI for Apps," is now deprecated and should not be used for new projects [5].

### Project Creation

Project creation is facilitated through the `@wix/create-new` package via the standard `npm create` command [5].

| Command | Purpose |
| :--- | :--- |
| `npm create @wix/new@latest -- app --app-name "Name"` | Registers a new app, provisions `wix.config.json` with `appId`, and initializes Git [5]. |
| `npm create @wix/new@latest -- headless --folder-name my-site --business-name "Biz"` | Provisions a Wix site, creates an Astro project, handles OAuth, and writes IDs to `wix.config.json` [5]. |
| `npm create @wix/new@latest -- headless link --business-name "Biz"` | Modifies an existing Astro 5 project in-place, provisions a site, and adds Wix Astro integrations [5]. |
| `npm create @wix/new@latest init` | Provisions a site and writes `wix.config.json` without scaffolding templates or dependencies [5]. |

### Project Structure (Modern CLI)

Modern CLI projects follow a standardized directory structure. The `.wix` folder contains internal configurations and must not be edited. The `dist` folder holds the build output, while the `src` folder contains the application logic. The `wix.config.json` file stores critical project identifiers such as the application ID and site ID, and it should remain untouched by developers [5].

A critical component of this structure is the `extensions.ts` file located in the `src` directory. This file serves as the central registry for all extensions. Extensions must be registered using a specific builder pattern. For example, developers must import the application and extensions builders from the Astro package, import their specific extension, and chain it to the application builder [5].

```typescript
import { app, extensions } from '@wix/astro/builders';
import myPage from './extensions/dashboard/pages/my-page.extension.ts';
export default app().use(myPage);
```

### CLI Commands (Modern)

The modern command-line interface provides several commands for managing the application lifecycle. The `wix dev` command starts a local development server with hot reloading, defaulting to port 4321 [5]. To scaffold new extensions, such as dashboard pages or service plugins, developers use the `wix generate` command [5].

Before previewing or releasing an application, it must be compiled using the `wix build` command [5]. Once built, `wix preview` uploads the code to Wix and generates a shareable preview URL; however, this command does not register new extensions in the application configuration [5]. To push code, publish the project, create a new application version, and register new extensions, developers must execute the `wix release` command [5].

Environment variables synchronized with Wix servers are managed using the `wix env pull`, `wix env set`, and `wix env remove` commands [5].

## 3. CI/CD and Automations (GitHub Actions)

Wix CLI for Sites can be integrated into continuous integration and continuous deployment pipelines, such as GitHub Actions, utilizing an API key [6].

To set up this automation, developers must first generate an API key in the Wix API Keys Manager, ensuring it possesses the "Wix CLI for Sites - Git Integration" permission [6]. This key should be stored securely as a GitHub secret, typically named `WIX_CLI_API_KEY` [6].

Within the workflow configuration file, authentication is achieved by running the login command and passing the secret key. After authentication, the workflow can execute commands such as `npm run wix preview` or `npm run wix publish` to automate the deployment process [6].

## 4. Troubleshooting and Recovery

When publishing via Git Integration, Wix performs syntax validation on the codebase. If errors occur, they are recorded in a `build.log` file, which is retained for thirty days for diagnostic purposes [7].

If a site needs to be reverted, the Site History feature allows developers to restore a previous version. This action reverts pages, code, hooks, routers, schemas, and permissions. However, it is critical to understand that restoring a version does not revert data within the Sandbox or Live databases [8].

## 5. Advanced Workflow Patterns

The integration of Wix sites with GitHub unlocks powerful concurrent development workflows. By leveraging standard Git branching strategies, multiple developers can work on separate features simultaneously without interfering with each other's progress. Developers should create a new branch for each feature or bug fix, isolating changes and allowing for independent testing. Once a feature is complete, a pull request should be opened against the main branch, enabling code review and automated testing before merging.

Robust testing is crucial for maintaining the reliability of Wix sites and applications developed using the command-line interface. Modern Wix CLI projects support standard testing frameworks like Vitest. Developers should write unit tests for individual functions, components, and backend logic to ensure they behave as expected in isolation. Additionally, end-to-end testing tools can simulate user interactions and test the entire application flow from the user interface to the database.

While Velo Packages are not supported when using Git Integration, developers can still leverage external code through npm packages. Any standard npm package can be installed using the package manager, and the `src/velo.dependencies.json` file tracks these dependencies. It is important to ensure that the packages used are compatible with the Node.js version running in the Wix backend environment.

## 6. Deep Dive: Wix-Managed Headless vs. Self-Managed Headless

When building headless solutions with Wix, developers must choose between Wix-managed and self-managed hosting. The modern Wix CLI streamlines the Wix-managed approach, where the frontend is built using Astro and hosted directly on Wix's infrastructure. This provides a simplified deployment process, integrated authentication, and seamless access to Wix APIs.

Conversely, a self-managed headless architecture allows the frontend to be built using any framework and hosted on a third-party provider. The backend communicates with Wix via the Wix Headless SDK or REST APIs. This approach offers complete control over the frontend stack and infrastructure but introduces increased complexity in setup, maintenance, and manual configuration of authentication.

## 7. Common Pitfalls and Anti-Patterns

A common anti-pattern is manually editing auto-generated files such as `wix.config.json` or `src/velo.dependencies.json`. This practice can break the synchronization between the local repository and the Wix platform, leading to deployment failures. Developers must always use the appropriate command-line operations to manage dependencies and configuration.

Another frequent mistake is renaming files in the `src/pages/` directory of a Git-integrated site. The Wix Editor relies on specific file naming conventions to map code to user interface elements. Renaming these files breaks this mapping. If a page needs to be renamed, it should be done within the Wix Editor user interface, allowing the changes to reflect in the repository upon synchronization.

Ignoring build errors and pushing code to the repository without running a local build is a dangerous practice. Syntax errors or missing dependencies will cause the publish process to fail, potentially leaving the site in an inconsistent state. Always run a local build and address any errors before committing and pushing code.

## 8. Agent Retrieval Checklist

When operating on a Wix CLI or code-first development task, verify the following conditions before proceeding:

First, determine the context by identifying whether the project is a standard Wix site using Git Integration or a modern application utilizing the unified Astro-based CLI.

Second, inspect the project structure. For integrated sites, ensure files reside in the correct directories and that page files have not been renamed. For modern applications, verify that the central registry file correctly registers all extensions using the required builder pattern.

Third, verify dependencies. For Git Integration sites, ensure no Velo Packages are present, as they are incompatible with this workflow.

Fourth, manage environment variables appropriately. For modern applications, use the dedicated environment commands to manage variables synchronized with Wix servers.

Fifth, distinguish between preview and release commands. Remember that previewing modern applications does not register new extensions; a full release command is required for registration.

Finally, ensure continuous integration authentication is properly configured. The API key must possess the correct permissions and be securely stored as a secret for automated workflows.

---

## References

[1]: https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/about-git-integration-wix-cli-for-sites.md "About Git Integration & Wix CLI for Sites"
[2]: https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/setting-up-git-integration-wix-cli-for-sites.md "Setting Up Git Integration & Wix CLI for Sites"
[3]: https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/git-hub-repository-file-structure.md "Git Hub Repository File Structure"
[4]: https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/wix-cli-for-sites-commands.md "Wix CLI for Sites Commands"
[5]: https://dev.wix.com/docs/wix-cli/guides/about-the-wix-cli.md "Wix CLI Reference"
[6]: https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/set-up-git-hub-actions-to-work-with-the-wix-cli-for-sites.md "Set up GitHub Actions to work with the Wix CLI for Sites"
[7]: https://dev.wix.com/docs/develop-websites-sdk/publish-your-site/publish-error-log/about-the-publish-error-log.md "About the Publish Error Log"
[8]: https://dev.wix.com/docs/develop-websites-sdk/publish-your-site/site-history/about-site-history.md "About Site History"
