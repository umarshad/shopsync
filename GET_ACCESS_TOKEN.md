# How to Get Supabase Access Token - Step by Step

## 🎯 Goal
Get an access token to use Supabase CLI for running migrations from terminal.

## 📋 Step-by-Step Instructions

### Step 1: Go to Access Tokens Page

1. **Open Supabase Dashboard**:
   - Go to: https://supabase.com/dashboard
   - Login if needed

2. **Navigate to Access Tokens**:
   - Click on your **profile/account icon** (top right corner)
   - Click on **"Account"** or **"Account Settings"**
   - Or go directly to: https://supabase.com/dashboard/account/tokens
   - Look for **"Access Tokens"** in the left sidebar

### Step 2: Generate New Token

1. **Click "Generate New Token"**:
   - You'll see a button or link to generate a new token
   - Click it

2. **Fill in Token Details**:
   - **Name**: Enter a descriptive name (e.g., "ShopSync CLI" or "Local Development")
   - **Expiration** (optional): 
     - Leave blank for no expiration
     - Or set a date for security
   - **Scopes/Permissions**: 
     - Make sure it has access to your project
     - Usually defaults to all necessary permissions

3. **Generate Token**:
   - Click **"Generate token"** or **"Create token"**
   - **IMPORTANT**: Copy the token immediately!
   - You won't be able to see it again after closing the dialog
   - It will look like: `sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 3: Save Token Securely

1. **Copy the token** to a safe place
2. **Add to .env file** (recommended):
   ```bash
   # Add to .env file
   SUPABASE_ACCESS_TOKEN=your-token-here
   ```
3. **Or export as environment variable**:
   ```bash
   export SUPABASE_ACCESS_TOKEN=your-token-here
   ```

### Step 4: Use Token with Supabase CLI

```bash
# Set token (if not in .env)
export SUPABASE_ACCESS_TOKEN=your-token-here

# Link project
cd shopsync
supabase link --project-ref fgyssizbuggjqsarwiuj

# Run migrations
supabase db push
```

## 🖼️ Visual Guide

### Where to Find Access Tokens

1. **Dashboard Home**:
   - Click your **profile icon** (top right)
   - Click **"Account"** or **"Account Settings"**

2. **Account Page**:
   - Look for **"Access Tokens"** in the left sidebar
   - Or look for **"API"** or **"Tokens"** section

3. **Alternative Path**:
   - Go directly to: https://supabase.com/dashboard/account/tokens
   - This should take you directly to the tokens page

### What the Token Page Looks Like

- **List of existing tokens** (if any)
- **"Generate New Token"** button
- **Token name** field
- **Expiration date** field (optional)
- **Generate/Create** button

## 🔍 Alternative: Find Token in Different Locations

If you can't find "Access Tokens" in Account settings, try:

1. **Project Settings**:
   - Go to your project: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj
   - Click **"Settings"** (gear icon)
   - Look for **"API"** or **"Access Tokens"**

2. **API Settings**:
   - Settings → API
   - Look for **"Service Role Key"** or **"Access Token"**

3. **Account → General**:
   - Account → General
   - Look for **"Personal Access Tokens"**

## 🆘 If You Still Can't Find It

### Option 1: Use Service Role Key

1. Go to: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/settings/api
2. Find **"Service Role Key"** (not anon key)
3. Copy it
4. Use it as access token (may have different permissions)

### Option 2: Check Supabase CLI Help

```bash
supabase login --help
```

This will show you if there's an alternative method.

### Option 3: Contact Support

If you still can't find it:
- Check Supabase documentation: https://supabase.com/docs/guides/cli
- Contact Supabase support
- Check if your account type supports access tokens

## ✅ Quick Test

Once you have the token:

```bash
# Test token
export SUPABASE_ACCESS_TOKEN=your-token-here
supabase projects list
```

If this works, your token is valid!

## 🔒 Security Notes

- ⚠️ **Never commit tokens to git**
- ⚠️ **Add `.env` to `.gitignore`** (already done)
- ⚠️ **Don't share tokens publicly**
- ⚠️ **Rotate tokens regularly**
- ⚠️ **Use different tokens for different environments**

## 📝 Next Steps After Getting Token

1. ✅ Get access token (follow steps above)
2. ✅ Set token: `export SUPABASE_ACCESS_TOKEN=your-token`
3. ✅ Link project: `supabase link --project-ref fgyssizbuggjqsarwiuj`
4. ✅ Run migrations: `supabase db push`
5. ✅ Verify tables created in dashboard

## 🚀 Quick Command Reference

```bash
# Set token
export SUPABASE_ACCESS_TOKEN=your-token-here

# Link project
supabase link --project-ref fgyssizbuggjqsarwiuj

# Run migrations
supabase db push

# Create new migration
supabase migration new add_feature

# Check status
supabase db status
```

