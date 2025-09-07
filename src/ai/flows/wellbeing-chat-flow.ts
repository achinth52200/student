'use server';
/**
 * @fileOverview A personalized well-being chatbot.
 *
 * - wellbeingChat - A function that handles the chatbot conversation.
 * - WellbeingChatInput - The input type for the wellbeingChat function.
 * - WellbeingChatOutput - The return type for the wellbeingChat function.
 */

import {ai} from '@/ai/genkit';
import {generate, Message} from 'genkit';
import {z} from 'zod';

const WellbeingChatInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
    })
  ),
  message: z.string().describe('The user’s current message.'),
});
export type WellbeingChatInput = z.infer<typeof WellbeingChatInputSchema>;

const WellbeingChatOutputSchema = z.object({
  response: z.string().describe('The AI’s response to the user’s message.'),
});
export type WellbeingChatOutput = z.infer<typeof WellbeingChatOutputSchema>;

export async function wellbeingChat(
  input: WellbeingChatInput
): Promise<WellbeingChatOutput> {
  return wellbeingChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'wellbeingChatPrompt',
  system: `You are a personal health manager and mentor for students. Your goal is to provide supportive, empathetic, and encouraging guidance to help them maintain their mental and physical well-being.
Act as a mentor, offering concise, actionable advice.
When appropriate, use bullet points for clarity and ask clarifying questions to understand their needs better.
Remember the conversation history to provide contextual support.`,
});

const wellbeingChatFlow = ai.defineFlow(
  {
    name: 'wellbeingChatFlow',
    inputSchema: WellbeingChatInputSchema,
    outputSchema: WellbeingChatOutputSchema,
  },
  async input => {
    const history: Message[] = input.history.map(msg => ({
      role: msg.role,
      content: [{text: msg.content}],
    }));

    const {output} = await generate({
      model: ai.model,
      prompt: input.message,
      history,
      config: prompt.config,
    });
    
    if (!output) {
      return { response: "I'm sorry, I couldn't generate a response." };
    }

    return {
      response: output.text,
    };
  }
);
