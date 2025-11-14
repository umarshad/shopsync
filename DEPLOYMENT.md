# ShopSync POS Deployment Guide

## Quick Deployment (5 Minutes)

### Step 1: Set up Supabase

1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key
3. Run the database migrations:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_realtime_setup.sql`

### Step 2: Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
cd shopsync
vercel
```

4. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

5. Redeploy:
```bash
vercel --prod
```

### Step 3: Install PWA

1. Open your deployed URL in Chrome/Edge
2. Click the install icon in the address bar
3. Click "Install" when prompted
4. ShopSync is now installed as a PWA

## Deployment Options

### Vercel

**Advantages:**
- Easy deployment
- Automatic HTTPS
- Global CDN
- Serverless functions support
- Free tier available

**Steps:**
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Netlify

**Advantages:**
- Easy deployment
- Automatic HTTPS
- Global CDN
- Free tier available
- Form handling support

**Steps:**
1. Push code to GitHub
2. Connect repository to Netlify
3. Set environment variables
4. Deploy

### Self-Hosted

**Requirements:**
- Web server (nginx, Apache)
- SSL certificate
- Node.js 18+
- Domain name

**Steps:**
1. Build the project:
```bash
npm run build
```

2. Serve the `dist` folder:
```bash
# Using nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/shopsync/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

3. Set up SSL certificate (Let's Encrypt):
```bash
certbot --nginx -d your-domain.com
```

## Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key

Optional environment variables:

- `VITE_APP_NAME` - Application name (default: ShopSync POS)
- `VITE_APP_VERSION` - Application version

## Database Setup

1. Create Supabase project
2. Run migrations in order:
   - `001_initial_schema.sql`
   - `002_rls_policies.sql`
   - `003_realtime_setup.sql`

3. Enable Realtime for tables:
   - products
   - sales
   - sale_items

4. Set up authentication:
   - Enable email authentication
   - Configure password policies
   - Set up user roles

## PWA Configuration

The PWA is configured in `vite.config.ts`:

```typescript
VitePWA({
  registerType: 'prompt',
  manifest: {
    name: 'ShopSync POS',
    short_name: 'ShopSync',
    // ... other config
  }
})
```

## Custom Domain

### Vercel

1. Go to Vercel dashboard
2. Select your project
3. Go to Settings > Domains
4. Add your domain
5. Configure DNS records

### Netlify

1. Go to Netlify dashboard
2. Select your site
3. Go to Domain settings
4. Add your domain
5. Configure DNS records

## SSL Certificate

Both Vercel and Netlify provide free SSL certificates automatically.

For self-hosted:
1. Use Let's Encrypt
2. Set up automatic renewal
3. Configure nginx/Apache

## Monitoring

### Vercel Analytics

1. Enable Vercel Analytics in dashboard
2. View real-time metrics
3. Monitor performance

### Error Tracking

Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage analytics

## Backup Strategy

1. Regular database backups (Supabase automatic)
2. Export data via Backup feature in Settings
3. Store backups in cloud storage
4. Test restore procedures regularly

## Security

1. Enable RLS on all tables
2. Use environment variables for secrets
3. Enable HTTPS only
4. Set up CORS policies
5. Regular security updates

## Performance Optimization

1. Enable CDN caching
2. Optimize images
3. Use lazy loading
4. Minimize bundle size
5. Enable compression

## Troubleshooting

### Deployment fails

- Check build logs
- Verify environment variables
- Check Node.js version
- Verify dependencies

### PWA not installing

- Check HTTPS is enabled
- Verify manifest.json
- Check service worker
- Clear browser cache

### Database connection fails

- Verify Supabase credentials
- Check RLS policies
- Verify network connectivity
- Check Supabase status

## Support

For deployment issues, please contact support@shopsync.com