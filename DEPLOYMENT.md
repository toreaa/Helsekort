# Deployment Guide - Helsekort for gravide

Denne guiden viser hvordan du setter opp og deployer Helsekort-applikasjonen.

## Del 1: Sett opp Supabase Database

### 1. Opprett Supabase prosjekt

1. Gå til [supabase.com](https://supabase.com)
2. Logg inn eller opprett konto
3. Klikk **"New Project"**
4. Fyll inn:
   - **Name:** Helsekort
   - **Database Password:** (velg et sterkt passord - HUSK Å LAGRE DET!)
   - **Region:** North Europe (Frankfurt) - nærmest Norge
5. Klikk **"Create new project"**
6. Vent 1-2 minutter mens prosjektet settes opp

### 2. Kjør database migration

1. Når prosjektet er klart, gå til **SQL Editor** (i venstremenyen)
2. Klikk **"New query"**
3. Åpne filen `supabase/migrations/001_initial_schema.sql` fra prosjektet
4. Kopier hele innholdet
5. Lim inn i SQL-editoren i Supabase
6. Klikk **"Run"** (eller Ctrl+Enter)
7. Du skal se melding om at kommandoene kjørte vellykket

### 3. Hent API-nøkler

1. Gå til **Project Settings** (tannhjul-ikonet nederst i venstremenyen)
2. Klikk på **API** i venstremenyen
3. Kopier disse verdiene (du trenger dem senere):
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## Del 2: Deployment til Vercel

### Metode 1: Via Vercel Dashboard (Anbefalt)

1. Gå til [vercel.com](https://vercel.com)
2. Logg inn (bruk GitHub-kontoen din)
3. Klikk **"Add New..."** → **"Project"**
4. Finn **"Helsekort"** repository i listen
5. Klikk **"Import"**
6. Under **"Configure Project"**:
   - Framework Preset: Next.js (skal være automatisk detektert)
   - Root Directory: `./` (la stå som default)
7. Klikk **"Environment Variables"**
8. Legg til disse variablene:

   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: [din Project URL fra Supabase]

   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: [din anon public key fra Supabase]
   ```

9. Klikk **"Deploy"**
10. Vent 2-3 minutter mens prosjektet bygges og deployes
11. Når deploymentet er ferdig, får du en URL (f.eks. `helsekort.vercel.app`)

### Metode 2: Via Vercel CLI (Alternativ)

Hvis du allerede har kjørt `vercel login` og `vercel --prod`:

1. Gå til Vercel Dashboard
2. Finn prosjektet "helsekort"
3. Gå til **Settings** → **Environment Variables**
4. Legg til miljøvariablene som beskrevet over
5. Gå til **Deployments**
6. Klikk på de tre prikkene ved siste deployment
7. Velg **"Redeploy"**

## Del 3: Test applikasjonen

### 1. Opprett testbruker

1. Besøk din Vercel URL (f.eks. `https://helsekort.vercel.app`)
2. Klikk **"Opprett konto"**
3. Fyll inn:
   - Fullt navn: `Test Bruker`
   - E-post: `test@helsekort.no`
   - Passord: `Test123!`
4. Klikk **"Opprett konto"**
5. Du blir sendt til dashboard

### 2. Last inn testdata (valgfritt)

1. Gå tilbake til Supabase Dashboard
2. Gå til **SQL Editor**
3. Åpne en ny query
4. Kopier innholdet fra `supabase/seed/002_fake_data.sql`
5. Lim inn og klikk **"Run"**
6. Gå tilbake til applikasjonen og refresh siden
7. Du skal nå se testdata i dashboard

## Del 4: Verifiser at alt fungerer

Sjekk at disse funksjonene virker:

- [ ] Logg inn og ut
- [ ] Se dashboard med svangerskapsoversikt
- [ ] Navigere til kontroller-siden
- [ ] Navigere til påminnelser-siden
- [ ] Se testdata (hvis du la til det)

## Feilsøking

### Problem: "Missing Supabase environment variables"

**Løsning:**
- Gå til Vercel → Settings → Environment Variables
- Sjekk at begge variablene er lagt til
- Redeploy prosjektet

### Problem: "Could not connect to database"

**Løsning:**
- Sjekk at du har kjørt migration-scriptet i Supabase
- Verifiser at API-nøklene er riktige
- Sjekk at Supabase-prosjektet ikke er pauset

### Problem: "Authentication failed"

**Løsning:**
- Gå til Supabase → Authentication → URL Configuration
- Sjekk at din Vercel URL er lagt til i "Site URL"
- Legg til `https://din-url.vercel.app/**` i "Redirect URLs"

## Neste steg

- Opprett ditt eget svangerskap via "Opprett nytt svangerskap"
- Begynn å registrere kontroller
- Sett opp påminnelser for kommende avtaler

## Kontinuerlige deployments

Fra nå av, hver gang du pusher kode til `main` branch på GitHub, vil Vercel automatisk:
1. Bygge prosjektet
2. Kjøre tester
3. Deploye hvis alt er OK

Du kan se deployment-status i Vercel Dashboard under **Deployments**.

## Support

Hvis du har problemer:
1. Sjekk Vercel deployment logs
2. Sjekk Supabase logs under **Logs** i dashboard
3. Se [Next.js dokumentasjon](https://nextjs.org/docs)
4. Se [Supabase dokumentasjon](https://supabase.com/docs)
