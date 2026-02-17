#!/usr/bin/env node

/**
 * Password Hashing Utility
 * Generates bcrypt hashes for admin passwords
 * Usage: npm run hash-password
 */

const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔐 Password Hashing Utility for The Henry');
console.log('='.repeat(50));
console.log('\nThis utility generates bcrypt hashes for your admin password.');
console.log('The hash output should be stored in HASHED_ADMIN_PASSWORD env var.\n');

rl.question('Enter admin password (will be hidden): ', async (password) => {
  if (!password || password.trim().length === 0) {
    console.error('\n❌ Error: Password cannot be empty');
    rl.close();
    process.exit(1);
  }

  try {
    console.log('\n⏳ Generating bcrypt hash (this may take a moment)...\n');
    
    // Generate hash with salt rounds 10 (default, good balance)
    const hash = await bcrypt.hash(password, 10);
    
    console.log('✅ Hash generated successfully!\n');
    console.log('Add this to your .env file:');
    console.log('-'.repeat(50));
    console.log(`HASHED_ADMIN_PASSWORD=${hash}`);
    console.log('-'.repeat(50));
    console.log('\n💡 To verify the hash matches your password later:');
    console.log('   bcrypt.compare("yourpassword", hash)\n');
    
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error generating hash:', error.message);
    rl.close();
    process.exit(1);
  }
});
