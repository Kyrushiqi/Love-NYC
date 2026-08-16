# Love NYC ❤️

## The Problem

New York publishes enormous amounts of public data every day — service requests get closed, events get permitted, film crews get approved, park rangers respond to wildlife. This information is real and constantly updated, but it lives in spreadsheets, dashboards, and government portals built for analysts, not residents.

Meanwhile, the dominant daily narrative about NYC is complaint: expensive rent, subway delays, broken infrastructure, distrust of institutions like health insurance. That narrative isn't wrong — but it's incomplete. The good things the city's own data already proves are happening every day never reach anyone as a _story_.

**The gap:** NYC Open Data has the facts. No one is translating them into something a person would actually want to read.

---

## Our Solution

LOVE NYC pulls live records from NYC Open Data, selects one per category (Fix, Gather, Create, Care), and uses AI to translate the raw record into a two-line warm headline plus one supporting detail line — never inventing anything beyond what the record states. The result is a small, shareable "postcard" story.

**Core principle: Data is truth. AI is voice.**
AI never decides _what_ happened or _whether_ it's good — that's determined by the dataset and simple filtering rules. AI's only job is tone and phrasing.

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

Frontend: React + Vite + TypeScript + Tailwind CSS + Leaflet + Lucide React
Backend: Express + Node.js + TypeScript + Gemini API via Google GenAI
Data Source: NYC Open Data (Socrata datasets for 311, permitted events, film permits, and park ranger activity)

---

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

## Docker Compose Setup

This is the recommended way to run the app.

**Prerequisites:** Docker Desktop or Docker Engine

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Add your Gemini API key to `.env`:
   ```bash
   GEMINI_API_KEY=your_key_here
   ```
3. Start the app:
   ```bash
   docker compose up --build
   ```
4. Open the app in your browser:
   ```text
   http://localhost:3000
   ```

To stop the app:

```bash
docker compose down
```

## Local development

**Prerequisites:** Node.js 20+

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a local environment file:
   ```bash
   cp .env.example .env.local
   ```
3. Add your Gemini API key in `.env.local`.
4. Run the app in development mode:
   ```bash
   npm run dev
   ```

## Production build

```bash
npm run build
npm run start
```

## Docker files included

- [Dockerfile](Dockerfile)
- [docker-compose.yml](docker-compose.yml)
- [.env.example](.env.example)

These provide a repeatable, portable setup for running the app in a containerized environment.
