
'use server';
/**
 * @fileOverview An AI-powered flow to extract multiple transaction details from an image.
 *
 * - extractTransactionsFromImage - A function that analyzes an image of a receipt or statement and returns structured transaction data.
 * - ExtractTransactionsInput - The input type for the extractTransactionsFromImage function.
 * - ExtractTransactionsOutput - The return type for the extractTransactionsFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ExtractTransactionsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a receipt or transaction history, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractTransactionsInput = z.infer<typeof ExtractTransactionsInputSchema>;


const TransactionSchema = z.object({
  description: z.string().describe("The description or merchant of the transaction. For personal transfers (like UPI), this should be the recipient's name."),
  amount: z.number().describe("The total amount of the transaction."),
  type: z.enum(['income', 'expense']).describe("The type of transaction (income or expense)."),
  category: z.string().describe("The most likely category. For personal transfers (like UPI), use the recipient's name as the category."),
});

const ExtractTransactionsOutputSchema = z.object({
    transactions: z.array(TransactionSchema).describe("The list of extracted transactions. If no transactions can be found, this should be an empty array.")
});

export type ExtractTransactionsOutput = z.infer<typeof ExtractTransactionsOutputSchema>;

export async function extractTransactionsFromImage(input: ExtractTransactionsInput): Promise<ExtractTransactionsOutput> {
  return extractTransactionsFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractTransactionsPrompt',
  input: {schema: ExtractTransactionsInputSchema},
  output: {schema: ExtractTransactionsOutputSchema},
  prompt: `You are an expert at extracting structured data from images of receipts or transaction histories.

Analyze the following image and extract all key transaction details for every transaction you find.

- The 'description' should be the name of the merchant or store.
- For personal payments like UPI, the 'description' should be the name of the person receiving the payment.
- The 'amount' should be the final total of the transaction.
- The 'type' should be 'expense' for payments made, and 'income' for money received.
- For 'category', make a reasonable guess based on the merchant (e.g., 'Groceries', 'Transport', 'Entertainment', 'Utilities', 'Salary', 'Other').
- For personal payments (like UPI), use the recipient's name as the 'category'. This is important for tracking payments to individuals.

If you cannot find any transactions in the image, return an empty array for the transactions.

Image: {{media url=photoDataUri}}`,
});

const extractTransactionsFromImageFlow = ai.defineFlow(
  {
    name: 'extractTransactionsFromImageFlow',
    inputSchema: ExtractTransactionsInputSchema,
    outputSchema: ExtractTransactionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
