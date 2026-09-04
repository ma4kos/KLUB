# Accessibility — the 43 findings are about 12 actual fixes

Full-site scan of **Klub 8** (`39c99397-4288-4294-92b1-0dad4b02e130`),
scan `c4637edd-8e94-4aaa-8129-43a03beca9fa`, 2026-09-04.
All 43 findings are severity **SERIOUS**.

## The headline: most of it is the header and footer

The same three element IDs recur on nearly every page:

| Element | Rule | Appears on |
|---|---|---|
| `comp-mtmhjgny` | image-alt | 9 of 9 scanned pages |
| `comp-mtmhjml0` | image-alt | 9 of 9 scanned pages |
| `comp-mtmhjms0` | color-contrast | 9 of 9 scanned pages |

Those are shared site chrome. In the Wix editor a header/footer change
propagates everywhere, so **fixing three elements once clears roughly 28 of the
43 findings**. What looks like a wall is mostly one wall repeated nine times.

Realistic worklist: **about 12 distinct fixes**, not 43.

## By page

| Page | image-alt | color-contrast | heading-structure |
|---|---|---|---|
| /about | 5 | 1 | 1 |
| /classes | 2 | 1 | 2 |
| /contact | 3 | 1 | 1 |
| /faq | 2 | 1 | 1 |
| /foundations-reformer | 2 | 1 | 1 |
| /instructors | 2 | 1 | 1 |
| /location | 2 | 1 | 2 |
| /policies | 2 | 1 | 1 |
| /signature-reformer | 2 | 2 | 1 |

Subtract the three shared elements from every row and only `/about` (3 extra
images), `/contact` (1 extra image), `/signature-reformer` (1 extra contrast)
and the per-page headings remain.

## How to fix each rule

**image-alt** — 22 findings, WCAG 1.1.1 (A). Click the image → **Settings →
Alt text**. Describe what the photo shows and why it is there; mark purely
decorative images as decorative. Wix flags this as needing human judgement,
which is fair: only a person knows whether an image is informative here.
Do this while placing Alex's real photographs (`FINISH-IN-EDITOR.md` step 1) —
the two jobs touch the same elements, so doing them together halves the work.

**color-contrast** — 10 findings, WCAG 1.4.3 (AA). Almost all one footer text
element. The palette itself is fine: ink `#1A1714` on linen `#F7F3EE` is far
past AA. The failures will be the muted umber `#7A6A55` or soft body grey
`#5C544C` used at small sizes on a light ground. Darken toward `#5C4F3D` where
flagged. No human judgement needed — it is a measurable ratio.

**heading-structure** — 11 findings. Headings must descend without skipping:
one `H1` per page, then `H2`, then `H3`. The generator tends to pick heading
levels for size rather than hierarchy. Fix by changing the *level* in the text
panel and restoring the look with font size, not by changing the level to suit
the look.

## Six pages could not be scanned

`/`, `/mat-pilates`, `/private-sessions`, `/schedule`, `/memberships`,
`/founding-member` returned as failed, undiagnosed. **The homepage is among
them**, so its findings are unknown and the true total is higher than 43.
Re-scan after the editor pass.

## Re-scan when done

```
POST https://www.wixapis.com/accessibility/v1/accessibility-scans/run
{ "target": { "targetType": "SCOPE",
              "scope": "ACCESSIBILITY_SCAN_SCOPE_FULL_SITE" },
  "idempotencyKey": "<a fresh UUID>" }
```

Then `GET /accessibility/v1/accessibility-scans/{id}` to poll, and
`GET /accessibility/v1/accessibility-scans/{id}/findings?paging.limit=50`.
Use a new UUID for each genuine scan.

## Why this matters

The Netlify build runs an axe suite in CI on every commit and passes. This one
does not, and Cyprus is in the EU, where the European Accessibility Act has
applied to consumer-facing services since June 2025 — a studio site taking
bookings is in scope. Clear these before the site goes near a real domain.
