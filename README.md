# StatCheck — League of Legends Statistics Platform

A full-stack OP.GG-inspired League of Legends stats tracker built with React, Node.js, and PostgreSQL.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS (dark theme) |
| State | TanStack Query v5 |
| Charts | Recharts |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Routing | React Router v6 |

## Features

- **Summoner Search** — Search any seeded summoner with autocomplete and history
- **Summoner Profile** — Ranked stats, LP history chart, KDA trend, most played champions
- **Match History** — OP.GG-style match cards with expandable detail view
- **Champion Statistics** — Sortable/filterable table and card grid with win/pick/ban rates
- **Champion Detail** — Radar chart, performance stats, recent match log
- **Favorites & History** — Locally stored favorite summoners and search history
- **Responsive** — Mobile-first layout with full desktop support

## Project Structure

```
statcheck/
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Navbar, Footer
│   │   │   ├── ui/           # Card, Badge, SearchBar, LoadingSpinner
│   │   │   ├── summoner/     # SummonerHeader, RankedCard, MatchCard, charts
│   │   │   ├── champion/     # ChampionTable, ChampionCard
│   │   │   └── home/         # SearchSection, FeaturedChampions, RecentMatches
│   │   ├── pages/            # Home, SummonerProfile, Champions, ChampionDetail
│   │   ├── hooks/            # useSummoner, useChampions, useMatches, useLocalStorage
│   │   ├── types/            # Shared TypeScript interfaces
│   │   └── utils/            # formatters, constants
│   └── ...
└── backend/                  # Express + TypeScript
    ├── src/
    │   ├── routes/           # summoners, champions, matches
    │   ├── controllers/      # business logic per resource
    │   └── middleware/       # error handler
    ├── prisma/
    │   ├── schema.prisma     # DB models
    │   └── seed.ts           # 20 champions + 8 summoners + 30 matches
    └── ...
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ running locally

### 1. Clone & Install

```bash
git clone <repo-url>
cd statcheck

# Install all dependencies
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/statcheck"
PORT=3001
```

### 3. Set Up the Database

```bash
cd backend

# Push schema to DB and generate Prisma client
npx prisma db push

# Seed with mock League of Legends data
npm run db:seed
```

### 4. Start Development Servers

**Backend** (port 3001):
```bash
cd backend
npm run dev
```

**Frontend** (port 5173):
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Optional: Prisma Studio

```bash
cd backend
npm run db:studio
```

Opens a visual DB browser at [http://localhost:5555](http://localhost:5555).

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/summoners` | List all summoners (paginated) |
| GET | `/api/summoners/search?q=name` | Search summoners |
| GET | `/api/summoners/:name` | Get summoner + match history |
| GET | `/api/champions` | List champions (sort/filter/paginate) |
| GET | `/api/champions/:id` | Get champion + recent matches |
| GET | `/api/matches/recent` | Recent matches for home page |
| GET | `/api/matches/:id` | Get single match detail |

## Seeded Data

The seed script creates:
- **20 champions**: Ahri, Zed, LeBlanc, Jinx, Lee Sin, Thresh, Yasuo, Lulu, Darius, Syndra, Caitlyn, Lux, Vi, Kai'Sa, Ekko, Orianna, Blitzcrank, Ezreal, Akali, Malphite
- **8 summoners**: Faker, Doublelift, Caps, Uzi, Showmaker, TheShy, Canyon, Knight
- **30 matches** with realistic KDA, CS, gold, items, LP changes

## Search Sample Queries

Try searching for: `Faker`, `Doublelift`, `Caps`, `Uzi`

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | — | PostgreSQL connection string |
| `PORT` | `3001` | Backend server port |
| `NODE_ENV` | `development` | Environment mode |
| `FRONTEND_URL` | `http://localhost:5173` | CORS allowed origin |
