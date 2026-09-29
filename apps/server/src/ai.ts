import OpenAI from "openai";
import type { Config } from "./config.js";

export type PersonalCardRequest = { feeling: string; wish: string; style: "classic" | "lively" | "quiet"; locale: "zh-TW" | "en" };
export type PersonalCardResult = { title: string; message: string; style: string; provider: "demo" | "openai"; developmentFallback: boolean };

export async function generatePersonalCard(config: Config, input: PersonalCardRequest): Promise<PersonalCardResult> {
  if (config.AI_PROVIDER !== "openai" || !config.OPENAI_API_KEY) {
    const message = input.locale === "en"
      ? `Development demo — May ${input.wish} meet you gently while you are feeling ${input.feeling}.`
      : `開發示範（非 AI 生成）— 願你在${input.feeling}的此刻，溫柔地遇見${input.wish}。`;
    return { title: input.wish, message, style: input.style, provider: "demo", developmentFallback: true };
  }
  const client = new OpenAI({ apiKey: config.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: config.OPENAI_TEXT_MODEL,
    input: `Write one culturally respectful contemporary guardian-card blessing. Locale: ${input.locale}. Feeling: ${input.feeling}. Desired strength: ${input.wish}. Mood: ${input.style}. Return plain text only, at most 60 words; do not claim divination or religious authority.`,
    max_output_tokens: 120,
  });
  return { title: input.wish, message: response.output_text.trim(), style: input.style, provider: "openai", developmentFallback: false };
}
