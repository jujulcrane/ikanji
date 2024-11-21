import { generateObject, streamObject } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { NextApiRequest, NextApiResponse } from 'next';

const falseAnswer = z.string();

type FalseAnswer = z.infer<typeof falseAnswer>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FalseAnswer[]>
) {
  if (req.method !== 'POST') {
    res.status(405);
    return;
  }

  try
  {
    console.log('Request body:', req.body);
    const readings = req.body.readings as string[];
    console.log('Parsed readings:', readings);
   
    const { elementStream } = await streamObject({
      model: openai('gpt-4-turbo'),
      output: 'array',
      schema: falseAnswer,
      prompt: `Generate 5 potential kanji readings in Japanese, that do not include the readings ${readings.join(", ")}.`
    });
    console.log('Element stream initialized:', elementStream);

    const falseAnswers: FalseAnswer[] = [];

    for await (const falseAnswer of elementStream) {
      console.log('Received false answer:', falseAnswer);
      falseAnswers.push(falseAnswer);
    }
    res.status(200).json(falseAnswers);
  } catch (error) {
    res.status(500);
  }
}