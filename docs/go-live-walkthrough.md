# KLUB website — go-live walkthrough

*A step-by-step guide in plain terms. Three jobs, roughly 20 minutes total. Do
them in this order — Part 1 unlocks the editing panel, which Part 2 uses.
August 2026.*

**The site's address:** the website is live at **https://klub-cy.netlify.app**
(behind a shared password while it's private). The studio's domain,
**www.keeplivingunderbalance.com**, still points at the old Wix site — switching
it over is a separate, later step (see the setup & hosting guide, §3), and
nothing below depends on it. `klub.cy` is registered but waiting on nic.cy
approval; it can be added whenever it comes through.

---

## Part 1 — Turn on the editing-panel login (Netlify Identity + Git Gateway) — ~5 min

This is what makes the `/admin/` editing panel actually let people log in and
edit the site.

1. Go to **app.netlify.com** and log in (the account that owns the site).
2. Click the **klub-cy** site.
3. In the left sidebar, go to **Site configuration** (or **Site settings**) →
   **Identity**.
4. Click **Enable Identity** — if it's already enabled, skip to step 5.
5. Still in Identity settings, find **Registration** and set it to **Invite
   only**. This is important — otherwise any stranger could sign themselves up
   as a site editor.
6. Scroll down in the same Identity section to **Services** → **Git Gateway** →
   click **Enable Git Gateway**. This is the bridge that lets the panel save
   changes without editors needing their own GitHub account.
7. Now invite the editors: go to the **Identity** tab (top of the site's page,
   next to Deploys), click **Invite users**, and enter the email addresses —
   Markos's, Alex's, Izzy's if she wants.
8. Each person gets an email with an **Accept the invite** link. Clicking it
   opens the site and asks them to set a password.
   - **Two gotchas:** the site's shared password gate comes first — enter the
     site password, then the set-password box appears. And if nothing pops up
     after clicking the link, copy everything in the address bar from
     `#invite_token=` onwards and paste it onto the admin page like this:
     `https://klub-cy.netlify.app/admin/#invite_token=XXXX` — the password box
     will appear there.
9. Done. From now on, editing the site = go to
   **https://klub-cy.netlify.app/admin/**, log in with email + password, edit,
   hit **Publish**. The site rebuilds itself in ~2 minutes. No GitHub, no code.
   (Day-to-day editing is covered in the separate **Admin Guide**.)

---

## Part 2 — Get GA4 and Clarity IDs and paste them into the panel — ~10 min

The site is already wired for both — they sit dormant until an ID exists.
You're getting two short codes and pasting them into two boxes. Until then, no
tracking script loads at all.

### Google Analytics (GA4)

1. Go to **analytics.google.com** and sign in with the Google account that
   should own the stats (Alex's, ideally, since he runs the site — it can be
   transferred or re-created later).
2. Click **Admin** (gear icon, bottom left) → **Create** → **Property**.
3. Name it "KLUB", set timezone to Cyprus, currency to Euro, click through the
   business questions (the answers don't matter much).
4. When asked to set up a **data stream**, choose **Web**, enter the site's
   address, name it "KLUB website".
5. It shows a **Measurement ID** that looks like **`G-ABC123XYZ0`**. Copy it.
   Ignore everything it says about installing code — the site already has the
   code.

### Microsoft Clarity (free heatmaps + session recordings)

1. Go to **clarity.microsoft.com** and sign in (any Microsoft or Google
   account).
2. Click **Add new project**, name it "KLUB", enter the site's address.
3. Skip/close any "install tracking code" instructions — already built in.
4. Go to the project's **Settings** → **Overview** and copy the **Project ID**
   — a short code like `abc1def2gh`.

### Paste both into the site

1. Go to **https://klub-cy.netlify.app/admin/** and log in (from Part 1).
2. Open **Studio Settings**.
3. Paste the Measurement ID into the **Google Analytics 4 ID** field and the
   Project ID into the **Microsoft Clarity ID** field.
4. Click **Publish**. Two minutes later, tracking is live. Within a day you'll
   see visitors in GA4's **Realtime** view and recordings in Clarity.
5. In GA4, mark `book_click` as a conversion (Admin → Events → toggle) — that's
   the site's #1 signal, every click toward booking.

> ⚠️ **One legal note:** Cyprus is EU, so once GA4/Clarity are live the site
> should show a cookie/consent notice before any paid-traffic campaigns. Wix
> provided one automatically; here it still needs adding — ask for it when
> you're ready to run ads.

---

## Part 3 — Make the GitHub repository private — ~2 min

Right now anyone on the internet can read the site's source code and content
files. Making the repository private changes nothing for visitors — the website
stays up exactly as is, builds keep working, and the editing panel keeps
working.

1. Go to **github.com/ma4kos/KLUB**.
2. Click **Settings** (the tab on the repository itself, far right).
3. Stay on the **General** page and scroll to the very bottom — the red
   **Danger Zone**.
4. Click **Change visibility** → **Change to private** → type the confirmation
   it asks for → confirm.
5. That's it. Netlify keeps building (its GitHub connection has permission),
   and the editing panel keeps working via Git Gateway.

---

## When you're ready to open the doors

Two switches, whenever the studio decides:

- **Remove the shared site password** — Netlify → Site configuration → Site
  protection: one toggle, and the site is public.
- **Point www.keeplivingunderbalance.com at the new site** — the DNS cut-over
  in the setup & hosting guide (§3). Until then the old Wix site keeps serving
  on the domain, and the new site lives on its Netlify address.

Both are reversible, and neither depends on the other.
