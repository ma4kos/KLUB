# Wix API, MCP, Claude Code, and Replatforming Knowledge Corpus

**Author:** Manus AI  
**Research snapshot:** 2026-09-02  
**Purpose:** A RAG-ready project corpus and implementation reference for Claude Code and Manus Wix development skills.

## How to Use This Corpus

Start with this file. Load only the chapter or example family relevant to the current task, then verify date-sensitive Wix methods, prices, credit rules, previews, and tool contracts against live official documentation before acting. For API work, retrieve the exact current method schema. For Wix writes, resolve account and site context, present a dry-run plan, and preserve the required approval gate.

The corpus contains conceptual references and executable examples. Conceptual chapters explain architecture, boundaries, and decisions. The example library provides compile-checked patterns and read-only KLUB migration transforms. Raw Wix documentation snapshots, official repository clones, and the KLUB source baseline live in the full research workspace/archive; they are intentionally excluded from the lightweight installable skills and should be searched selectively rather than loaded wholesale.

## Core Chapters

| File | Purpose | Words | Sources |
|---|---|---:|---:|
| [`Reference_Wix_01_Wix_Platform_Architecture_and_Development_Path_Decision_Guide.md`](./Reference_Wix_01_Wix_Platform_Architecture_and_Development_Path_Decision_Guide.md) | **Purpose**: This chapter serves as a definitive guide for Claude Code and Manus agents to understand Wix's platform architecture, evaluate development paths, and select the appropriate technical approach for Wix projects. **Audience**: AI Agents (Claude Code, Manus) assisting developers with Wix projects. **Last Researched Date**: 2026-09-02 **Retrieval Key… | 2,280 | 6 |
| [`Reference_Wix_02_Unified_Wix_API_Reference.md`](./Reference_Wix_02_Unified_Wix_API_Reference.md) | **Purpose:** Provide a definitive guide on the Unified Wix API, clarifying the boundaries between REST APIs, the JavaScript/TypeScript SDK, Velo-only APIs, and how AI agents should interact with them. **Audience:** Claude Code, Manus agents, and expert developers. **Last-Researched Date:** 2026-09-02 **Retrieval Keywords:** Wix Unified API, REST, JavaScript… | 2,030 | 8 |
| [`Reference_Wix_03_Wix_Authentication_Authorization_and_Security_Reference.md`](./Reference_Wix_03_Wix_Authentication_Authorization_and_Security_Reference.md) | **Purpose.** This chapter is the operational reference for choosing a Wix identity, authentication method, SDK strategy, permission model, and request-verification approach. It is written for AI coding agents, backend integrations, Wix Headless projects, Wix apps, and site code. Recheck the linked Wix documentation before production implementation because to… | 2,466 | 15 |
| [`Reference_Wix_04_Wix_CLI_and_Code_First_Wix_Site_Development.md`](./Reference_Wix_04_Wix_CLI_and_Code_First_Wix_Site_Development.md) | **Purpose:** Provide a comprehensive, RAG-ready reference for developing with Wix CLI, including site development, headless projects, apps, environment variables, CI/CD, troubleshooting, and agent instructions. **Audience:** Claude Code, Manus agents, and developers automating Wix CLI workflows. **Last-Researched Date:** 2026-09-02 **Retrieval Keywords:** wi… | 2,106 | 8 |
| [`Reference_Wix_05_Wix_Headless_Architecture_Integration.md`](./Reference_Wix_05_Wix_Headless_Architecture_Integration.md) | **Purpose.** This chapter guides architecture selection and implementation for Wix-managed Headless with Astro, Wix-managed Headless with another supported framework, and self-managed Headless. It covers hosting, authentication, SDK/REST boundaries, routing, SEO, extensions, members, commerce, deployment, operations, and migration. | 3,167 | 16 |
| [`Reference_Wix_06_Wix_App_Development_Comprehensive_Reference.md`](./Reference_Wix_06_Wix_App_Development_Comprehensive_Reference.md) | **Purpose:** This chapter provides authoritative guidance for developing Wix apps, including self-managed apps, CLI apps, Wix Blocks, and the app lifecycle. It covers OAuth, instances, permissions, extensions, plugins, and marketplace considerations. **Audience:** AI Agents (Claude Code, Manus) and Developers. **Last-Researched Date:** 2026-09-02 **Retrieval… | 3,158 | 20 |
| [`Reference_Wix_07_Wix_MCP_Claude_Code_and_Official_Wix_Skills.md`](./Reference_Wix_07_Wix_MCP_Claude_Code_and_Official_Wix_Skills.md) | **Purpose.** This chapter is the operational reference for connecting AI clients to Wix, selecting the correct Wix MCP tool family, installing the official Wix plugin or skills, retrieving documentation and method schemas, and controlling live site/account actions. It is intended for Claude Code, Claude, Manus, Cursor, VS Code/Copilot, Windsurf, n8n, and oth… | 2,716 | 12 |
| [`Reference_Wix_08_Wix_AI_Platform_and_Agent_Facing_Capabilities.md`](./Reference_Wix_08_Wix_AI_Platform_and_Agent_Facing_Capabilities.md) | **Purpose.** This chapter explains the Wix features that help AI agents build or manage Wix projects and the Wix APIs that add AI functionality to a site or app. These are different layers. The **Wix MCP, Wix plugin, and Wix Skills** help an external AI client work with Wix. The **Wix AI APIs** let application code call supported AI models through Wix. The *… | 2,967 | 14 |
| [`Reference_Wix_09_Wix_Development_CMS_Data_Media_Forms_CRM_Members_and_Migrations.md`](./Reference_Wix_09_Wix_Development_CMS_Data_Media_Forms_CRM_Members_and_Migrations.md) | **Purpose:** Provide authoritative, RAG-ready patterns and API boundaries for Wix CMS, Data, Media, Forms, CRM, Members, and migration strategies. **Audience:** Claude Code, Manus agents, and AI development systems orchestrating Wix tasks. **Last-Researched Date:** 2026-09-02 **Retrieval Keywords:** Wix CMS, Wix Data, Wix Media, Wix Forms, Wix CRM, Wix Membe… | 2,313 | 10 |
| [`Reference_Wix_10_Wix_Business_and_Account_APIs_Reference_Guide.md`](./Reference_Wix_10_Wix_Business_and_Account_APIs_Reference_Guide.md) | **Purpose**: Provide an authoritative, RAG-ready reference for integrating and managing Wix Business and Account APIs across various architectures. **Audience**: AI Agents (Claude Code, Manus), Wix Developers, System Architects **Last Researched**: 2026-09-02 **Retrieval Keywords**: Wix Business APIs, eCommerce, Stores, Bookings, Pricing Plans, Events, Blog,… | 1,836 | 5 |
| [`Reference_Wix_11_Wix_Design_and_Site_Implementation.md`](./Reference_Wix_11_Wix_Design_and_Site_Implementation.md) | * **Wix Editor**: A classic drag-and-drop builder for standard websites . * **Wix Studio**: A responsive, advanced creation platform for agencies and professionals, integrating the Harmony Design System. It offers advanced breakpoints and CSS grid capabilities not available in the classic Editor . * **Wix Harmony**: The new no-code editor for self-creators,… | 2,177 | 5 |
| [`Reference_Wix_12_Existing_Site_to_Wix_Migration_and_Replatforming.md`](./Reference_Wix_12_Existing_Site_to_Wix_Migration_and_Replatforming.md) | **Purpose:** Provide authoritative, RAG-ready guidance for migrating existing websites to Wix (Managed Headless or Native), covering architecture mapping, evidence collection, and deployment. **Audience:** Claude Code, Manus agents, and technical replatforming teams. **Last Researched:** 2026-09-02 **Retrieval Keywords:** wix migration, replatform, KLUB case… | 2,296 | 5 |
| [`Strategy_Existing_Website_to_Wix_Migration_Playbook.md`](./Strategy_Existing_Website_to_Wix_Migration_Playbook.md) | **Author:** Manus AI **Audience:** Claude Code agents, Manus agents, and senior developers **Primary use:** Rebuild an existing public website on Wix while preserving identity, data, URLs, business workflows, and measurable quality | 2,222 | 6 |
| [`Strategy_KLUB_to_Wix_Implementation_Blueprint.md`](./Strategy_KLUB_to_Wix_Implementation_Blueprint.md) | **Author:** Manus AI **Source:** `ma4kos/KLUB` **Recommended target:** Wix-managed Headless with Astro, Wix CMS, Wix Media Manager, Wix Forms/CRM, and an explicit booking-system decision | 2,467 | 4 |

