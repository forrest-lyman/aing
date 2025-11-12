import OpenAI from "openai";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

export async function getData<T extends z.ZodType>(
  body: ChatCompletionCreateParamsNonStreaming,
  schema: T,
  apiKey: string
): Promise<z.infer<T>> {
  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    ...body,
    model: body.model ?? "gpt-5-mini",
    max_completion_tokens: body.max_completion_tokens ?? 4096,
    response_format: zodResponseFormat(schema, "response_schema"),
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty model response");

  return schema.parse(JSON.parse(raw));
}