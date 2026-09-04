# Verified KLUB Source Baseline

**Repository:** https://github.com/ma4kos/KLUB  
**Default branch:** `claude/izzy-pilates-website-w61t75`  
**Pinned commit:** `15ec3d93f187f5ec12bee14e8bd7b11692220002`  
**Commit date:** 2026-08-31T06:18:22Z  
**Source archive SHA-256:** `dcde9cde70dabe6d1aa2828155c9870e5f7d437e14c1c1dcc2c08b5980d42423`

The current source is a private-package Astro 5.18.2 site. `npm ci` and `npm run build` passed against the pinned archive. The focused local Playwright suite passed with **193 tests and 5 skips** in 56.9 seconds. The one-shot Claude workflow must run the full `npm test` cross-browser suite before any domain cutover or publication decision.

The deterministic migration inventory contains **14 Astro route source files**, **10 components**, **5 JSON content models**, **87 public assets**, and **179 migration-relevant source files** after fresh dependency/build artifacts. The machine-readable evidence is in `analysis/klub-architecture-inventory.json`; the human-readable summary is `analysis/Strategy_KLUB_Architecture_and_Migration_Inventory.md`.

The current Netlify deployment at `https://klub-cy.netlify.app/` was independently unlocked and verified. It is the rendered visual/content comparison target. Its access password and any administrator credentials are intentionally excluded from every package file and must be supplied through local environment variables.
