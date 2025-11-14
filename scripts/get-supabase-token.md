# Get Supabase Access Token for CLI

## Quick Steps to Get Access Token

### Step 1: Get Access Token from Dashboard

1. **Go to Supabase Dashboard**:
   - Open: https://supabase.com/dashboard/account/tokens
   - Or: Dashboard → Account → Access Tokens

2. **Create New Token**:
   - Click **"Generate new token"**
   - Give it a name: "ShopSync CLI"
   - Set expiration (optional)
   - Click **"Generate token"**

3. **Copy Token**:
   - **IMPORTANT**: Copy the token immediately
   - You won't be able to see it again
   - Save it securely

### Step 2: Use Token with Supabase CLI

**Option A: Set Environment Variable** (Recommended)
```bash
export SUPABASE_ACCESS_TOKEN=your-token-here
supabase link --project-ref fgyssizbuggjqsarwiuj
supabase db push
```

**Option B: Use in Command**
```bash
SUPABASE_ACCESS_TOKEN=your-token-here supabase link --project-ref fgyssizbuggjqsarwiuj
SUPABASE_ACCESS_TOKEN=your-token-here supabase db push
```

**Option C: Add to .env file**
```bash
# Add to .env file
SUPABASE_ACCESS_TOKEN=your-token-here
```

### Step 3: Link Project and Run Migrations

```bash
# Link project
supabase link --project-ref fgyssizbuggjqsarwiuj

# Run migrations
supabase db push

# Create new migration
supabase migration new add_feature

# Edit migration file
# Then push it
supabase db push
```

## Security Notes

- ⚠️ **Never commit tokens to git**
- ⚠️ **Add `.env` to `.gitignore`** (already done)
- ⚠️ **Rotate tokens regularly**
- ⚠️ **Use different tokens for different environments**

## Troubleshooting

### "Invalid token"
- Verify token is correct
- Check if token has expired
- Regenerate token if needed

### "Unauthorized"
- Token doesn't have required permissions
- Check token permissions in dashboard
- Regenerate token with correct permissions

### "Project not found"
- Verify project reference is correct: `fgyssizbuggjqsarwiuj`
- Check if token has access to this project
- Verify you're logged in with correct account

