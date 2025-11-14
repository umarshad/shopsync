# Get Supabase Access Token - Exact Steps

## 🎯 Step-by-Step Guide

### Step 1: Open Supabase Dashboard

1. **Go to Supabase Dashboard**:
   - Open: https://supabase.com/dashboard
   - Login with your account

### Step 2: Navigate to Access Tokens

**Method 1: Via Profile Icon (Easiest)**
1. Click on your **profile icon** (top right corner of the page)
2. Click on **"Account"** or **"Account Settings"**
3. In the left sidebar, look for **"Access Tokens"**
4. Click on it

**Method 2: Direct URL**
1. Go directly to: https://supabase.com/dashboard/account/tokens
2. This should take you straight to the Access Tokens page

**Method 3: Via Account Menu**
1. Click on your **profile icon** (top right)
2. Look for **"Account"** or **"Settings"** in the dropdown
3. Click on it
4. Look for **"Access Tokens"** or **"API Tokens"** in the sidebar

### Step 3: Generate New Token

1. **Click "Generate New Token"** button
   - You'll see a button or link to create a new token
   - Click it

2. **Fill in Token Details**:
   - **Name**: Enter a descriptive name (e.g., "ShopSync CLI" or "Local Development")
   - **Expiration** (optional): Leave blank for no expiration, or set a date
   - **Permissions**: Usually defaults to necessary permissions

3. **Generate and Copy Token**:
   - Click **"Generate token"** or **"Create"**
   - **⚠️ IMPORTANT**: Copy the token immediately!
   - It will look like: `sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - You won't be able to see it again after closing

### Step 4: Use Token with Supabase CLI

**Option A: Export as Environment Variable**
```bash
export SUPABASE_ACCESS_TOKEN=your-token-here
supabase link --project-ref fgyssizbuggjqsarwiuj
supabase db push
```

**Option B: Use --token Flag**
```bash
supabase login --token your-token-here
supabase link --project-ref fgyssizbuggjqsarwiuj
supabase db push
```

**Option C: Add to .env File**
```bash
# Add to .env file
SUPABASE_ACCESS_TOKEN=your-token-here
```

Then run:
```bash
export $(cat .env | grep SUPABASE_ACCESS_TOKEN)
supabase link --project-ref fgyssizbuggjqsarwiuj
supabase db push
```

## 🔍 Visual Guide

### Where to Click:

1. **Top Right Corner**:
   ```
   [Your Profile Icon] ← Click here
   ```

2. **Dropdown Menu**:
   ```
   Account
   Settings
   Logout
   ```
   Click **"Account"**

3. **Left Sidebar** (Account Page):
   ```
   General
   Billing
   Access Tokens  ← Click here
   Team
   ```

4. **Access Tokens Page**:
   ```
   [Generate New Token] ← Click here
   ```

5. **Token Form**:
   ```
   Name: [ShopSync CLI]
   Expiration: [Optional]
   [Generate Token] ← Click here
   ```

6. **Copy Token**:
   ```
   Your token: sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   [Copy] ← Click here immediately!
   ```

## 🆘 If You Can't Find Access Tokens

### Alternative: Check Account Settings

1. **Go to Account Settings**:
   - https://supabase.com/dashboard/account
   - Look for **"API"**, **"Tokens"**, or **"Access Tokens"** in the sidebar

2. **Check Project Settings**:
   - Go to your project: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj
   - Click **"Settings"** (gear icon)
   - Look for **"API"** or **"Access Tokens"**

3. **Check Profile Settings**:
   - Click profile icon → **"Profile"**
   - Look for **"API Tokens"** or **"Access Tokens"**

### Still Can't Find It?

1. **Check Supabase Version**:
   - Some older accounts might have different UI
   - Check if you're using the latest Supabase dashboard

2. **Contact Support**:
   - Go to: https://supabase.com/support
   - Ask where to find Access Tokens

3. **Check Documentation**:
   - https://supabase.com/docs/guides/cli
   - Look for "Access Tokens" section

## ✅ Quick Test

After getting the token:

```bash
# Test token
export SUPABASE_ACCESS_TOKEN=your-token-here
supabase projects list
```

If this works, you'll see your projects listed!

## 🚀 Next Steps

1. ✅ Get access token (follow steps above)
2. ✅ Set token: `export SUPABASE_ACCESS_TOKEN=your-token`
3. ✅ Link project: `supabase link --project-ref fgyssizbuggjqsarwiuj`
4. ✅ Run migrations: `supabase db push`
5. ✅ Verify tables in dashboard

## 📝 Example Workflow

```bash
# 1. Get token from dashboard (follow steps above)
# 2. Set token
export SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 3. Link project
cd shopsync
supabase link --project-ref fgyssizbuggjqsarwiuj
# Enter database password when prompted: 6287605b.B

# 4. Run migrations
supabase db push

# 5. Verify
# Go to Supabase dashboard → Table Editor
# You should see: profiles, products, sales, sale_items, sync_queue
```

## 🔒 Security Reminder

- ⚠️ **Never commit tokens to git**
- ⚠️ **Don't share tokens publicly**
- ⚠️ **Rotate tokens regularly**
- ⚠️ **Use different tokens for different environments**

