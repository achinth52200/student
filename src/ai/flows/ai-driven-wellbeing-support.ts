
'use server';
/**
 * @fileOverview An AI-driven well-being support agent that monitors stress levels and emotional regulation based on user inputs.
 *
 * - provideAiDrivenWellbeingSupport - A function that provides AI-driven personalized feedback and support for maintaining mental and physical well-being.
 * - AiDrivenWellbeingSupportInput - The input type for the provideAiDrivenWellbeingSupport function.
 * - AiDrivenWellbeingSupportOutput - The return type for the provideAiDrivenWellbeingSupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiDrivenWellbeingSupportInputSchema = z.object({
  stressLevel: z
    .number()
    .describe('The current stress level of the student (1-10).'),
  emotionalRegulation: z
    .string()
    .describe(
      'Description of the student’s current emotional state and regulation strategies.'
    ),
  physicalActivity: z
    .string()
    .describe(
      'The description of physical activities performed by the student, including frequency and duration.'
    ),
  sleepQuality: z
    .string()
    .describe('The description of the sleep quality of the student.'),
  studyHours: z
    .number()
    .describe('The number of hours the student spent studying today.'),
});
export type AiDrivenWellbeingSupportInput = z.infer<
  typeof AiDrivenWellbeingSupportInputSchema
>;

const AiDrivenWellbeingSupportOutputSchema = z.object({
  feedback: z.string().describe('Personalized feedback and support suggestions.'),
});
export type AiDrivenWellbeingSupportOutput = z.infer<
  typeof AiDrivenWellbeingSupportOutputSchema
>;

export async function provideAiDrivenWellbeingSupport(
  input: AiDrivenWellbeingSupportInput
): Promise<AiDrivenWellbeingSupportOutput> {
  return aiDrivenWellbeingSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDrivenWellbeingSupportPrompt',
  input: { schema: AiDrivenWellbeingSupportInputSchema },
  output: { schema: AiDrivenWellbeingSupportOutputSchema },
  prompt: `You are an AI assistant designed to provide personalized feedback and support to students for maintaining their mental and physical well-being.

  Based on the following information provided by the student, offer specific and actionable suggestions to help them manage stress, improve emotional regulation, and promote overall well-being.

  Stress Level (1-10): {{{stressLevel}}}
  Emotional Regulation Description: {{{emotionalRegulation}}}
  Physical Activity: {{{physicalActivity}}}
  Sleep Quality: {{{sleepQuality}}}
  Study Hours: {{{studyHours}}}

  Provide feedback that is tailored to the student's situation, encouraging them to adopt healthy habits and coping mechanisms.
  Keep the feedback concise and to the point, ideally in 2-3 sentences.
  Consider their study hours and suggest appropriate breaks and relaxation techniques.
  Suggest improvements for sleep quality, physical activity, and emotional regulation, providing concrete steps they can take.
  Offer support and encouragement to help them stay balanced during their studies.
  `,
});

const aiDrivenWellbeingSupportFlow = ai.defineFlow(
  {
    name: 'aiDrivenWellbeingSupportFlow',
    inputSchema: AiDrivenWellbeingSupportInputSchema,
    outputSchema: AiDrivenWellbeingSupportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
