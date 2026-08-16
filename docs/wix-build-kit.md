# KLUB Website → Wix Build Kit

**For Alex** — everything from the custom-built KLUB site, packaged so it can be rebuilt in (or connected to) Wix.

---

## 1. The honest starting point

Wix is a closed platform: **there is no way to import or "plug in" an externally-coded website into Wix.** Wix pages can only be built with Wix's own editor. So "use Wix" means one of two real options:

### Option A — Hybrid (recommended for "for the moment")

Keep the finished custom site as the public website, and use Wix **only for what Wix is genuinely great at: bookings and payments** (Wix Bookings handles class schedules, packages, memberships and cancellations out of the box).

- The custom site is already built, live as a preview, and free to host (Netlify free tier / GitHub Pages).
- Every "Book" button on the site gets pointed at the Wix booking page (a one-line change, I can do it the moment the Wix booking URL exists).
- Zero rebuild work. You get the premium design *and* Wix's booking engine, today.
- Later, if you decide everything should live in Wix, nothing is lost — this kit covers the rebuild too.

### Option B — Full rebuild in Wix

Recreate the site inside Wix using this kit as the blueprint: same colors, fonts, structure, photos, videos and word-for-word copy (all of it is in section 5 below). Expect roughly a weekend of work in the Wix editor for someone comfortable with it. You lose some of the custom polish (arch-shaped video frames, scroll animations, the performance scores) but gain full self-service editing.

Either way, **don't lose the SEO work**: every page in section 5 lists its browser-tab title and meta description — paste those into Wix's per-page SEO settings, they were written for "pilates limassol" searches.

---

## 2. Design system (set these once in Wix's Site Design / Theme)

### Colors

| Role | Hex | Where it's used |
|---|---|---|
| Background "warm linen" | `#F7F3EE` | Page background everywhere |
| Card / clean sections | `#FFFFFF` | Cards, alternating sections |
| Sand | `#E8DFD3` | Soft highlight sections (e.g. "Meet Izzy" band) |
| Ink (warm black) | `#1A1714` | Headlines, body text, dark CTA sections |
| Taupe | `#5C544C` | Secondary/soft text |
| Warm grey | `#9A9088` | Faint labels |
| Umber (brand accent) | `#7A6A55` | Buttons, links, accents, announcement bar |
| Deep umber | `#5C4F3D` | Button hover |
| Hairlines | `#E8E0D6` | Borders, dividers |

### Fonts (both are free Google Fonts — available in Wix's font picker)

- **Headlines:** DM Serif Display (use the *italic* cut for single accent words inside headlines — e.g. "Intentional *movement.*")
- **Everything else:** DM Sans (400 body, 500 buttons/labels, 700 bold)
- Small uppercase labels above headings ("eyebrows"): DM Sans, ~12–13px, letter-spacing wide, umber color

### Shapes & feel

- Images and videos sit in **arch shapes** (fully rounded top, gently rounded bottom corners) — Wix: use an arch/round-top mask on image elements
- Cards: white, 16–20px rounded corners, hairline border, very soft shadow
- Buttons: pill-shaped (fully rounded), umber fill with white text (primary) or thin outline (secondary)
- Generous whitespace; alternate linen / white / sand / dark-ink section backgrounds down each page

---

## 3. Assets

Everything is in the public GitHub repo — **github.com/ma4kos/KLUB** → green "Code" button → *Download ZIP*. Inside:

