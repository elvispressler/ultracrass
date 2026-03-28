# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite (Tailwind v4, Framer Motion, Wouter)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── literary-dispatch/  # Literary Dispatch React frontend
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Literary Dispatch — The App

A literary journal website where the owner submits short fragments (diary entries, observations, quotes) from their phone, and an AI-selected artist theme defines the visual identity.

### Features
- **Dynamic artist themes**: 7 artists pre-configured (Egon Schiele, Gustav Klimt, Jean-Michel Basquiat, Caspar David Friedrich, Frida Kahlo, Mark Rothko, Piet Mondrian). Each theme has colors, fonts, public-domain artwork URLs, and a mood description.
- **Admin interface**: Password-protected at `/admin`. Default password: `dispatch2024` (change via `ADMIN_PASSWORD` env var).
- **Content types**: diary, observation, quote, comment, literary — displayed in German.
- **Scattered layout**: Entries appear offset/staggered, not as a boring list.
- **Mobile-first**: Works on phone.

### API Endpoints
- `GET /api/entries` — list all entries (newest first)
- `POST /api/entries` — create entry (requires `adminPassword`)
- `DELETE /api/entries/:id` — delete entry (requires `adminPassword`)
- `GET /api/theme` — get current artist theme
- `POST /api/theme/generate` — generate new artist theme (requires `adminPassword`, optionally `artistName`)
- `POST /api/auth/verify` — verify admin password

### Admin Password
Default: `dispatch2024`
Override: set `ADMIN_PASSWORD` environment variable in the API server.

### DB Schema
- `entries` table: id, title, subject, content, type, created_at
- `artist_themes` table: id, artist_name, artist_bio, era, color_*, font_*, artwork_urls (JSON), artwork_titles (JSON), mood_description, active_from

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API types

## DB Operations

- `pnpm --filter @workspace/db run push` — push schema to DB (dev)
- `pnpm --filter @workspace/db run push-force` — force push schema
