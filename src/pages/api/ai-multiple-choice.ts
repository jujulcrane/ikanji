import { streamObject } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { NextApiRequest, NextApiResponse } from 'next';

const aiMultipleChoice = z.object({
  question: z.string(),
  correctAnswer: z.string(),
  incorrectOptions: z.array(z.string()).min(3),
  feedback: z.string(),
});

type AIMultipleChoice = z.infer<typeof aiMultipleChoice>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AIMultipleChoice[] | { error: string }>
) {
  if (req.method !== 'POST') {
    res.status(405);
    return;
  }

  try {
    console.log('Request body:', req.body);
    const kanji = req.body.kanji as string[];
    console.log('Parsed kanji:', kanji);

    const { elementStream } = await streamObject({
      model: openai('gpt-4-turbo'),
      output: 'array',
      schema: aiMultipleChoice,
      prompt: `Create multiple choice questions based on these kanji: ${kanji.join(',')} to help me learn them. For example, in a question provide the Japanese sentence and ask which kanji completes the sentence. Focus on showing how the kanji are used in common phrases or with particles. Ensure the questions range from beginner to intermediate difficulty. Varry the questions. Provide 1 correct answer and 3 convincing incorrect answers, and give me 10 questions. For the feedback, make it be 1 short statment that explains why the correct answer is correct, including the hiragana reading for the kanji in parenthesis, for example "新聞（しんぶん)".`,
    });
    console.log('Element stream initialized:', elementStream);

    const questions: AIMultipleChoice[] = [];

    for await (const question of elementStream) {
      questions.push(question);
      console.log('Received question:', question);
    }
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error during processing:', error);
    res.status(500);
  }
}
