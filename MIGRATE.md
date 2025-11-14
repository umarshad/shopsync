# Database Migration Guide

## ✅ Environment Setup
- `.env` file created with your Supabase credentials
- Migration files ready in `supabase/migrations/`

## 🚀 Running Migrations

You have **3 options** to deploy the database schema:

### Option 1: Use Combined Migration File (Easiest) ⭐ RECOMMENDED

A combined migration file has been created for you:

1. **Open the file**: `ALL_MIGRATIONS.sql` in the root directory
2. **Copy all contents** (Cmd/Ctrl + A, then Cmd/Ctrl + C)
3. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj
4. **Click "SQL Editor"** in the left sidebar
5. **Click "+ New query"**
6. **Paste the entire file** (Cmd/Ctrl + V)
7. **Click "Run"** or press `Cmd/Ctrl + Enter`
8. **Wait for "Success" message**

Done! All tables, indexes, triggers, and RLS policies are now set up.

### Option 2: Run Individual Migration Files

If you prefer to run them one by one:

1. Go to: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/sql
2. For each file in `supabase/migrations/`:
   - Open the file (001_initial_schema.sql, 002_rls_policies.sql, 003_realtime_setup.sql)
   - Copy contents
   - Paste into SQL Editor
   - Click "Run"
   - Wait for success before moving to next file

### Option 3: Use Supabase CLI (If Installed)

If you have Supabase CLI installed:

```bash
# Link to your project
supabase link --project-ref fgyssizbuggjqsarwiuj

# Run migrations
supabase db push
```

## ✅ Verify Installation

After running migrations, verify everything is set up:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see these tables:
   - ✅ `profiles`
   - ✅ `products`
   - ✅ `sales`
   - ✅ `sale_items`
   - ✅ `sync_queue`

3. Check **Row Level Security**:
   - Go to **Authentication** > **Policies**
   - You should see policies for each table

## 🎯 What's Next?

After migrations are complete:

1. ✅ Database schema deployed
2. ⏭️ Create your first user (see QUICKSTART.md)
3. ⏭️ Start the app: `npm run dev`
4. ⏭️ Login and start using ShopSync!

## 🆘 Troubleshooting

**Error: "relation already exists"**
- Some tables may already exist. This is OK - migrations use `CREATE TABLE IF NOT EXISTS`
- You can safely ignore these warnings

**Error: "permission denied"**
- Make sure you're logged into Supabase Dashboard
- Verify you have admin access to the project

**Can't connect directly via script**
- Direct database connections may be disabled in Supabase settings
- Use Option 1 (SQL Editor) instead - it's the most reliable method

## 📝 Migration Files

- `001_initial_schema.sql` - Creates all tables, indexes, and functions
- `002_rls_policies.sql` - Sets up Row Level Security policies
- `003_realtime_setup.sql` - Enables Realtime and creates triggers

All migrations are idempotent (safe to run multiple times).

