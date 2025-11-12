#!/usr/bin/env node

import { prompt } from '../src/index.js';

const args = process.argv.slice(2);
const input = args.join(' ');

if (!input) {
  console.log('Usage: aing <command or phrase>');
  process.exit(1);
}

async function main() {
  await prompt(input);
}

main().then(() => console.log('completed'));