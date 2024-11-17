import { generateObject, streamObject } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { NextApiRequest, NextApiResponse } from 'next';

const sentence = z.object({ 
  japanese: z.string(),
  english: z.string()
});

type Sentence = z.infer<typeof sentence>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Sentence[]>
) {
    const kanji = JSON.parse(req.body).kanji as string[];
   
    const { elementStream } = await streamObject({
      model: openai('gpt-4-turbo'),
      output: 'array',
      schema: sentence,
      prompt: `Generate 5 sentences in Japanese using ONLY the kanji ${kanji.join(", ")} in the sentence. Provide both the English and Japanese translations.`
    });

    const sentences: Sentence[] = [];

    for await (const sentence of elementStream) {
      sentences.push(sentence);
    }
    res.status(200).json(sentences);
}