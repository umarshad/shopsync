import pg from 'pg';

const { Client } = pg;

// Test different connection methods
const connections = [
  {
    name: 'Direct Connection (Port 5432)',
    url: 'postgresql://postgres:6287605b.B@db.fgyssizbuggjqsarwiuj.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
  },
  {
    name: 'Connection Pool (Port 6543)',
    url: 'postgresql://postgres.fgyssizbuggjqsarwiuj:6287605b.B@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
    ssl: { rejectUnauthorized: false }
  },
  {
    name: 'Alternative Pool URL',
    url: 'postgresql://postgres.fgyssizbuggjqsarwiuj:6287605b.B@pooler.supabase.com:6543/postgres?pgbouncer=true',
    ssl: { rejectUnauthorized: false }
  }
];

async function testConnection(name, url, ssl) {
  const client = new Client({
    connectionString: url,
    ssl: ssl,
    connect_timeout: 5
  });

  try {
    console.log(`\n🔌 Testing: ${name}...`);
    await client.connect();
    
    // Test query
    const result = await client.query('SELECT version()');
    console.log(`   ✅ SUCCESS! Connected via ${name}`);
    console.log(`   📊 PostgreSQL version: ${result.rows[0].version.split(',')[0]}`);
    
    // Check current database
    const dbResult = await client.query('SELECT current_database()');
    console.log(`   📁 Database: ${dbResult.rows[0].current_database}`);
    
    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    if (tablesResult.rows.length > 0) {
      console.log(`   📋 Existing tables: ${tablesResult.rows.map(r => r.table_name).join(', ')}`);
    } else {
      console.log(`   📋 No tables found (migrations not run yet)`);
    }
    
    await client.end();
    return { success: true, name, url };
  } catch (error) {
    console.log(`   ❌ FAILED: ${error.message}`);
    if (client) {
      try {
        await client.end();
      } catch (e) {
        // Ignore cleanup errors
      }
    }
    return { success: false, name, error: error.message };
  }
}

async function testAllConnections() {
  console.log('🧪 Testing Supabase Database Connections\n');
  console.log('='.repeat(60));
  
  const results = [];
  
  for (const conn of connections) {
    const result = await testConnection(conn.name, conn.url, conn.ssl);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Results Summary:\n');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  if (successful.length > 0) {
    console.log('✅ Working connections:');
    successful.forEach(r => {
      console.log(`   - ${r.name}`);
      console.log(`     URL: ${r.url.split('@')[1] || r.url}`);
    });
    console.log('\n💡 Use one of the working connections in your migration script.');
  } else {
    console.log('❌ No working connections found.');
    console.log('\n📝 To enable direct connections:');
    console.log('   1. Go to Supabase Dashboard > Settings > Database');
    console.log('   2. Enable "Direct connections"');
    console.log('   3. Check "Connection string" section');
    console.log('   4. Allow your IP address if required');
    console.log('\n   Or use the SQL Editor method (see MIGRATE.md)');
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed connections:');
    failed.forEach(r => {
      console.log(`   - ${r.name}: ${r.error}`);
    });
  }
  
  console.log('\n');
}

testAllConnections().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

