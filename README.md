# ShopSync POS - Retail POS + Inventory Management System

ShopSync is a complete, production-ready, offline-first Retail POS + Inventory Management System powered by Supabase. It works without internet using local IndexedDB cache and syncs automatically when online.

## Features

- ✅ **100% Offline-First**: Works without internet using local IndexedDB cache
- ✅ **Real-time Sync**: Automatic sync when online via Supabase Realtime
- ✅ **Web-based PWA**: Installable on Windows/Linux/Android
- ✅ **Multi-user**: Cashier, Manager, Owner roles with RLS
- ✅ **Real-time Inventory**: Live stock updates and low stock alerts
- ✅ **Thermal Printer**: Support for 58mm/80mm receipts via WebUSB
- ✅ **Barcode Scanner**: Camera or USB scanner support
- ✅ **Customer Display**: Second screen via WebSocket
- ✅ **White-label**: Customize logo, name, colors
- ✅ **Multi-language**: English + Urdu (RTL support)
- ✅ **Backup/Restore**: One-click backup/restore
- ✅ **Reports**: Sales reports, inventory reports, export to CSV

## Tech Stack

- **Backend**: Supabase (PostgreSQL + RLS + Realtime + Storage)
- **Frontend**: React 18 + Vite + Tailwind CSS + Zustand
- **State**: Supabase client + localforage (offline cache)
- **Auth**: Supabase Auth (email + PIN)
- **Sync**: Supabase Realtime + local queue
- **PWA**: Vite PWA plugin
- **Printing**: WebUSB + ESC/POS
- **i18n**: react-i18next

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- PostgreSQL database (via Supabase)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shopsync
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Set up the database:
   - Go to your Supabase project
   - Run the SQL migrations from `supabase/migrations/` in order:
     - `001_initial_schema.sql`
     - `002_rls_policies.sql`
     - `003_realtime_setup.sql`

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Database Setup

1. Create a Supabase project
2. Run the migrations in order:
   - `001_initial_schema.sql` - Creates tables and indexes
   - `002_rls_policies.sql` - Sets up Row Level Security
   - `003_realtime_setup.sql` - Configures Realtime subscriptions

3. Enable Realtime for tables:
   - products
   - sales
   - sale_items

## Deployment

### Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

3. Set environment variables in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## User Roles

- **Cashier**: Can create sales, view products
- **Manager**: Can manage inventory, view reports, manage sales
- **Owner**: Full access including user management

## Configuration

### White-Label Configuration

Edit `public/white-label/config.json` or use the Settings UI:

```json
{
  "appName": "Your Shop Name",
  "logo": "/logo.png",
  "primaryColor": "#16a34a",
  "currency": "PKR",
  "currencySymbol": "₨",
  "language": "en",
  "printerWidth": 58,
  "shopName": "My Shop",
  "shopAddress": "123 Main St",
  "shopPhone": "+1234567890",
  "shopEmail": "shop@example.com",
  "taxRate": 0,
  "receiptFooter": "Thank you for your purchase!"
}
```

## Printer Setup

1. Connect your thermal printer via USB
2. Open ShopSync POS
3. Go to Settings > Printer
4. Click "Connect Printer"
5. Select your printer from the list
6. Test print a receipt

## Barcode Scanner Setup

1. Connect your barcode scanner via USB
2. Open ShopSync POS
3. The scanner should work automatically
4. Scan a barcode to add products to cart

## Offline Sync

ShopSync automatically syncs data when online:
- Syncs every 30 seconds
- Queues operations when offline
- Automatically retries failed syncs
- Conflict resolution for concurrent updates

## Backup & Restore

1. Go to Settings > Backup
2. Click "Backup" to export all data
3. Click "Restore" to import from backup file

## Multi-Language Support

ShopSync supports English and Urdu:
- Switch language in Settings
- Urdu text displays in RTL (right-to-left)
- All UI elements are translated

## Troubleshooting

### Printer not connecting
- Make sure the printer is connected via USB
- Check if the printer is powered on
- Try disconnecting and reconnecting the printer
- Restart the browser

### Barcode scanner not working
- Make sure the scanner is in HID mode (keyboard mode)
- Check if the scanner is connected via USB
- Try scanning directly in the barcode input field

### PWA not installing
- Make sure you're using a supported browser
- Check if the site is loaded over HTTPS
- Clear browser cache and try again

### Sync not working
- Check your internet connection
- Verify Supabase credentials in `.env`
- Check browser console for errors
- Verify RLS policies are set correctly

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please contact support@shopsync.com

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Acknowledgments

- Supabase for the backend infrastructure
- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and users of ShopSync
