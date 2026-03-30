

# SSB ↔ EO Core Integration — Implementation Plan

## Overview
Build the full integration layer connecting SSB clubs with EO competitions: competition browsing/joining from SSB side, player validation, global player identity, match lineups, and player career history. All with mock data first (Supabase not yet connected).

## What Gets Built

### 1. SSB Competition Pages (3 new pages)
- **`/ssb/competitions`** — Browse available competitions (from EO). Shows competition cards with category, dates, registration status, slot availability.
- **`/ssb/competitions/:id`** — Competition detail with "Daftar Tim" button. Shows format, rules, registered teams.
- **`/ssb/competitions/:id/register`** — Registration flow: select team → pick players (roster) → review validation status → submit. Auto age-check against category limit. Shows valid/invalid badges per player.

### 2. SSB Registration Management
- **`/ssb/registrations`** — "Pendaftaran Saya" list. Shows all submitted registrations with status (pending/approved/rejected). Accessible from SSBMore menu.

### 3. EO Registration Enhancement
- Update **EORegistrations** page to show detailed roster view per registration, with per-player validation status (age check result, document status). Add approve/reject with reason dialog.

### 4. EO Match Enhancement — Lineups & Events
- Update **EOMatches** — Add match detail view with:
  - **Lineup selection**: Pick players from registered roster for each team
  - **Match events**: Log goals, assists, cards with player selection
  - Score input connected to events

### 5. Global Player Identity System (UI layer)
- **Player detail page** (`/ssb/players/:id`) — Shows global profile info, competition history across tournaments, career stats (matches, goals, assists).
- Player cards throughout the app show a "verified" global ID badge.

### 6. Player Career / History
- **Stats tab** on player detail — Aggregated stats from all competitions: matches played, goals, assists, cards. Per-competition breakdown table.

## New Files

| File | Purpose |
|------|---------|
| `src/pages/ssb/SSBCompetitions.tsx` | Browse available competitions |
| `src/pages/ssb/SSBCompetitionDetail.tsx` | Competition detail + register CTA |
| `src/pages/ssb/SSBCompetitionRegister.tsx` | Roster selection with age validation |
| `src/pages/ssb/SSBRegistrations.tsx` | My registrations list |
| `src/pages/ssb/SSBPlayerDetail.tsx` | Player profile + competition history |
| `src/pages/eo/EORegistrationDetail.tsx` | Detailed roster review for EO |
| `src/pages/eo/EOMatchDetail.tsx` | Lineup + match events input |
| `src/lib/mock-data.ts` | Shared mock data (players, teams, competitions, registrations) |
| `src/lib/validation.ts` | Age validation logic + player verification helpers |

## Modified Files

| File | Changes |
|------|---------|
| `src/App.tsx` | Add new SSB + EO routes |
| `src/pages/ssb/SSBMore.tsx` | Link to competitions & registrations |
| `src/pages/eo/EORegistrations.tsx` | Add click-through to registration detail |
| `src/pages/eo/EOMatches.tsx` | Add click-through to match detail |
| `src/components/layout/SSBBottomNav.tsx` | No change (competitions accessed via "Lainnya") |

## Key Integration Flows (Mock)

### Flow 1: SSB Joins Competition
SSBMore → Kompetisi → Browse list → Detail → "Daftar" → Select team → Pick players (auto age-validated) → Submit → Shows in SSBRegistrations as "pending" + appears in EORegistrations

### Flow 2: Player Validation
During roster selection, each player's `birth_date` is checked against `category.age_limit`. Players exceeding age limit are flagged "invalid" and cannot be submitted. UI shows green/red validation badges.

### Flow 3: Match Data Sync
EOMatchDetail → Select lineup from registered roster → Log events (goals/cards linked to player_id) → Stats auto-aggregated in player history

## Technical Details

- **Shared mock data file** (`mock-data.ts`): Single source of truth for all mock entities, ensuring SSB and EO pages reference the same players/teams/competitions
- **Validation utility**: Pure function `validatePlayerAge(birthDate, categoryAgeLimit, referenceDate)` returns valid/invalid with reason
- **Global player ID**: Each mock player has a `globalId` + `uniqueHash` field. Player detail page shows cross-competition stats
- **Registration locking**: Once submitted, roster shows as locked (no edits). EO can approve/reject with reason

## Implementation Order
1. Create `mock-data.ts` + `validation.ts` shared utilities
2. SSB Competition pages (browse → detail → register)
3. SSB Registrations page
4. SSB Player Detail with history
5. EO Registration Detail (roster review)
6. EO Match Detail (lineup + events)
7. Wire up routes in App.tsx + update SSBMore links

