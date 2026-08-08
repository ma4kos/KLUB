# Making the KLUB website earn its keep — notes for Alex

*August 2026. Plain-language critique and builder's brief. Not a verdict on anyone's work —
the checklist of what a studio website must do to fill classes, with reasoning. Apply it to
whichever build becomes the base. The code, content and edited videos of the build at
ma4kos.github.io/KLUB are free to take, wholesale or piece by piece, from github.com/ma4kos/KLUB.*

## 1. The seven jobs the site must do

1. **Say where you are and how to reach you — on every page.** Address, WhatsApp, hours in
   every footer. Google can't put KLUB on the map without an address, and "pilates near me"
   is won on the map.
2. **Show prices openly, with a Book button next to them.** "How much is Pilates in Limassol"
   is the last question before booking. Hidden prices create silent exits.
3. **Timetable + online booking, as real text.** Most-revisited page of any studio site.
   Schedules locked inside embeds are invisible to Google — duplicate the times as normal text.
4. **Answer the questions people won't ask out loud.** 30–40 FAQ items: what to wear, grip
   socks, class size, pregnancy, back pain, parking, language. Read by nervous first-timers
   AND by Google/ChatGPT — the cheapest way to become the studio AI assistants recommend.
   (A ready-made 38-question FAQ exists in the GitHub build.)
5. **Sell Izzy, by name, with her story.** RAD degree, London → Dubai → Cyprus, pre/post-natal
   qualified, PILATIZ. Named credentialed instructors are a new studio's strongest trust signal.
6. **Look like the studio actually feels.** Real photos/film of the real space and the real
   Izzy. Never stock fitness imagery — visitors can smell it.
7. **Be findable — the invisible plumbing.** Unique page titles mentioning Limassol, one main
   heading per page, image descriptions, sitemap, schema "business card" code — plus a Google
   Business Profile started the day the address exists (postal verification takes weeks).

## 2. Straight talk about the current live site (keeplivingunderbalance.com)

From an independent August 2026 review (scored 12/45 on the basics — missing, not broken):

- **The homepage says almost nothing** — logo + tagline only. Fix: 300–500 words of what/where/cost/how-to-book. Keep the tagline, don't let it be alone.
- **The price list exists but nothing links to it.** Add "Pricing" to the menu (ten minutes,
  highest value on the list). Also verify the intro/drop-in prices — mobile and desktop may
  show them swapped.
- **No address, phone, or map anywhere.** See job 1; start the Google Business Profile immediately after the address is confirmed.
- **Small technical debts:** 5 of 7 pages lack Google descriptions; image descriptions are
  filenames; 3–4 "main headings" per page; no sharing image (WhatsApp shows a grey box);
  **Wix country/timezone set to UAE/Dubai** — will scramble class times when booking goes live.

## 3. Judging the AI-built versions — a buyer's checklist

*(Written without access to the Qwen and Manus previews; apply equally to all candidates,
including the GitHub one.)*

- **Hunt for invented "facts" — the #1 AI hazard.** AI builders confidently make up addresses,
  phones, prices, hours, instructor names and testimonials. Verify or delete every factual
  claim before launch.
- **Real photos or stock?** Swap generic imagery for Izzy's real material.
- **Does every button go somewhere?** Click every Book button, submit every form.
- **Open it on a phone.** Instagram traffic is mobile.
- **Check the invisible plumbing** (job 7) — where one-shot AI builds are thinnest.
- **Can you update it in a year?** Where hosted, who owns it, what it costs, how Izzy changes a price.
- **Speed** — run PageSpeed Insights; heavy AI builds often score badly and Google ranks slow sites lower.

## 4. What's already built and free to take (github.com/ma4kos/KLUB)

Done: 12 pages of verified copy (classes, pricing, FAQ, policies, founder story) · Izzy's
videos edited for web (captions removed, compressed, incl. real studio walkthrough) · brand
design system · full SEO plumbing.
Pending (blocked on Izzy's questionnaire, not on code): booking system, real address/phone/hours,
Google Business Profile, professional shoot.

## 5. Recommendations, in order

1. **Pick one base and kill the others** — four live versions confuse Google and people; redirect the rest.
2. **Get Izzy's questionnaire answered** — every open decision is in it.
3. **Settle the domain: klub-cy.com** — old domain redirects for 2+ years.
4. **Start the Google Business Profile the day the address is confirmed** — slowest item, biggest lever. Ask every founding member for a review in week one.
5. **Wire the booking system before opening week** — Momence or TeamUp, payment at booking.
6. **Book the shoot in the finished space** — 10s wide pan, Izzy portrait, street entrance, and (once real members exist) real people on that sofa.
7. **Add free measurement at launch** — GA4 + Search Console (+ Meta pixel if ads planned).

**One thing to resist:** another week polishing looks. Every candidate is already prettier than
most Limassol competitors. Winners in this market ship the boring parts: address, prices,
timetable, booking, FAQ, Google listing.
