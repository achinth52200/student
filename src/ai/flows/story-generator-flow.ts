
'use server';
/**
 * @fileOverview An AI-driven flow to generate a story with a cover image.
 *
 * - generateStory - A function that provides a story and cover image based on a prompt.
 * - StoryGeneratorInput - The input type for the generateStory function.
 * - StoryGeneratorOutput - The return type for the generateStory function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const StoryGeneratorInputSchema = z.object({
  prompt: z.string().describe('The user prompt for the story.'),
});
export type StoryGeneratorInput = z.infer<typeof StoryGeneratorInputSchema>;

const StoryGeneratorOutputSchema = z.object({
  title: z.string().describe('The title of the story.'),
  story: z.string().describe('The generated story.'),
  coverImage: z.string().describe('The data URI for the generated cover image.'),
});
export type StoryGeneratorOutput = z.infer<typeof StoryGeneratorOutputSchema>;

export async function generateStory(input: StoryGeneratorInput): Promise<StoryGeneratorOutput> {
  return storyGeneratorFlow(input);
}

const storyGeneratorFlow = ai.defineFlow(
  {
    name: 'storyGeneratorFlow',
    inputSchema: StoryGeneratorInputSchema,
    outputSchema: StoryGeneratorOutputSchema,
  },
  async ({ prompt }) => {
    
    // Generate Story and Title
    const storyPrompt = ai.definePrompt({
        name: 'storyGenerationPrompt',
        prompt: `Based on the following prompt, write a short, engaging story. Also, give it a suitable title.
        Prompt: {{{prompt}}}
        `,
        output: {
            schema: z.object({
                title: z.string().describe('The title of the story.'),
                story: z.string().describe('The generated story.'),
            }),
        },
    });

    const storyResult = await storyPrompt({ prompt });
    const { title, story } = storyResult.output!;

    // Generate Cover Image
    const imageResult = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a visually appealing, artistic cover image for a story with the following title and plot.
      Title: ${title}
      Story: ${story}`,
    });

    const coverImage = imageResult.media.url;
    
    return {
      title,
      story,
      coverImage,
    };
  }
);
