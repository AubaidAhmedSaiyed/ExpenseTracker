# FlowSpend — Expense Tracker

A production-style **personal expense tracker** built as a Web Developer internship assignment. The UI is a dark-first SaaS dashboard with glassmorphism cards, responsive layouts, live FX conversion, and polished empty/loading/error states.

## Features

- **Expense CRUD (local)**: add categorized expenses with validation; delete with confirmation-free quick action + toast.
- **Analytics**: totals, transaction count, averages, top category, monthly spend (current calendar month).
- **Category insights**: progress bars + **Recharts** pie distribution.
- **Live currency conversion**: converts your USD total into **USD / INR / EUR / GBP / AED** using **Frankfurter** (`USD → INR,EUR,GBP`) plus **Open ER API** for **AED** (Frankfurter/ECB does not publish AED).
- **Search & sort**: filter by name/category; sort by date or amount.
- **Persistence**: expenses + theme stored in `localStorage`.
- **Accessibility**: semantic sections, labels, keyboard-friendly controls, `aria-live` toasts.

## Tech stack

- React (functional components) + Vite
- Hooks: `useState`, `useEffect`, `useMemo`, `useCallback`, `useLayoutEffect`
- Tailwind CSS
- Axios (FX fetch)
- Recharts (pie chart)

## Getting started

```bash
npm install
npm run dev
```

Build + preview:

```bash
npm run build
npm run preview
```

## APIs

- **Frankfurter**: `https://api.frankfurter.app/latest?from=USD&to=INR,EUR,GBP`
- **Open ER API** (fallback + AED): `https://open.er-api.com/v6/latest/USD` — response uses `rates` (used when Frankfurter is blocked and to fill **AED**).

## Deployment

### Vercel

1. Import the repo in Vercel.
2. Framework preset: **Vite**.
3. Build command: `npm run build`
4. Output directory: `dist`

`vercel.json` includes a SPA rewrite fallback.

### Netlify

`netlify.toml` sets:

- build: `npm run build`
- publish: `dist`
- SPA redirect to `index.html`

## Project structure

```
src/
  components/
  pages/
  hooks/
  utils/
  App.jsx
  main.jsx
  index.css
```

## Notes

- Amounts are treated as **USD** for FX consistency.
- If FX services are unreachable, the app shows a friendly error state with retry.
