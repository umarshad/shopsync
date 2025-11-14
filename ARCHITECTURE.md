# ShopSync POS Architecture

## Overview

ShopSync is an offline-first Retail POS + Inventory Management System built with React, Vite, and Supabase. It uses local IndexedDB for offline storage and syncs with Supabase when online.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        ShopSync PWA                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │   Zustand    │  │  Localforage │      │
│  │  Components  │  │    Store     │  │  (IndexedDB) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Sync       │  │   Printer    │  │   Scanner    │      │
│  │   Service    │  │   (WebUSB)   │  │   (HID)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS/WebSocket
                           │
┌─────────────────────────────────────────────────────────────┐
│                        Supabase                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │   Realtime   │  │     Auth     │      │
│  │  + RLS       │  │   (WebSocket)│  │   (JWT)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Components

### Frontend

#### React Components
- **POS**: Main POS interface
- **ProductGrid**: Product display and selection
- **Cart**: Shopping cart and checkout
- **BarcodeScanner**: Barcode input handler
- **ProductList**: Inventory management
- **ProductForm**: Product creation/editing
- **SalesReport**: Sales reports and analytics
- **Settings**: Application settings
- **WhiteLabelConfig**: White-label configuration
- **BackupRestore**: Backup and restore functionality
- **CustomerDisplay**: Customer display screen

#### State Management
- **Zustand Stores**:
  - `authStore`: Authentication state
  - `cartStore`: Shopping cart state
  - `configStore`: Application configuration

#### Services
- **Sync Service**: Offline sync queue and processing
- **Printer Service**: Thermal printer integration (WebUSB)
- **Storage Service**: IndexedDB operations (localforage)

### Backend

#### Supabase
- **PostgreSQL**: Database with RLS (Row Level Security)
- **Realtime**: WebSocket subscriptions for live updates
- **Auth**: JWT-based authentication
- **Storage**: File storage (optional)

#### Database Schema
- **profiles**: User profiles and shop information
- **products**: Product catalog
- **sales**: Sales transactions
- **sale_items**: Sale line items
- **sync_queue**: Offline sync queue

## Data Flow

### Online Flow
1. User performs action (e.g., create sale)
2. Action is sent to Supabase via API
3. Supabase processes and stores data
4. Realtime subscription notifies all clients
5. Local cache is updated

### Offline Flow
1. User performs action (e.g., create sale)
2. Action is queued in local sync queue
3. Data is stored in IndexedDB
4. UI updates immediately
5. When online, sync service processes queue
6. Data is sent to Supabase
7. Local cache is updated

### Sync Flow
1. Sync service runs every 30 seconds
2. Checks if online
3. Processes sync queue
4. Sends queued operations to Supabase
5. Updates local cache with server data
6. Handles conflicts and errors

## Security

### Row Level Security (RLS)
- Each shop has its own data isolated by `shop_id`
- Users can only access data from their shop
- Role-based access control (Cashier, Manager, Owner)

### Authentication
- JWT tokens via Supabase Auth
- Email + password authentication
- PIN-based quick login
- Session management

### Data Protection
- HTTPS only
- Encrypted data transmission
- Secure storage in IndexedDB
- Environment variables for secrets

## Offline Strategy

### Local Storage
- **IndexedDB**: Product catalog, sales, cart
- **localStorage**: User preferences, configuration
- **Cache API**: Static assets, service worker cache

### Sync Strategy
- **Queue-based**: Operations are queued when offline
- **Automatic sync**: Syncs every 30 seconds when online
- **Conflict resolution**: Last write wins (configurable)
- **Error handling**: Retries failed operations

## Performance

### Optimization
- **Code splitting**: Lazy loading of components
- **Image optimization**: WebP format, lazy loading
- **Caching**: Service worker cache for static assets
- **Debouncing**: Debounced search and input
- **Virtual scrolling**: For large product lists

### Monitoring
- **Performance metrics**: Core Web Vitals
- **Error tracking**: Console errors and network failures
- **Sync status**: Queue length, last sync time
- **User analytics**: Page views, user actions

## Scalability

### Horizontal Scaling
- Stateless frontend (PWA)
- Supabase handles backend scaling
- CDN for static assets
- Load balancing via Vercel/Netlify

### Database Scaling
- Supabase handles PostgreSQL scaling
- Indexed columns for fast queries
- Connection pooling
- Read replicas for reporting

## Extensibility

### Plugins
- Printer plugins for different printer types
- Payment gateway integrations
- Inventory management extensions
- Reporting and analytics plugins

### Customization
- White-label configuration
- Custom themes
- Multi-language support
- Custom receipt templates

## Testing

### Unit Tests
- Component tests (React Testing Library)
- Store tests (Zustand)
- Utility function tests

### Integration Tests
- API integration tests
- Database tests
- Sync service tests

### E2E Tests
- User flow tests
- Offline/online scenarios
- Printer integration tests

## Deployment

### Build Process
1. TypeScript compilation
2. React build
3. Asset optimization
4. Service worker generation
5. PWA manifest generation

### Deployment Targets
- **Vercel**: Recommended for easy deployment
- **Netlify**: Alternative deployment option
- **Self-hosted**: For enterprise deployments

## Monitoring & Maintenance

### Logging
- Console logging for development
- Error logging for production
- Sync status logging
- User action logging

### Updates
- Automatic PWA updates
- Manual update prompts
- Version checking
- Changelog display

## Future Enhancements

### Planned Features
- Multi-shop support
- Advanced reporting
- Inventory forecasting
- Customer management
- Loyalty programs
- Payment gateway integrations
- Mobile app (React Native)
- API for third-party integrations

## Support

For architecture questions or issues, please contact support@shopsync.com

