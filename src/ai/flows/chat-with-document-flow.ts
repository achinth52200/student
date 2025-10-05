'use server';
/**
 * @fileOverview A flow to enable interactive chat with an uploaded document.
 *
 * - chatWithDocument - A function that handles the conversation with the document.
 */

import { ai } from '@/ai/genkit';
import { generate, Message } from 'genkit';
import { z } from 'zod';

const ChatWithDocumentInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
    })
  ),
  message: z.string().describe('The user’s current question about the document.'),
  documentDataUri: z.string().describe('The document content as a data URI.'),
});

export type ChatWithDocumentInput = z.infer<typeof ChatWithDocumentInputSchema>;

const ChatWithDocumentOutputSchema = z.object({
  response: z.string().describe('The AI’s answer based on the document.'),
});

export type ChatWithDocumentOutput = z.infer<
  typeof ChatWithDocumentOutputSchema
>;

export async function chatWithDocument(
  input: ChatWithDocumentInput
): Promise<ChatWithDocumentOutput> {
  return chatWithDocumentFlow(input);
}

const chatWithDocumentFlow = ai.defineFlow(
  {
    name: 'chatWithDocumentFlow',
    inputSchema: ChatWithDocumentInputSchema,
    outputSchema: ChatWithDocumentOutputSchema,
  },
  async ({ history, message, documentDataUri }) => {
    const historyMessages: Message[] = history.map((msg) => ({
      role: msg.role,
      content: [{ text: msg.content }],
    }));

    const systemPrompt = `You are an expert academic assistant. Your task is to answer questions based *exclusively* on the content of the provided document.
- Do not use any external knowledge.
- If the answer is not found in the document, you must state that "The answer is not available in this document."
- Be thorough and quote relevant parts of the document to support your answer where appropriate.

Here is the document:
{{media url=documentDataUri}}
`;

    const { output } = await generate({
      model: ai.model,
      prompt: message,
      history: historyMessages,
      system: systemPrompt,
      // Pass the document URI to the prompt template
      context: { documentDataUri },
    });

    if (!output) {
      return { response: "I'm sorry, I couldn't generate a response." };
    }

    return {
      response: output.text,
    };
  }
);
