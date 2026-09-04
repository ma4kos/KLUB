# Aria — how Alex iterates on the site himself

**This corrects an earlier conclusion in `RUN-LOG.md`.**

Across eleven runs the finding was recorded that "iterative edits are
impossible — every refinement means a whole new generated site". That is true
of the **API**: passing an existing `jobId` back to the site builder is a
verified no-op, and there is no REST endpoint for pages, sections or image
placement.

It is **not** true of the platform. Wix Harmony — the editor these sites are
built in — ships an AI design agent called **Aria**, and per Wix's own
documentation Aria can:

> redesign pages, generate content, set up business features like product
> catalogs and booking systems, and provide SEO guidance
>
> — [About Aria](https://dev.wix.com/docs/overview/ai-the-wix-platform/about-aria)

So the site *is* iteratively editable in natural language. Just not from a
terminal — from inside the editor, by whoever is logged in.

Guide: https://support.wix.com/en/article/wix-harmony-editor-working-with-aria

## Why this matters for KLUB

This is the thing Alex actually asked for. In his own words on WhatsApp:

> "if youd ever need any sort of movement or restructure done on the site it
> becomes a fav, whereas if done with wix or promted with ai its just a few min
> job and then edit text and you are solid"

Aria is that. He opens the editor, types what he wants, and it happens — no
developer, no deploy, no waiting on anyone. It is a stronger answer to his
requirement than anything the API route delivers, because it puts the iteration
in his hands rather than a session's.

## Editor link for the current build

**Klub 10** — `ac575e89-105d-44a3-babe-9b3a80ac4f66`
https://editor.wix.com/edit/od/9f148365-6e94-41f6-aca1-28db625d4079?metaSiteId=ac575e89-105d-44a3-babe-9b3a80ac4f66

Live, no login: https://markossymeonides.wixsite.com/klub-10

## Things worth asking Aria for

These are the outstanding items from `FINISH-IN-EDITOR.md` phrased as requests
Aria should be able to act on directly:

- "Replace the photo in the hero with `alex-hero-reformers.jpg` from my site
  files." (Repeat per section — the mapping is in `media-map.json`.)
- "Add alt text to every image on this page describing what it shows."
- "Fix the heading levels on the homepage so there is one H1 and the chapter
  headings are H2."
- "Increase the contrast of the footer text so it meets WCAG AA."
- "Embed this HTML on the Schedule page" (the bsport widget — company 6604,
  widget 868966; markup in `src/components/BsportWidget.astro`).
- "Set the site language and region to Cyprus, euro, Asia/Nicosia."
- "Rename the site to KLUB."

## The one caution

Aria redesigns pages. Ask it for a change to *one section* rather than a broad
"make the homepage better", or it may restyle work that is already correct.
Wix keeps site history, so a bad change is revertable — but a narrow request is
cheaper than an undo.

Also keep the review's accessibility rule in mind when asking for the hero
treatment: spaced-out capitals must come from CSS letter-spacing, never literal
spaces between letters, or screen readers spell the headline out letter by
letter.
