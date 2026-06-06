# StatCheck

A full-stack League of Legends stats platform inspired by OP.GG. Search any NA summoner and get live ranked stats, match history, and champion performance pulled directly from the Riot API — with a 5-minute PostgreSQL cache to keep responses fast.


![Home page](https://cdn.discordapp.com/attachments/1512542345646571614/1512914507826069666/image.png?ex=6a25d2ef&is=6a24816f&hm=f4f2f3b723266bd0a89d043ff4ffc123698159c63c76de85d3e5d6ca21b214f1&)

![Summoner profile](https://cdn.discordapp.com/attachments/1512542345646571614/1512914645567017212/image.png?ex=6a25d310&is=6a248190&hm=d2a38d4a04e8a7865f7786b2861d646f74f0f8287991e02e80e67a243c734db3&)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Data Fetching | TanStack Query v5 |
| Charts | Recharts |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Data Source | Riot Games API v5 + Data Dragon |

## Features

- **Live summoner lookup** — pulls real data from the Riot API on first search, serves from DB cache for 5 minutes
- **Ranked stats** — Solo/Duo and Flex queue LP, win rate, tier emblem
- **Match history** — Last 10 ranked solo games with KDA, CS, gold, items, and expandable detail view
- **Most played champions** — computed from real match history
- **LP & KDA trend charts** — visualised with Recharts
- **Champion directory** — all 160+ champions synced from Data Dragon on startup, sortable by win/pick/ban rate and KDA
- **Champion detail** — radar chart, stats panel, recent match log
- **Search autocomplete** — suggestions from DB with recent search history and favorites stored locally
- **Responsive** — mobile-first dark theme

## Project Structure

```
statcheck/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── layout/       # Navbar, Footer
│       │   ├── ui/           # Card, Badge, SearchBar, LoadingSpinner
│       │   ├── summoner/     # SummonerHeader, RankedCard, MatchCard, PerformanceChart
│       │   ├── champion/     # ChampionTable, ChampionCard
│       │   └── home/         # SearchSection, FeaturedChampions, RecentMatches
│       ├── hooks/            # useSummoner, useChampions, useMatches, useLocalStorage
│       ├── pages/            # Home, SummonerProfile, Champions, ChampionDetail
│       ├── types/            # Shared TypeScript interfaces
│       └── utils/            # formatters, constants
└── backend/
    ├── src/
    │   ├── services/         # riotApi.ts, dataDragon.ts
    │   ├── controllers/      # summonerController, championController, matchController
    │   ├── routes/           # summoners, champions, matches
    │   └── middleware/       # errorHandler
    └── prisma/
        ├── schema.prisma     # Summoner, Champion, ChampionStats, RankedStats, Match, MatchParticipant
        └── seed.ts           # Optional seed for champion stats (win/pick/ban rates)
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Riot Games API key — get one free at [developer.riotgames.com](https://developer.riotgames.com) (dev keys expire every 24 hours)

### 1. Clone & install

```bash
git clone https://github.com/koleluo/statcheck-gg.git
cd statcheck-gg

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
```

Fill in `.env`:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/statcheck"
PORT=3001
FRONTEND_URL=http://localhost:5173
RIOT_API_KEY=RGAPI-your-key-here
RIOT_PLATFORM=na1
RIOT_REGION=americas
```

`RIOT_PLATFORM` is the platform routing value (`na1`, `euw1`, `kr`, etc.).  
`RIOT_REGION` is the regional routing value (`americas`, `europe`, `asia`, `sea`).

### 3. Set up the database

```bash
cd backend

# Apply schema and generate Prisma client
npx prisma db push

# Optional: seed champion win/pick/ban rate stats
npm run db:seed
```

> The champion list (names, images, tags) is synced automatically from Data Dragon every time the backend starts. The seed script only populates the performance stats table.

### 4. Start dev servers

```bash
# Terminal 1
cd backend && npm run dev    # http://localhost:3001

# Terminal 2
cd frontend && npm run dev   # http://localhost:5173
```

### Optional: Prisma Studio

```bash
cd backend && npm run db:studio   # http://localhost:5555
```

## How summoner lookup works

```
GET /api/summoners/:name
  1. Check PostgreSQL for cached summoner (fresh = updated < 5 min ago)
  2. If fresh → return from DB immediately
  3. If stale or not found:
       → GET /lol/summoner/v4/summoners/by-name/{name}      (na1)
       → GET /lol/league/v4/entries/by-summoner/{id}        (na1)
       → GET /lol/match/v5/matches/by-puuid/{puuid}/ids     (americas)
       → GET /lol/match/v5/matches/{matchId}  × 10          (americas)
       → Upsert all results into PostgreSQL
       → Return merged response
```

Subsequent searches within 5 minutes are served entirely from the database with no Riot API calls.

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/summoners` | List all cached summoners (paginated) |
| GET | `/api/summoners/search?q=name` | Autocomplete search against DB |
| GET | `/api/summoners/:name` | Live summoner lookup with Riot API sync |
| GET | `/api/champions` | All champions — sortable, filterable, paginated |
| GET | `/api/champions/:id` | Single champion detail with recent matches |
| GET | `/api/matches/recent` | Recent matches across all cached summoners |
| GET | `/api/matches/:id` | Single match detail |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | — | PostgreSQL connection string |
| `PORT` | `3001` | Backend port |
| `NODE_ENV` | `development` | Environment |
| `FRONTEND_URL` | `http://localhost:5173` | CORS allowed origin |
| `RIOT_API_KEY` | — | Riot Games API key (expires every 24h for dev keys) |
| `RIOT_PLATFORM` | `na1` | Platform routing (`na1`, `euw1`, `kr`, `eun1`, etc.) |
| `RIOT_REGION` | `americas` | Regional routing (`americas`, `europe`, `asia`, `sea`) |

## Notes

- **Dev API key expiry**: Riot dev keys expire every 24 hours. When expired, summoner lookups return a `403` error. Grab a new key at [developer.riotgames.com](https://developer.riotgames.com) and update `backend/.env`.
- **Champion stats**: Win/pick/ban rates are not available from the Riot API directly (they require aggregate data). The seed script populates these with realistic placeholder values. The champion *list* (names, images, tags) is always live from Data Dragon.
- **LP change tracking**: The Riot match API does not include LP deltas. LP change is recorded as `0` for all live matches.
