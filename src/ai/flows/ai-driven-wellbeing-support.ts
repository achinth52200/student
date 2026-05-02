
'use server';
/**
 * @fileOverview An AI-driven well-being support agent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiDrivenWellbeingSupportInputSchema = z.object({
  stressLevel: z.number(),
  emotionalRegulation: z.string(),
  physicalActivity: z.string(),
  sleepQuality: z.string(),
  studyHours: z.number(),
});
export type AiDrivenWellbeingSupportInput = z.infer<typeof AiDrivenWellbeingSupportInputSchema>;

const AiDrivenWellbeingSupportOutputSchema = z.object({
  feedback: z.string().describe('Personalized feedback and support suggestions.'),
});
export type AiDrivenWellbeingSupportOutput = z.infer<typeof AiDrivenWellbeingSupportOutputSchema>;

export async function provideAiDrivenWellbeingSupport(input: AiDrivenWellbeingSupportInput): Promise<AiDrivenWellbeingSupportOutput> {
  return aiDrivenWellbeingSupportFlow(input);
}

const aiDrivenWellbeingSupportFlow = ai.defineFlow(
  {
    name: 'aiDrivenWellbeingSupportFlow',
    inputSchema: AiDrivenWellbeingSupportInputSchema,
    outputSchema: AiDrivenWellbeingSupportOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: `You are an AI assistant designed to provide personalized feedback and support to students for maintaining their mental and physical well-being.

        Based on the following information provided by the student, offer specific and actionable suggestions.

        Stress Level (1-10): ${input.stressLevel}
        Emotional State: ${input.emotionalRegulation}
        Physical Activity: ${input.physicalActivity}
        Sleep Quality: ${input.sleepQuality}
        Study Hours: ${input.studyHours}

        Provide feedback that is tailored to the student's situation.
        Keep the feedback concise and to the point, ideally in 2-3 sentences.
        Offer support and encouragement to help them stay balanced during their studies.
        `,
        output: {
            schema: AiDrivenWellbeingSupportOutputSchema
        }
    });

    if (!output) {
      throw new Error("AI failed to generate feedback");
    }

    return output;
  }
);
