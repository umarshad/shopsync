#!/bin/bash

# Execute SQL fix using Supabase CLI with access token
echo "========================================"
echo "Executing SQL Fix via Command Line"
echo "========================================"
echo ""

# Check if token is provided
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ SUPABASE_ACCESS_TOKEN not set"
    echo ""
    echo "📝 To get access token:"
    echo "   1. Go to: https://supabase.com/dashboard/account/tokens"
    echo "   2. Click 'Generate New Token'"
    echo "   3. Copy the token"
    echo ""
    echo "📝 Then run:"
    echo "   export SUPABASE_ACCESS_TOKEN=your-token-here"
    echo "   ./scripts/execute-sql-fix.sh"
    echo ""
    echo "Or use the token directly:"
    echo "   SUPABASE_ACCESS_TOKEN=your-token-here ./scripts/execute-sql-fix.sh"
    echo ""
    exit 1
fi

echo "✅ Access token found"
echo ""

# Change to project directory
cd "$(dirname "$0")/.." || exit 1

# Link to project
echo "🔗 Linking to Supabase project..."
supabase link --project-ref fgyssizbuggjqsarwiuj --password 6287605b.B

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Failed to link project"
    echo "   Check if:"
    echo "   - Token is valid"
    echo "   - Project reference is correct: fgyssizbuggjqsarwiuj"
    echo ""
    exit 1
fi

echo ""
echo "✅ Project linked successfully!"
echo ""

# Execute SQL file
echo "🚀 Executing SQL fixes..."
supabase db execute --file scripts/fix-all.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All fixes applied successfully!"
    echo ""
    echo "🔄 Refresh your browser to see changes"
else
    echo ""
    echo "❌ SQL execution failed"
    echo "   Check errors above"
    exit 1
fi

