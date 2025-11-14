import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://fgyssizbuggjqsarwiuj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZneXNzaXpidWdnanFzYXJ3aXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDMwNTMsImV4cCI6MjA3ODcxOTA1M30.qkW_oXfKVYkWFPaEFTcRx_z17Ue2IsCgESn1qv70vtM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkConnectionInfo() {
  console.log('📋 Checking Supabase Connection Information\n');
  console.log('='.repeat(60));
  console.log('\n✅ Supabase URL:');
  console.log(`   ${SUPABASE_URL}`);
  console.log('\n✅ Anon Key:');
  console.log(`   ${SUPABASE_ANON_KEY.substring(0, 50)}...`);
  console.log('\n📝 To enable direct connections:');
  console.log('\n   1. Go to Supabase Dashboard:');
  console.log('      https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj');
  console.log('\n   2. Navigate to Settings > Database:');
  console.log('      Click on "Settings" (gear icon) in left sidebar');
  console.log('      Click on "Database" in settings menu');
  console.log('\n   3. Find "Connection string" section:');
  console.log('      Look for "Connection string" or "Database URL"');
  console.log('      Select "Direct connection" (not "Connection pooling")');
  console.log('\n   4. Copy the connection string:');
  console.log('      It should look like:');
  console.log('      postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres');
  console.log('\n   5. If you see "Connection pooling" enabled:');
  console.log('      Toggle it OFF to allow direct connections');
  console.log('      Or use the connection pool URL for migrations');
  console.log('\n   6. Check "Network restrictions":');
  console.log('      Some projects require IP whitelisting');
  console.log('      Add your current IP address');
  console.log('      Or disable restrictions for development');
  console.log('\n   7. Get your database password:');
  console.log('      Go to Settings > Database > Database password');
  console.log('      Reset password if needed');
  console.log('      Current password: 6287605b.B');
  console.log('\n📚 Alternative: Use Supabase CLI (Recommended)');
  console.log('\n   Install Supabase CLI:');
  console.log('     brew install supabase/tap/supabase');
  console.log('     # or');
  console.log('     npm install -g supabase');
  console.log('\n   Then run:');
  console.log('     cd shopsync');
  console.log('     ./scripts/setup-supabase-cli.sh');
  console.log('\n   This will:');
  console.log('     - Install Supabase CLI');
  console.log('     - Login to Supabase');
  console.log('     - Link to your project');
  console.log('     - Allow running: supabase db push');
  console.log('\n');
  
  // Test API connection
  try {
    console.log('🧪 Testing Supabase API connection...');
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error && error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log('   ✅ API connection works (tables not created yet)');
    } else if (error) {
      console.log(`   ⚠️  API connection issue: ${error.message}`);
    } else {
      console.log('   ✅ API connection works!');
    }
  } catch (error) {
    console.log(`   ❌ API connection failed: ${error.message}`);
  }
  
  console.log('\n');
}

checkConnectionInfo().catch(error => {
  console.error('Error:', error);
});

