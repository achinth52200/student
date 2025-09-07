'use server';
/**
 * @fileOverview An AI-powered flow to extract transaction details from an image.
 *
 * - extractTransactionFromImage - A function that analyzes an image of a receipt and returns structured transaction data.
 * - ExtractTransactionInput - The input type for the extractTransactionFromImage function.
 * - ExtractTransactionOutput - The return type for the extractTransactionFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Transaction } from '@/lib/types';

const ExtractTransactionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractTransactionInput = z.infer<typeof ExtractTransactionInputSchema>;


const TransactionSchema = z.object({
  description: z.string().describe("The description or merchant of the transaction."),
  amount: z.number().describe("The total amount of the transaction."),
  type: z.enum(['income', 'expense']).describe("The type of transaction (income or expense). Most receipts will be expenses."),
  category: z.enum(['Groceries' , 'Transport' , 'Entertainment' , 'Utilities' , 'Salary' , 'Other' , 'UPI']).describe("The most likely category for the transaction."),
});

const ExtractTransactionOutputSchema = z.object({
    transaction: TransactionSchema.nullable().describe("The extracted transaction details. If no transaction can be found, this should be null.")
});

export type ExtractTransactionOutput = z.infer<typeof ExtractTransactionOutputSchema>;

export async function extractTransactionFromImage(input: ExtractTransactionInput): Promise<ExtractTransactionOutput> {
  return extractTransactionFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractTransactionPrompt',
  input: {schema: ExtractTransactionInputSchema},
  output: {schema: ExtractTransactionOutputSchema},
  prompt: `You are an expert at extracting structured data from images of receipts.

Analyze the following receipt image and extract the key transaction details.

- The 'description' should be the name of the merchant or store.
- The 'amount' should be the final total of the transaction.
- The 'type' should almost always be 'expense'. Only classify as 'income' if it is clearly a return or refund receipt.
- For 'category', make a reasonable guess based on the merchant. If it's a supermarket, use 'Groceries'. If it's a restaurant or cafe, use 'Entertainment'. If it is unclear, use 'Other'.

If you cannot confidently determine the details of a transaction from the image, return null for the transaction.

Image: {{media url=photoDataUri}}`,
});

const extractTransactionFromImageFlow = ai.defineFlow(
  {
    name: 'extractTransactionFromImageFlow',
    inputSchema: ExtractTransactionInputSchema,
    outputSchema: ExtractTransactionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
