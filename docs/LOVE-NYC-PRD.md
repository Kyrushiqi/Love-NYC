# LOVE NYC ❤️
### Product Requirements Document — NYPL Hackathon

**One-liner:** A daily civic storytelling app that turns real NYC Open Data into short, warm, swipeable stories about small good things happening across the city.

---

## 1. Problem Statement

New York publishes enormous amounts of public data every day — service requests get closed, events get permitted, film crews get approved, park rangers respond to wildlife. This information is real and constantly updated, but it lives in spreadsheets, dashboards, and government portals built for analysts, not residents.

Meanwhile, the dominant daily narrative about NYC is complaint: expensive rent, subway delays, broken infrastructure, distrust of institutions like health insurance. That narrative isn't wrong — but it's incomplete. The good things the city's own data already proves are happening every day never reach anyone as a *story*.

**The gap:** NYC Open Data has the facts. No one is translating them into something a person would actually want to read.

---

## 2. Solution

LOVE NYC pulls live records from NYC Open Data, selects one per category, and uses AI to translate the raw record into a two-line warm headline plus one supporting detail line — never inventing anything beyond what the record states. The result is a small, shareable "postcard" story, not a dashboard.

**Core principle: Data is truth. AI is voice.**
AI never decides *what* happened or *whether* it's good — that's determined by the dataset and simple filtering rules. AI's only job is tone and phrasing.

---

## 3. Goals & Success Metrics (for hackathon demo)

| Goal | How we'll show it |
|---|---|
| Prove the data → story pipeline works live | Live fetch + live AI generation on stage, not pre-recorded |
| Prove facts aren't invented | "View source data" toggle next to every card, showing raw JSON |
| Make it feel like a product, not a script demo | Swipeable stack, consistent visual system, shareable postcard |
| Show breadth across real datasets | 4 categories, 4 different NYC Open Data sources, live counts where possible |

Non-goals for this hackathon: user accounts, notifications, historical date picker, saved favorites, backend database, production auth.

---

## 4. Target User

New Yorkers who feel worn down by the "everything is broken" narrative of the city and want a small, honest counterweight — not denial that problems exist, but proof that good things are also happening, backed by the city's own records. Secondary audience: hackathon judges evaluating civic-data creativity and responsible AI use.

---

## 5. Core Categories

Four categories, each mapped to one live NYC Open Data source:

| Category | Description | Dataset | Reliability for "live/today" framing |
|---|---|---|---|
| ✨ **Fix** | Tiny pieces of the city getting attention | NYC 311 Service Requests (closed only) | High — `closed_date` is genuinely updated daily |
| 🎵 **Gather** | Places where people came together | NYC Permitted Event Information | High — forward-looking permitted events, updated regularly |
| 🎬 **Create** | New York becoming someone's set | NYC Film Permits (MOME) | High — actively maintained, recent permits |
| 🐦 **Care** | Humans helping wild New Yorkers | Urban Park Ranger Animal Condition Response | Moderate — real dataset, but skews toward older records rather than daily-fresh ones; framed as "on record," not "today," to stay honest |

*(Grow/trees was considered and deliberately cut from MVP — the reliable tree datasets are census-style snapshots, not daily feeds, so a "today" framing would overclaim freshness.)*

---

## 6. Card Anatomy (same skeleton for every post)

Every post — regardless of category — follows this exact structure. Only color, doodle icon, and dataset change:

```
[ date badge ]
[ category pill ]
[ two-line headline ]
[ one detail line ]
[ source citation ]
```

**Example — Fix:**
> ✨ FIX · AUG 15
> Someone's walk home
> got a little brighter.
> A streetlight issue in Queens was closed out today.
> *Source: NYC 311 Service Requests*

**Example — Care:**
> 🐦 CARE
> A wild New Yorker
> got some help today.
> An Urban Park Ranger responded to a hawk in the Bronx.
> *Source: Urban Park Ranger Animal Condition Response*

---

## 7. Daily Stack Interaction

