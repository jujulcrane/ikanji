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
      prompt: `Create one multiple-choice question based on at least 2 of these kanji: ${kanji.join(',')} to help me learn them. For example, in a question provide the Japanese sentence with kanji ommitted, for the student to complete the sentence. Focus on showing how the kanji are used in common phrases or with particles. Ensure the question is of intermediate difficulty. Provide 1 correct answer and 3 convincing incorrect answers. The structure should be:
  - question: The question text
  - correctAnswer: The correct answer kanji
  - incorrectOptions: An array of 3 incorrect kanji options
  - feedback: A short statement explaining why the correct answer is correct. Only in the feedback, provide the hiragana readings for any kanji in the structure of kanji(hiragana) - for example: ”新聞（しんぶん）.” Keep the feedback as brief as possible and do not mention the other options, only the correct answer.`,
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
