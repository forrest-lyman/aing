import getConfig from "./config/index.js";
import { getOpenAIKey } from "./config/openai-key.js";
import planner from "./agents/planner.js";

export async function prompt(prompt: string) {
  const config = await getConfig();
  const plan = await planner({config, prompt});
  console.log(plan);
}

