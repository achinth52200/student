'use server';
/**
 * @fileOverview A personalized well-being chatbot.
 *
 * - wellbeingChat - A function that handles the chatbot conversation.
 * - WellbeingChatInput - The input type for the wellbeingChat function.
 * - WellbeingChatOutput - The return type for the wellbeingChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {generate, Message, Role} from 'genkit';

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
  response: z
    .string()
    .describe('The AI’s response to the user’s message.'),
});
export type WellbeingChatOutput = z.infer<typeof WellbeingChatOutputSchema>;

export async function wellbeingChat(
  input: WellbeingChatInput
): Promise<WellbeingChatOutput> {
  return wellbeingChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'wellbeingChatPrompt',
  system: `You are an AI assistant designed to provide personalized feedback and support to students for maintaining their mental and physical well-being.
Your tone should be supportive, empathetic, and encouraging.
Keep your responses concise and actionable.
When appropriate, use bullet points to make your suggestions clear and easy to follow.
Ask clarifying questions to better understand the user's situation.
You are having a conversation, so remember the context of previous messages.`,
});

const wellbeingChatFlow = ai.defineFlow(
  {
    name: 'wellbeingChatFlow',
    inputSchema: WellbeingChatInputSchema,
    outputSchema: WellbeingChatOutputSchema,
  },
  async input => {
    const history: Message[] = input.history.map(msg => ({
      role: msg.role as Role,
      content: [{text: msg.content}],
    }));

    const {output} = await ai.generate({
      prompt: input.message,
      model: ai.model,
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
