import { z } from "zod";
import { Project } from "./project.js";
import { agentMetadata } from "./agents/index.js";
import { getData } from "./clients/ai.js";

export interface AgentPayload {
  prompt: string;
  config: { apiKey: string };
  project: Project;
}

export interface AgentMetadata {
  name: string;
  filepath: string;
  match: string;
}

// ---- Define the schema ----
const SingleAgentSchema = z.object({
  agent: z.string(),
  reasoning: z.string(),
});

const PlanSchema = z.object({
  agents: z.array(SingleAgentSchema),
});

export type Plan = z.infer<typeof PlanSchema>;

export async function plan(payload: AgentPayload): Promise<Plan> {
  // If not in a project, return project agent only
  if (!payload.project.root) {
    return {
      agents: [
        {
          agent: "project",
          reasoning: "Not in an Angular project, need to create or set up project first"
        }
      ]
    };
  }

  const agentList = agentMetadata
    .map(a => `- ${a.name}: ${a.match}`)
    .join("\n");

  const systemPrompt = `
You are the AING planner.
Your job is to interpret the user's request and decide which agent(s) should handle it.

Available agents:
${agentList}

Return a structured JSON object with this shape:
{
  "agents": [
    { "agent": string, "reasoning": string }
  ]
}
`;

  return getData(
    {
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: payload.prompt },
      ],
    },
    PlanSchema,
    payload.config.apiKey
  );
}