- On open, the app presents a small daily feed to swipe through — typically **2 to 5 posts**. *(For this hackathon, we're showing up to 8 posts — 2 from each of the 4 categories — specifically to demonstrate breadth across all four data sources; a shipped version would likely surface a smaller, tighter daily set rather than all categories at once.)*
- Stories are shuffled across categories and shown as one swipeable stack — swipe or drag between cards, dot indicators show position.
- Tapping "view source data" on any card expands the raw JSON record behind that story, side-by-side with the AI-written line.
- "Send this postcard" copies a shareable version of the story text.
- **End of feed:** swiping past the last story doesn't loop or dead-end — it leads into the journaling moment described in Section 8, then closes on something like *"That's today. Come back tomorrow — we're making a better New York, one small thing at a time."* This keeps the daily-ritual framing intact instead of the app feeling like it simply ran out of content.
- **(Optional) Card / Map toggle:** a segmented control at the bottom of the screen switches between the swipeable card stack and a map view, where each story appears as a category-colored pin at its (or its borough's) location. Tapping a pin surfaces the same card component anchored to that spot, so both views share one card design rather than being separate features.
- *(Demo-only affordance, not part of the shipped interaction model: a "shuffle" action to re-pull a fresh live set on demand, useful for showing the pipeline working live on stage.)*

---

## 8. Journal & Community Moments (New Feature)

After the last data-driven story, the app invites the user to add one of their own — turning LOVE NYC from something purely observational into something participatory.

**8.1 Personal Journal Prompt**
- At the end of the swipe stack, a simple prompt appears: *"What good thing happened to you in New York today?"*
- The user types one short line (character-limited to match the app's brief, warm voice — roughly the same length as an AI-written headline, e.g. ~140 characters).
- Their entry renders as a card using the **same skeleton as every other post** (date badge, headline, detail-style line) but with a distinct **"🫶 Yours"** pill instead of a data category, and **no source citation** — since it's self-reported, not sourced from open data. This visual distinction matters: personal entries must never be confused with verified, data-backed stories.
- Entries are private by default (visible only to the person who wrote them) unless the person opts to share to the Community page.

**8.2 Community Page**
- After journaling, the user can open a lightweight **Community page**: one anonymized positive moment submitted by another New Yorker that day, shown in the same card style.
- Entries are anonymous — no name, no handle, no exact location beyond borough (if given at all) — and clearly labeled **"from a fellow New Yorker"** so it's never mistaken for a verified, dataset-backed story.
- Framing stays modest for the hackathon: one stranger's moment at a time, not an infinite social feed — consistent with the app's "one small thing a day" pacing rather than becoming a scrolling social app.

**8.3 Feasibility note for the hackathon**
- This does require a shared write/read layer, which the community page needs but the rest of the app (all open-data cards) does not. A simple shared key-value store is sufficient for demo purposes — no custom backend needed.
- **Moderation is the real risk here, not the engineering.** Any open text field shown to strangers needs at least a basic profanity/PII filter and a character cap before this goes anywhere near a public demo; a production version would need real moderation tooling (reporting, rate limits, review queue) before shipping beyond the hackathon. This is called out again in Section 13.

---



**AI does:**
- Write a two-line headline (each line under ~9 words) and one detail sentence, using only the supplied fact object (category, type, borough, agency, date, location).
- Adjust tone per category (warmer for Care, quietly witty for Fix) within a fixed voice: observant, warm, never falsely upbeat, never uses exclamation points or words like "amazing."

**AI never:**
- Selects which record is shown (simple filter rules do that — e.g., `status = Closed`, has a borough field).
- Invents a name, number, date, place, species, or outcome not present in the fact object. If a fact is missing, the model is instructed to omit it rather than guess.
- Touches the map, pins, source citation, or raw-data panel — those render directly from the dataset with no model involved.

**Failure handling:** If the AI call fails or returns invalid output, the app falls back to a plain templated sentence built directly from the raw fields — so a model outage produces a plainer card, never a broken or fabricated one.

---

## 10. Screens (MVP)

1. **Landing** — "What good things happened in New York today?" + "See today's stories" button
2. **Daily Stack** — swipeable cards, 8 max, dot navigation, shuffle
3. **Story Detail** (expanded via "view source data") — raw record shown inline within the card
4. **Journal Prompt** — end-of-feed screen inviting the user to write their own positive moment, rendered as a matching card with a "Yours" pill
5. **Community Page** — one anonymized stranger's positive moment per visit, same card style, clearly labeled as user-submitted rather than data-sourced
6. **(Stretch) Map View** — toggle between Cards and Map; pins colored by category; tapping a pin surfaces the same card component anchored to that location

Cut from MVP, listed as stretch/post-hackathon: historical date picker, "near me" geolocation, saved postcards, accounts.

---

## 11. Design System

- **Palette:** warm cream background; category cards in flat pastel — sky blue (Fix), mustard (Gather), coral (Create), mint (Care); black ink for text and borders
- **Type:** headline copy moves to a hand-lettered, handwriting-style display face (e.g. Caveat or Kalam, bold weight) for an intimate, personal feel — like a note written just for you — paired with a clean sans-serif (DM Sans) for body, detail lines, pills, and source citations, so functional text stays easy to read at small sizes
- **Card style:** thick black border, hard offset drop-shadow (no blur), organic asymmetric border-radius — a "sticker" aesthetic rather than a flat rectangle
- **Category tag:** rounded pill, colored fill, black border — one color per category, consistent across card and (if built) map pins
- **Icons:** cute, friendly line doodles per category — rounded strokes with a slightly imperfect, hand-drawn feel (lightbulb, music stand, clapperboard, bird), warmer and softer than sharp geometric or stock icons
- **Motion:** one deliberate entrance animation per card (settle/fade-in), no scattered or decorative animation elsewhere

---

## 12. Technical Architecture

```
NYC Open Data (Socrata API — public, no auth required)
        ↓
Client-side fetch per category (2 records each)
        ↓
Simple filter rules (status, presence of borough/location fields)
        ↓
Structured fact object: { category, type, subject, borough, agency, date, location, raw }
        ↓
AI call (strict system prompt — facts only, JSON output)
        ↓
Parsed { line1, line2, detail } — fallback to templated sentence on failure
        ↓
Render card → swipeable stack → shuffle / share / view-source actions
```

- **Frontend:** single-page HTML/JS, mobile-first, no build step required for the demo
- **Data layer:** direct Socrata JSON endpoints (CORS-enabled), generic field extraction (matches keys like `*borough*`, `*date*`, `*agency*`) so the app tolerates schema differences across datasets without hardcoding brittle field names
- **AI layer:** single-purpose prompt per record; runs in parallel across all fetched records
- **Map (stretch):** Leaflet.js, no API key required; pins colored by category; borough-level placement noted where exact coordinates aren't available (Gather/Create), precise coordinates used where available (Fix/Care)
- **Community layer:** the only part of the app needing shared read/write storage; a simple shared key-value store is enough to hold journal entries opted into the Community page — no custom backend required for the hackathon demo

---

## 13. Known Data Limitations (to state proactively, not hide)

- **Care** records are real but not reliably "today-fresh" — labeled "on record" rather than implying same-day freshness.
- **Gather** and **Create** datasets are strong on borough-level location but not always on exact coordinates — map pins for these categories represent a general area, not a precise address, and the app should not claim otherwise.
- Socrata field names vary slightly across datasets — the app extracts generically rather than assuming one fixed schema, trading a small amount of precision for resilience against schema drift.
- **Community entries are user-submitted, not verified** — this is the one place in the app where "data is truth" doesn't apply, so entries must stay visually and textually distinct from data-backed cards (no source citation, clear "Yours"/"fellow New Yorker" labeling). Any open text field shown to other people needs a basic content filter and length cap even at hackathon scale; real moderation tooling is a pre-launch requirement, not a nice-to-have, before this goes beyond a demo.

---

## 14. Demo Day Success Criteria

- [ ] Live fetch + live AI generation happens on stage, visibly, not pre-cached
- [ ] At least 3 of 4 categories return real data at demo time
- [ ] "View source data" toggle clearly shows the raw record matches the story
- [ ] Swipe interaction works smoothly on the actual device being demoed
- [ ] One clean "send postcard" moment to close the demo

---

## 15. Weekend Build Priority

**Must have:** live fetch (all 4 categories) → AI story generation → swipeable 8-card stack → source-data transparency toggle → basic share action

**Strong addition if time allows:** map view toggle with category-colored pins; end-of-feed journal prompt + Community page (with a basic content filter on submissions before anything is shown to other users)

**Cut entirely for this hackathon:** accounts, notifications, historical date picker, saved/favorited stories, backend persistence beyond the community shared store
