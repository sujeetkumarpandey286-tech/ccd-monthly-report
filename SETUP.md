# CCD Monthly Report System — Setup Guide

## Quick Start (15 minutes)

### Step 1: Create Supabase Project (Free)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project" → Name it "ccd-monthly-report"
3. Choose region closest to you (Mumbai for India)
4. Set a database password (save it!)
5. Wait ~2 minutes for project to spin up

### Step 2: Run Database Schema

1. In Supabase dashboard → SQL Editor
2. Copy-paste the entire contents of `supabase/schema.sql`
3. Click "Run" — this creates all 15 tables, RLS policies, views, and indexes

### Step 3: Create Your First Admin User

In Supabase → Authentication → Users → "Add User":
- Email: `ccd-1001@ccd.internal`
- Password: (choose a strong password)
- Click "Create User"

Then in SQL Editor, run:
```sql
INSERT INTO profiles (id, employee_id, full_name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'ccd-1001@ccd.internal'),
  'CCD-1001',
  'D. Sharma',
  'admin'
);
```

### Step 4: Get API Keys

In Supabase → Settings → API:
- Copy "Project URL"
- Copy "anon/public" key

### Step 5: Deploy Frontend (Free on Vercel)

1. Push this code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → "New Project" → Import from GitHub
3. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
4. Click "Deploy" — live in ~60 seconds

### Step 6: Add More Users

Login as Admin (CCD-1001) → Admin Panel → "+ Add User"
Or via Supabase dashboard + SQL:

```sql
-- After creating user in Auth dashboard:
INSERT INTO profiles (id, employee_id, full_name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'ccd-1042@ccd.internal'),
  'CCD-1042',
  'R. Kumar',
  'production'
);
```

## For Local Development

```bash
npm install
cp .env.local.example .env.local
# Fill in your Supabase credentials
npm run dev
# Open http://localhost:3000
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  Vercel (Frontend Hosting) — FREE                    │
│  Next.js 14 + React + Tailwind + Recharts           │
└───────────────────────┬─────────────────────────────┘
                        │ HTTPS API calls
┌───────────────────────▼─────────────────────────────┐
│  Supabase — FREE tier                                │
│  ┌────────────┐ ┌──────────┐ ┌───────────────────┐  │
│  │ PostgreSQL │ │   Auth   │ │  Row-Level        │  │
│  │  Database  │ │(email/pw)│ │  Security (RLS)   │  │
│  └────────────┘ └──────────┘ └───────────────────┘  │
└──────────────────────────────────────────────────────┘
```

## Roles & Permissions Matrix

| Role | Can Edit | Can View | Special |
|------|----------|----------|---------|
| Production | Production, Receipt, Consumption, Despatch, Stock, Running Hours | All sections | — |
| Quality | Techno-Eco, Product Yield, Product Quality (Old & New), Lab Analysis | All sections | — |
| Environment | Environment BOD, ISO Objectives | All sections | — |
| Safety | OHSAS Objectives | All sections | — |
| Viewer | Nothing | All sections + Dashboard | — |
| Admin | All sections | All + Audit Log | Override past months, manage users |

## Database Tables (15 total + audit)

| # | Table | Parameters | Managed By |
|---|-------|-----------|------------|
| 1 | production | 14 products × (APP + ACT) | Production |
| 2 | receipt | 4 raw materials | Production |
| 3 | consumption | 44 breakdown items | Production |
| 4 | despatch | 6 products × (APP + ACT) | Production |
| 5 | stock | 16 products | Production |
| 6 | running_hours | 15 equipment items | Production |
| 7 | techno_eco | 11 parameters | Quality |
| 8 | product_yield | 11 yield metrics | Quality |
| 9 | product_quality | 4 metrics (Old CCD) | Quality |
| 10 | product_quality_new | 4 metrics (New CCD) | Quality |
| 11 | lab_analysis_new | 3 metrics | Quality |
| 12 | revenue | 1 (NSR) | Admin |
| 13 | iso_objectives | 3 metrics with norms | Environment |
| 14 | ohsas_objectives | 3 metrics with norms | Safety |
| 15 | environment_bod | 11 parameters with norms | Environment |
| — | audit_log | All admin overwrites | Auto-logged |
| — | month_status | Per-section per-month lock state | System |
| — | profiles | User management | Admin |

**Total unique parameters tracked: ~130+**

## Monthly Workflow

1. Month starts → all sections show as "Not Started" for the new month
2. Each operator fills their sections → saves drafts → submits when done
3. Dashboard updates in real-time as data comes in
4. Admin reviews → locks the month when all sections are submitted
5. If correction needed → Admin unlocks specific section → operator fixes → re-submit
6. Admin can override directly (with reason) → logged in audit trail

## Free Tier Limits (More Than Enough)

- **Supabase**: 500MB database, 50,000 monthly active users, unlimited API calls
- **Vercel**: 100GB bandwidth/month, unlimited deployments
- **Your data**: ~130 params × 12 months × 5 years = ~8,000 rows. Well under 500MB.
