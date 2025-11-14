#!/bin/bash

# Quick script to run all fixes
echo "========================================"
echo "Running ShopSync Fixes"
echo "========================================"
echo ""

cd "$(dirname "$0")/.." || exit 1

# Method 1: Try using Supabase CLI
if command -v supabase &> /dev/null; then
    echo "📦 Using Supabase CLI..."
    
    # Link if not already linked
    if [ ! -f ".supabase/config.toml" ]; then
        echo "🔗 Linking to project..."
        if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
            echo "⚠️  SUPABASE_ACCESS_TOKEN not set. Please set it first:"
            echo "   export SUPABASE_ACCESS_TOKEN=your-token"
            echo ""
            echo "📝 Or run the SQL file manually in Supabase SQL Editor:"
            echo "   https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/sql"
            echo "   File: scripts/fix-all.sql"
            exit 1
        fi
        
        supabase link --project-ref fgyssizbuggjqsarwiuj --password 6287605b.B
    fi
    
    # Execute SQL file
    echo "🚀 Executing SQL fixes..."
    supabase db execute --file scripts/fix-all.sql
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ All fixes applied successfully!"
    else
        echo ""
        echo "⚠️  CLI execution failed. Please run the SQL manually:"
        echo "   1. Go to: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/sql"
        echo "   2. Copy contents of: scripts/fix-all.sql"
        echo "   3. Paste and run"
    fi
else
    echo "⚠️  Supabase CLI not found."
    echo ""
    echo "📝 Please run the SQL file manually:"
    echo "   1. Go to: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/sql"
    echo "   2. Open: scripts/fix-all.sql"
    echo "   3. Copy all contents"
    echo "   4. Paste into SQL Editor and click 'Run'"
    echo ""
    echo "Or install Supabase CLI:"
    echo "   brew install supabase/tap/supabase"
fi

echo ""
echo "✅ Done! Refresh your browser to see changes."

