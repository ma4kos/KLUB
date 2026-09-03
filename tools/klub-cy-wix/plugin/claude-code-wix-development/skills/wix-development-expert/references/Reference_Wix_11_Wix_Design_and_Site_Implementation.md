# Wix Design and Site Implementation
**Purpose:** Provide authoritative, RAG-ready reference material on Wix design systems, editor environments, and visual implementation patterns.
**Audience:** Claude Code and Manus agents.
**Last Researched Date:** 2026-09-02
**Retrieval Keywords:** wix design system, wix editor, wix studio, harmony, visual implementation, components, accessibility, multilingual, seo, responsive, custom elements

## 1. Introduction to Wix Visual Environments
Wix provides a comprehensive platform for building websites, offering distinct environments to cater to different development needs [1]. The mental model separates visual design (components, elements, styles) from backend logic and data (CMS, Media Manager) [1].

*   **Wix Editor**: A classic drag-and-drop builder for standard websites [1].
*   **Wix Studio**: A responsive, advanced creation platform for agencies and professionals, integrating the Harmony Design System. It offers advanced breakpoints and CSS grid capabilities not available in the classic Editor [1].
*   **Wix Harmony**: The new no-code editor for self-creators, which does not support custom site code [2]. For code-driven visual implementations, developers must use Wix Studio, Wix Editor, or Wix Headless [2].

## 2. Wix Design System (WDS)
The Wix Design System (`@wix/design-system`) is a comprehensive library of React components used to build native-looking interfaces within the Wix ecosystem, primarily for Dashboard Pages and Dashboard Modals [2].

### Component Selection Hierarchy
When building Dashboard UI, agents must follow this strict order of preference [2]:
1.  **`@wix/patterns`**: Always check if a full functional pattern exists first (e.g., a complete list, settings page, or empty state).
2.  **`@wix/design-system`**: Use WDS components for the "leaf" UI elements inside the shell (inputs, buttons, form fields, text, layout, cards, badges, icons).

**Anti-Pattern:** Never hand-roll a component that either library already provides [2].

