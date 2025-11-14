#!/bin/bash

# Script to help get access token and run migrations
echo "========================================"
echo "Supabase Access Token Setup"
echo "========================================"
echo ""
echo "📋 Step 1: Get Access Token"
echo ""
echo "   1. Open: https://supabase.com/dashboard/account/tokens"
echo "      (Or: Dashboard → Profile Icon → Account → Access Tokens)"
echo ""
echo "   2. Click 'Generate New Token'"
echo ""
echo "   3. Fill in:"
echo "      - Name: ShopSync CLI"
echo "      - Expiration: (optional, leave blank for no expiration)"
echo ""
echo "   4. Click 'Generate token'"
echo ""
echo "   5. COPY THE TOKEN IMMEDIATELY (you won't see it again!)"
echo ""
echo "📋 Step 2: Set Token and Run Migrations"
echo ""
echo "   After you get the token, run these commands:"
echo ""
echo "   export SUPABASE_ACCESS_TOKEN=your-token-here"
echo "   cd shopsync"
echo "   supabase link --project-ref fgyssizbuggjqsarwiuj"
echo "   supabase db push"
echo ""
echo "========================================"
echo ""
echo "🔍 Can't find Access Tokens page?"
echo ""
echo "   Try these URLs:"
echo "   - https://supabase.com/dashboard/account/tokens"
echo "   - https://supabase.com/dashboard/account"
echo "   - https://supabase.com/dashboard/profile"
echo ""
echo "   Or:"
echo "   1. Click your profile icon (top right)"
echo "   2. Click 'Account' or 'Account Settings'"
echo "   3. Look for 'Access Tokens' in left sidebar"
echo ""
echo "========================================"
echo ""
read -p "Do you have the token? (y/n): " has_token

if [ "$has_token" = "y" ] || [ "$has_token" = "Y" ]; then
    echo ""
    echo "📝 Enter your access token:"
    read -s SUPABASE_ACCESS_TOKEN
    echo ""
    echo "🔗 Setting token and linking project..."
    export SUPABASE_ACCESS_TOKEN
    supabase link --project-ref fgyssizbuggjqsarwiuj --password 6287605b.B
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Project linked successfully!"
        echo ""
        echo "🚀 Running migrations..."
        supabase db push
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "🎉 Migrations completed successfully!"
            echo ""
            echo "✅ Next steps:"
            echo "   1. Verify tables in Supabase dashboard"
            echo "   2. Create first user (see QUICKSTART.md)"
            echo "   3. Run: npm run dev"
        else
            echo ""
            echo "❌ Migration failed. Check errors above."
        fi
    else
        echo ""
        echo "❌ Failed to link project. Check token and try again."
    fi
else
    echo ""
    echo "📝 Get your token first, then run this script again."
    echo "   Or follow the steps in GET_ACCESS_TOKEN.md"
fi

echo ""

