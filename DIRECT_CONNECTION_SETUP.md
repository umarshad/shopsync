# Enable Direct Database Connections in Supabase

## 🎯 Goal

Enable direct PostgreSQL connections so you can run migrations and database changes from your terminal.

## 📋 Step-by-Step Instructions

### Method 1: Enable Direct Connections in Supabase Dashboard

1. **Go to Supabase Dashboard**:
   - Open: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj
   - Login if needed

2. **Navigate to Database Settings**:
   - Click **"Settings"** (gear icon) in the left sidebar
   - Click **"Database"** in the settings menu

3. **Find Connection Settings**:
   - Look for **"Connection string"** section
   - Or **"Connection pooling"** section
   - Or **"Database URL"** section

4. **Enable Direct Connections**:
   - If you see **"Connection pooling"** toggle: **Turn it OFF**
   - Or select **"Direct connection"** mode
   - Some projects have this under **"Connection mode"**

5. **Get Connection String**:
   - Copy the **"Direct connection"** string
   - It should be: `postgresql://postgres:[PASSWORD]@db.fgyssizbuggjqsarwiuj.supabase.co:5432/postgres`
   - Replace `[PASSWORD]` with your database password

6. **Check Network Restrictions** (if applicable):
   - Look for **"Network restrictions"** or **"Allowed IPs"**
   - Add your current IP address
   - Or disable restrictions for development
   - Find your IP: https://whatismyipaddress.com

7. **Reset Database Password** (if needed):
   - Go to **Settings > Database > Database password**
   - Click **"Reset database password"**
   - Copy the new password
   - Update `.env` file if needed

### Method 2: Use Supabase CLI (Recommended for Development)

Supabase CLI handles connections automatically and is the best way to manage migrations.

#### Install Supabase CLI

**macOS (using Homebrew)**:
```bash
brew install supabase/tap/supabase
```

**macOS/Linux (using npm)**:
```bash
npm install -g supabase
```

**Or use the setup script**:
```bash
cd shopsync
./scripts/setup-supabase-cli.sh
```

#### Setup Supabase CLI

```bash
# Login to Supabase (opens browser)
supabase login

# Link to your project
cd shopsync
supabase link --project-ref fgyssizbuggjqsarwiuj

# You'll be prompted for database password
# Enter: 6287605b.B
```

#### Use Supabase CLI for Migrations

```bash
# Run all migrations
supabase db push

# Create new migration
supabase migration new add_new_feature

# Edit the file in supabase/migrations/
# Then push it
supabase db push

# Reset database (development only)
supabase db reset
```

### Method 3: Use Connection Pool URL

If direct connections are not available, you can use the connection pool URL (limited features):

```
postgresql://postgres.fgyssizbuggjqsarwiuj:6287605b.B@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Limitations**:
- Some PostgreSQL features may not work
- Better for application connections, not migrations
- Use direct connections for schema changes

## 🧪 Test Connection

After enabling direct connections, test it:

```bash
cd shopsync
npm run migrate:test
```

This will test all connection methods and tell you which one works.

## 🔧 Update Migration Script

Once you have a working connection, update `scripts/run-migrations.js` with the correct connection string.

Or the script will automatically try different connection methods.

## 📝 Create New Migrations

Once connections are working:

```bash
# Create a new migration file
npm run migrate:new add_customer_table

# Edit the file in supabase/migrations/
# Add your SQL

# Run the migration
npm run migrate
```

## 🚀 Recommended Workflow

For ongoing development, use **Supabase CLI**:

1. **Install Supabase CLI** (once)
2. **Link to project** (once)
3. **Create migrations**: `supabase migration new <name>`
4. **Edit migration file** in `supabase/migrations/`
5. **Push migrations**: `supabase db push`
6. **Test locally**: `supabase start` (optional)

## 🆘 Troubleshooting

### "Connection refused" or "ENOTFOUND"
- Direct connections not enabled
- Check Supabase dashboard settings
- Verify connection string format
- Check if IP is whitelisted

### "Password authentication failed"
- Verify password is correct
- Reset database password in Supabase dashboard
- Check for special characters in password

### "SSL connection required"
- Script already handles SSL
- Check Supabase SSL settings
- Verify connection string includes SSL parameters

### "Connection timeout"
- Check network/firewall
- Verify host and port
- Try connection pool URL instead
- Check Supabase status page

### "Tenant or user not found" (Connection Pool)
- Connection pool URL format might be wrong
- Check your project region
- Try direct connection instead

## 📚 Additional Resources

- **Supabase CLI Docs**: https://supabase.com/docs/guides/cli
- **Database Connections**: https://supabase.com/docs/guides/database/connecting-to-postgres
- **Connection Pooling**: https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler
- **Migrations Guide**: https://supabase.com/docs/guides/cli/local-development#database-migrations

## ✅ Next Steps

1. ✅ Enable direct connections in Supabase dashboard
2. ✅ Test connection: `npm run migrate:test`
3. ✅ Run migrations: `npm run migrate`
4. ✅ Install Supabase CLI: `./scripts/setup-supabase-cli.sh`
5. ✅ Create new migrations as needed

## 💡 Pro Tips

- **Use Supabase CLI** for best experience
- **Test migrations locally** before pushing to production
- **Use version control** for migration files
- **Backup database** before major migrations
- **Review migrations** in SQL Editor before running

