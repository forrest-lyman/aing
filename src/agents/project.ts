import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { AgentPayload } from "../agent.js";
import { getProjectRoot } from '../config/project.js';

export interface ProjectPayload extends AgentPayload {

}

export const metadata = {
    name: 'Project agent',
    description: 'Generates a new Angular project'
}

export async function agent(payload: ProjectPayload) {
    const {project} = payload;

    const spinner = ora('Checking for Angular project...').start();

    try {
        const root = getProjectRoot();
        spinner.succeed(chalk.green(`Found existing Angular project at: ${root}`));
        
        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Do you want to create a new subproject in this Angular workspace?',
                default: false
            }
        ]);

        if (!confirm) {
            console.log(chalk.yellow('Project creation cancelled'));
            process.exit(0);
        }

        return root;
    } catch (error) {
        spinner.warn(chalk.yellow('No existing Angular project found'));
        console.log(chalk.blue('Creating a new Angular project...'));
        // Will create new project
        return null;
    }
}