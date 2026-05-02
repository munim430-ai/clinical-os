# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```shell
bun install                  # install dependencies
bun run dev                  # start Expo dev server
bun run dev:android          # start Expo dev server, clear cache, Android
bun run build:web            # export static web build to dist/
bun run format               # lint + format with Biome (auto-fix)
bun run db:generate          # generate Drizzle migration files from schema

# Build the pre-seeded SQLite file used by the web version (Node >= 22 required)
node --experimental-sqlite scripts/build-web-db.mjs
```

There is no test suite. Biome is the linter/formatter — not ESLint or Prettier. Always run `bun run format` before committing.

## Architecture

### Platform split

The app targets Android, iOS, and web from the same codebase. Platform-specific modules use Metro's platform extension resolution — files ending in `.web.ts` are used on web, bare `.ts` on native. Affected modules:

| Module | Native | Web |
|---|---|---|
| Database driver | `db/drizzle.ts` (expo-sqlite) | `db/drizzle.web.ts` (sql.js) |
| Persona/prefs | `lib/persona.ts` (MMKV) | `lib/persona.web.ts` (localStorage) |
| Storage | `lib/storage.ts` (MMKV) | `lib/storage.web.ts` (localStorage) |
| Surveillance | `lib/surveillance.ts` | `lib/surveillance.web.ts` |
| Navigation bar | `lib/android-navigation-bar.ts` | `lib/android-navigation-bar.web.ts` |

### Database

- **Native**: `expo-sqlite` opened as `clinical_os.db`; Drizzle runs SQL migrations on first launch via `DatabaseProvider` in `db/provider.tsx`.
- **Web**: `sql.js` loads a pre-built static file at `/database.sqlite` (served from `public/`). Build it with the script above before `bun run build:web`. The web provider uses `initialize()` directly; `useMigrationHelper` is a no-op stub.
- All Drizzle queries go through the `useDatabase()` hook which exposes the `db` instance from context. Import schema tables from `db/schema.ts`.
- Add new tables to `db/schema.ts`, then run `bun run db:generate` to produce a migration file in `db/migrations/`. Seed data goes in a separate numbered `.sql` file in the same folder.

### Application modules (four tabs)

| Tab | Route | Purpose |
|---|---|---|
| GP Master | `app/(tabs)/gp/` | Clinical workflows: body systems → conditions → symptoms, warning signs, protocols, exam steps, OSCE cards |
| DIMS | `app/(tabs)/dims/` | Drug lookup — 21,700+ Bangladesh drug brands, generics, manufacturers, dosage forms |
| ER | `app/(tabs)/er/` | Emergency room: weight-based drug dose calculator |
| Profile | `app/(tabs)/profile/` | Persona selection, preferences |

Detail screens live outside the tab group: `app/dims/brand/[id].tsx`, `app/dims/generic/[id].tsx`, `app/gp/[system].tsx`, `app/gp/condition/[id].tsx`, `app/gp/quiz.tsx`.

### Navigation

Expo Router file-based routing. `app/_layout.tsx` is the root layout and wraps the entire tree in `DatabaseProvider` → `ThemeProvider` → `GestureHandlerRootView` → `BottomSheetModalProvider`. The onboarding check runs there: if MMKV key `onboarded` is false, the router redirects to `/onboarding` after fonts load.

### Design system

The app is **dark-only** — there is no light theme, even though both `LIGHT_THEME` and `DARK_THEME` constants exist; both resolve to the same dark palette.

Tailwind custom tokens (defined in `tailwind.config.ts`):
- Background: `background` (`#000`), `surface` (`#121212`), `ink-800` (`#121212`)
- Accent: `accent-primary` / `mint` → Luminous Mint `#B8FFD2`; `clinical-red` (`#FF453A`); `clinical-teal` (`#00D7B5`)
- Text: `text-primary` (white), `text-secondary`, `text-muted`, `text-accent`
- Border: `border` (`#1C1C1E`), `border-soft/medium/strong`
- Border radius: `rounded-clinical` (24px), `rounded-xl2` (28px)
- Font families: `font-heading`, `font-headingSemi`, `font-body`, `font-bodySemi`, `font-mono`

NativeWind is used for all styling. Use className-based Tailwind on React Native components.

### State and preferences

MMKV (`react-native-mmkv`) stores lightweight preferences on native. Persona type is `"student" | "intern" | "gp"`, set during onboarding and accessed via `lib/persona.ts`. There is no global state manager — component state + the database context cover all data needs.

### Content policy

Clinical OS must only ship original, public-domain, government-licensed, or medically-reviewed content. Never import copied subscription databases, scraped proprietary app content, or reverse-engineered protected datasets. See `docs/content-import.md` for the full import contract and CSV column schemas for each table.

The `content_versions`, `sync_manifest`, `media_assets`, and `app_alerts` tables support future remote content delivery without requiring an app update.
