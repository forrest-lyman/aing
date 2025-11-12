import chalk from "chalk";
import { plan, AgentPayload } from "./agent.js";
import getConfig from "./config/index.js";
import getProject from "./project.js";
import * as projectAgent from "./agents/project.js";

const agentMap: Record<string, (payload: AgentPayload) => Promise<AgentPayload>> = {
  project: projectAgent.agent,
};

export async function prompt(prompt: string) {
  const config = await getConfig();
  let project = await getProject();
  
  let payload: AgentPayload = { config, prompt, project };
  
  const planResult = await plan(payload);
  
  console.log(chalk.blue(`\nPlan: ${planResult.agents.length} agent(s) to execute\n`));
  
  for (const agentStep of planResult.agents) {
    console.log(chalk.blue(`→ Executing ${agentStep.agent} agent`));
    
    const agentFn = agentMap[agentStep.agent];
    if (!agentFn) {
      console.log(chalk.red(`✗ Agent '${agentStep.agent}' not found`));
      continue;
    }
    
    try {
      payload = await agentFn(payload);
      console.log(chalk.green(`✓ Completed ${agentStep.agent} agent\n`));
    } catch (error) {
      console.log(chalk.red(`✗ Error in ${agentStep.agent} agent`));
      throw error;
    }
  }
  
  console.log(chalk.green('✓ All agents completed successfully\n'));
}

