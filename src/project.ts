import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join, parse } from 'node:path';

export interface ProjectResource {
    filepath: string;
    name: string;
}

export interface Project {
    root: string;
    resources: {
        components: ProjectResource[];
        pages: ProjectResource[];
        models: ProjectResource[];
        services: ProjectResource[];
    }
}

export default async function getProject(): Promise<Project> {
    try {
        const root = getProjectRoot();
        return {
            root,
            resources: {
                components: [],
                pages: [],
                models: [],
                services: []
            }
        };
    } catch (error) {
        // Not in an Angular project
        return {
            root: '',
            resources: {
                components: [],
                pages: [],
                models: [],
                services: []
            }
        };
    }
}

export function getProjectRoot(): string {
    let currentDir = process.cwd();
    
    while (currentDir !== parse(currentDir).root) {
        const angularJsonPath = join(currentDir, 'angular.json');
        if (existsSync(angularJsonPath)) {
            return currentDir;
        }
        currentDir = dirname(currentDir);
    }
    
    throw new Error('Could not find Angular project root (angular.json not found)');
}

export function createProjectResources(): void {
    const root = getProjectRoot();
    const appDir = join(root, 'src', 'app');
    
    const resourceDirs = ['components', 'pages', 'models', 'services'];
    
    for (const dir of resourceDirs) {
        const dirPath = join(appDir, dir);
        if (!existsSync(dirPath)) {
            mkdirSync(dirPath, { recursive: true });
        }
    }
}