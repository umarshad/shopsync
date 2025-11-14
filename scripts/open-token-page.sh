#!/bin/bash
# Open Supabase Access Tokens page in browser
echo "Opening Supabase Access Tokens page..."
echo ""
echo "If browser doesn't open, go to:"
echo "https://supabase.com/dashboard/account/tokens"
echo ""

# Try to open in default browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "https://supabase.com/dashboard/account/tokens"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "https://supabase.com/dashboard/account/tokens" 2>/dev/null || \
    gnome-open "https://supabase.com/dashboard/account/tokens" 2>/dev/null || \
    echo "Please open: https://supabase.com/dashboard/account/tokens"
else
    echo "Please open: https://supabase.com/dashboard/account/tokens"
fi

echo ""
echo "📝 Steps:"
echo "   1. Click 'Generate New Token'"
echo "   2. Name it: 'ShopSync CLI'"
echo "   3. Click 'Generate'"
echo "   4. Copy the token"
echo "   5. Run: export SUPABASE_ACCESS_TOKEN=your-token"
echo "   6. Run: ./scripts/run-with-token.sh"
echo ""
