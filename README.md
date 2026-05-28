# ☎ Peeps Tracker — Speed Dial for Real Life

Keep track of the people you care about. A personal contact-frequency tracker that looks like a Nokia phone from 1999. Never let a relationship quietly drift again.

> **Font note:** The retro LCD look uses the [VT323](https://fonts.google.com/specimen/VT323) pixel font from Google Fonts. It loads from the internet on first visit — the app still works offline, it just falls back to Courier New.

---

## What it does

- Groups contacts by tier: 💛 **Lots** / 💚 **Medium** / 🤍 **Whenever**
- Shows color-coded status dots: 🟢 good · 🟡 due soon · 🔴 overdue
- Each group gets a speed dial number **①②③** — reorder them to set your priorities
- One-tap **☎** button to log a contact (then the dot turns green)
- Stats bar at a glance · Filter by tier or overdue-only
- Data lives in your browser's `localStorage` — no account or server needed (Phase 1)

---

## Phase 1 Setup — Local App (Do This Now)

> Data saves to your browser. Works offline. No login required.

- [ ] **Clone or download** this repo to your machine
- [ ] **Install dependencies**
  ```bash
  npm install
  ```
- [ ] **Start the dev server**
  ```bash
  npm run dev
  ```
- [ ] **Open the app** at `http://localhost:5173/peeps-tracker/`
- [ ] **Add your first group** → click MANAGE → Groups tab → `+ ADD GROUP`
  - Pick a name (e.g. "Close Friends"), a tier, and how often to reach out in days
- [ ] **Add people** → People tab → `+ ADD PERSON`
  - Fill in name, group, and last-contact date if you remember it
- [ ] **Use the speed dial** — back on the main screen, groups are numbered ①②③
  - Use the ↑↓ arrows in Manage → Groups to set which group is #1, #2, etc.
  - Tap ☎ on a person when you've reached out — dot turns green, timer resets

---

## Deploy to GitHub Pages (optional)

> So you can access it from your phone without running a local server.

- [ ] **Create a GitHub repo** named `peeps-tracker`
  - Settings → Pages → Source: `gh-pages` branch
- [ ] **Initialize git and push**
  ```bash
  git init
  git remote add origin https://github.com/YOUR_USERNAME/peeps-tracker.git
  git add .
  git commit -m "initial commit"
  git push -u origin main
  ```

  **That's it.** Pushing to `main` automatically runs tests, builds, and deploys via GitHub Actions (`.github/workflows/deploy.yml`). No manual `npm run deploy` needed.

- [ ] **Visit** `https://YOUR_USERNAME.github.io/peeps-tracker/`
- [ ] **Bookmark it on your phone** — add to home screen for app-like feel

> ⚠️ Each browser/device has its own localStorage — data won't sync between your phone and laptop (that's Phase 2).

---

## Phase 2 — Cloud Sync with Supabase (Later)

> Add a real backend so your data syncs across devices and has a login.

- [ ] Go to [supabase.com](https://supabase.com) → create a free project
- [ ] Open the **SQL Editor** → paste and run the contents of [`supabase/schema.sql`](supabase/schema.sql)
  - This creates the `groups` and `people` tables with Row Level Security
- [ ] In Supabase: **Settings → API** → copy your **Project URL** and **anon public key**
- [ ] Fill them in to [`.env.local`](.env.local):
  ```
  VITE_SUPABASE_URL=https://your-project-id.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key-here
  ```
- [ ] In Supabase: **Authentication → URL Configuration** → set Site URL to:
  ```
  https://YOUR_USERNAME.github.io/peeps-tracker/
  ```
- [ ] Wire up auth in the app (swap `localData` calls for Supabase calls, add magic-link login page)
  - The `LoginPage.tsx` and `supabaseClient.ts` are already scaffolded in `src/`
- [ ] Re-deploy: `npm run deploy`
- [ ] Test end-to-end: sign up with your email, click the magic link, add a group + person, refresh — data should persist

---

## Development

```bash
npm test          # run unit tests once
npm run test:watch  # re-run on file changes
```

Tests cover the core logic in `src/lib/utils.ts` (status thresholds, day counting) and all CRUD operations in `src/lib/localData.ts`.

---

## Phase 3 — Nice to Haves (Maybe Someday)

- [ ] Contact log history — see past dates per person, not just the most recent
- [ ] Mobile PWA — `manifest.json` so it installs to your home screen as an app icon
- [ ] Export to CSV — download your full peeps list
- [ ] Weekly email digest — Supabase edge function that emails you "who to reach out to this week"
- [x] GitHub Actions auto-deploy on push to `main`

---

## Stack

| Thing | What |
|---|---|
| [Vite 8](https://vite.dev) + [React 19](https://react.dev) | Frontend framework |
| [TypeScript 6](https://typescriptlang.org) | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [react-router-dom v7](https://reactrouter.com) | Client-side routing (HashRouter for GH Pages) |
| [date-fns v4](https://date-fns.org) | Date math |
| [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) | Phase 1 data storage |
| [Supabase](https://supabase.com) | Phase 2 auth + cloud DB |
| [gh-pages](https://github.com/tschaub/gh-pages) | GitHub Pages deployment (manual) |
| [Vitest](https://vitest.dev) | Unit tests |
| [GitHub Actions](https://docs.github.com/en/actions) | Auto-deploy on push to main |
