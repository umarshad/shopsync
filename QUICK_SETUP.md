# Quick Setup: Enable Direct Database Connections

## 🎯 Goal
Enable terminal access to your Supabase database for running migrations.

## ⚡ Quick Steps (5 minutes)

### Option 1: Use Supabase CLI (Easiest) ⭐ RECOMMENDED

```bash
# 1. Install Supabase CLI
brew install supabase/tap/supabase

# 2. Login to Supabase
supabase login

# 3. Link to your project
cd shopsync
supabase link --project-ref fgyssizbuggjqsarwiuj
# Password: 6287605b.B

# 4. Run migrations
supabase db push

# Done! ✅
```

### Option 2: Enable Direct Connections in Dashboard

1. **Go to Supabase Dashboard**:
   - https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj

2. **Settings > Database**:
   - Click "Settings" (⚙️ gear icon) → "Database"

3. **Find Connection Settings**:
   - Look for "Connection string" or "Connection pooling"
   - Find "Direct connection" option

4. **Enable Direct Connection**:
   - If you see "Connection pooling" toggle → Turn it OFF
   - Or select "Direct connection" mode
   - Copy the connection string

5. **Check Network Restrictions** (if any):
   - Look for "Allowed IPs" or "Network restrictions"
   - Add your current IP address
   - Or disable restrictions for development

6. **Test Connection**:
   ```bash
   cd shopsync
   npm run migrate:test
   ```

7. **Run Migrations**:
   ```bash
   npm run migrate
   ```

## 📝 Where to Find Settings in Supabase Dashboard

### Step-by-Step Navigation:

1. **Login to Supabase**: https://supabase.com/dashboard
2. **Select your project**: fgyssizbuggjqsarwiuj
3. **Click "Settings"** (gear icon) in left sidebar
4. **Click "Database"** in settings menu
5. **Look for these sections**:
   - **Connection string**: Shows database URL
   - **Connection pooling**: Toggle to enable/disable
   - **Database password**: Reset password if needed
   - **Network restrictions**: Add IP addresses
   - **SSL mode**: Should be enabled

### What to Look For:

**Connection String Section**:
- Should show: `postgresql://postgres:[PASSWORD]@db.fgyssizbuggjqsarwiuj.supabase.co:5432/postgres`
- Select "Direct connection" (not "Connection pooling")
- Copy the connection string

**Connection Pooling**:
- If enabled → Turn OFF for migrations
- Connection pool is for applications, not migrations
- Port 6543 = Pooling, Port 5432 = Direct

**Network Restrictions**:
- Some projects require IP whitelisting
- Find your IP: https://whatismyipaddress.com
- Add it to allowed IPs
- Or disable restrictions (development only)

## 🔧 After Enabling Direct Connections

1. **Test connection**:
   ```bash
   npm run migrate:test
   ```

2. **Run migrations**:
   ```bash
   npm run migrate
   ```

3. **Create new migrations**:
   ```bash
   npm run migrate:new add_new_feature
   ```

## 🚀 Recommended: Use Supabase CLI

Supabase CLI is the best way to manage migrations:

```bash
# Install
brew install supabase/tap/supabase

# Setup (one time)
supabase login
supabase link --project-ref fgyssizbuggjqsarwiuj

# Use for migrations
supabase migration new add_feature
supabase db push
```

## 🆘 Troubleshooting

**"Connection refused"**:
- Direct connections not enabled
- Check Supabase dashboard settings
- Verify connection string format

**"Password authentication failed"**:
- Verify password: 6287605b.B
- Reset password in Supabase dashboard
- Update connection string

**"Connection timeout"**:
- Check network/firewall
- Verify IP is whitelisted
- Check Supabase status

**"ENOTFOUND"**:
- Hostname not resolving
- Check connection string format
- Verify project reference is correct

## ✅ Checklist

- [ ] Supabase CLI installed (recommended)
- [ ] Direct connections enabled in dashboard
- [ ] Network restrictions configured (if needed)
- [ ] Connection tested: `npm run migrate:test`
- [ ] Migrations run: `npm run migrate`

## 📚 Full Documentation

- **Direct Connection Setup**: `DIRECT_CONNECTION_SETUP.md`
- **Migration Guide**: `MIGRATE.md`
- **Quick Start**: `QUICKSTART.md`

## 💡 Pro Tip

**Use Supabase CLI** - It handles connections automatically and is the recommended way for development.

```bash
# One-time setup
brew install supabase/tap/supabase
supabase login
supabase link --project-ref fgyssizbuggjqsarwiuj

# Then just run
supabase db push
```

No need to enable direct connections manually! 🎉

