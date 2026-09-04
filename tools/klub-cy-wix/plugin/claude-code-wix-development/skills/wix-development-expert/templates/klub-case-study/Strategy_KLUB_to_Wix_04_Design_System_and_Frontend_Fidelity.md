# KLUB-to-Wix Migration Design: Design System & Frontend Fidelity

## 1. Executive Summary

This document maps the migration of the KLUB frontend design system, including its Astro components, CSS variables, typography, and interactive behaviors, to a Wix environment. The goal is to preserve the "lush" aesthetic, high-performance interactions, and responsive design within the Wix ecosystem.

## 2. Source-to-Target Mapping

| KLUB Source (Astro/CSS) | Wix Target | Rationale |
| --- | --- | --- |
| `global.css` (Custom Properties: `--sand`, `--umber`, `--ink`) | Wix Site Colors / Custom CSS | Wix allows defining site-wide color palettes that map directly to CSS variables. |
| Typography (`--sans`, `--serif`) | Wix Site Typography | Wix supports uploading custom fonts (e.g., 'Instrument Serif', 'Switzer') and mapping them to text themes (H1-H6, P). |
| Layout Grid (`--pad`) | Wix Studio Grids & Padding | Wix Studio provides precise control over breakpoints, grid layouts, and padding, allowing us to replicate the `min(5vw, 42px)` logic. |
| `ArchVideo.astro` | Wix Pro Gallery / Custom Element | For the specific arch mask and auto-play behavior, a custom element or a highly styled Pro Gallery item is required. |
| `BsportWidget.astro` | Wix Bookings / Velo Iframe | If migrating fully to Wix Bookings, this is replaced by Wix Bookings widgets. If keeping Bsport, an iframe or custom element is used. |
| `FoundingForm.astro` | Wix Forms | Wix Forms natively supports lead capture, validation, and CRM integration, replacing the custom Astro form. |
| Scroll Reveals (`.reveal`, `.in`) | Wix Interactions | Wix Studio has built-in scroll animations (fade in, slide up) that can perfectly replicate the `IntersectionObserver` reveals. |
| Film Grain (`body::after`) | Wix Custom CSS / Velo | The SVG fractal noise filter can be applied globally via Custom CSS in Wix Studio. |

## 3. Design System Implementation

### 3.1 Typography & Colors
- **Colors:** The core palette (Sand, Umber, Ink) will be mapped to the Wix Site Colors. This ensures that native Wix components inherit the correct branding.
- **Typography:** The custom fonts will be uploaded to the Wix Media Manager and assigned to the Site Text Themes.

### 3.2 Responsive Behavior
- **Breakpoints:** Wix Studio's responsive AI and breakpoint management will be used to ensure the design scales fluidly from mobile to desktop, matching KLUB's fluid typography (`clamp`) and padding.

### 3.3 Animations & Interactions
- The subtle scroll reveals and hover effects (e.g., card image scaling) will be implemented using Wix Studio's native interactions panel, avoiding the need for custom JavaScript where possible.

## 4. Accessibility & Performance
- **Accessibility:** Wix provides built-in accessibility tools (e.g., aria-labels, focus rings). We will ensure all interactive elements (like the video pause/play toggle) meet WCAG 2.2.2 standards, as implemented in KLUB.
- **Performance:** Wix automatically optimizes images (WebP) and serves them via CDN, replacing the need for Astro's `<Image>` optimization.

## 5. Unresolved Inputs & Rollback
- **Unresolved:** Final decision on Bsport vs. Wix Bookings impacts the `BsportWidget` migration.
- **Rollback:** The current Astro site can remain live on its current hosting until the Wix site is fully QA'd and DNS is updated.

## 6. Automation Summary
The mapping of colors, typography, and basic layouts can be partially automated via Wix Headless APIs or CLI tools if using Wix Blocks. However, the precise configuration of Wix Studio interactions, custom CSS injection for the film grain, and the setup of Wix Forms require a connected Wix account and manual configuration within the Wix Editor.
