
'use server';
/**
 * @fileOverview An AI-driven flow to summarize educational content from various file types.
 *
 * - summarizeModule - A function that takes a file's data URI and provides a detailed summary and generates audio.
 * - SummarizeModuleInput - The input type for the summarizeModule function.
 * - SummarizeModuleOutput - The return type for the summarizeModule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { textToSpeech } from './text-to-speech-flow';

const SummarizeModuleInputSchema = z.object({
  fileDataUri: z.string().describe("A data URI of the document (PDF, DOCX, etc.) to be summarized. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type SummarizeModuleInput = z.infer<typeof SummarizeModuleInputSchema>;

const SummarizeModuleOutputSchema = z.object({
  summary: z.string().describe('A detailed summary of the provided text content.'),
  audioDataUri: z.string().describe('The generated audio of the summary as a base64-encoded data URI.'),
});
export type SummarizeModuleOutput = z.infer<typeof SummarizeModuleOutputSchema>;


export async function summarizeModule(input: SummarizeModuleInput): Promise<SummarizeModuleOutput> {
  return summarizeModuleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeModulePrompt',
  input: { schema: z.object({ fileDataUri: z.string() }) },
  output: { schema: z.object({ summary: z.string() }) },
  prompt: `You are an expert academic assistant. Your task is to create a comprehensive and detailed summary of the following educational material from the provided file.

Focus on the key concepts, main arguments, and important definitions. The summary should be clear and well-structured, using bullet points to highlight the most critical information.

Analyze the document below and generate a detailed summary.

Document: {{media url=fileDataUri}}
`,
});

const summarizeModuleFlow = ai.defineFlow(
  {
    name: 'summarizeModuleFlow',
    inputSchema: SummarizeModuleInputSchema,
    outputSchema: SummarizeModuleOutputSchema,
  },
  async ({ fileDataUri }) => {
    // Step 1: Generate the summary from the document
    const { output: summaryOutput } = await prompt({ fileDataUri });
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
