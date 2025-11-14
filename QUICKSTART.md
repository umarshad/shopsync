# ShopSync Quick Start Guide

## Step 1: Environment Variables ✅

The `.env` file has been created with your Supabase credentials:
- URL: https://fgyssizbuggjqsarwiuj.supabase.co
- Anon Key: (configured)

## Step 2: Deploy Database Schema

You need to run the SQL migrations in your Supabase project. You have **two options**:

### Option A: Using Supabase Dashboard (Easiest)

1. Go to: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj
2. Click on **SQL Editor** in the left sidebar
3. Run each migration file **in order**:

   **First, run `001_initial_schema.sql`:**
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Paste into SQL Editor
   - Click **Run** (or press Cmd/Ctrl + Enter)

   **Then, run `002_rls_policies.sql`:**
   - Copy the contents of `supabase/migrations/002_rls_policies.sql`
   - Paste into SQL Editor
   - Click **Run**

   **Finally, run `003_realtime_setup.sql`:**
   - Copy the contents of `supabase/migrations/003_realtime_setup.sql`
   - Paste into SQL Editor
   - Click **Run**

### Option B: Using psql Command Line

If you have `psql` installed:

```bash
cd shopsync

# Run migrations in order
psql 'postgresql://postgres:6287605b.B@db.fgyssizbuggjqsarwiuj.supabase.co:5432/postgres' -f supabase/migrations/001_initial_schema.sql

psql 'postgresql://postgres:6287605b.B@db.fgyssizbuggjqsarwiuj.supabase.co:5432/postgres' -f supabase/migrations/002_rls_policies.sql

psql 'postgresql://postgres:6287605b.B@db.fgyssizbuggjqsarwiuj.supabase.co:5432/postgres' -f supabase/migrations/003_realtime_setup.sql
```

Or use the helper script:
```bash
./scripts/setup-database.sh
```

## Step 3: Verify Database Setup

After running migrations, verify the tables were created:

1. Go to Supabase Dashboard > **Table Editor**
2. You should see these tables:
   - `profiles`
   - `products`
   - `sales`
   - `sale_items`
   - `sync_queue`

## Step 4: Create First User

1. Go to Supabase Dashboard > **Authentication** > **Users**
2. Click **Add User** > **Create new user**
3. Enter email and password
4. Copy the user's UUID (you'll need this)
5. Go to **SQL Editor** and run:

```sql
-- Replace 'YOUR-USER-UUID' with the actual UUID from step 4
-- Replace 'YOUR-SHOP-NAME' with your shop name
-- Set PIN to whatever you want (e.g., '1234')

INSERT INTO profiles (id, shop_id, shop_name, role, pin)
VALUES (
  'YOUR-USER-UUID',
  gen_random_uuid(), -- This generates a unique shop_id
  'YOUR-SHOP-NAME',
  'owner',
  '1234'
);
```

## Step 5: Install Dependencies

```bash
cd shopsync
npm install
```

## Step 6: Start Development Server

```bash
npm run dev
```

## Step 7: Login and Use ShopSync

1. Open http://localhost:5173
2. Login with:
   - **Email**: The email you created in Step 4
   - **Password**: The password you set
   - Or use **PIN**: The PIN you set (e.g., '1234')

## What's Next?

1. ✅ Database schema deployed
2. ✅ Environment variables configured
3. ⏭️ Add products (Inventory > Add Product)
4. ⏭️ Connect thermal printer (Settings > Printer)
5. ⏭️ Configure white-label (Settings > White Label)
6. ⏭️ Start making sales!

## Troubleshooting

### "Table does not exist" error
- Make sure you ran all 3 migration files in order
- Check the Supabase Table Editor to see if tables exist

### "RLS policy violation" error
- Make sure you ran `002_rls_policies.sql`
- Verify your user profile exists in the `profiles` table

### Can't login
- Verify user exists in Supabase Auth > Users
- Verify profile exists in `profiles` table with correct user UUID
- Check browser console for errors

### Need Help?
Check the full documentation:
- `README.md` - Complete documentation
- `SETUP.md` - Detailed setup guide
- `DEPLOYMENT.md` - Deployment instructions

