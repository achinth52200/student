
'use server';
/**
 * @fileOverview AI-driven personalized tips generator using Groq.
 */

import { client } from '@/ai/claude';
import type { Transaction, Reminder } from '@/lib/types';

export type GeneratePersonalizedTipsInput = {
  transactions: Transaction[];
  reminders: Reminder[];
};

type Tip = {
  icon: 'PiggyBank' | 'GraduationCap' | 'HeartPulse' | 'Lightbulb';
  text: string;
};

export type GeneratePersonalizedTipsOutput = {
  tips: Tip[];
};

export async function generatePersonalizedTips(input: GeneratePersonalizedTipsInput): Promise<GeneratePersonalizedTipsOutput> {
  const transactionsList = input.transactions.map(t => `- ${t.description}: ${t.type} of RS ${t.amount} on ${t.date} (Category: ${t.category})`).join('\n') || '- No transactions available.';
  const remindersList = input.reminders.map(r => `- ${r.title} (Due: ${r.dueDate}, Completed: ${r.completed})`).join('\n') || '- No reminders available.';

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1024,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are a student success coach. Respond with valid JSON: {"tips": [{"icon": "PiggyBank"|"GraduationCap"|"HeartPulse"|"Lightbulb", "text": "..."}]}
Icons: PiggyBank=financial, GraduationCap=academic, HeartPulse=wellbeing, Lightbulb=productivity.`,
      },
      {
        role: 'user',
        content: `Generate 3-4 personalized, encouraging tips based on this student data:

Transactions:
${transactionsList}

Reminders:
${remindersList}`,
      },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error('AI failed to generate tips');
  }

  try {
    const parsed = JSON.parse(text);
    return { tips: parsed.tips || [] };
  } catch {
    throw new Error('Failed to parse AI tips response');
  }
}
