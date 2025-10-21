# Helsekort for gravide

Digital versjon av helsekort for gravide brukt i Norge. Denne webappen lar gravide registrere og holde oversikt over svangerskapsdata digitalt.

## Funksjoner

- 🔐 Sikker autentisering med Supabase Auth
- 📝 Registrere svangerskapsinformasjon
- 🏥 Logg svangerskapskontroller med målinger (vekt, blodtrykk, symfyse-fundus)
- 🔬 Registrere ultralydundersøkelser
- 💉 Oversikt over blodprøver og tester
- ⏰ Påminnelser for kommende kontroller
- 📊 Dashboard med svangerskapsoversikt

## Teknologi

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL database + Auth)
- **Deployment:** Vercel
- **Versjonskontroll:** GitHub

## Komme i gang

### Forutsetninger

- Node.js 18+ installert
- En Supabase-konto (gratis på [supabase.com](https://supabase.com))
- Git installert

### 1. Klon repository

```bash
git clone https://github.com/toreaa/Helsekort.git
cd Helsekort
```

### 2. Installer avhengigheter

```bash
npm install
```

### 3. Sett opp Supabase

1. Gå til [supabase.com](https://supabase.com) og opprett et nytt prosjekt
2. Når prosjektet er opprettet, gå til **SQL Editor**
3. Kjør SQL-skriptet fra `supabase/migrations/001_initial_schema.sql`
   - Dette oppretter alle tabeller og policies

### 4. Konfigurer miljøvariabler

1. Kopier `.env.local.example` til `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Gå til Supabase Dashboard → Project Settings → API
3. Kopier verdiene og lim inn i `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=din-prosjekt-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=din-anon-key
```

### 5. Kjør utviklingsserver

```bash
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren.

### 6. Legg til testdata (valgfritt)

1. Opprett først en bruker via signup-siden: [http://localhost:3000/auth/signup](http://localhost:3000/auth/signup)
   - Bruk e-post: `test@helsekort.no`
   - Passord: `Test123!` (eller ditt eget)

2. Gå til Supabase Dashboard → SQL Editor
3. Kjør SQL-skriptet fra `supabase/seed/002_fake_data.sql`
   - Dette legger til testdata for den første brukeren i systemet

## Deployment til Vercel

Prosjektet er allerede konfigurert for Vercel deployment.

### Via Vercel Dashboard

1. Gå til [vercel.com](https://vercel.com)
2. Import GitHub repository: `toreaa/Helsekort`
3. Legg til miljøvariabler:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Via Vercel CLI

```bash
vercel --prod
```

**Viktig:** Hver gang du pusher til `main` branch på GitHub, vil Vercel automatisk deploye endringene.

## Prosjektstruktur

```
Helsekort/
├── app/                          # Next.js App Router
│   ├── auth/                     # Autentisering (login/signup)
│   ├── dashboard/                # Dashboard og hovedfunksjoner
│   │   ├── kontroller/           # Svangerskapskontroller
│   │   ├── paapinnelser/         # Påminnelser
│   │   └── ny-graviditet/        # Opprett nytt svangerskap
│   ├── globals.css               # Global CSS
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Hjemmeside
├── components/                   # React komponenter
│   ├── auth/                     # Auth-komponenter
│   └── helsekort/                # Helsekort-komponenter
├── lib/                          # Konfigurasjoner
│   └── supabase.ts               # Supabase client og types
├── utils/                        # Hjelpefunksjoner
│   ├── auth.ts                   # Auth utilities
│   └── pregnancy.ts              # Database queries
├── supabase/                     # Database
│   ├── migrations/               # Database schema
│   └── seed/                     # Testdata
└── public/                       # Statiske filer
```

## Database schema

Databasen består av følgende hovedtabeller:

- **profiles** - Brukerprofiler
- **pregnancies** - Svangerskapsdata
- **checkups** - Svangerskapskontroller
- **ultrasounds** - Ultralydundersøkelser
- **blood_tests** - Blodprøver
- **reminders** - Påminnelser
- **medical_conditions** - Medisinske forhold
- **previous_pregnancies** - Tidligere graviditeter

Se `supabase/migrations/001_initial_schema.sql` for full dokumentasjon.

## Sikkerhet

- Row Level Security (RLS) er aktivert på alle tabeller
- Brukere kan kun se og redigere sine egne data
- Autentisering håndteres av Supabase Auth
- Miljøvariabler brukes for sensitiv konfigurasjon

## Utvikling

### Kjør i utviklingsmodus

```bash
npm run dev
```

### Bygg for produksjon

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Bidra

Dette er et personlig prosjekt, men du er velkommen til å foreslå forbedringer via issues eller pull requests.

## Lisens

Privat prosjekt - Alle rettigheter reservert.

## Kontakt

For spørsmål, kontakt prosjekteier via GitHub.
