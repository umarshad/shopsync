# Enable Direct Connections in Supabase Dashboard

## Quick Steps to Enable Direct Connections

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj
2. Login if needed

### Step 2: Navigate to Database Settings
1. Click **"Settings"** (gear icon ⚙️) in the left sidebar
2. Click **"Database"** in the settings menu

### Step 3: Find Connection String Section
Look for one of these sections:
- **"Connection string"**
- **"Connection pooling"**
- **"Database URL"**
- **"Connection mode"**

### Step 4: Enable Direct Connection
1. **If you see "Connection pooling" toggle:**
   - Turn it **OFF** to allow direct connections
   - Or look for a dropdown/radio button to select "Direct connection"

2. **If you see "Connection string" dropdown:**
   - Select **"Direct connection"** (not "Connection pooling")
   - Copy the connection string

3. **If you see "Connection mode":**
   - Select **"Direct"** mode

### Step 5: Check Network Restrictions
1. Look for **"Network restrictions"** or **"Allowed IPs"**
2. **Option A**: Add your current IP address
   - Find your IP: https://whatismyipaddress.com
   - Add it to allowed IPs
3. **Option B**: Disable restrictions (development only)
   - Toggle off network restrictions
   - Or add `0.0.0.0/0` to allow all IPs (NOT recommended for production)

### Step 6: Get Connection String
1. Copy the **"Direct connection"** string
2. It should look like:
   ```
   postgresql://postgres:[PASSWORD]@db.fgyssizbuggjqsarwiuj.supabase.co:5432/postgres
   ```
3. Replace `[PASSWORD]` with your database password: `6287605b.B`

### Step 7: Verify Database Password
1. Go to **Settings > Database > Database password**
2. Verify or reset password if needed
3. Current password: `6287605b.B`

### Step 8: Test Connection
After enabling direct connections, test it:
```bash
cd shopsync
npm run migrate:test
```

If successful, you should see:
```
✅ SUCCESS! Connected via Direct Connection (Port 5432)
```

### Step 9: Run Migrations
Once connection works:
```bash
npm run migrate
```

## Alternative: Use Supabase CLI (After Login)

If you want to use Supabase CLI (recommended):

1. **Get Access Token**:
   - Run `supabase login` in your terminal (opens browser)
   - Or get token from: https://supabase.com/dashboard/account/tokens
   - Set it: `export SUPABASE_ACCESS_TOKEN=your-token`

2. **Link Project**:
   ```bash
   supabase link --project-ref fgyssizbuggjqsarwiuj
   ```

3. **Run Migrations**:
   ```bash
   supabase db push
   ```

## Troubleshooting

### "Connection refused" or "ENOTFOUND"
- Direct connections not enabled
- Check Supabase dashboard settings
- Verify connection string format

### "Password authentication failed"
- Verify password: `6287605b.B`
- Reset password in Supabase dashboard
- Check for special characters

### "Connection timeout"
- Check network/firewall
- Verify IP is whitelisted
- Check Supabase status

### "Network restrictions"
- Add your IP to allowed IPs
- Or disable restrictions (development only)
- Find your IP: https://whatismyipaddress.com

## Quick Links

- **Dashboard**: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj
- **SQL Editor**: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/sql
- **Settings**: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/settings/database
- **Access Tokens**: https://supabase.com/dashboard/account/tokens

