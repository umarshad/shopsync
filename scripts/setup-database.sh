#!/bin/bash

# ShopSync Database Setup Script
# This script helps you run the database migrations in Supabase

echo "========================================"
echo "ShopSync Database Setup"
echo "========================================"
echo ""
echo "This script will guide you through setting up the database."
echo ""
echo "Database URL: postgresql://postgres:6287605b.B@db.fgyssizbuggjqsarwiuj.supabase.co:5432/postgres"
echo ""
echo "You have two options:"
echo ""
echo "Option 1: Use Supabase Dashboard (Recommended)"
echo "1. Go to https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj"
echo "2. Navigate to SQL Editor"
echo "3. Run each migration file in order:"
echo "   - 001_initial_schema.sql"
echo "   - 002_rls_policies.sql"
echo "   - 003_realtime_setup.sql"
echo ""
echo "Option 2: Use psql command line"
echo "Run the following commands:"
echo ""
echo "psql 'postgresql://postgres:6287605b.B@db.fgyssizbuggjqsarwiuj.supabase.co:5432/postgres' -f supabase/migrations/001_initial_schema.sql"
echo "psql 'postgresql://postgres:6287605b.B@db.fgyssizbuggjqsarwiuj.supabase.co:5432/postgres' -f supabase/migrations/002_rls_policies.sql"
echo "psql 'postgresql://postgres:6287605b.B@db.fgyssizbuggjqsarwiuj.supabase.co:5432/postgres' -f supabase/migrations/003_realtime_setup.sql"
echo ""
echo "========================================"
echo ""

# Check if psql is available
if command -v psql &> /dev/null; then
    echo "psql is available. Would you like to run migrations automatically? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "Running migrations..."
        psql 'postgresql://postgres:6287605b.B@db.fgyssizbuggjqsarwiuj.supabase.co:5432/postgres' -f supabase/migrations/001_initial_schema.sql
        psql 'postgresql://postgres:6287605b.B@db.fgyssizbuggjqsarwiuj.supabase.co:5432/postgres' -f supabase/migrations/002_rls_policies.sql
        psql 'postgresql://postgres:6287605b.B@db.fgyssizbuggjqsarwiuj.supabase.co:5432/postgres' -f supabase/migrations/003_realtime_setup.sql
        echo "Migrations completed!"
    fi
else
    echo "psql is not installed. Please use Option 1 (Supabase Dashboard)."
fi

