import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MIGRATIONS_DIR = join(__dirname, '..', 'supabase', 'migrations');
const OUTPUT_FILE = join(__dirname, '..', 'ALL_MIGRATIONS.sql');

async function combineMigrations() {
  console.log('📋 Combining all migration files...\n');

  const files = await readdir(MIGRATIONS_DIR);
  const migrationFiles = files
    .filter(f => f.endsWith('.sql') && f.match(/^\d+_/))
    .sort()
    .map(f => ({ name: f, path: join(MIGRATIONS_DIR, f) }));

  let combined = `-- ShopSync Database Migrations
-- Combined file for easy execution in Supabase SQL Editor
-- Run this entire file in one go: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/sql
-- Generated: ${new Date().toISOString()}

`;

  migrationFiles.forEach((file, index) => {
    console.log(`📄 Adding: ${file.name}`);
    const content = readFileSync(file.path, 'utf8');
    combined += `\n-- ========================================\n`;
    combined += `-- Migration ${index + 1}: ${file.name}\n`;
    combined += `-- ========================================\n\n`;
    combined += content;
    combined += `\n\n`;
  });

  writeFileSync(OUTPUT_FILE, combined, 'utf8');

  console.log(`\n✅ Combined migration file created: ${OUTPUT_FILE}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Open: https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/sql`);
  console.log(`   2. Click "+ New query"`);
  console.log(`   3. Open the file: ${OUTPUT_FILE}`);
  console.log(`   4. Copy all contents and paste into SQL Editor`);
  console.log(`   5. Click "Run" (or press Cmd/Ctrl + Enter)`);
  console.log(`   6. Wait for "Success" message\n`);
}

combineMigrations().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

