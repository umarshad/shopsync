# 🚀 START HERE: Run Migrations

## ✅ What's Ready
- ✅ Supabase CLI installed (v2.58.5)
- ✅ Migration files ready
- ✅ Helper scripts created
- ⚠️ Need access token from dashboard

## 🎯 Quick Steps (5 minutes)

### Step 1: Get Access Token

**Option A: Use Helper Script**
```bash
cd shopsync
npm run migrate:token
```
This opens the Access Tokens page in your browser.

**Option B: Manual**
1. Open: **https://supabase.com/dashboard/account/tokens**
2. Click **"Generate New Token"**
3. Name: `ShopSync CLI`
4. Click **"Generate"**
5. **Copy token immediately!** (starts with `sbp_`)

### Step 2: Run Setup Script

```bash
cd shopsync
npm run migrate:setup
```

The script will:
1. Ask for your access token
2. Test the token
3. Link to your project
4. Run migrations automatically

**Done!** ✅ Your database is ready!

## 📋 Alternative: Manual Commands

If you prefer manual control:

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

## 🔍 Where to Find Access Token

### Direct URL:
**https://supabase.com/dashboard/account/tokens**

### Navigation:
1. Click **profile icon** (top right corner)
2. Click **"Account"**
3. Click **"Access Tokens"** in left sidebar
4. Click **"Generate New Token"**

### Visual Guide:
See `ACCESS_TOKEN_VISUAL_GUIDE.md` for detailed screenshots and navigation.

## ✅ Verify Migrations

After running migrations:

1. Go to Supabase Dashboard:
   - https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/editor

2. Check tables:
   - You should see: `profiles`, `products`, `sales`, `sale_items`, `sync_queue`

3. Check RLS:
   - Go to: Settings → Database → Row Level Security
   - Policies should be enabled

## 📝 Next Steps

After migrations are complete:

1. ✅ Database schema deployed
2. ⏭️ Create first user (see QUICKSTART.md)
3. ⏭️ Start development server: `npm run dev`
4. ⏭️ Login and start using ShopSync!

## 🆘 Troubleshooting

**"Token is invalid"**:
- Verify token is correct (starts with `sbp_`)
- Check if token has expired
- Regenerate token if needed

**"Project not found"**:
- Verify project reference: `fgyssizbuggjqsarwiuj`
- Check if token has access to this project

**"Password authentication failed"**:
- Verify password: `6287605b.B`
- Reset password in Supabase dashboard if needed

**"Can't find Access Tokens page"**:
- Try direct URL: https://supabase.com/dashboard/account/tokens
- Check if you're logged in with correct account
- Try different browser
- See `ACCESS_TOKEN_VISUAL_GUIDE.md` for detailed navigation

## 📚 Available Commands

```bash
# Open Access Tokens page
npm run migrate:token

# Setup token and run migrations (interactive)
npm run migrate:setup

# Run migrations (if token is already set)
npm run migrate:run

# Test database connection
npm run migrate:test

# Create new migration
npm run migrate:new add_feature_name

# Combine migrations
npm run migrate:combine
```

## 🎯 Recommended Workflow

**First Time**:
1. Run: `npm run migrate:token` (opens token page)
2. Get token from dashboard
3. Run: `npm run migrate:setup` (does everything)

**Future Migrations**:
1. Create migration: `npm run migrate:new add_feature`
2. Edit migration file
3. Run: `supabase db push`

## ✅ Summary

**Easiest way (3 steps)**:
1. Get token: https://supabase.com/dashboard/account/tokens
2. Run: `npm run migrate:setup`
3. Done! ✅

**All documentation**:
- `QUICK_TOKEN_GUIDE.md` - Quick reference
- `ACCESS_TOKEN_VISUAL_GUIDE.md` - Visual guide with navigation
- `GET_TOKEN_STEPS.md` - Detailed step-by-step
- `MIGRATION_INSTRUCTIONS.md` - Complete instructions

## 🚀 Let's Go!

1. **Get your access token**: https://supabase.com/dashboard/account/tokens
2. **Run setup**: `npm run migrate:setup`
3. **Verify**: Check Supabase dashboard for tables

**You're all set!** 🎉

