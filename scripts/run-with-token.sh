#!/bin/bash

# Helper script to run migrations with access token
echo "========================================"
echo "ShopSync Migration with Access Token"
echo "========================================"
echo ""

# Check if token is provided
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ SUPABASE_ACCESS_TOKEN not set"
    echo ""
    echo "📝 To get access token:"
    echo "   1. Go to: https://supabase.com/dashboard/account/tokens"
    echo "   2. Click 'Generate New Token'"
    echo "   3. Name it: 'ShopSync CLI'"
    echo "   4. Copy the token"
    echo ""
    echo "📝 Then run:"
    echo "   export SUPABASE_ACCESS_TOKEN=your-token-here"
    echo "   ./scripts/run-with-token.sh"
    echo ""
    echo "Or use the token directly:"
    echo "   SUPABASE_ACCESS_TOKEN=your-token-here ./scripts/run-with-token.sh"
    echo ""
    exit 1
fi

echo "✅ Access token found"
echo ""

# Change to project directory
cd "$(dirname "$0")/.." || exit 1

echo "🔗 Linking to Supabase project..."
supabase link --project-ref fgyssizbuggjqsarwiuj --password 6287605b.B

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Failed to link project"
    echo "   Check if:"
    echo "   - Token is valid"
    echo "   - Project reference is correct: fgyssizbuggjqsarwiuj"
    echo "   - You have access to this project"
    echo ""
    exit 1
fi

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
    echo "   1. Verify tables in Supabase dashboard:"
    echo "      https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/editor"
    echo ""
    echo "   2. Create first user (see QUICKSTART.md)"
    echo ""
    echo "   3. Start development server:"
    echo "      npm run dev"
    echo ""
else
    echo ""
    echo "❌ Migration failed"
    echo "   Check errors above"
    echo ""
    exit 1
fi

