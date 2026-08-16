# Love NYC ❤️

## The Problem

New York publishes enormous amounts of public data every day — service requests get closed, events get permitted, film crews get approved, park rangers respond to wildlife. This information is real and constantly updated, but it lives in spreadsheets, dashboards, and government portals built for analysts, not residents.

Meanwhile, the dominant daily narrative about NYC is complaint: expensive rent, subway delays, broken infrastructure, distrust of institutions like health insurance. That narrative isn't wrong — but it's incomplete. The good things the city's own data already proves are happening every day never reach anyone as a *story*.

**The gap:** NYC Open Data has the facts. No one is translating them into something a person would actually want to read.

---

## Our Solution

LOVE NYC pulls live records from NYC Open Data, selects one per category (Fix, Gather, Create, Care), and uses AI to translate the raw record into a two-line warm headline plus one supporting detail line — never inventing anything beyond what the record states. The result is a small, shareable "postcard" story.

**Core principle: Data is truth. AI is voice.**
AI never decides *what* happened or *whether* it's good — that's determined by the dataset and simple filtering rules. AI's only job is tone and phrasing.

---

## Target User

New Yorkers who feel worn down by the "everything is broken" narrative of the city and want a small, honest counterweight — not denial that problems exist, but proof that good things are also happening, backed by the city's own records.

---

## Core Features
- Postcards - Swipe through positive news daily
- Map - Tap a pin that shares positive news in the area
- Journal - Share with others one positive thing you did today or a positive thing that happened to you anonymously.

Pull live record data from NYC Open Data sources and use AI to turn data into emotional narratives.


---
## Tech Stack
Frontend: <br>
Backend: <br>
Data Source: <br>

---

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/94fa57e1-6010-4494-8ad3-5bf90fd912dc

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
