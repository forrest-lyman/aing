import { spawn } from 'node:child_process';

export interface AngularCliOptions {
  cwd?: string;
  stdio?: 'inherit' | 'pipe';
}

/**
 * Execute an Angular CLI command using spawn
 * @param command - The Angular CLI command (e.g., 'generate', 'new', 'serve')
 * @param args - Arguments for the command
 * @param options - Options for spawn
 * @returns Promise that resolves when command completes
 */
export async function runAngularCli(
  command: string,
  args: string[] = [],
  options: AngularCliOptions = {}
): Promise<void> {
  const { cwd = process.cwd(), stdio = 'inherit' } = options;

  return new Promise<void>((resolve, reject) => {
    const child = spawn('npx', ['-y', '@angular/cli@latest', command, ...args], {
      cwd,
      stdio,
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Angular CLI command '${command}' exited with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Generate an Angular component, service, or other schematic
 * @param type - The type to generate (component, service, module, etc.)
 * @param name - The name of the generated item
 * @param additionalArgs - Additional arguments (e.g., ['--skip-tests', '--flat'])
 * @param options - Options for spawn
 */
export async function generateAngular(
  type: string,
  name: string,
  additionalArgs: string[] = [],
  options: AngularCliOptions = {}
): Promise<void> {
  return runAngularCli('generate', [type, name, ...additionalArgs], options);
}

/**
 * Create a new Angular project
 * @param projectName - The name of the project
 * @param additionalArgs - Additional arguments (e.g., ['--routing', '--style=css'])
 * @param options - Options for spawn
 */
export async function createAngularProject(
  projectName: string,
  additionalArgs: string[] = [],
  options: AngularCliOptions = {}
): Promise<void> {
  return runAngularCli('new', [projectName, ...additionalArgs], options);
}