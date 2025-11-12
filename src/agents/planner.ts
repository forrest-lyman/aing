import * as projectAgent from './project.js';

export interface PlanPayload{
    config: {
        apiKey: string
    };
    prompt: string
}
export default async function plan(payload: PlanPayload) {
    return {
        plan: [
            payload.prompt
        ]
    }
}

const prompt = `

`