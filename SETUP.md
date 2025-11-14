# ShopSync POS Setup Guide

## Quick Setup Steps

### 1. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migrations in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_realtime_setup.sql`

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. PWA Icons

Create PWA icons (192x192 and 512x512) and place them in the `public` folder:
- `public/pwa-192x192.png`
- `public/pwa-512x512.png`

You can use an online tool like https://realfavicongenerator.net/ to generate icons.

### 4. Logo

Place your shop logo in the `public` folder:
- `public/logo.png`

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Development Server

```bash
npm run dev
```

### 7. Create First User

1. Go to Supabase Auth dashboard
2. Create a new user
3. Create a profile in the `profiles` table:
   ```sql
   INSERT INTO profiles (id, shop_id, shop_name, role, pin)
   VALUES (
     'user-uuid-here',
     'shop-uuid-here',
     'My Shop',
     'owner',
     '1234'
   );
   ```

### 8. Login

1. Open the app in your browser
2. Login with email/password or PIN
3. Start using ShopSync!

## Next Steps

1. Configure white-label settings in Settings > White Label
2. Add products in Inventory
3. Connect a thermal printer (Settings > Printer)
4. Set up barcode scanner
5. Customize receipt template

## Troubleshooting

### Database connection fails
- Verify Supabase URL and anon key in `.env`
- Check if migrations ran successfully
- Verify RLS policies are enabled

### PWA not installing
- Make sure icons are in the `public` folder
- Check if site is served over HTTPS
- Clear browser cache

### Printer not connecting
- Check USB connection
- Verify printer is powered on
- Try different USB port
- Check browser permissions for USB devices

### Sync not working
- Check internet connection
- Verify Supabase credentials
- Check browser console for errors
- Verify sync queue is processing

## Support

For setup issues, please contact support@shopsync.com

