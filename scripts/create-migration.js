#!/usr/bin/env node

import { writeFileSync, readdir } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir as readdirPromise } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MIGRATIONS_DIR = join(__dirname, '..', 'supabase', 'migrations');

// Get migration name from command line
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('❌ Error: Migration name is required');
  console.log('\nUsage:');
  console.log('  node scripts/create-migration.js <migration-name>');
  console.log('\nExample:');
  console.log('  node scripts/create-migration.js add_customer_table');
  console.log('  node scripts/create-migration.js update_product_schema');
  process.exit(1);
}

// Sanitize migration name
const sanitizedName = migrationName
  .toLowerCase()
  .replace(/[^a-z0-9_]/g, '_')
  .replace(/_+/g, '_')
  .replace(/^_|_$/g, '');

// Get next migration number
async function getNextMigrationNumber() {
  try {
    const files = await readdirPromise(MIGRATIONS_DIR);
    const migrations = files
      .filter(f => f.endsWith('.sql') && f.match(/^\d+_/))
      .map(f => {
        const match = f.match(/^(\d+)_/);
        return match ? parseInt(match[1]) : 0;
      })
      .sort((a, b) => b - a);
    
    return migrations.length > 0 ? migrations[0] + 1 : 1;
  } catch (error) {
    return 1;
  }
}

async function createMigration() {
  const number = await getNextMigrationNumber();
  const fileName = `${String(number).padStart(3, '0')}_${sanitizedName}.sql`;
  const filePath = join(MIGRATIONS_DIR, fileName);
  
  const template = `-- Migration: ${sanitizedName}
-- Created: ${new Date().toISOString()}
-- Description: ${migrationName}

-- Add your SQL migration here
-- Example:
-- CREATE TABLE IF NOT EXISTS example (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   name TEXT NOT NULL,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );

`;

  writeFileSync(filePath, template, 'utf8');
  
  console.log('✅ Migration file created:');
  console.log(`   ${filePath}`);
  console.log('\n📝 Next steps:');
  console.log('   1. Edit the migration file with your SQL');
  console.log('   2. Test locally if possible');
  console.log('   3. Run migration: npm run migrate');
  console.log('   4. Or use Supabase CLI: supabase db push');
  console.log('');
}

createMigration().catch(error => {
  console.error('Error creating migration:', error);
  process.exit(1);
});

