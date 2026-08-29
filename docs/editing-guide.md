# Editing the KLUB website — a guide for Izzy & Alex

This is your plain-English guide to changing the words, prices, photos and
schedule on the KLUB website — no code, no developer needed. You edit in a
simple visual panel, press save, and the live site updates itself a minute or
two later.

You don't need to understand anything technical to use this. If you can fill in
an online form, you can edit the site.

---

## 1. Logging in the first time

1. You'll get an email with the subject **"You've been invited to join klub.cy"**.
2. Open it and click the **Accept the invite** button.
3. It takes you to the site and asks you to **choose a password**. Pick one and
   confirm it. That's your account created.
4. From then on, you log in at **https://klub.cy/admin/** with your email and
   that password.

> **Tip:** bookmark **https://klub.cy/admin/** — that `/admin/` on the end is
> the editing panel. The normal website (what visitors see) is just
> **https://klub.cy**.

If the invite email hasn't arrived, check spam. If it's still missing, ask
Markos to re-send the invite.

---

## 2. How editing works (the important idea)

- You edit content in the panel, then press **Publish** (or Save).
- **Every time you publish, the live website rebuilds itself automatically.**
  The change appears on **https://klub.cy** about **1–2 minutes** later.
- To check your work, use the **View Live** link at the top of the entry you're
  editing — it opens that exact page on the real website. (There's deliberately
  no preview box inside the panel: it showed the words without any of the site's
  design, which was more confusing than helpful.)
- You can't break the design or the layout — you're only editing text, prices,
  photos, videos and the schedule. The structure is fixed.

If something looks wrong after you publish, wait two minutes and refresh the
page. If it's still wrong, you can always edit it again — nothing is permanent.

---

## 3. What's in the panel

When you log in you'll see these sections down the left side:

| Section | What it controls |
| --- | --- |
| **Studio Settings** | Your contact details, social links, and the announcement bar at the very top of every page |
| **Pages** | The words on each page — Homepage, Classes Page, Our Instructors, About, Timetable, Location, Contact, Book, Founding Member, Policies |
| **Pricing** | The price tables and the pricing questions-and-answers |
| **Classes** | The four class descriptions (Reformer Fundamentals, Flow, Power, Private Sessions) |
| **FAQ** | The frequently-asked-questions page |

Click a section, click the item inside it, make your change, then press
**Publish** at the top.

Each section and each item has a one-line description under its name in the
panel telling you what it controls, so you never have to guess.

---

## 4. The special fields — read this bit

A few fields do clever things across the whole site when you fill them in.
They live in **Studio Settings → Contact, Socials & Banner**.

### Online booking link
This is **already set** — every "Book" button on the website currently sends
people to your existing booking page at `keeplivingunderbalance.com`. When a new
booking system is ready, replace the web address in **"Online booking link"** and
**every "Book" button on the whole website** follows it automatically. You only
set this in one place. If you ever clear the box, the buttons fall back to the
pre-launch "Book" page on this site.

### WhatsApp number
Type your WhatsApp Business number into **"WhatsApp number"** — digits only, no
spaces or `+` (for example `35799123456`). Once it's set, the floating chat
button and every "Message us" link **switch from Instagram to WhatsApp**
automatically. Leave it blank and they keep using Instagram.

### Phone (as displayed)
The phone number exactly as you want it shown, e.g. `+357 99 123 456`. It
appears in the footer.

### Street address
Leave this **empty** until you're ready to announce the location. While it's
empty, the site shows the "address announced soon" note instead. Fill it in and
it appears in the footer, on the homepage and on the Location page — and it is
sent to Google as the studio's address.

### Opening hours
One row per group of days. Days are two-letter codes separated by commas
(`Mo,Tu,We,Th,Fr`), and times are 24-hour (`07:00`). These don't print on a page
— they're what Google shows next to KLUB in search and on Maps, so keep them
accurate.

### Founding-member signup form
The **"What interests you most?"** dropdown on the signup forms, and the text on
its button. Whatever someone picks arrives next to their email in the Netlify
dashboard, so these options are how you sort your list — keep them short and
keep them meaningful.

### Announcement banner
The coloured bar across the very top of every page.
- **Show the banner** — turn it on or off.
- **Text** — the message (currently the September 2026 opening / founding-member
  message).
- **Link text** and **Link URL** — the clickable part (e.g. "Join now" →
  `/founding-member/`). Both are **optional**: leave them empty for a plain
  notice with nothing to click, like "Closed 25–26 December".

Change the **Text** and everyone sees the new banner, including people who
dismissed the old one.

---

## 5. Writing tips (little formatting tricks)

- **Italic accent colour:** wrap a word in asterisks to make it show in the
  elegant italic accent style. Typing `Meet *Izzy*` shows "Izzy" in the accent
  font. Great for one highlighted word in a heading.
- **Half-size text:** wrap something in tildes to shrink it. `50~′~` shows the
  minutes mark small next to a big "50" in the numbers row.
- **Important:** these two tricks only work on fields whose little grey tooltip
  says so — mostly headings and the numbers row. Anywhere else the asterisks and
  tildes just show on the page exactly as you typed them, so don't use them
  in ordinary paragraphs.
