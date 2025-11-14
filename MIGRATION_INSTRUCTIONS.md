# 🚀 Run Migrations - Quick Instructions

## ✅ Current Status
- ✅ Supabase CLI installed
- ✅ Migration files ready
- ⚠️ Need access token (get from dashboard)

## 🎯 Quick Steps (5 minutes)

### Step 1: Get Access Token

**Option A: Use Helper Script**
```bash
cd shopsync
npm run migrate:token
```
This will open the Access Tokens page in your browser.

**Option B: Manual**
1. Go to: https://supabase.com/dashboard/account/tokens
2. Click **"Generate New Token"**
3. Name it: `ShopSync CLI`
4. Click **"Generate"**
5. **Copy the token immediately!**

### Step 2: Run Setup Script

```bash
cd shopsync
npm run migrate:setup
```

This script will:
- Ask for your access token
- Test the token
- Link to your project
- Run migrations automatically

### Step 3: Verify

1. Go to Supabase Dashboard:
   - https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/editor

2. Check tables:
   - You should see: `profiles`, `products`, `sales`, `sale_items`, `sync_queue`

## 📋 Alternative: Manual Steps

If you prefer to do it manually:

```bash
# 1. Set token
export SUPABASE_ACCESS_TOKEN=your-token-here

# 2. Link project
cd shopsync
supabase link --project-ref fgyssizbuggjqsarwiuj
# Password when prompted: 6287605b.B

# 3. Run migrations
supabase db push
```

## 🔍 Can't Find Access Tokens?

### Direct URL:
https://supabase.com/dashboard/account/tokens

### Navigation:
1. Click **profile icon** (top right)
2. Click **"Account"**
3. Click **"Access Tokens"** in left sidebar
4. Click **"Generate New Token"**

## 📚 Documentation

- **Quick Token Guide**: `QUICK_TOKEN_GUIDE.md`
- **Visual Guide**: `ACCESS_TOKEN_VISUAL_GUIDE.md`
- **Detailed Steps**: `GET_TOKEN_STEPS.md`

## 🆘 Troubleshooting

**"Token is invalid"**:
- Verify token is correct
- Check if token has expired
- Regenerate token if needed

**"Project not found"**:
- Verify project reference: `fgyssizbuggjqsarwiuj`
- Check if token has access to this project

**"Password authentication failed"**:
- Verify password: `6287605b.B`
- Reset password in Supabase dashboard if needed

## ✅ Summary

**Easiest way:**
1. Run: `npm run migrate:token` (opens token page)
2. Get token from dashboard
3. Run: `npm run migrate:setup` (does everything automatically)

**Done!** ✅
