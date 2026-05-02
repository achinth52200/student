
'use server';
/**
 * @fileOverview An AI-powered flow to extract multiple transaction details from an image.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTransactionsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a receipt or transaction history, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractTransactionsInput = z.infer<typeof ExtractTransactionsInputSchema>;


const TransactionSchema = z.object({
  description: z.string().describe("The description or merchant of the transaction."),
  amount: z.number().describe("The total amount of the transaction."),
  type: z.enum(['income', 'expense']).describe("The type of transaction (income or expense)."),
  category: z.string().describe("The most likely category."),
});

const ExtractTransactionsOutputSchema = z.object({
    transactions: z.array(TransactionSchema).describe("The list of extracted transactions."),
});

export type ExtractTransactionsOutput = z.infer<typeof ExtractTransactionsOutputSchema>;

export async function extractTransactionsFromImage(input: ExtractTransactionsInput): Promise<ExtractTransactionsOutput> {
  return extractTransactionsFromImageFlow(input);
}

const extractTransactionsFromImageFlow = ai.defineFlow(
  {
    name: 'extractTransactionsFromImageFlow',
    inputSchema: ExtractTransactionsInputSchema,
    outputSchema: ExtractTransactionsOutputSchema,
  },
  async ({ photoDataUri }) => {
    const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: [
            {
                text: `You are an expert at extracting structured data from images of receipts or transaction histories.

Analyze the following image and extract all key transaction details for every transaction you find.

- The 'description' should be the name of the merchant or store.
- For personal payments like UPI, the 'description' should be the name of the person receiving the payment.
- The 'amount' should be the final total of the transaction.
- The 'type' should be 'expense' for payments made, and 'income' for money received.
- For 'category', make a reasonable guess based on the merchant (e.g., 'Groceries', 'Transport', 'Entertainment', 'Utilities', 'Salary', 'Other').

If you cannot find any transactions in the image, return an empty array for the transactions.`,
            },
            { media: { url: photoDataUri} },
        ],
        output: {
            schema: ExtractTransactionsOutputSchema,
        },
    });

    if (!output) {
      return { transactions: [] };
    }

    return output;
  }
);