- `public/images/` — all edited studio & Izzy photos (webp + jpg pairs; use the .jpg files in Wix)
- `public/videos/` — 7 short muted loop clips, already cleaned of social-media captions and trimmed (studio walkthrough, reformers, lounge, Dubai, Cyprus pool, mat & online-studio clips) + matching poster stills
- `public/fonts/` — the exact font files (not needed in Wix — pick the same fonts from Wix's list)
- `public/images/og/` — branded 1200×630 link-preview cards (Wix: upload per page under SEO → social share image)

Live reference of how it should all look: **ma4kos.github.io/KLUB/**

---

## 4. Booking setup (Wix Bookings)

Configure these as the paid plans/packages — they match the site's pricing page exactly:

- Drop-In Class €20 · Intro Pack (2 classes) €32 — *new clients only*
- Memberships: 4/month €120 · 8/month €200 · Unlimited €280
- Flexi packs: 5 classes €110 (valid 2 months) · 10 classes €200 (valid 3 months)
- Private 1-to-1: single €80 · 5-pack €375 · 10-pack €700
- Class capacity: **6 per class** · Class length: **50 min** · Cancellation window: **12 hours**
- Class types: Reformer Fundamentals, Reformer Flow, Reformer Power, Private Sessions

*(Prices are the working draft from the PRD — confirm with Izzy before switching payments on.)*

---

## 5. Every page, word for word

The full sitemap with each page's SEO title, meta description, headings, body copy, button labels, and every image and video placement follows. Rebuild pages top-to-bottom in this order:

- `[Button: …]` lines show the exact label and destination
- 🖼 `[Image: …]` lines show which photo sits in that spot (file paths are inside the repo ZIP's `public/` folder; use the .jpg version) — **copy the alt text into Wix's image alt field**, it's part of the SEO
- 🎞 `[Video loop: …]` lines show which clip plays there: muted, autoplaying, looping, no controls. The poster frame is the still shown before the video loads. In Wix use "Video Box" with autoplay + loop + no sound
- Portrait images and all videos sit in the arch-shaped frame (see section 2)

## Home

**URL:** `/`  
**Browser-tab title (SEO):** KLUB | Pilates Reformer Studio in Limassol City Center  
**Meta description (SEO):** Premium Pilates reformer classes in Limassol city center. Small group sessions & private 1-to-1 training. New to Pilates? Start with our €20 intro offer. Opening September 2026.

### Intentional movement. Mindful strength.

Premium reformer Pilates in the heart of Limassol — small groups of six, private 1-to-1 sessions, and a space that feels like an exhale.

[Button: Book Your First Class — €20 → /book/]

[Button: View Timetable → /timetable/]

🎞 [Video loop (muted, autoplay): `/videos/studio-tour.mp4` — poster frame: `/videos/studio-tour-poster.jpg`]

🖼 [Image: `/images/arch-entrance.jpg` — alt text: "Arched entrance of KLUB Pilates studio in Limassol with a glowing circular KLUB logo and olive tree"]

#### The world's best Pilates, brought home to Cyprus

Our founder trained and taught in the studios of London and Dubai — and built her online studio from the island. KLUB brings all of it home to Limassol.

🎞 [Video loop (muted, autoplay): `/videos/dubai-studio.mp4` — poster frame: `/videos/dubai-studio-poster.jpg` — caption below: "Refined abroad — Teaching in Dubai's studios"]

🎞 [Video loop (muted, autoplay): `/videos/cyprus-pool.mp4` — poster frame: `/videos/cyprus-pool-poster.jpg` — caption below: "Rooted in Cyprus — Movement under the Limassol sun"]

🎞 [Video loop (muted, autoplay): `/videos/studio-lounge.mp4` — poster frame: `/videos/studio-lounge-poster.jpg` — caption below: "Home in Limassol — The KLUB studio, ready for you"]

🖼 [Image: `/images/reception.jpg` — alt text: "Warm minimalist reception area at KLUB Pilates Limassol with stone desk, soft seating and natural textures"]

#### A space built for balance

KLUB stands for Keep Living Under Balance . Warm plaster walls, arched doorways, soft light and calm proportions — a studio designed to slow you down the moment you walk in.

On the floor it's serious equipment and small groups: reformer classes capped at six, so your instructor sees every rep — your alignment, your pace, your progress.

Chill vibes are found here.

[Button: Step Inside → /about/]

#### Find your class

Four ways to move, from your first step to your strongest self.

🖼 [Image: `/images/equipment-wall.jpg` — alt text: "Black reformer Pilates springs and equipment displayed in arched niches at KLUB studio Limassol"]

##### Reformer Fundamentals

Perfect for beginners. Learn the machine, master the basics, build confidence.

🖼 [Image: `/images/studio-room.jpg` — alt text: "Softly lit reformer Pilates studio room with sheer curtains and equipment shelving at KLUB Limassol"]

##### Reformer Flow

Smooth, continuous movement for those ready to build stamina and grace.

🖼 [Image: `/images/mat-studio.jpg` — alt text: "Open movement studio floor with mats and natural light at KLUB Pilates Limassol"]

##### Reformer Power

Intensified resistance, dynamic sequences. For the experienced mover.

🖼 [Image: `/images/interior-arch.jpg` — alt text: "Calm arched interior with warm lighting at KLUB Pilates studio in Limassol city center"]

##### Private Sessions

Training tailored to your body, your goals, your schedule.

#### Meet Izzy

Royal Academy of Dance graduate. Certified reformer and mat Pilates instructor. Pre/post-natal qualified. From London stages to Dubai studios — now bringing it all home to Limassol.

[Button: Her Story → /instructors/]

🖼 [Image: `/images/izzy-dubai-teaching.jpg` — alt text: "Izzy Nicolaou guiding a reformer Pilates class in an arched, softly lit Dubai studio"]

#### Transparent pricing

No hidden fees. No complicated tiers. Just clear options that fit how you want to move.

[Button: View Full Price List → /pricing/]

€20

Try any group class

€32

Your first two reformer classes

€80

1-to-1 personal training

🖼 [Image: `/images/street-sign.jpg` — alt text: "Illuminated KLUB sign mounted on a stone building facade in Limassol city center"]

#### In the heart of Limassol

Limassol City Center, Cyprus. Full street address announced soon — join the list to be first to know.

[Button: Location & Directions → /location/]

[Button: Message Us → https://www.instagram.com/klubstudios]

#### Be part of the founding circle

Join before we open for exclusive founding member rates and first access to bookings. Early members choose their class times before anyone else.

We respect your inbox. A couple of emails before opening, then only what's useful. Unsubscribe anytime.


## About

**URL:** `/about/`  
**Browser-tab title (SEO):** About KLUB | Pilates Reformer Studio Limassol  
**Meta description (SEO):** KLUB — Keep Living Under Balance — is a premium reformer Pilates studio opening in Limassol city center in September 2026. Small groups, private sessions, warm space.

### Keep Living Under Balance

That's what KLUB stands for — and what the studio is built around.

#### The Space

Warm plaster walls, arched doorways, dried botanicals and soft, indirect light. The studio was designed to feel less like a gym and more like an exhale — a place where the pace of the city stops at the door.

On the floor: professional reformer machines, capped at six per class, arranged so every person has space to move and be seen by their instructor.

Chill vibes are found here.

It's painted on our wall, and it is a promise. No intimidation, no competition — just intentional movement, mindful strength and real connection.

🖼 [Image: `/images/lounge.jpg` — alt text: "Cozy white sofa lounge corner with warm lamp light at KLUB Pilates studio Limassol"]

🖼 [Image: `/images/equipment-wall.jpg` — alt text: "Black Pilates springs, balls and equipment displayed in arched cream niches at KLUB Limassol"]

#### What We Believe

##### Intentional Movement

Every exercise has a purpose. We teach you what you're doing and why, so strength comes with understanding.

##### Mindful Strength

Progress that lasts is built with control, not chaos. Six people per class means your form always comes first.

##### Real Connection

A studio should know your name. Ours will — and the community forming around it is the part we're most excited about.

[Button: Meet Our Instructors → /instructors/]


## Classes (overview)

**URL:** `/classes/`  
**Browser-tab title (SEO):** Pilates Classes in Limassol | Reformer, Flow & Private | KLUB  
**Meta description (SEO):** Small-group reformer Pilates classes and private 1-to-1 sessions in Limassol city center. All levels welcome. Classes taught in English. Book your first class for €20.

### Our Classes

Four ways to move. One space to grow.

🖼 [Image: `/images/equipment-wall.jpg` — alt text: "Black reformer Pilates springs and equipment displayed in arched niches at KLUB studio Limassol"]

#### Reformer Fundamentals

If you have never stepped onto a reformer — or it has been a while — this is where you start. Fundamentals is a slow, deliberate introduction to the machine: the carriage, the springs, the straps, and how your body works with each of them.

[Button: About this class → /classes/reformer-fundamentals/]

[Button: Book → /book/]

🖼 [Image: `/images/studio-room.jpg` — alt text: "Softly lit reformer Pilates studio room with sheer curtains and equipment shelving at KLUB Limassol"]

#### Reformer Flow

Flow is where the reformer starts to feel like dancing. Movements link into continuous, breath-led sequences — one exercise melting into the next — so you build stamina and coordination without ever feeling rushed.

[Button: About this class → /classes/reformer-flow/]

[Button: Book → /book/]

🖼 [Image: `/images/mat-studio.jpg` — alt text: "Open movement studio floor with mats and natural light at KLUB Pilates Limassol"]

#### Reformer Power

Power is our strongest class. Heavier springs, quicker transitions, longer holds — designed for movers who know the reformer and want to be challenged by it.

[Button: About this class → /classes/reformer-power/]

[Button: Book → /book/]

🖼 [Image: `/images/interior-arch.jpg` — alt text: "Calm arched interior with warm lighting at KLUB Pilates studio in Limassol city center"]

#### Private Sessions

One reformer, one instructor, one plan built entirely around you. Private sessions are the fastest way to progress — every minute of the 50 is calibrated to your body, your history and your goals.

[Button: About this class → /classes/private-sessions/]

[Button: Book → /book/]

Not sure which class is right for you? Read our FAQ or message us — we'll point you to the right starting place.


## Class: Reformer Fundamentals

**URL:** `/classes/reformer-fundamentals/`  
**Browser-tab title (SEO):** Reformer Fundamentals Class | Beginner Pilates Limassol | KLUB  
**Meta description (SEO):** Never tried reformer Pilates? Our Fundamentals class in Limassol teaches you the machine from zero. 50 minutes, max 6 people, taught in English. First class €20.

### Reformer Fundamentals

If you have never stepped onto a reformer — or it has been a while — this is where you start. Fundamentals is a slow, deliberate introduction to the machine: the carriage, the springs, the straps, and how your body works with each of them.

Your instructor walks the room the whole time. With six people maximum, nobody gets lost in the back row. You will leave knowing the foundational movements that every other class builds on — and why your core feels like it just woke up.

[Button: Book this class → /book/]

[Button: View in timetable → /timetable/]

🖼 [Image: `/images/equipment-wall.jpg` — alt text: "Black reformer Pilates springs and equipment displayed in arched niches at KLUB studio Limassol"]

#### What to expect

- A full tour of the reformer before you move
- Foundational exercises: footwork, bridging, arm work, basic core series
- Constant hands-on guidance and modifications for your body
- A calm pace — strength over speed
#### Who it's for

- Complete beginners
- Anyone returning to movement after a break or injury
- Experienced movers who want to refine their technique
#### Good to know

Wear comfortable leggings or shorts and a fitted top. Grip socks are required — bring your own or pick up a pair at the studio. Arrive 10 minutes early for your first visit.

Questions before you book? Read the FAQ or message us .

[Button: See pricing → /pricing/]


## Class: Reformer Flow

**URL:** `/classes/reformer-flow/`  
**Browser-tab title (SEO):** Reformer Flow Class | Dynamic Pilates Limassol | KLUB  
**Meta description (SEO):** Reformer Flow at KLUB Limassol: 50 minutes of smooth, breath-led sequences that build stamina, coordination and control. Small groups of six, taught in English.

### Reformer Flow

Flow is where the reformer starts to feel like dancing. Movements link into continuous, breath-led sequences — one exercise melting into the next — so you build stamina and coordination without ever feeling rushed.

Rooted in classical technique and shaped by our ballet heritage, Flow rewards you for showing up regularly: the choreography becomes familiar, and then it becomes yours.

[Button: Book this class → /book/]

[Button: View in timetable → /timetable/]

🖼 [Image: `/images/studio-room.jpg` — alt text: "Softly lit reformer Pilates studio room with sheer curtains and equipment shelving at KLUB Limassol"]

#### What to expect

- Continuous sequences with minimal stops
- Breath-led pacing that builds endurance
- Full-body work: legs, core, arms, back
- Options to add or reduce intensity every round
#### Who it's for

- Anyone comfortable with reformer basics
- Those who love rhythm and momentum in a workout
- Building lean, functional strength week over week
#### Good to know

Wear comfortable leggings or shorts and a fitted top. Grip socks are required — bring your own or pick up a pair at the studio. Arrive 10 minutes early for your first visit.

Questions before you book? Read the FAQ or message us .

[Button: See pricing → /pricing/]


## Class: Reformer Power

**URL:** `/classes/reformer-power/`  
**Browser-tab title (SEO):** Reformer Power Class | Advanced Pilates Limassol | KLUB  
**Meta description (SEO):** Reformer Power at KLUB Limassol: higher resistance, faster transitions and dynamic sequences for experienced movers. 50 minutes, max 6 people. Book your spot.

### Reformer Power

Power is our strongest class. Heavier springs, quicker transitions, longer holds — designed for movers who know the reformer and want to be challenged by it.

Expect to work close to your edge, safely. The group stays capped at six, so intensity never comes at the cost of technique.

[Button: Book this class → /book/]

[Button: View in timetable → /timetable/]

🖼 [Image: `/images/mat-studio.jpg` — alt text: "Open movement studio floor with mats and natural light at KLUB Pilates Limassol"]

#### What to expect

- Increased spring resistance and tempo
- Dynamic sequences including jumpboard and plank series
- Progressions layered through the class
- A proper burn — and a proper cool-down
#### Who it's for

- Experienced reformer clients ready to progress
- Athletes cross-training for strength and control
- Regulars who have outgrown Flow and want more
#### Good to know

Wear comfortable leggings or shorts and a fitted top. Grip socks are required — bring your own or pick up a pair at the studio. Arrive 10 minutes early for your first visit.

Questions before you book? Read the FAQ or message us .

[Button: See pricing → /pricing/]


## Class: Private Sessions

**URL:** `/classes/private-sessions/`  
**Browser-tab title (SEO):** Private Pilates Sessions | 1-to-1 Training Limassol | KLUB  
**Meta description (SEO):** Private 1-to-1 reformer Pilates in Limassol city center. Personalized sessions for injury recovery, pre/post-natal training and athletic goals. From €70 per session.

### Private Sessions

One reformer, one instructor, one plan built entirely around you. Private sessions are the fastest way to progress — every minute of the 50 is calibrated to your body, your history and your goals.

They are also the right choice when a group setting is not: recovering from injury, training through or after pregnancy, or simply preferring privacy and a schedule that bends to yours. Our instructors are certified in pre- and post-natal movement, so you are in qualified hands at every stage.

[Button: Book this class → /book/]

[Button: View in timetable → /timetable/]

🖼 [Image: `/images/interior-arch.jpg` — alt text: "Calm arched interior with warm lighting at KLUB Pilates studio in Limassol city center"]

#### What to expect

- A movement assessment in your first session
- A program designed for your specific goals
- Pre/post-natal certified instruction when you need it
- Flexible scheduling by appointment
#### Who it's for

- Injury recovery and rehabilitation support
- Pre- and post-natal training
- Athletic conditioning and sport-specific goals
- Anyone who wants undivided attention
#### Good to know

Wear comfortable leggings or shorts and a fitted top. Grip socks are required — bring your own or pick up a pair at the studio. Arrive 10 minutes early for your first visit.

Questions before you book? Read the FAQ or message us .

[Button: See pricing → /pricing/]


## Pricing

**URL:** `/pricing/`  
**Browser-tab title (SEO):** Pilates Prices Limassol | Drop-In, Packages & Private | KLUB  
**Meta description (SEO):** Clear, simple Pilates pricing in Limassol. Drop-in €20. Intro pack €32. Monthly packages from €120. Private 1-to-1 sessions from €70 per session. No hidden fees.

### Simple, Honest Pricing

All prices in euro. What you see is what you pay — no joining fees, no surprises.

#### Getting Started

Your first steps on the reformer.

| Package | Price | Per class | Best for |
|---|---|---|---|
| Drop-In Class | €20 | €20 | Try any class, no commitment |
| Intro Pack (2 classes) | €32 | €16 | First-timers — your best-value start |
[Button: Book Now → /book/]

#### Monthly Memberships

A steady rhythm, month after month.

| Package | Price | Per class | Best for |
|---|---|---|---|
| 4 Classes / Month | €120 | €30 | A weekly routine |
| 8 Classes / Month | €200 | €25 | Twice-weekly commitment |
| Unlimited | €280 | — | Daily practice |
[Button: Book Now → /book/]

#### Flexi Packs

Buy a bundle, book when it suits you.

| Package | Price | Per class | Validity |
|---|---|---|---|
| 5-Class Pack | €110 | €22 | Valid 2 months |
| 10-Class Pack | €200 | €20 | Valid 3 months |
[Button: Book Now → /book/]

#### Private 1-to-1

Fully personalized sessions, by appointment.

| Package | Price | Per session | Best for |
|---|---|---|---|
| Single Private Session | €80 | €80 | One-off focus or assessment |
| 5-Session Pack | €375 | €75 | A short-term goal |
| 10-Session Pack | €700 | €70 | Long-term progress |
[Button: Book Now → /book/]

Grip socks are required in all classes (available for purchase at the studio). A 12-hour cancellation policy applies — read our full policies .

#### Pricing questions

**Q: What's the difference between a drop-in and the intro pack?**

A drop-in is a single class at €20, ideal if you already know reformer Pilates. The intro pack gives new clients their first two classes for €32 — a gentler, better-value way to learn the machine.

**Q: Do class packs expire?**

Flexi packs are valid for 2 months (5-class) or 3 months (10-class) from purchase. Monthly memberships renew each month.

**Q: Can I share a pack with a friend?**

Packs are personal to you. If you'd like to bring a friend, they can start with a €20 drop-in or the intro pack.

**Q: What happens if I need to cancel a booking?**

Cancel at least 12 hours before class and your credit is returned automatically. See our policies page for the details.

Anything else? Message us — we usually reply within half an hour.


## Timetable

**URL:** `/timetable/`  
**Browser-tab title (SEO):** Pilates Class Timetable Limassol | Book Your Spot | KLUB  
**Meta description (SEO):** View the planned reformer Pilates class schedule at KLUB Limassol. Morning, lunchtime and evening sessions. Booking opens before our September 2026 launch.

### Class Timetable

Find a time that fits your rhythm — early mornings, lunchtime resets and evening sessions.

This is our planned launch schedule. Online booking opens shortly before we do — founding members get first access to every slot.

#### Monday–Friday

#### Saturday

#### By appointment

Can't find a time that works? Private sessions are available by appointment — message us to arrange one.

#### Be First on the Timetable

Join the founding member list and you'll book before public slots open.

We respect your inbox. A couple of emails before opening, then only what's useful. Unsubscribe anytime.


## Meet Izzy (Instructors)

**URL:** `/instructors/`  
**Browser-tab title (SEO):** Meet Izzy Nicolaou | Founder & Pilates Instructor | KLUB Limassol  
**Meta description (SEO):** Izzy Nicolaou, founder of KLUB Limassol — Royal Academy of Dance graduate, certified reformer Pilates instructor and pre/post-natal specialist, trained in London and Dubai.

### Izzy Nicolaou

Classically trained ballet teacher. Certified Pilates instructor. Founder of KLUB — and the reason your form is about to get very, very good.

[Button: Book a class with Izzy → /book/]

[Button: @pilateswithizzy → https://www.instagram.com/pilateswithizzy]

🎞 [Video loop (muted, autoplay): `/videos/cyprus-pool.mp4` — poster frame: `/videos/cyprus-pool-poster.jpg`]

#### London. Dubai. Home.

🖼 [Image: `/images/izzy-mat-wide.jpg` — alt text: "Izzy Nicolaou moving through a mat Pilates sequence in warm Mediterranean light"]

##### Trained where movement is a language

Izzy earned her BA (Hons) in Ballet Education at the Royal Academy of Dance — one of the most respected dance institutions in the world. Years of classical training taught her what most fitness certifications never do: how bodies actually learn to move, and how to teach with precision and patience.

🎞 [Video loop (muted, autoplay): `/videos/dubai-studio.mp4` — poster frame: `/videos/dubai-studio-poster.jpg`]

##### Taught in world-class studios

In Dubai, Izzy taught reformer Pilates in some of the region's most beautiful studios and trained clients of every level — athletes, beginners, mothers, executives. It's where classical technique met contemporary studio culture, and where her teaching style took its final shape: exacting, warm, and impossible to get lost in.

🎞 [Video loop (muted, autoplay): `/videos/online-studio.mp4` — poster frame: `/videos/online-studio-poster.jpg`]

##### Built PILATIZ, her online studio

Izzy founded PILATIZ — an on-demand Pilates platform with workouts from 10 to 40 minutes, live classes and monthly challenges, followed by thousands. Teaching on camera sharpened what her in-person clients already knew: she can break any movement down until it clicks.

🎞 [Video loop (muted, autoplay): `/videos/studio-reformers.mp4` — poster frame: `/videos/studio-reformers-poster.jpg`]

##### Bringing it all home to Cyprus

KLUB is the studio Izzy always wanted to walk into: bright, calm, seriously equipped, and small enough that every client is known by name. London's discipline, Dubai's polish, the island's soul — all under one roof in Limassol city center. The reformers are already on the floor.

#### Qualified is an understatement

##### BA (Hons) Ballet Education

Royal Academy of Dance, London

##### Certified Reformer Pilates Instructor

Comprehensive apparatus training

##### Certified Mat Pilates Instructor

Classical foundations, contemporary method

##### Pre & Post-Natal Qualified

Safe movement through pregnancy and recovery

##### International Teaching Experience

London · Dubai · Cyprus

##### Founder, PILATIZ Online Studio

On-demand classes followed worldwide

Teaches in English · Also speaks Greek · Fully certified and insured

> “Pilates gave my dancers strength without bulk, control without tension. It does the same for every body that walks in — you just have to start .”

— Izzy, on why she teaches

🎞 [Video loop (muted, autoplay): `/videos/mat-home.mp4` — poster frame: `/videos/mat-home-poster.jpg`]

#### Train with Izzy today

PILATIZ is Izzy's online studio — on-demand workouts from 10 to 40 minutes, beginner to advanced, live classes and monthly challenges. Start moving now, walk into KLUB already stronger.

[Button: Visit PILATIZ → https://www.instagram.com/pilatizstudio]

[Button: Ask a Question → https://www.instagram.com/klubstudios]

#### Your first class is €20

Six people, fifty minutes, one very good teacher.

[Button: Book Now → /book/]

[Button: Join the Founding Circle → /founding-member/]


## FAQ

**URL:** `/faq/`  
**Browser-tab title (SEO):** Pilates FAQ Limassol | First Class, What to Wear, Parking | KLUB  
**Meta description (SEO):** Everything you need to know before your first Pilates class in Limassol: what to wear, grip socks, class sizes, pregnancy Pilates, back pain, parking and more.

### Your Questions, Answered

Everything people ask before their first class — and a few things they wish they'd asked.

#### Getting Started

**Q: What is reformer Pilates?**

Reformer Pilates is practiced on a machine with a sliding carriage, springs and straps. The springs add resistance and support, making exercises both harder and safer than mat work alone. It builds strength, flexibility and control — and it is genuinely fun.

**Q: Do I need any experience to start?**

None at all. Our Reformer Fundamentals class is built for complete beginners — you will learn the machine from zero with a maximum of six people in the room.

**Q: What should I wear?**

Comfortable leggings or shorts and a fitted top that lets your instructor see your alignment. Avoid anything with zips that could scratch the equipment.

**Q: Do I need grip socks?**

Yes — grip socks are required in all classes for hygiene and safety. Bring your own or buy a pair at reception.

**Q: What should I bring?**

Just yourself, grip socks and a bottle of water. Everything else is provided.

**Q: What happens if I arrive late?**

Doors close 10 minutes after class starts — the warm-up matters for safety. If you miss the window, we will happily help you rebook.

**Q: Is Pilates a good workout, or is it too gentle?**

Both, depending on the class. Fundamentals is measured and controlled; Power will challenge experienced athletes. Every class is a genuine full-body workout — expect to feel muscles you forgot you had.

**Q: How quickly will I notice results?**

Most people feel a difference in posture and core awareness within a few sessions, and see visible change with two to three classes a week over a couple of months. Consistency beats intensity.

#### Classes & Booking

**Q: How big are the classes?**

Maximum six people. Small enough that your instructor sees and corrects every rep.

**Q: How long is a class?**

All group classes and private sessions are 50 minutes.

**Q: Can I book a private 1-to-1 session?**

Yes — we are one of the few city-center studios offering true private sessions. They run by appointment and start from €70 per session in packs.

**Q: How do I book?**

Online booking opens shortly before we launch in September 2026. Until then, join the founding member list for first access, or message us and we will reserve your spot personally.

**Q: What's the cancellation policy?**

Cancel at least 12 hours before class and your credit returns to your account automatically. Later than that, the class is charged — the spot was held for you in a room of six.

**Q: Is there a waitlist for full classes?**

Yes. If a class is full, join the waitlist and you will be notified automatically the moment a spot opens.

#### Location & Facilities

**Q: Where exactly is the studio?**

We are in Limassol city center. The exact street address is being announced with our opening — join the founding member list or follow @klubstudios and you will be the first to know.

**Q: Is there parking nearby?**

Yes — public parking is available within a short walk of the studio. We will publish a simple parking guide before opening day.

**Q: Can I reach you by public transport?**

The studio is centrally located and well served by city bus routes. Exact stop details will be published with our address.

**Q: Do you have changing rooms?**

Yes — changing facilities are available, so a lunchtime class between meetings is absolutely doable.

**Q: Can I store my things during class?**

Yes, there is space for your belongings inside the studio, always within sight.

**Q: Is the studio air-conditioned?**

Yes — comfortably cool in summer and warm in winter. Cyprus summers are no joke; we have planned for them.

#### Health & Safety

**Q: Can I do Pilates while pregnant?**

In many cases yes, with the right guidance. Our founder Izzy is fully certified in pre-natal movement. We recommend private sessions during pregnancy so everything is tailored to you — and always check with your doctor first.

**Q: When can I return after giving birth?**

Every recovery is different. With your doctor's clearance — typically from six weeks after birth — our post-natal certified instructors will rebuild your strength gradually and safely, starting with the deep core.

**Q: I have back pain. Is reformer Pilates safe for me?**

Reformer Pilates is often recommended for back pain because the springs support you while you strengthen the muscles that protect your spine. Tell us about your pain when you book — we may suggest starting with a private session.

**Q: Can I train with an injury?**

Often yes, and thoughtfully. Message us about your injury before booking. Private sessions let us work around and with your body; in group classes we offer modifications for most exercises.

**Q: Do you offer modifications in class?**

Constantly. With six people maximum, your instructor adapts exercises to your level and any limitations in real time.

**Q: Is reformer Pilates safe for older adults?**

Yes — the reformer is one of the most joint-friendly ways to build strength and balance at any age. Fundamentals is the right starting point.

**Q: Should I eat before class?**

Keep it light. A small snack an hour or two before is ideal; a full meal right before class is not your friend on the reformer.

**Q: Do I need to tell you about health conditions?**

Please do — it stays confidential and it helps us keep you safe. There is space for this when you register, and you can always message us privately.

#### Pricing & Memberships

**Q: How much does a class cost?**

A drop-in class is €20. Packs bring the per-class price down to as low as €20 for groups, and monthly memberships run from €120. The intro pack gives newcomers two classes for €32. Full details are on our pricing page.

**Q: Do class packs expire?**

Flexi packs are valid for 2 months (5 classes) or 3 months (10 classes). Monthly memberships renew monthly.

**Q: Can I share my pack with someone else?**

Packs are personal. Friends are always welcome to join you with their own drop-in or intro pack.

**Q: What payment methods do you accept?**

Card and cash at the studio, and card online once booking opens.

**Q: Is there a refund policy?**

Unused, unexpired packs can be discussed case by case — talk to us. Completed classes and expired packs are non-refundable.

**Q: Are there founding member rates?**

Yes — joining the founding member list before we open locks in exclusive rates and first access to bookings.

#### Language & Community

**Q: What language are classes taught in?**

All classes are taught in English, and we welcome every nationality. Our team also speaks Greek.

**Q: Do I need to speak Greek to join?**

Not at all. English is the language of the studio, and much of our community is international.

**Q: Can I come alone?**

Most people do. Classes of six get friendly fast — coming alone is the normal way to arrive and rarely how people leave.

**Q: Is the studio beginner-friendly in atmosphere?**

Completely. No mirrored walls of intimidation, no competitive energy. Chill vibes are found here — it is on the wall, and we mean it.

#### Still have questions?

Message us — we typically reply within 30 minutes during business hours.

[Button: Message Us → https://www.instagram.com/klubstudios]


## Location

**URL:** `/location/`  
**Browser-tab title (SEO):** KLUB Pilates Studio Location | Limassol City Center | Directions  
**Meta description (SEO):** Find KLUB Pilates studio in Limassol city center, Cyprus. Full address, map and parking guide coming with our September 2026 opening. Message us for directions.

### Find Us in Limassol City Center

Limassol City Center, Cyprus — full street address announced soon — join the list to be first to know.

🖼 [Image: `/images/street-sign.jpg` — alt text: "Illuminated KLUB studio sign on a stone building corner in Limassol city center"]

🖼 [Image: `/images/arch-entrance.jpg` — alt text: "KLUB Pilates studio entrance with arched doorway and glowing circular logo"]

🖼 [Image: `/images/klub-reformers.jpg` — alt text: "Rows of black reformer machines on the bright studio floor at KLUB Pilates Limassol"]

🖼 [Image: `/images/klub-lounge.jpg` — alt text: "KLUB studio lounge with white sofa and spiral staircase, Limassol city center"]

##### Getting Here

We're right in the city center — walkable from the seafront, the old town and the main business district. A detailed map and directions go live with our address.

##### Parking

Public parking is available within a short walk. We'll publish a simple where-to-park guide before opening day — Limassol parking should not be a workout.

##### Contact

team@klub-cy.com @klubstudios Message us for directions

#### Want the address the moment it drops?

Founding members hear everything first — address, opening hours and booking access.

[Button: Join the Founding Member List → /founding-member/]


## Contact

**URL:** `/contact/`  
**Browser-tab title (SEO):** Contact KLUB Pilates | Message, Email & Instagram | Limassol  
**Meta description (SEO):** Contact KLUB Pilates studio in Limassol. Message us, email team@klub-cy.com or reach us on Instagram @klubstudios. We reply within 30 minutes in business hours.

### Say Hello

Questions, bookings, or just curious? We're quick to reply.

#### Send a message

#### Direct lines

##### Instant message

Message KLUB — fastest response, usually within 30 minutes during business hours.

##### Email

team@klub-cy.com

##### Instagram

@klubstudios — studio updates, class previews and opening news.

##### Visit

Limassol City Center, Cyprus Full street address announced soon — join the list to be first to know.


## Founding Member

**URL:** `/founding-member/`  
**Browser-tab title (SEO):** Founding Member | Early Access & Exclusive Rates | KLUB Limassol  
**Meta description (SEO):** Join the KLUB founding member list for early access to bookings, exclusive founding rates and priority class selection before our September 2026 Limassol opening.

### Be Part of the Founding Circle

The people who join before we open get the best of KLUB, permanently.

#### What founding members get

- Exclusive founding rates — locked in before public pricing, kept as long as you stay.
- First access to bookings — choose your class times before slots open to anyone else.
- Opening week priority — guaranteed spots in launch week classes.
- The address first — location, hours and every announcement before they're public.
Founding membership closes when we open in September 2026. After that, it's gone for good.

We never share your details. You'll receive a couple of emails before opening, then only our weekly timetable — unsubscribe anytime.

#### Join the list

We respect your inbox. A couple of emails before opening, then only what's useful. Unsubscribe anytime.


## Policies

**URL:** `/policies/`  
**Browser-tab title (SEO):** Studio Policies | Cancellations, Grip Socks & Arrival | KLUB  
**Meta description (SEO):** KLUB Limassol studio policies: 12-hour cancellation notice, grip socks required, 10-minute late arrival rule, class pack expiry and privacy. Read before your first class.

### Studio Policies

Short, fair and there to keep classes running smoothly for everyone.

#### Grip Socks

- Grip socks are required in every class — for hygiene and for safety on the reformer.
- Forgot yours? Pairs are available for purchase at reception.
#### Arrival & Late Policy

- Please arrive 5–10 minutes early, and 10 minutes early for your very first visit.
- Entry closes 10 minutes after class starts. The warm-up is part of keeping you safe — missing it means missing the class.
- If you miss the cut-off, message us and we'll help you rebook.
#### Cancellation & No-Show

- Cancel at least 12 hours before class and your credit is returned automatically.
- Cancellations inside 12 hours, and no-shows, are charged in full — in a class of six, your spot matters.
- Genuine emergencies happen. Talk to us.
#### Class Pack Expiry

- 5-class Flexi Packs are valid for 2 months from purchase.
- 10-class Flexi Packs are valid for 3 months from purchase.
- Monthly memberships renew each month; unused classes don't roll over.
#### Health & Safety

- Tell us about injuries, pregnancy or health conditions before your first class — it stays confidential and helps us keep you safe.
- Our instructors are fully certified and insured, including pre/post-natal qualification.
- Equipment is cleaned between every class.
#### Privacy

- We collect only the details needed to manage your bookings and keep in touch: name, contact details and any health information you choose to share.
- We never sell or share your data with third parties for marketing.
- Marketing emails are opt-in and every one includes an unsubscribe link.
- To access or delete your data, email team@klub-cy.com — we comply with GDPR.

## Book

**URL:** `/book/`  
**Browser-tab title (SEO):** Book a Pilates Class in Limassol | KLUB  
**Meta description (SEO):** Booking for KLUB Pilates Limassol opens with our September 2026 launch. Join the founding member list for first access, or message us to reserve your spot personally.

### Booking Opens Soon

Online booking goes live shortly before we open in September 2026. Founding members book first.

#### Get first access

Join the founding member list — early rates, priority booking, the address before anyone else.

We respect your inbox. A couple of emails before opening, then only what's useful. Unsubscribe anytime.

##### Reserve a spot personally

Want to lock in a class the human way? Message us with your preferred class and time and we'll confirm within a few hours.

[Button: Message to Reserve → https://www.instagram.com/klubstudios]

##### Not sure where to start?

New to the reformer? Start with Reformer Fundamentals or read the FAQ — it answers everything from what to wear to how sore you'll be.

##### Private sessions

1-to-1 sessions can be arranged before general booking opens — ideal for pre/post-natal training or injury recovery. Ask about availability .
