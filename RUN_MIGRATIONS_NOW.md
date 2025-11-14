# Run Migrations Now - Quick Guide

## ✅ Current Status

- ✅ Supabase CLI installed (v2.58.5)
- ✅ Migration files ready
- ✅ Combined migration file created: `ALL_MIGRATIONS.sql`
- ⚠️ Direct connections not enabled (requires dashboard access)

## 🚀 Option 1: Run Migrations via SQL Editor (Easiest - 2 minutes)

This method works **right now** without enabling direct connections:

1. **Open SQL Editor**:
   - Go to: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/sql
   - Click **"+ New query"**

2. **Copy Migration File**:
   - Open: `ALL_MIGRATIONS.sql` (in shopsync folder)
   - Select all (Cmd+A)
   - Copy (Cmd+C)

3. **Paste and Run**:
   - Paste into SQL Editor (Cmd+V)
   - Click **"Run"** or press `Cmd+Enter`
   - Wait for **"Success. No rows returned"** message

4. **Verify**:
   - Go to **"Table Editor"** in left sidebar
   - You should see: `profiles`, `products`, `sales`, `sale_items`, `sync_queue`

✅ **Done! Database is ready!**

## 🔧 Option 2: Enable Direct Connections (For Terminal Access)

To enable terminal access for future migrations:

### Step 1: Enable Direct Connections in Dashboard

1. **Go to Supabase Dashboard**:
   - https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/settings/database

2. **Find Connection Settings**:
   - Look for **"Connection string"** or **"Connection pooling"** section
   - Select **"Direct connection"** (not "Connection pooling")
   - Or disable **"Connection pooling"** toggle

3. **Check Network Restrictions**:
   - Look for **"Network restrictions"** or **"Allowed IPs"**
   - Add your current IP address
   - Or disable restrictions (development only)
   - Find your IP: https://whatismyipaddress.com

4. **Copy Connection String**:
   - Copy the **"Direct connection"** string
   - Should be: `postgresql://postgres:[PASSWORD]@db.fgyssizbuggjqsarwiuj.supabase.co:5432/postgres`

### Step 2: Test Connection

```bash
cd shopsync
npm run migrate:test
```

You should see:
```
✅ SUCCESS! Connected via Direct Connection (Port 5432)
```

### Step 3: Run Migrations

```bash
npm run migrate
```

✅ **Done! Migrations run from terminal!**

## 🔑 Option 3: Use Supabase CLI (Recommended for Development)

To use Supabase CLI for migrations:

### Step 1: Get Access Token

1. **Get Access Token**:
   - Go to: https://supabase.com/dashboard/account/tokens
   - Click **"Generate new token"**
   - Name it: "ShopSync CLI"
   - Click **"Generate token"**
   - **Copy token immediately** (you won't see it again)

2. **Set Token**:
   ```bash
   export SUPABASE_ACCESS_TOKEN=your-token-here
   ```

### Step 2: Link Project

```bash
cd shopsync
supabase link --project-ref fgyssizbuggjqsarwiuj
# Enter database password when prompted: 6287605b.B
```

### Step 3: Run Migrations

```bash
supabase db push
```

✅ **Done! Migrations run via CLI!**

## 📝 What Each Option Does

### Option 1: SQL Editor
- ✅ Works immediately
- ✅ No setup required
- ✅ Visual feedback
- ❌ Manual copy-paste
- ❌ Need to repeat for each migration

### Option 2: Direct Connections
- ✅ Terminal access
- ✅ Automated migrations
- ✅ Script-based
- ⚠️ Requires dashboard setup
- ⚠️ Need to enable in dashboard

### Option 3: Supabase CLI
- ✅ Best for development
- ✅ Automated migrations
- ✅ Version control
- ✅ Easy rollback
- ⚠️ Requires access token
- ⚠️ One-time setup

## 🎯 Recommended Workflow

**For Now (First Time)**:
1. Use **Option 1** (SQL Editor) to run initial migrations
2. Takes 2 minutes, works immediately

**For Future (Development)**:
1. Get access token (Option 3)
2. Use Supabase CLI for all migrations
3. Best practice for development

**For Production**:
1. Enable direct connections (Option 2)
2. Use CI/CD for automated migrations
3. Test migrations before deploying

## 📊 Next Steps After Migrations

1. ✅ Run migrations (choose one option above)
2. ✅ Verify tables exist in Supabase dashboard
3. ✅ Create first user (see QUICKSTART.md)
4. ✅ Start development server: `npm run dev`
5. ✅ Login and start using ShopSync!

## 🆘 Troubleshooting

**"Connection refused"**:
- Direct connections not enabled
- Use Option 1 (SQL Editor) instead

**"Access token invalid"**:
- Regenerate token in dashboard
- Copy token correctly
- Check token expiration

**"Project not found"**:
- Verify project reference: `fgyssizbuggjqsarwiuj`
- Check if token has access
- Verify you're logged in with correct account

## ✅ Summary

**To run migrations RIGHT NOW**:
1. Open: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/sql
2. Copy contents of `ALL_MIGRATIONS.sql`
3. Paste and run in SQL Editor
4. Done! ✅

**To enable terminal access**:
1. Enable direct connections in dashboard (Option 2)
2. Or get access token for CLI (Option 3)
3. Then run: `npm run migrate` or `supabase db push`

## 📚 Documentation

- **Full Guide**: `DIRECT_CONNECTION_SETUP.md`
- **Migration Guide**: `MIGRATE.md`
- **Quick Start**: `QUICKSTART.md`
- **Get Token**: `scripts/get-supabase-token.md`

