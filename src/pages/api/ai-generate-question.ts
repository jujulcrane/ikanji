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
    const { kanji, randomTheme } = req.body as {
      kanji: string[];
      randomTheme: string;
    };

    if (!kanji || kanji.length === 0 || !randomTheme) {
      return res.status(400).json({
        error:
          'Invalid request. Ensure "kanji" and "randomTheme" are provided.',
      });
    }

    console.log('Parsed kanji:', kanji, 'Parsed theme:', randomTheme);

    const prompt = `
Randomly select 2 kanji from the provided list: ${kanji.join(',')}.
Theme: ${randomTheme}.
Using the selected kanji, create a unique intermediate-level multiple-choice question. The question should:

- Present a natural sentence related to the theme, with proper grammar and particle usage.
- Include a "fill-in-the-blank" format where the blank represents one of the selected kanji.
- In only the question sentence, use hiragana readings in parentheses (e.g., 学校(がっこう)) for all kanji not included in the provided list. Kanji from the list should appear without readings.
- Focus on showcasing the kanji's meaning or usage in real-life or thematic contexts.
- Provide 1 correct kanji to complete the sentence and 3 convincing, plausible incorrect options.

Output format:
- **question**: A complete Japanese sentence containing a blank for the correct kanji.
- **correctAnswer**: The kanji that correctly completes the sentence.
- **incorrectOptions**: An array of 3 plausible but incorrect kanji choices.
- **feedback**: A concise English explanation of why the correct kanji fits the sentence, including its reading in the format "kanji(hiragana)". Do not mention incorrect options. Example: "新聞(しんぶん) means 'newspaper,' fitting the context of reading daily news."

Additional Guidelines:
- Vary sentence structures, grammar points, and contexts with each call to avoid repetition.
- Avoid generic phrases; tailor sentences to the selected theme.
- Ensure incorrect kanji options are plausible but clearly incorrect based on grammar, meaning, or context.
- The question should be challenging but appropriate for an intermediate learner.
`;

    const { elementStream } = await streamObject({
      model: openai('gpt-4-turbo'),
      output: 'array',
      schema: aiMultipleChoice,
      prompt,
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