## Retrieval Map

| Task intent | Load first | Then load |
|---|---|---|
| Choose a Wix architecture | `Reference_Wix_01_*` | Headless, apps, design, or migration chapter |
| Generate REST or SDK code | `Reference_Wix_02_*` | Authentication chapter and `examples/sdk` or `examples/rest` |
| Configure credentials or permissions | `Reference_Wix_03_*` | MCP chapter if using Claude Code |
| Build with Wix CLI | `Reference_Wix_04_*` | Headless chapter and `examples/ci` |
| Build an Astro Headless site | `Reference_Wix_05_*` | CLI, CMS, and design chapters |
| Build Wix apps or extensions | `Reference_Wix_06_*` | Authentication and unified API chapters |
| Use Wix from Claude Code | `Reference_Wix_07_*` | `examples/mcp`, `examples/prompts`, then domain chapter |
| Use AI tools or inspect credits | `Reference_Wix_08_*` | MCP and authentication chapters; recheck live pricing/limits |
| Work with CMS, media, forms, or CRM | `Reference_Wix_09_*` | Unified API, auth, and relevant examples |
| Work with Stores, Bookings, or account APIs | `Reference_Wix_10_*` | Unified API and auth chapters |
| Rebuild design, SEO, or accessibility | `Reference_Wix_11_*` | Headless or site-development chapter |
| Convert an existing site to Wix | `Reference_Wix_12_*` | Migration playbook and project-specific blueprint |
| Convert KLUB to Wix | `Strategy_KLUB_to_Wix_Implementation_Blueprint.md` | Migration chapter and `examples/migration` |

