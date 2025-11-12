import { getOpenAIKey } from "./openai-key.js";

export default async function getConfig() {
  const apiKey = await getOpenAIKey();
  return {
    apiKey
  }
}