#!/usr/bin/env node

import { prompt } from '../src/index.js';

const args = process.argv.slice(2);
const input = args.join(' ');

if (!input) {
  console.log('Usage: aing <command or phrase>');
  process.exit(1);
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\nOperation cancelled');
  process.exit(0);
});

async function main() {
  try {
    await prompt(input);
    console.log('completed');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

main();