import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir } from 'fs/promises';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try connection pool URL (Supabase format: postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543)
// If this doesn't work, you'll need to run migrations manually in Supabase Dashboard
const POOL_URL = 'postgresql://postgres.fgyssizbuggjqsarwiuj:6287605b.B@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true';
const DIRECT_URL = 'postgresql://postgres:6287605b.B@db.fgyssizbuggjqsarwiuj.supabase.co:5432/postgres';

const MIGRATIONS_DIR = join(__dirname, '..', 'supabase', 'migrations');

async function runMigrations() {
  const connectionUrls = [
    { name: 'Connection Pool', url: POOL_URL },
    { name: 'Direct Connection', url: DIRECT_URL }
  ];

  let client = null;
  let connected = false;

  // Try each connection method
  for (const { name, url } of connectionUrls) {
    try {
      console.log(`🔌 Trying ${name}...`);
      client = new Client({
        connectionString: url,
        ssl: {
          rejectUnauthorized: false
        },
        connect_timeout: 10
      });

      await client.connect();
      console.log(`✅ Connected via ${name}!\n`);
      connected = true;
      break;
    } catch (error) {
      console.log(`   ❌ ${name} failed: ${error.message}\n`);
      if (client) {
        try {
          await client.end();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }
  }

  if (!connected || !client) {
    console.error('❌ Could not connect to database using either method.\n');
    console.log('📝 Please run migrations manually in Supabase Dashboard:\n');
    console.log('   1. Go to: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj');
    console.log('   2. Click "SQL Editor" in the left sidebar');
    console.log('   3. Click "+ New query"');
    console.log('   4. Copy and paste the contents of each file from supabase/migrations/ folder');
    console.log('   5. Run them in order: 001, 002, 003\n');
    process.exit(1);
  }

  try {
    // Get all migration files sorted by name
    const files = await readdir(MIGRATIONS_DIR);
    const migrationFiles = files
      .filter(f => f.endsWith('.sql') && f.match(/^\d+_/))
      .sort()
      .map(f => join(MIGRATIONS_DIR, f));

    console.log(`📋 Found ${migrationFiles.length} migration file(s):\n`);

    for (let i = 0; i < migrationFiles.length; i++) {
      const filePath = migrationFiles[i];
      const fileName = filePath.split('/').pop();
      
      console.log(`📄 [${i + 1}/${migrationFiles.length}] Running: ${fileName}`);
      
      try {
        // Read migration file
        const sql = readFileSync(filePath, 'utf8');
        
        // Execute migration (pg handles multiple statements automatically)
        await client.query(sql);
        
        console.log(`   ✅ Success: ${fileName}\n`);
      } catch (error) {
        // Check if it's a "already exists" error (OK to continue)
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate') ||
            error.message.includes('relation') && error.message.includes('already') ||
            error.message.includes('already enabled')) {
          console.log(`   ⚠️  Warning: Some objects may already exist. Continuing...\n`);
        } else {
          console.error(`   ❌ Error in ${fileName}:`);
          console.error(`   ${error.message}\n`);
          throw error;
        }
      }
    }

    console.log('🎉 All migrations completed successfully!');
    
    // Verify tables were created
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

    // Verify RLS is enabled
    console.log('\n🔒 Verifying Row Level Security...');
    const rlsResult = await client.query(`
      SELECT tablename, rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);
    
    rlsResult.rows.forEach(row => {
      const status = row.rowsecurity ? '✅ Enabled' : '❌ Disabled';
      console.log(`   ${status}: ${row.tablename}`);
    });

    console.log('\n✨ Database setup complete!\n');

  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error.message);
    if (error.position) {
      console.error(`   At position: ${error.position}`);
    }
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed.');
  }
}

// Run migrations
runMigrations().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
