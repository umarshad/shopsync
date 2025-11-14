# Enable Direct Database Connection in Supabase

## Step 1: Enable Direct Connections in Supabase Dashboard

1. **Go to Supabase Dashboard**:
   - https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj

2. **Navigate to Settings**:
   - Click on **"Settings"** (gear icon) in the left sidebar
   - Click on **"Database"** in the settings menu

3. **Enable Direct Connections**:
   - Scroll down to **"Connection Pooling"** section
   - Look for **"Direct connections"** or **"Connection mode"**
   - Enable **"Direct connections"** or select **"Direct"** mode
   - Some Supabase projects have this under **"Connection string"** section
   - Look for **"Connection pooling"** toggle - you may need to disable it for direct connections

4. **Get Connection String**:
   - In the **"Connection string"** section
   - Select **"Direct connection"** (not "Connection pooling")
   - Copy the connection string
   - It should look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

5. **Alternative: Check Connection Info**:
   - Go to **Settings** > **Database** > **Connection string**
   - You'll see:
     - **Host**: `db.fgyssizbuggjqsarwiuj.supabase.co`
     - **Port**: `5432`
     - **Database**: `postgres`
     - **User**: `postgres`
     - **Password**: (your database password)

## Step 2: Allow Your IP Address (If Required)

Some Supabase projects require IP whitelisting:

1. Go to **Settings** > **Database** > **Connection Pooling**
2. Look for **"Allowed IP addresses"** or **"Network restrictions"**
3. Add your current IP address
4. Or disable IP restrictions (for development only)

## Step 3: Update Connection String

Once direct connections are enabled, you'll use:

```
postgresql://postgres:6287605b.B@db.fgyssizbuggjqsarwiuj.supabase.co:5432/postgres
```

## Step 4: Test Connection

Run the migration script:

```bash
cd shopsync
npm run migrate
```

If it works, you're all set!

## Alternative: Use Supabase CLI (Recommended for Production)

Supabase CLI is the best way to manage migrations:

### Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Or using npm
npm install -g supabase
```

### Initialize Supabase

```bash
cd shopsync
supabase login
supabase link --project-ref fgyssizbuggjqsarwiuj
```

### Run Migrations

```bash
# Run all migrations
supabase db push

# Or run specific migration
supabase migration up
```

### Create New Migration

```bash
# Create a new migration file
supabase migration new add_new_feature

# Edit the file in supabase/migrations/
# Then push it
supabase db push
```

## Troubleshooting

### "Connection refused" or "ENOTFOUND"
- Direct connections might not be enabled
- Check Supabase dashboard settings
- Verify the connection string is correct
- Check if your IP is whitelisted

### "Password authentication failed"
- Verify the password is correct
- Check if you're using the right user (usually `postgres`)
- Password might have special characters that need escaping

### "SSL connection required"
- Make sure SSL is enabled in the connection
- The script already handles this with `rejectUnauthorized: false`

### "Connection timeout"
- Check your network/firewall
- Verify the host and port are correct
- Try using connection pool URL instead

## Connection Pooling vs Direct Connection

- **Connection Pooling** (port 6543): Better for production, handles many connections
- **Direct Connection** (port 5432): Better for migrations, full PostgreSQL features

For migrations and schema changes, use **Direct Connection**.
For application connections, use **Connection Pooling**.

## Next Steps

Once direct connections are enabled:

1. ✅ Test connection: `npm run migrate`
2. ✅ Create new migrations as needed
3. ✅ Use Supabase CLI for better workflow
4. ✅ Set up CI/CD for automated migrations

