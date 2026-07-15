# CCD Monthly Report — Deployment Guide (Cloudflare + Supabase)

Everything below is FREE. Total cost: ₹0.

---

## PART A: Create Accounts (5 minutes)

You need 3 free accounts. Use Google sign-in for speed.

| # | Service | URL | Purpose |
|---|---------|-----|---------|
| 1 | **GitHub** | https://github.com/signup | Stores your code |
| 2 | **Supabase** | https://supabase.com | Database + user login system |
| 3 | **Cloudflare** | https://dash.cloudflare.com/sign-up | Hosts your website |

---

## PART B: Set Up the Database (10 minutes)

### B1. Create Supabase Project

1. Login to Supabase → click **"New Project"**
2. Fill in:
   - Organization: (create one if asked, any name)
   - Project name: `ccd-monthly-report`
   - Database password: **choose a strong one, SAVE IT**
   - Region: **South Asia (Mumbai)**
3. Click "Create new project" — wait 2 minutes

### B2. Run the Database Schema

1. In left sidebar → click **"SQL Editor"**
2. Click **"+ New query"**
3. Open the file `supabase/schema.sql` from the project folder
4. **Select ALL** the text (Ctrl+A), **copy** (Ctrl+C)
5. **Paste** into the Supabase SQL editor
6. Click **"Run"** (or Ctrl+Enter)
7. You should see "Success. No rows returned" — that means it worked!

### B3. Create Your Admin User

Still in SQL Editor, run this (replace the password):

```sql
-- First, go to Authentication > Users > "Add User" in the Supabase dashboard
-- Email: ccd-1001@ccd.internal
-- Password: YourChosenPassword123
-- Check: "Auto Confirm User"
-- Click "Create User"

-- Then come back to SQL Editor and run:
INSERT INTO profiles (id, employee_id, full_name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'ccd-1001@ccd.internal'),
  'CCD-1001',
  'D. Sharma',
  'admin'
);
```

### B4. Copy Your API Keys

