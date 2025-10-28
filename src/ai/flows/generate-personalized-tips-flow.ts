
'use server';
/**
 * @fileOverview An AI-driven flow to generate personalized tips for students based on their dashboard data.
 *
 * - generatePersonalizedTips - A function that provides tips based on financial status, reminders, and well-being.
 * - GeneratePersonalizedTipsInput - The input type for the generatePersonalizedTips function.
 * - GeneratePersonalizedTipsOutput - The return type for the generatePersonalizedTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import type {Transaction, Reminder} from '@/lib/types';

const TransactionSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.number(),
  type: z.enum(['income', 'expense']),
  category: z.string(),
  date: z.string(),
  status: z.enum(['Completed', 'Pending', 'Failed']),
});

const ReminderSchema = z.object({
    id: z.string(),
    title: z.string(),
    dueDate: z.string(),
    completed: z.boolean(),
});

const GeneratePersonalizedTipsInputSchema = z.object({
  transactions: z.array(TransactionSchema).describe("The user's recent financial transactions."),
  reminders: z.array(ReminderSchema).describe("The user's current reminders."),
});

export type GeneratePersonalizedTipsInput = z.infer<typeof GeneratePersonalizedTipsInputSchema>;

const TipSchema = z.object({
  icon: z.enum(["PiggyBank", "GraduationCap", "HeartPulse", "Lightbulb"]),
  text: z.string(),
});

const GeneratePersonalizedTipsOutputSchema = z.object({
  tips: z.array(TipSchema).describe('A list of 3-4 personalized, actionable tips for the student.'),
});

export type GeneratePersonalizedTipsOutput = z.infer<typeof GeneratePersonalizedTipsOutputSchema>;

export async function generatePersonalizedTips(input: GeneratePersonalizedTipsInput): Promise<GeneratePersonalizedTipsOutput> {
  return generatePersonalizedTipsFlow(input);
}

const promptText = `You are a student success coach. Your goal is to provide supportive, actionable, and personalized tips to a student based on their recent activity.

Analyze the following data:
- Financial transactions
- Pending reminders

Based on this data, generate 3-4 concise, helpful, and encouraging tips. Each tip must be assigned an appropriate icon.

Here are the available icons and their meanings:
- PiggyBank: For financial advice (budgeting, saving, etc.).
- GraduationCap: For academic or study-related advice.
- HeartPulse: For well-being, stress management, or health.
- Lightbulb: For general productivity or other helpful ideas.

User's Transactions:
{{#each transactions}}
- {{description}}: {{type}} of RS {{amount}} on {{date}} (Category: {{category}})
{{else}}
- No transactions available.
{{/each}}

User's Reminders:
{{#each reminders}}
- {{title}} (Due: {{dueDate}}, Completed: {{completed}})
{{else}}
- No reminders available.
{{/each}}

Here are some examples of good tips:
- If expenses are high: "Your expenses seem a bit high. Try creating a weekly budget to track spending and find areas to save." (Icon: PiggyBank)
- If many tasks are pending: "You have a few tasks coming up. Try the Pomodoro Technique: study for 25 mins, then take a 5-min break to stay focused." (Icon: GraduationCap)
- If there are no recent well-being checks: "Remember to check in with your well-being. A few minutes of mindfulness can make a big difference." (Icon: HeartPulse)

Generate a list of tips that are directly relevant to the user's provided data.
`;

const generatePersonalizedTipsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedTipsFlow',
    inputSchema: GeneratePersonalizedTipsInputSchema,
    outputSchema: GeneratePersonalizedTipsOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      prompt: promptText,
      input,
      output: {
        schema: GeneratePersonalizedTipsOutputSchema,
      },
    });
    return output!;
  }
);
