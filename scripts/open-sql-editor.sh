#!/bin/bash
# Open Supabase SQL Editor with fix SQL ready

echo "========================================"
echo "Opening Supabase SQL Editor"
echo "========================================"
echo ""
echo "📋 SQL Fix is ready at: scripts/fix-all.sql"
echo ""
echo "🔗 Opening SQL Editor..."
echo ""

# Try to open in default browser
if command -v open &> /dev/null; then
    open "https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/sql"
elif command -v xdg-open &> /dev/null; then
    xdg-open "https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/sql"
else
    echo "Please open: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/sql"
fi

echo ""
echo "📝 Next steps:"
echo "   1. Copy the SQL from: scripts/fix-all.sql"
echo "   2. Paste into SQL Editor"
echo "   3. Click 'Run'"
echo ""
echo "Or copy this SQL now:"
echo ""
cat scripts/fix-all.sql
