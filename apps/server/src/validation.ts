import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const cardInputSchema = z.object({
  zh: z.string().trim().min(1).max(1000),
  en: z.string().trim().min(1).max(1000),
  imagePrompt: z.string().trim().max(2000).nullable().optional(),
  imageUrl: z.string().url().max(4000).nullable().optional(),
  content: z.object({
    name: z.object({ "zh-TW": z.string().min(1), en: z.string().min(1) }),
    epithet: z.object({ "zh-TW": z.string().min(1), en: z.string().min(1) }),
    keywords: z.object({ "zh-TW": z.array(z.string()).min(1), en: z.array(z.string()).min(1) }),
    blessing: z.object({ "zh-TW": z.string().min(1), en: z.string().min(1) }),
    story: z.object({ "zh-TW": z.string().min(1), en: z.string().min(1) }),
    palette: z.enum(["vermilion", "jade", "gold", "indigo"]),
  }).optional(),
});

export const generateBatchSchema = z.object({ cards: z.array(cardInputSchema).length(50) });

export function validateBody<T>(schema: z.ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: "validation_error", issues: result.error.issues });
    req.body = result.data;
    next();
  };
}