- **Two-line headings:** press **Enter** inside a heading field to break it onto
  a second line on the page.

---

## 6. Photos and videos

Fields marked **Photo** or **Image** let you upload a picture; fields marked
**Video** let you upload a short video clip.
- Click the field, choose **Upload**, pick the file from your computer, and
  select it.
- **JPG, PNG or WebP.** You don't need to resize or crop first — the site
  automatically fits every photo neatly into its frame (it crops to *fill*,
  never stretches or squashes it). Around 1200 pixels on the longest side is
  plenty. Every Photo field shows a little tooltip reminding you of this.
- **Size limit: 5000 kB per photo** (20000 kB for a video). If the panel refuses
  your file, it's too big — open it on your phone or computer, export or "send"
  it at a smaller size, and try again. This limit exists because every upload is
  stored with the website forever, and a straight-off-the-camera photo is 30–50
  times larger than anything else on the site.
- **iPhone owners, do this once:** go to **Settings → Camera → Formats → Most
  Compatible**. Otherwise your phone saves photos as `.HEIC`, which the panel
  will accept but which **will not display on the website** — you'd get a broken
  image and no warning.
- **Orientation tip:** most photo frames on the site are tall (portrait), so a
  portrait photo fills them best. A very wide photo still works, it's just
  cropped a little top and bottom to fit.
- Always fill in the **"Describe this photo"** box next to a photo — it's a one
  sentence description of the picture (it helps visually-impaired visitors and
  Google). Example: "Reformer studio interior with arched niches". **If you
  change a photo, rewrite the description underneath it to match** — a
  description of the old picture is worse than none.
- Use good-quality images. The current photos are placeholders cropped from
  Instagram; replacing them with proper high-resolution photography is on the
  pre-launch list.

---

## 7. A few things **not** to change

- **The "Slug" field** on a class (it says "do not change — it is the page
  address"). Changing it breaks the link to that class page.
- You can't add or remove classes from the editor (there are four, fixed), and
  the panel has no delete button on them. Same for the four numbers in the
  numbers row and the two photos in the About page's "The Space" section. Ask a
  developer if you ever need a fifth class.
- The **contact email** (`team@klub-cy.com`) is deliberately on the old domain
  for now — leave it until the email inbox decision is made.

---

## 8. Common things you'll want to do

| I want to… | Go to… |
| --- | --- |
| Change the opening message at the top | Studio Settings → Announcement banner |
| Change where Book buttons go | Studio Settings → Online booking link |
| Switch the chat button to WhatsApp | Studio Settings → WhatsApp number |
| Update a class price | Pricing → Price Tables, **or** Classes (per-class price) |
| Fix a typo on the homepage | Pages → Homepage |
| Change the timetable | Pages → Timetable |
| Add a question to the FAQ | FAQ → FAQ Page |
| Update the instructor bios | Pages → Our Instructors |
| Change the studio's opening hours | Studio Settings → Opening hours |
| Change the signup form's dropdown options | Studio Settings → Founding-member signup form |

---

## Where your prices and content came from

This site was built fresh, but not from a blank page. Your existing KLUB website
(the Wix "Keep Living Under Balance" site) already had a few real, current
details, so we carried those across so nothing was lost and everything stays
consistent:

- **Your prices** were taken from the pricing page on that Wix site. (That page
  existed but wasn't in the Wix menu, so it was easy to miss.) They now live on
  the **Pricing** page here — and unlike before, Pricing *is* in the menu and
  footer, so visitors can actually find it. Every price is editable under
  **Pricing** in the panel.
- **The founding-member offer** — a free week of unlimited Pilates plus 20% off
  your first purchase — came from your "Early Access Benefits" page. Editable
  under **Pages → Founding Member**.
- **The studio policies** — grip socks, the 10-minute rule, cancellations — came
  from your "KLUB Policies" page. Editable under **Pages → Policies**.
- **Your socials** now include TikTok, alongside Instagram and Facebook.

If any price or detail is out of date, just change it in the panel — you don't
need a developer. And when you have proper studio photography, upload it into any
Photo field (see section 6) — it will fit automatically.

---

## 9. If you get stuck

- **A field turned red and won't let you publish:** that's deliberate. A few
  fields (the booking link, the WhatsApp number, prices, the analytics IDs) now
  check what you typed and tell you in plain English what they expect. Read the
  red line, fix the value, and Publish will work again. It's stopping you from
  breaking something, not misbehaving.
- **A change didn't appear:** wait two minutes, then refresh
  **https://klub.cy** (not the `/admin/` panel). The site rebuilds after every
  publish and it takes a moment.
- **You can't log in:** make sure you're at **https://klub.cy/admin/** and using
  the password you set from the invite email. Ask Markos to re-send the invite
  if needed.
- **Anything else:** contact Markos, or the developer notes are in the
  **Setup & hosting guide** (`docs/setup-and-hosting.md`) in the same folder.

That's it — you're in control of the words, prices, photos and schedule. Edit
freely; you can't break it.
