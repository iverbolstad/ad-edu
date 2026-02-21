import { z } from "zod/v4";

export const vocabularyItemSchema = z.object({
  word: z.string(),
  translation: z.string(),
  example: z.string(),
});

export const comprehensionQuestionSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const generatedStorybookSchema = z.object({
  title: z.string(),
  story: z.string(),
  vocabulary: z.array(vocabularyItemSchema),
  questions: z.array(comprehensionQuestionSchema),
});