### Core Setup & Configuration
To use WDS components, the global styles must be imported in the main component entry file (e.g., `page.tsx` or the modal's `.tsx` file). Do not import this in child, tab, or helper files [2].

```tsx
// Example: page.tsx or main entry point
import { Page, Layout, Box, Button } from '@wix/design-system';
import '@wix/design-system/styles.global.css'; // Mandatory for styling

export default function MyDashboardPage() {
  return (
    <Page>
      <Page.Header title="My App" />
      <Page.Content>
        <Layout>
          <Box gap="SP2" padding="SP3">
            <Button>Save</Button>
          </Box>
        </Layout>
      </Page.Content>
    </Page>
  );
}
```

### Spacing Tokens (Harmony)
Wix Design System uses Spacing (SP) tokens for `gap`, `padding`, and `margin` (not for width/height). When translating pixel designs to WDS, use the following conversion [2]:

| Token | Classic (px) | Studio (px) |
| :--- | :--- | :--- |
| `SP1` | 6px | 4px |
| `SP2` | 12px | 8px |
| `SP3` | 18px | 12px |
| `SP4` | 24px | 16px |
| `SP5` | 30px | 20px |
| `SP6` | 36px | 24px |

### Common Component Mappings

| Design Element | WDS Component | Notes |
| :--- | :--- | :--- |
| Rectangle/container | `<Box>` | Layout wrapper |
| Text button | `<TextButton>` | Secondary actions |
| Input with label | `<FormField>` + `<Input>` | Wrap inputs |
| Toggle | `<ToggleSwitch>` | On/off settings |
| Modal | `<Modal>` + `<CustomModalLayout>` | Use together (Not for Dashboard Pages) |
| Grid | `<Layout>` + `<Cell>` | Responsive layout |

### Icons and Testkits
Icons are provided by the `@wix/wix-ui-icons-common` package [2].
```tsx
import { Add, Edit, Delete, AddSmall } from "@wix/wix-ui-icons-common";
```
WDS provides "Testkits" for testing components across different environments (unidriver, vanilla, puppeteer, playwright) [2].

### Anti-Patterns & Constraints
*   **Custom CSS on WDS**: Never override WDS CSS tokens. If absolutely necessary, flag it as a critical anti-pattern [2].
*   **Modals in Dashboard Pages**: Dashboard Pages cannot use `<Modal />`. Instead, use a separate Dashboard Modal extension and invoke it via `dashboard.openModal()` [2].

## 3. Visual Implementation in Headless Environments
For Wix Headless projects (Next.js, Astro), visual implementation is entirely decoupled from the Wix Design System. Official templates demonstrate two primary styling approaches [2].

### Tailwind CSS
Most modern Wix Headless templates (e.g., Astro templates for commerce, events, registration) use Tailwind CSS for styling [2].

### CSS Modules
Next.js minimal templates often utilize CSS Modules for component-scoped styling [2].

## 4. Key Objects and Architecture
*   **Pages & Sections**: The structural hierarchy of a site. Pages contain sections, which contain components/elements [1].
*   **Components & Elements**: Buttons, text boxes, images, galleries, etc [1].
*   **Styles**: Global site styles, typography, color palettes, and component-specific overrides [1].
*   **Media**: Images, videos, and documents managed via the Media Manager [1].

## 5. Specific Domains

### Responsive Behavior
Use Wix Studio for full breakpoint control and advanced CSS grid capabilities [1].

### Accessibility
Utilize Wix's built-in accessibility tools, including alt text and ARIA attributes via Velo [1].

### SEO
Configure meta tags, structured data, and URL redirects via the SEO API or dashboard [1].

### Multilingual
Manage site languages and translations via the Multilingual API [1].

## 6. Migration and QA Workflows
When replatforming to Wix, the `rp-source-evidence` module mandates browser-backed extraction, explicitly rejecting HTML-only extraction methods. Agents must preserve exact evidence rather than inference, capturing `@font-face` tuples, exact logo variants, responsive behavior, core interaction scenes, and background-media roles [3].

### Visual QA and Gap Loops
The `rp-qa-gap-loop` module manages the visual QA process. Fixes must be applied in a specific order:
1.  Missing structure, text, and media
2.  Composition and dimensions
3.  Core interactions
4.  Polish

A maximum of two distinct targeted attempts per fix is budgeted. In `one_click` mode, the loop runs up to five cycles. If blockers remain after five cycles, a `done_with_gaps` receipt is written [3].

## 7. Failure Modes and Validation
*   **Common Errors**: 401 Unauthorized (invalid token), 403 Forbidden (insufficient permissions), 429 Too Many Requests (rate limit exceeded) [1].
*   **Validation Checklist**:
    *   Verify API tokens.
    *   Check element IDs in Velo code match the Editor.
    *   Ensure CMS permissions allow the intended read/write operations [1].

## 8. Agent Retrieval Checklist
Before acting on a Wix design or implementation task, an agent MUST verify:
- [ ] Which environment is being targeted (Editor, Studio, Headless, Dashboard App)?
- [ ] If building a Dashboard App, am I using `@wix/design-system` and `@wix/patterns` instead of custom CSS?
- [ ] If migrating, have I extracted browser-backed evidence (not just HTML)?
- [ ] Am I respecting the WDS spacing tokens (SP1-SP6) and avoiding custom pixel values for gaps/padding?
- [ ] Have I checked for deprecations in the API or design system?

## References
[1]: https://dev.wix.com/docs/overview/site-features-tools/site-development-on-wix.md "Wix Site Development (Reference_Wix_Core_08_Wix_Site_Editor_Design_Systems.md)"
[2]: https://github.com/wix/skills/tree/main/skills/wix-design-system "Official Wix Design System Skill"
[3]: https://github.com/wix/skills/tree/main/wix-headless-replatform "Official Wix Headless Replatform Skill"
[4]: https://dev.wix.com/docs/overview/site-features-tools/site-development-on-wix.md "Site Development on Wix"
[5]: https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/overview/where-do-i-put-my-code.md "Where Do I Put My Code"

## 9. Advanced Visual Implementation Strategies

### Managing Complex Layouts
When implementing complex layouts, especially in Wix Studio, agents must leverage CSS Grid and Flexbox capabilities effectively. The mental model requires thinking in terms of fluid grids and responsive containers rather than fixed-pixel positioning.

**Grid Allocation**: Divide the screen real estate using fractional units (fr) to ensure that the layout adapts seamlessly to different viewport sizes.

**Flexbox for Components**: Use flexbox properties for aligning items within a container, such as navigation menus or card groups. This ensures that elements distribute themselves appropriately when the container size changes.

**Viewport Units**: Utilize viewport width (vw) and viewport height (vh) for typography and structural elements that need to scale proportionally with the screen size.

### Custom Elements and Embeds
Wix allows the integration of custom web components and HTML embeds when the built-in elements do not suffice.

**Custom Elements**: These are standard Web Components (custom HTML tags) that can be defined using JavaScript and registered in the browser. They provide a way to encapsulate complex UI logic and styling, making them reusable across the site. Agents should ensure that custom elements are properly registered and that their properties and attributes are synced with the Wix environment.

**HTML iFrames**: Use iFrames for embedding third-party widgets or external content. However, agents must be aware of the security and performance implications. iFrames run in a sandboxed environment, which limits their ability to interact directly with the parent page's DOM or Velo code without using the postMessage API.

### Handling Assets and Media
Efficient asset management is crucial for site performance and visual fidelity.

**Media Manager**: All images, videos, and documents should be uploaded to and served from the Wix Media Manager. This ensures they are optimized and delivered via Wix's CDN.

**Responsive Images**: Wix automatically generates multiple resolutions of an uploaded image to serve the most appropriate size based on the user's device. Agents should avoid hardcoding image dimensions that conflict with this responsive behavior.

**Background Media**: When setting background images or videos, use the appropriate sizing properties (e.g., cover, contain) to ensure they behave correctly across breakpoints.

**Focal Points**: For images that may be cropped on smaller screens, agents should instruct the user to set a focal point in the Wix Editor to ensure the most important part of the image remains visible.

### Theming and Design Tokens
Consistent theming is achieved through the use of design tokens and global styles.

**Color Palettes**: Define a comprehensive color palette in the site's theme settings. Use semantic naming (e.g., primary, secondary, text, background) rather than literal color names.

**Typography**: Establish a typographic scale using standard HTML headings (H1-H6) and paragraph styles. Ensure that font families, weights, and line heights are applied consistently.

**Design Tokens in Headless**: For headless implementations, extract these design tokens from the source design (e.g., Figma) and map them to CSS variables or Tailwind configuration files. This ensures the headless frontend maintains visual consistency with the intended design.

## 10. Deep Dive into Migration Workflows

### Discovery and Page Capture
The initial phase of any migration involves a meticulous discovery and capture process.

**Browser-Backed Evidence**: As noted earlier, relying solely on HTML is insufficient. The `rp-source-evidence` module uses headless browsers (like Puppeteer or Playwright) to render the page and capture the computed styles, layout dimensions, and visual appearance.

**Design Token Extraction**: During the capture phase, the system extracts design tokens such as font families, color palettes, and spacing scales. These tokens form the foundation of the new site's theme.

**Asset Handling**: All referenced assets (images, fonts, videos) are identified and queued for download and re-upload to the Wix Media Manager.

### Mapping and Translation
Once the source evidence is captured, it must be mapped to Wix's specific paradigms.

**Component Mapping**: Source components are analyzed and mapped to their closest Wix equivalents. For example, a custom carousel might be mapped to a Wix ProGallery.

**Schema Translation**: Data structures from the source site (e.g., product catalogs, blog posts) are translated to match Wix's CMS or eCommerce schemas. This often involves handling deprecated fields or adapting to new data models (like the shift from Catalog V1 to V3).

**Interaction Translation**: Simple interactions (hover states, basic animations) are mapped to Wix's built-in animation capabilities. More complex interactions may require custom Velo code.

### Implementation and Code Generation
The actual building of the site is orchestrated by the migration pipeline.

**Idempotent Execution**: The pipeline is designed to be resumable. If an error occurs, it can restart from the last successful state without duplicating work.

**Manifest-Driven**: The entire build process is driven by the immutable manifest generated during the discovery phase. Agents do not make subjective design decisions during this phase; they strictly follow the manifest.

### Quality Assurance (QA) and Gap Analysis
The final phase ensures the migrated site matches the source evidence.

**Visual Regression Testing**: Screenshots of the newly built Wix site are compared against the original source screenshots. Differences are flagged as "gaps".

**Targeted Fixes**: The `rp-qa-gap-loop` module attempts to resolve these gaps automatically, prioritizing structural issues before moving on to cosmetic polish.

**Manual Review**: Any gaps that cannot be resolved automatically within the budgeted cycles are documented in the `mapping-summary.md` for manual review by the user.

## 11. Performance Optimization Techniques

**Lazy Loading**: Ensure that below-the-fold images and heavy components are lazy-loaded to improve initial page load times.

**Code Splitting**: In Velo, modularize code and only load the necessary scripts for the current page. Avoid placing all logic in the global `masterPage.js` unless absolutely necessary.

**Caching**: Leverage Wix's built-in caching mechanisms for API responses and database queries where appropriate.

**Minimizing External Scripts**: Be cautious when adding third-party scripts via custom elements or the tracking tools manager, as these can significantly impact performance.

## 12. Security and Permissions in Visual Contexts

**Frontend Security**: Never expose sensitive data (API keys, user PII) in frontend code or visual elements.

**Data Binding Permissions**: Ensure that CMS collections bound to visual elements have the correct permissions set. For example, a collection displaying public blog posts should be readable by anyone, but writable only by admins.

**Input Validation**: When using custom forms or input elements, always validate the data on the frontend for user experience, but critically, re-validate it on the backend to prevent malicious submissions.

## 13. Summary of Developer Responsibilities
Agents and developers working within the Wix ecosystem must balance visual creativity with technical constraints. The primary responsibilities include:

1.  **Choosing the Right Environment**: Selecting between Editor, Studio, or Headless based on project requirements.
2.  **Adhering to Design Systems**: Strictly following the Wix Design System for dashboard apps and establishing robust design tokens for headless sites.
3.  **Ensuring Quality**: Implementing rigorous visual QA and performance optimization practices.
4.  **Maintaining Security**: Protecting sensitive data and adhering to Wix's security guidelines.

By understanding and applying these principles, developers can create robust, visually stunning, and highly performant websites and applications on the Wix platform.
