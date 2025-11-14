# Quick Guide: Get Supabase Access Token

## 🎯 Fastest Way to Get Token

### Step 1: Open Access Tokens Page
**Direct Link**: https://supabase.com/dashboard/account/tokens

Or navigate:
1. Click **profile icon** (top right) → **"Account"** → **"Access Tokens"**

### Step 2: Generate Token
1. Click **"Generate New Token"**
2. Name: `ShopSync CLI`
3. Expiration: (leave blank)
4. Click **"Generate"**
5. **Copy token immediately!** (looks like: `sbp_xxxxx...`)

### Step 3: Use Token
```bash
# Set token
export SUPABASE_ACCESS_TOKEN=your-token-here

# Run migrations
cd shopsync
./scripts/run-with-token.sh
```

## 📋 Alternative: Use Token Directly

```bash
# One command
SUPABASE_ACCESS_TOKEN=your-token-here cd shopsync && supabase link --project-ref fgyssizbuggjqsarwiuj --password 6287605b.B && supabase db push
```

## 🔍 Can't Find Access Tokens?

### Try These URLs:
1. https://supabase.com/dashboard/account/tokens
2. https://supabase.com/dashboard/account
3. https://supabase.com/dashboard/profile

### Or:
1. Click **profile icon** (top right)
2. Look for **"Account"** or **"Settings"**
3. Look for **"Access Tokens"** in sidebar

## ✅ After Getting Token

1. **Set token**:
   ```bash
   export SUPABASE_ACCESS_TOKEN=your-token-here
   ```

2. **Link project**:
   ```bash
   cd shopsync
   supabase link --project-ref fgyssizbuggjqsarwiuj
   # Password: 6287605b.B
   ```

3. **Run migrations**:
   ```bash
   supabase db push
   ```

4. **Verify**:
   - Go to: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/editor
   - You should see tables: profiles, products, sales, sale_items, sync_queue

## 🆘 Still Having Issues?

1. **Check token format**: Should start with `sbp_`
2. **Verify token is valid**: `supabase projects list`
3. **Check project reference**: `fgyssizbuggjqsarwiuj`
4. **Try different browser**: Sometimes UI differs
5. **Check Supabase status**: https://status.supabase.com

## 📝 Quick Reference

```bash
# Get token from: https://supabase.com/dashboard/account/tokens
# Then:
export SUPABASE_ACCESS_TOKEN=your-token
cd shopsync
supabase link --project-ref fgyssizbuggjqsarwiuj
supabase db push
```

Done! ✅

