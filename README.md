# Heisenberg Quote Workspace

Local-first premium quote workstation for composing institutional product quote pages.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Prisma ORM
- SQLite

## Features

- Quote dashboard with create, edit, and delete flows
- One quote page can contain multiple products
- Product fields: name, short description, main image, detail images
- Multi-scheme pricing per product (quantity + unit price)
- Deterministic professional text standardization layer for product descriptions
- Premium corporate share page layout (private banking / enterprise proposal style)
- Temporary share links with validity options: 15 days or no expiry
- Optional password protection per share link
- Local image upload storage (`public/uploads`)
- Contact footer on shared quote pages:
  - `heisenberg@newbrandit.com`

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma client:

```bash
npm run prisma:generate
```

3. Generate and initialize local SQLite schema:

```bash
npm run prisma:generate
sqlite3 prisma/dev.db < prisma/bootstrap.sql
```
This resets the local database schema (destructive).

4. Start development server:

```bash
npm run dev
```

5. Open:

- Dashboard: `http://localhost:3000`
- Share page format: `http://localhost:3000/s/<token>`

## Data + Storage Notes

- SQLite database path is configured in `.env` via `DATABASE_URL` (`prisma/dev.db` for this project).
- Optional public share host can be set with `NEXT_PUBLIC_APP_URL` (example: `https://your-domain.com`).
- Uploaded images are stored locally under `public/uploads`.
- Share token passwords are hashed with `bcrypt` before storage.

## Operational Notes

- This tool is designed as a private local workspace; there is no account system.
- Share links are considered temporary and are invalid when expired.
- Password-protected links require a password to render the quote page.
