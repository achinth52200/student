
'use server';
/**
 * @fileOverview AI-powered receipt/transaction extraction using Groq vision model.
 */

import { client } from '@/ai/claude';

export type ExtractTransactionsInput = {
  photoDataUri: string;
};

export type ExtractTransactionsOutput = {
  transactions: {
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
  }[];
};

export async function extractTransactionsFromImage(input: ExtractTransactionsInput): Promise<ExtractTransactionsOutput> {
  const response = await client.chat.completions.create({
    model: 'llama-3.2-11b-vision-preview',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: input.photoDataUri,
            },
          },
          {
            type: 'text',
            text: `You are an expert at extracting structured data from images of receipts or transaction histories.

Analyze the image and extract all transaction details.
- description: merchant or store name (for UPI, use the person's name)
- amount: final total amount as a number
- type: "expense" for payments made, "income" for money received
- category: one of "Groceries", "Transport", "Entertainment", "Utilities", "Salary", "Other"

If no transactions found, return empty array.

Respond with ONLY valid JSON, no markdown, no code fences:
{"transactions": [{"description": "...", "amount": 0, "type": "expense", "category": "..."}]}`,
          },
        ],
      },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    return { transactions: [] };
  }

  try {
    // Try to extract JSON from the response (handle cases where model wraps in markdown)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { transactions: parsed.transactions || [] };
    }
    return { transactions: [] };
  } catch {
    return { transactions: [] };
  }
}
