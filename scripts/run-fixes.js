#!/usr/bin/env node

// Run all fixes via Supabase REST API
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = 'https://fgyssizbuggjqsarwiuj.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ACCESS_TOKEN;

if (!SUPABASE_SERVICE_KEY) {
  console.log('❌ SUPABASE_SERVICE_KEY or SUPABASE_ACCESS_TOKEN not set');
  console.log('');
  console.log('📝 Option 1: Set service key (recommended for SQL execution)');
  console.log('   Get it from: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/settings/api');
  console.log('   export SUPABASE_SERVICE_KEY=your-service-key');
  console.log('');
  console.log('📝 Option 2: Run SQL manually');
  console.log('   1. Go to: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/sql');
  console.log('   2. Open: scripts/fix-all.sql');
  console.log('   3. Copy and paste, then click Run');
  console.log('');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runFixes() {
  console.log('========================================');
  console.log('Running ShopSync Fixes');
  console.log('========================================');
  console.log('');

  try {
    // Read SQL file
    const sqlPath = join(__dirname, 'fix-all.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    // Split by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    console.log('');

    // Execute via RPC or direct query
    // Note: Supabase JS client doesn't support arbitrary SQL execution
    // So we'll use the REST API directly
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      },
      body: JSON.stringify({ sql })
    });

    if (!response.ok) {
      // Fallback: Try executing via Supabase management API
      console.log('⚠️  Direct SQL execution not available');
      console.log('');
      console.log('📝 Please run the SQL manually:');
      console.log('   1. Go to: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/sql');
      console.log('   2. Open: scripts/fix-all.sql');
      console.log('   3. Copy all contents');
      console.log('   4. Paste and click "Run"');
      console.log('');
      process.exit(1);
    }

    console.log('✅ All fixes applied successfully!');
    console.log('');
    console.log('🔄 Refresh your browser to see changes');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
    console.log('📝 Please run the SQL manually:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/sql');
    console.log('   2. Open: scripts/fix-all.sql');
    console.log('   3. Copy all contents');
    console.log('   4. Paste and click "Run"');
  }
}

runFixes();

