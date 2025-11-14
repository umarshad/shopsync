import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase configuration
const SUPABASE_URL = 'https://fgyssizbuggjqsarwiuj.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZneXNzaXpidWdnanFzYXJ3aXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDMwNTMsImV4cCI6MjA3ODcxOTA1M30.qkW_oXfKVYkWFPaEFTcRx_z17Ue2IsCgESn1qv70vtM';

// Use service key if available, otherwise use anon key (may have limited permissions)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Migration files directory
const MIGRATIONS_DIR = join(__dirname, '..', 'supabase', 'migrations');

async function runSQL(sql) {
  // Try using Supabase REST API rpc or direct query
  // Note: Supabase doesn't expose a direct SQL execution endpoint via the JS client
  // We need to use the Management API or connect directly via psql
  
  // For now, we'll provide instructions and try to use pg with connection pool URL
  console.log('⚠️  Supabase JS client cannot execute raw SQL directly.');
  console.log('   Using alternative method...\n');
  
  // Try to use the connection pool URL instead
  return false;
}

async function runMigrationsWithPool() {
  // Supabase connection pool URL format
  // pooler.supabase.com uses port 6543 and requires session mode
  const POOL_URL = 'postgresql://postgres.fgyssizbuggjqsarwiuj:6287605b.B@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true';
  
  try {
    const { Client } = await import('pg');
    const client = new Client({
      connectionString: POOL_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log('🔌 Connecting to Supabase via connection pool...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Get all migration files
    const files = await readdir(MIGRATIONS_DIR);
    const migrationFiles = files
      .filter(f => f.endsWith('.sql') && f.startsWith('00'))
      .sort()
      .map(f => join(MIGRATIONS_DIR, f));

    console.log(`📋 Found ${migrationFiles.length} migration file(s):\n`);

    for (let i = 0; i < migrationFiles.length; i++) {
      const filePath = migrationFiles[i];
      const fileName = filePath.split('/').pop();
      
      console.log(`📄 [${i + 1}/${migrationFiles.length}] Running: ${fileName}`);
      
      try {
        const sql = readFileSync(filePath, 'utf8');
        
        // Split by semicolons and execute each statement
        // Some statements might span multiple lines
        const statements = sql.split(';').filter(s => s.trim().length > 0);
        
        for (const statement of statements) {
          const trimmed = statement.trim();
          if (trimmed && !trimmed.startsWith('--')) {
            await client.query(trimmed + ';');
          }
        }
        
        console.log(`   ✅ Success: ${fileName}\n`);
      } catch (error) {
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate') ||
            (error.message.includes('relation') && error.message.includes('already'))) {
          console.log(`   ⚠️  Warning: Some objects may already exist. Continuing...\n`);
        } else {
          console.error(`   ❌ Error in ${fileName}:`);
          console.error(`   ${error.message}\n`);
          throw error;
        }
      }
    }

    console.log('🎉 All migrations completed successfully!');
    
    // Verify tables
    console.log('\n📊 Verifying tables...');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    const tables = result.rows.map(r => r.table_name);
    console.log(`✅ Found ${tables.length} tables:`);
    tables.forEach(table => console.log(`   - ${table}`));

    await client.end();
    console.log('\n✨ Database setup complete!\n');

  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      console.error('\n❌ Connection failed. Trying alternative method...\n');
      console.log('📝 Please run migrations manually in Supabase Dashboard:');
      console.log('   1. Go to: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj');
      console.log('   2. Click "SQL Editor"');
      console.log('   3. Run each migration file from supabase/migrations/ folder\n');
      return false;
    }
    throw error;
  }
}

async function runMigrations() {
  try {
    // Try connection pool first (most reliable)
    await runMigrationsWithPool();
  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error.message);
    console.log('\n📝 Alternative: Run migrations manually in Supabase Dashboard');
    console.log('   1. Go to: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj');
    console.log('   2. Click "SQL Editor"');
    console.log('   3. Copy and paste each migration file from supabase/migrations/\n');
    process.exit(1);
  }
}

runMigrations().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

