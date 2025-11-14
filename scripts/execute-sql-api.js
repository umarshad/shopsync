#!/usr/bin/env node

// Execute SQL via Supabase Management API
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ACCESS_TOKEN = 'sbp_910eae15bbbfb48193712c2e74341541ea340a4a';
const PROJECT_REF = 'fgyssizbuggjqsarwiuj';

// Read SQL file
const sqlPath = join(__dirname, 'fix-all.sql');
const sql = readFileSync(sqlPath, 'utf-8');

console.log('========================================');
console.log('Executing SQL Fix via Management API');
console.log('========================================');
console.log('');

// Use Supabase Management API to execute SQL
const url = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`;

const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: sql
  })
});

if (response.ok) {
  const result = await response.json();
  console.log('✅ SQL executed successfully!');
  console.log('');
  if (result.data) {
    console.log('Result:', JSON.stringify(result.data, null, 2));
  }
} else {
  const error = await response.text();
  console.error('❌ Error:', response.status, response.statusText);
  console.error('Details:', error);
  console.log('');
  console.log('📝 Alternative: Run SQL manually in Supabase Dashboard:');
  console.log('   https://supabase.com/dashboard/project/' + PROJECT_REF + '/sql');
  process.exit(1);
}