1. Go to **Settings** (gear icon in sidebar) → **API**
2. Copy these two values (you'll need them in Part D):

| Key | Where to find | Looks like |
|-----|--------------|------------|
| Project URL | Under "Project URL" | `https://abcdefgh.supabase.co` |
| Anon Key | Under "Project API keys" → `anon` `public` | `eyJhbGciOiJIUzI1NiIs...` (long string) |

---

## PART C: Upload Code to GitHub (5 minutes)

### Option 1: Upload via Browser (No coding needed)

1. Go to https://github.com/new
2. Repository name: `ccd-monthly-report`
3. Keep it **Public** (or Private, both work)
4. Click **"Create repository"**
5. On the next page, click **"uploading an existing file"** link
6. Drag and drop ALL files/folders from the `ccd-report-system` folder
7. Click **"Commit changes"**

**Important:** Make sure the folder structure looks like this at the root:
```
ccd-monthly-report/
├── package.json          ← This MUST be at the root, not inside a subfolder
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── .env.local.example
├── DEPLOY-GUIDE.md
├── supabase/
│   └── schema.sql
└── src/
    ├── middleware.ts
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css
    │   ├── entry/page.tsx
    │   ├── dashboard/page.tsx
    │   └── admin/page.tsx
    ├── components/
    │   ├── Navbar.tsx
    │   ├── Sidebar.tsx
    │   └── DataEntryTable.tsx
    └── lib/
        ├── supabase.ts
        ├── supabase-server.ts
        ├── types.ts
        └── sections-config.ts
```

### Option 2: Using Git (if you know how)

```bash
cd ccd-report-system
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ccd-monthly-report.git
git push -u origin main
```

---

## PART D: Deploy on Cloudflare Pages (5 minutes)

1. Go to https://dash.cloudflare.com
2. Left sidebar → **"Workers & Pages"**
3. Click **"Create"** → select **"Pages"** tab
4. Click **"Connect to Git"**
5. Authorize Cloudflare to access your GitHub → select `ccd-monthly-report` repo
6. Configure build settings:

| Setting | Value |
|---------|-------|
| Project name | `ccd-monthly-report` |
| Production branch | `main` |
| Framework preset | **Next.js** |
| Build command | `npx @cloudflare/next-on-pages` |
| Build output directory | `.vercel/output/static` |

7. Expand **"Environment variables"** and add these:

| Variable name | Value |
|--------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Project URL from Part B4 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Anon Key from Part B4 |
| `NODE_VERSION` | `18` |

8. Click **"Save and Deploy"**
9. Wait 2-3 minutes for the build to complete
10. You'll get a live URL like: **`ccd-monthly-report.pages.dev`**

---

## PART E: First Login & Adding Users

### Login as Admin

1. Open your Cloudflare URL (e.g., `ccd-monthly-report.pages.dev`)
2. Employee ID: `CCD-1001`
3. Password: (whatever you set in Part B3)

### Add Other Users

**From the Admin Panel (easiest):**
- Login as Admin → click "Admin Panel" tab → click "+ Add User"
- Fill in Employee ID, Name, Role, Password → Create

**Or manually via Supabase:**
1. Supabase → Authentication → Users → Add User
2. Email: `ccd-1042@ccd.internal` (format: employee-id@ccd.internal)
3. Password: (set one)
4. Then SQL Editor:
```sql
INSERT INTO profiles (id, employee_id, full_name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'ccd-1042@ccd.internal'),
  'CCD-1042',
  'R. Kumar',
  'production'
);
```

### Suggested Initial Users

| Employee ID | Name | Role | Sections |
|-------------|------|------|----------|
| CCD-1001 | D. Sharma | admin | All |
| CCD-1042 | R. Kumar | production | Production, Consumption, Despatch, Stock, Running Hrs, Receipt |
| CCD-1087 | S. Patel | quality | Techno-Eco, Product Quality, Product Yield, Lab Analysis |
| CCD-1065 | M. Singh | environment | Environment BOD, ISO Objectives |
| CCD-1023 | A. Das | safety | OHSAS Objectives |
| CCD-2001 | P. Gupta | viewer | View only (all sections + dashboard) |

---

## PART F: Custom Domain (Optional)

If you want `report.yourcompany.com` instead of `ccd-monthly-report.pages.dev`:

1. Cloudflare → your Pages project → **"Custom domains"**
2. Click "Set up a custom domain"
3. Enter your domain → follow the DNS instructions

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails on Cloudflare | Make sure `NODE_VERSION` is set to `18` in environment variables |
| "Invalid credentials" on login | Check that the email format is `ccd-XXXX@ccd.internal` (lowercase) |
| User created but can't login | Make sure you checked "Auto Confirm" when creating the user in Supabase |
| Blank page after login | Check that both environment variables are set correctly (no extra spaces) |
| "permission denied" errors | Make sure schema.sql ran fully — check for the RLS policies |

---

## Monthly Workflow (Once Deployed)

```
Month starts
    ↓
Production Operator logs in → fills Production, Consumption, Despatch, Stock, Running Hours → Submits
Quality Lab logs in → fills Techno-Eco, Product Quality, Yield → Submits
Environment Officer → fills Environment BOD, ISO → Submits
Safety Officer → fills OHSAS → Submits
    ↓
Dashboard updates automatically
    ↓
Admin reviews all sections → Locks the month
Viewers can see everything at any time
    ↓
If correction needed → Admin overrides (logged in audit trail)
```

---

## Cost Summary

| Service | Free Tier | Your Usage | Status |
|---------|-----------|------------|--------|
| Supabase | 500MB DB, 50K users | ~8,000 rows, ~25 users | Well within |
| Cloudflare Pages | Unlimited bandwidth, 500 builds/mo | Minimal | Well within |
| GitHub | Unlimited repos | 1 repo | Well within |
| **Total monthly cost** | | | **₹0** |
