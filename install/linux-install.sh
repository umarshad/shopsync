#!/bin/bash

echo "========================================"
echo "ShopSync POS Installation"
echo "========================================"
echo ""
echo "This script will help you install ShopSync POS as a PWA."
echo ""

# Replace with your actual deployment URL
SHOP_SYNC_URL="https://your-shopsync-app.vercel.app"

echo "Step 1: Opening ShopSync in your browser..."
echo ""

# Try to open in default browser
if command -v xdg-open &> /dev/null; then
    xdg-open "$SHOP_SYNC_URL"
elif command -v gnome-open &> /dev/null; then
    gnome-open "$SHOP_SYNC_URL"
elif command -v kde-open &> /dev/null; then
    kde-open "$SHOP_SYNC_URL"
else
    echo "Please open $SHOP_SYNC_URL in your browser"
fi

echo ""
echo "Step 2: Install as PWA"
echo ""
echo "1. Look for the install icon in your browser's address bar"
echo "2. Click 'Install' when prompted"
echo "3. ShopSync will be installed as a desktop app"
echo ""
echo "Alternatively:"
echo "1. Click the three dots menu (>)"
echo "2. Select 'Install ShopSync POS'"
echo ""
echo "========================================"
echo "Installation Complete!"
echo "========================================"
echo ""
echo "ShopSync POS is now installed on your system."
echo "You can find it in your applications menu."
echo ""

