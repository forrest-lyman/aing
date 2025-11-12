import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { AgentPayload } from "../agent.js";
import { getProjectRoot, createProjectResources } from '../project.js';
import { getData } from '../clients/ai.js';
import { createAngularProject } from '../clients/angular.js';

export interface ProjectPayload extends AgentPayload {

}

export const metadata = {
    name: 'Project agent',
    description: 'Generates a new Angular project',
    match: 'Determine if the user wants to create a new project'
}

export async function agent(payload: ProjectPayload): Promise<ProjectPayload> {
    const { project } = payload;

    // Determine if the current directory is empty
    const currentDir = process.cwd();
    const files = readdirSync(currentDir);
    const isEmptyDir = files.length === 0 || (files.length === 1 && files[0] === '.git');

    if (!isEmptyDir) {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Current directory is not empty. What would you like to do?',
                choices: [
                    { name: 'Create project in a subdirectory', value: 'subproject' },
                    { name: 'Create project in current directory', value: 'current' },
                    { name: 'Cancel', value: 'cancel' }
                ]
            }
        ]);

        if (action === 'cancel') {
            console.log(chalk.yellow('Operation cancelled'));
            process.exit(0);
        }

        if (action === 'current') {
            const { confirm } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: 'This will create Angular project files in the current directory. Continue?',
                    default: false
                }
            ]);

            if (!confirm) {
                console.log(chalk.yellow('Operation cancelled'));
                process.exit(0);
            }
        }
    }

    // Use getData to figure out the name of the project
    const ProjectNameSchema = z.object({
        projectName: z.string().describe('A kebab-case project name derived from the user\'s request'),
        reasoning: z.string().describe('Why this name was chosen')
    });

    const spinner = ora('Planning project...').start();
    
    const nameData = await getData(
        {
            model: "gpt-5-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an Angular project naming assistant. Generate a kebab-case project name based on the user's request. The name should be descriptive, follow Angular naming conventions, and be lowercase with hyphens."
                },
                {
                    role: "user",
                    content: payload.prompt
                }
            ]
        },
        ProjectNameSchema,
        payload.config.apiKey
    );

    spinner.stop();

    // Confirm the project name with the user
    const { projectName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'Project name:',
            default: nameData.projectName,
            validate: (input: string) => {
                if (!/^[a-z][a-z0-9-]*$/.test(input)) {
                    return 'Project name must be kebab-case (lowercase, start with a letter, hyphens allowed)';
                }
                return true;
            }
        }
    ]);

    // Generate and execute Angular CLI command
    console.log(chalk.blue('\nCreating Angular project...\n'));
    
    try {
        await createAngularProject(projectName, [], { cwd: currentDir });
        
        const projectPath = join(currentDir, projectName);
        
        console.log(chalk.green(`\n✓ Generated Angular project at ${projectPath}`));

        // Create project resources
        const spinner = ora('Setting up project structure...').start();
        process.chdir(projectPath);
        createProjectResources();
        spinner.succeed(chalk.green('Project structure created'));

        console.log(chalk.blue('\nNext steps:'));
        console.log(chalk.white(`  cd ${projectName}`));
        console.log(chalk.white('  ng serve'));

    } catch (error) {
        console.log(chalk.red('✗ Failed to create Angular project'));
        if (error instanceof Error) {
            console.error(chalk.red(error.message));
        }
        process.exit(1);
    }

    return {
        ...payload
    };

}