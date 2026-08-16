# Supabase Setup Guide for LOVE NYC

This directory contains the database schema, migrations, and seed data for **LOVE NYC**.

---

## 🗄️ Database Architecture

The schema includes the following tables:
- **`community_moments`**: User-submitted positive moments shared across NYC boroughs.
- **`stories_cache`**: Daily AI-generated story stack cache backed by NYC Open Data.
- **`journal_entries`**: Synced user journal entries.
- **`custom_datasets`**: User-registered Socrata dataset references.
- **RPC Function `increment_community_likes(entry_id text)`**: Atomic race-condition safe upvoting.
- **Row Level Security (RLS)**: Public read/write policies configured out of the box.

---

## 🚀 Setup Option 1: Supabase Cloud (Dashboard)

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Copy and run the contents of [`supabase/migrations/20260816000000_initial_schema.sql`](./migrations/20260816000000_initial_schema.sql).
4. (Optional) Run [`supabase/seed.sql`](./seed.sql) in the SQL Editor to populate the 7 starter NYC moments.
5. In **Project Settings** -> **API**, copy:
   - **Project URL**
   - **anon / public key**
   - **service_role key** (keep secret, used on the backend)
6. Add these to your `.env` file in the project root:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Client-side Vite environment variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 💻 Setup Option 2: Local Development with Supabase CLI

1. **Install Supabase CLI** (if not already installed):
   ```bash
   # macOS (Homebrew)
   brew install supabase/tap/supabase
   ```

2. **Start Local Supabase instance**:
   ```bash
   npx supabase start
   ```

3. **Apply Migrations and Seed Data**:
   ```bash
   npx supabase db reset
   ```

4. The CLI will output your local API URL and keys:
   - API URL: `http://127.0.0.1:54321`
   - Studio URL: `http://127.0.0.1:54323`
   - Anon key & Service role key

5. Set these in `.env`:
   ```bash
   SUPABASE_URL=http://127.0.0.1:54321
   SUPABASE_ANON_KEY=eyJhbGciOi...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
   ```