## Example Library

The example library includes MCP configuration, tool routing, OAuth and API-key SDK clients, a site/account-scoped REST wrapper, cursor pagination, a managed-Headless CMS query, CI validation, prompts, logical CMS schemas, route and execution manifests, and a deterministic KLUB payload builder. Both TypeScript projects compile cleanly against the installed package set, and the migration transform is validated against the source counts.

## Source Hierarchy

| Rank | Source | Use |
|---:|---|---|
| 1 | Live official Wix method schema or product documentation | Final authority for current requests, fields, permissions, limits, and behavior |
| 2 | Official Wix-owned repositories and templates | Executable patterns, skills, orchestration, and implementation conventions |
| 3 | This synthesized corpus | Fast retrieval, decisions, workflows, guardrails, and cross-source explanation |
| 4 | Community materials | Supplemental examples only; verify against official sources |

## Date-Sensitive Warning

Wix MCP tools, plugin installation, Wix AI credits, API previews, package versions, CLI commands, limits, and deprecations may change. Treat the research date as a snapshot. Recheck any operation that writes data, publishes, changes a site/account, incurs cost, or depends on a preview API.

## Machine-Readable Index

See `Reference_Wix_Corpus_Manifest.json` for chapter titles, counts, summaries, headings, retrieval topics, example files, and the distribution-qualified research-workspace source inventory.
