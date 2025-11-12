import { Project } from "./config/project.js";

export interface AgentPayload {
    prompt: string;
    config: {
        apiKey: string
    }
    project: Project
}