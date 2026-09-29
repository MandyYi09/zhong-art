import { describe, expect, it } from "vitest";
import { generateBatchSchema } from "./validation.js";

const card = { zh: "你好", en: "hello" };
describe("generateBatchSchema", () => {
  it("requires exactly fifty bilingual cards", () => {
    expect(generateBatchSchema.safeParse({ cards: Array.from({ length: 50 }, () => card) }).success).toBe(true);
    expect(generateBatchSchema.safeParse({ cards: Array.from({ length: 49 }, () => card) }).success).toBe(false);
    expect(generateBatchSchema.safeParse({ cards: Array.from({ length: 51 }, () => card) }).success).toBe(false);
  });
  it("rejects missing language text", () => {
    expect(generateBatchSchema.safeParse({ cards: Array.from({ length: 50 }, () => ({ zh: "你好", en: "" })) }).success).toBe(false);
  });
});
