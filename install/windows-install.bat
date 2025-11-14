@echo off
echo ========================================
echo ShopSync POS Installation
echo ========================================
echo.
echo This script will help you install ShopSync POS as a PWA.
echo.
echo Step 1: Opening ShopSync in your browser...
echo.

REM Replace with your actual deployment URL
set SHOP_SYNC_URL=https://your-shopsync-app.vercel.app

start chrome --app=%SHOP_SYNC_URL%

echo.
echo Step 2: Install as PWA
echo.
echo 1. Look for the install icon in your browser's address bar
echo 2. Click "Install" when prompted
echo 3. ShopSync will be installed as a desktop app
echo.
echo Alternatively:
echo 1. Click the three dots menu (^>)
echo 2. Select "Install ShopSync POS"
echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo ShopSync POS is now installed on your system.
echo You can find it in your Start Menu or Desktop.
echo.
pause

