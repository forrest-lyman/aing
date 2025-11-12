import keytar from 'keytar';
import inquirer from 'inquirer';
import chalk from 'chalk';

const SERVICE = 'aing';
const ACCOUNT = 'openai';

/**
 * Returns a usable OpenAI API key for AING.
 * Priority:
 *  1. Saved in system keychain (keytar)
 *  2. OPENAI_API_KEY environment variable
 *  3. Prompt user for new key and store
 */
export async function getOpenAIKey(): Promise<string> {
  // 1. Check keytar first — silently succeed
  const stored = await keytar.getPassword(SERVICE, ACCOUNT);
  if (stored) return stored;

  // Show warning since we don't have a stored key
  console.log(chalk.yellow('\n  An OpenAI API key is required to use this tool'));
  console.log(chalk.blue('Create your API key at: https://platform.openai.com/api-keys\n'));

  // 2. Check environment variable
  const envKey = process.env.OPENAI_API_KEY;
  if (envKey) {
    const { useEnv } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useEnv',
        message: 'Use the existing OPENAI_API_KEY environment variable?',
        default: true,
      },
    ]);

    if (useEnv) {
      console.log(chalk.green('✓ API key saved securely to system keychain.\n'));
      // Optionally cache for next time
      await keytar.setPassword(SERVICE, ACCOUNT, envKey);
      return envKey;
    }
  }

  // 3. Prompt user for new key

  const { newKey } = await inquirer.prompt([
    {
      type: 'password',
      name: 'newKey',
      message: 'Enter your OpenAI API key:',
      mask: '*',
    },
  ]);

  console.log(chalk.green('✓ API key saved securely to system keychain.\n'));

  // 4. Save for future runs
  await keytar.setPassword(SERVICE, ACCOUNT, newKey);

  return newKey;
}
