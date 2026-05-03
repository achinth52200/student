
'use server';
/**
 * @fileOverview A personalized well-being chatbot using Groq.
 */

import { client } from '@/ai/claude';

export type WellbeingChatInput = {
  history: { role: 'user' | 'model'; content: string }[];
  message: string;
};

export type WellbeingChatOutput = {
  response: string;
};

export async function wellbeingChat(input: WellbeingChatInput): Promise<WellbeingChatOutput> {
  // Convert history to OpenAI format (model -> assistant)
  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    {
      role: 'system',
      content: `You are a personal health manager and mentor for students. Your role is to be a responsive, empathetic, and encouraging student motivator and health advisor. Your goal is to provide supportive guidance to help them maintain their mental and physical well-being.
- Act as a mentor, offering concise, actionable advice.
- When they talk about their studies, motivate them.
- When they talk about their health, give them sound advice.
- When appropriate, use bullet points for clarity.
- Ask clarifying questions to better understand their needs.
- Remember the conversation history to provide contextual support and track their progress.
- Keep your responses encouraging and positive.`,
    },
  ];

  // Add history
  for (const msg of input.history) {
    messages.push({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.content,
    });
  }

  // Add current message
  messages.push({ role: 'user', content: input.message });

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1024,
    messages,
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    return { response: "I'm sorry, I couldn't generate a response." };
  }

  return { response: text };
}
