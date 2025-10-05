'use server';
/**
 * @fileOverview An AI-driven flow to summarize educational content from various file types.
 *
 * - summarizeModule - A function that takes text content and provides a concise summary and generates audio.
 * - SummarizeModuleInput - The input type for the summarizeModule function.
 * - SummarizeModuleOutput - The return type for the summarizeModule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { textToSpeech } from './text-to-speech-flow';

const SummarizeModuleInputSchema = z.object({
  textContent: z.string().describe("The full text content extracted from a document (PDF, DOCX, etc.)."),
});
export type SummarizeModuleInput = z.infer<typeof SummarizeModuleInputSchema>;

const SummarizeModuleOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the provided text content.'),
  audioDataUri: z.string().describe('The generated audio of the summary as a base64-encoded data URI.'),
});
export type SummarizeModuleOutput = z.infer<typeof SummarizeModuleOutputSchema>;


export async function summarizeModule(input: SummarizeModuleInput): Promise<SummarizeModuleOutput> {
  return summarizeModuleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeModulePrompt',
  input: { schema: z.object({ textContent: z.string() }) },
  output: { schema: z.object({ summary: z.string() }) },
  prompt: `You are an expert academic assistant. Your task is to create a concise, easy-to-understand summary of the following educational material.

Focus on the key concepts, main arguments, and important definitions. The summary should be clear and well-structured, ideally using bullet points to highlight the most critical information.

Analyze the text below and generate a summary.

Content:
{{{textContent}}}
`,
});

const summarizeModuleFlow = ai.defineFlow(
  {
    name: 'summarizeModuleFlow',
    inputSchema: SummarizeModuleInputSchema,
    outputSchema: SummarizeModuleOutputSchema,
  },
  async ({ textContent }) => {
    // Step 1: Generate the summary
    const { output: summaryOutput } = await prompt({ textContent });
    if (!summaryOutput?.summary) {
        throw new Error("Failed to generate a summary for the content.");
    }
    const summary = summaryOutput.summary;

    // Step 2: Generate audio from the summary
    const { audioDataUri } = await textToSpeech({ text: summary });

    // Step 3: Return both
    return {
      summary,
      audioDataUri,
    };
  }
);
